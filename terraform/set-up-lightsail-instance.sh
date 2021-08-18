#!/bin/bash

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

# Set up AWS credentials for litestream
echo AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID" > ~/.bashrc
echo AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY" >> ~/.bashrc
echo SQLITE_PATH="$SQLITE_PATH" >> ~/.bashrc
echo S3_BUCKET_NAME="$S3_BUCKET_NAME" >> ~/.bashrc
echo S3_BUCKET_PATH="$S3_BUCKET_PATH" >> ~/.bashrc

export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
export SQLITE_PATH=$SQLITE_PATH
export S3_BUCKET_NAME=$S3_BUCKET_NAME
export S3_BUCKET_PATH=$S3_BUCKET_PATH

# Run update
sudo apt -y update

# Install node
sudo apt-get install -y gnupg2
curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
sudo apt -y install nodejs gcc g++ make

# Install nginx
sudo apt install -y nginx ufw
sudo ufw allow 'Nginx HTTP'
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

# Install blitz globally
sudo npm i -g blitz --legacy-peer-deps --unsafe-perm=true

# Install sqlite3
sudo apt install -y sqlite3

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
sed -i -e "s/http:\/\/localhost:3000/https:\/\/labs.wizeline.com/g" blitz.config.ts
else
sed -i -e "s/http:\/\/localhost:3000/https:\/\/$BRANCH.labs.wizeline.com/g" blitz.config.ts
fi
npm i
npm i react react-dom
npm run build
if [ $DB_EXISTS -eq 0 ]
then
blitz prisma migrate deploy
else
echo y | blitz prisma migrate reset --force
sqlite3 db/db.sqlite < db/search_indexes.sql
# Uncomment when production is ready
#if [ "$SEED_DATA" == "yes" ]
#then
#blitz db seed
#fi
fi
blitz db seed
npm run sync-all-catalogs

if [ "$BRANCH" == "default" ]
then
# Start litestream replication
echo "Starting Replication"
sed -i -e "s/SQLITE_PATH/$SQLITE_PATH/g" pm2-db-replication.json
sed -i -e "s/S3_BUCKET_NAME/$S3_BUCKET_NAME/g" pm2-db-replication.json
sed -i -e "s/S3_BUCKET_PATH/$S3_BUCKET_PATH/g" pm2-db-replication.json
npm run pm2:db-replication
fi

# Launch prisma studio on dev env
if [ "$BRANCH" != "default" ]
then
npm run pm2:prisma-studio
fi

# Start application
sudo cp -rf ./nginx/config /etc/nginx/sites-enabled/default
sudo service nginx restart
npm run pm2:server
