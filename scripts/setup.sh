#!/bin/bash

# Change to tmp directory
cd ~/projectlab/tmp

# Set up variables
WORKSPACE=$1
DB_URL=$2

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

# Install yarn
sudo npm install --global yarn
export PATH="$PATH:$(yarn global bin)"

# Install pm2
sudo npm install --global pm2

# Set up env
mv env-tmp .env

# Unzip Dependancies
yarn install
yarn build

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

# Replace old db
rm -rf ~/projectlab/db
mkdir -p ~/projectlab/db

# Copy files to app folder
cp -R ~/projectlab/tmp/. ~/projectlab/app/

# Change to app directory
cd ~/projectlab/app

# Preparations for dev environments
if [ "$WORKSPACE" != "production" ]
then

# install database
sudo apt -y install gnupg2
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" |sudo tee  /etc/apt/sources.list.d/pgdg.list
sudo apt update
sudo apt -y install postgresql-12 postgresql-client-12
sudo -u postgres psql -c "CREATE USER admin;"
sudo -u postgres psql -c "CREATE DATABASE projectlab;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE projectlab TO admin;"
echo "DATABSE_URL=postgresql://admin@localhost:5432/projectlab" >> .env

# load prod database
pg_dump --dbname $DB_URL | psql projectlab

# Launch prisma studio
pm2 stop prisma-studio
npm run pm2:prisma-studio
npx blitz db seed
fi

# Start application
pm2 stop server
npx blitz prisma migrate deploy
npm run pm2:server

# Enable pm2 service
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u admin --hp /home/admin
sudo systemctl enable pm2-admin

# Start services
sudo systemctl restart wos-sync.service
