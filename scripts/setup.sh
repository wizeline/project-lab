#!/bin/bash

# Change to tmp directory
cd ~/projectlab/tmp

# Set up variables
WORKSPACE=$1
AWS_ACCESS_KEY_ID=$2
AWS_SECRET_ACCESS_KEY=$3

# Remember variables
echo AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID" > ~/.bashrc
echo AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY" >> ~/.bashrc

export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY

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
yarn global add pm2

# Install blitz globally
yarn global add blitz

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

# Start services
sudo systemctl restart wos-sync.service

# Change to app directory
cd ~/projectlab/app

# Start litestream replication
if [ "$WORKSPACE" == "default" ]
then
pm2 stop db-replication
npm run pm2:db-replication
fi

# Launch prisma studio on dev env
if [ "$WORKSPACE" != "default" ]
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