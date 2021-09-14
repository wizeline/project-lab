#!/bin/bash

# Change to tmp directory
cd ~/projectlab/tmp

# Set up variables
BRANCH=$1
AWS_ACCESS_KEY_ID=$2
AWS_SECRET_ACCESS_KEY=$3
SQLITE_PATH=$4
S3_BUCKET_NAME=$5
S3_BUCKET_PATH=$6
SEED_DATA=$7
DB_EXISTS=1

if [ $BRANCH != "default" ]
then
SEED_DATA="yes"
fi

# Remember variables
echo AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID" > ~/.bashrc
echo AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY" >> ~/.bashrc
echo SQLITE_PATH="$SQLITE_PATH" >> ~/.bashrc
echo S3_BUCKET_NAME="$S3_BUCKET_NAME" >> ~/.bashrc
echo S3_BUCKET_PATH="$S3_BUCKET_PATH" >> ~/.bashrc
echo BRANCH="$BRANCH" >> ~/.bashrc

export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
export SQLITE_PATH=$SQLITE_PATH
export S3_BUCKET_NAME=$S3_BUCKET_NAME
export S3_BUCKET_PATH=$S3_BUCKET_PATH
export BRANCH=$BRANCH

# Run update
sudo apt -y update

# Install node
sudo apt-get install -y gnupg2
curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
sudo apt -y install nodejs gcc g++ make

# Install nginx
sudo apt install -y nginx ufw
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 8080
echo y | sudo ufw enable
sudo ufw status

# Install litestream
wget https://github.com/benbjohnson/litestream/releases/download/v0.3.5/litestream-v0.3.5-linux-amd64.deb
sudo dpkg -i litestream-v0.3.5-linux-amd64.deb
litestream version
sudo systemctl enable litestream

# Install yarn
sudo npm install --global yarn
export PATH="$PATH:$(yarn global bin)"

# Install pm2
sudo npm install --global pm2@latest

# Install blitz globally
sudo npm i -g blitz --legacy-peer-deps --unsafe-perm=true

# Install sqlite3
sudo apt install -y sqlite3

# Update pm2 in memory
pm2 update

if [ "$BRANCH" == "default" ]
then
# Restore DB
echo "Starting Restoring"
litestream restore -o "$SQLITE_PATH" "s3://$S3_BUCKET_NAME/$S3_BUCKET_PATH"
DB_EXISTS=$?
fi

# Prepare env
rm -rf .env
cp env-file .env

# Init App
if [ "$BRANCH" == "default" ]
then
sed -i -e "s/http:\/\/localhost:3000/https:\/\/labs.wizeline.com/g" ~/projectlab/tmp/blitz.config.ts
else
sed -i -e "s/http:\/\/localhost:3000/https:\/\/$BRANCH.labs.wizeline.com/g" ~/projectlab/tmp/blitz.config.ts
fi
npm i
npm i react react-dom
npm run build
if [ $DB_EXISTS -eq 0 ]
then
blitz prisma migrate deploy
else
echo y | blitz prisma migrate reset --force
sqlite3 ~/projectlab/db/db.sqlite < ~/projectlab/tmp/db/search_indexes.sql
fi
blitz db seed

# Replace pm2 db-replication.json config with correct values
if [ "$BRANCH" == "default" ]
then
sed -i -e "s/SQLITE_PATH/$SQLITE_PATH/g" ~/projectlab/tmp/pm2/db-replication.json
sed -i -e "s/S3_BUCKET_NAME/$S3_BUCKET_NAME/g" ~/projectlab/tmp/pm2/db-replication.json
sed -i -e "s/S3_BUCKET_PATH/$S3_BUCKET_PATH/g" ~/projectlab/tmp/pm2/db-replication.json
fi

# Setup nginx
sudo cp -rf ~/projectlab/tmp/nginx/config /etc/nginx/sites-enabled/default
sudo service nginx restart

# Enable wos-sync service
if [ ! -f "/etc/systemd/system/wos-sync.service" ]
then
sudo cp ~/projectlab/tmp/systemd/wos-sync.service /etc/systemd/system/wos-sync.service
sudo cp ~/projectlab/tmp/systemd/wos-sync.timer /etc/systemd/system/wos-sync.timer
sudo systemctl daemon-reload
sudo systemctl enable wos-sync.service
fi

# Remove app folder
rm -rf ~/projectlab/app

# Create app folder
mkdir -p ~/projectlab/app

# Copy files to app folder
cp -R ~/projectlab/tmp/. ~/projectlab/app/

# Remove tmp directory
rm -rf ~/projectlab/tmp/

# Setup start up script
sudo chmod +x ~/projectlab/app/scripts/startup.sh

# Start services
sudo systemctl restart wos-sync.service

# Change to app directory
cd ~/projectlab/app

# Start litestream replication
if [ "$BRANCH" == "default" ]
then
pm2 stop db-replication
npm run pm2:db-replication
fi

# Launch prisma studio on dev env
if [ "$BRANCH" != "default" ]
then
pm2 stop prisma-studio
npm run pm2:prisma-studio
fi

# Start application
pm2 stop server
npm run pm2:server

# Enable pm2 service
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u admin --hp /home/admin
sudo systemctl enable pm2-admin