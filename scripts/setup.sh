#!/bin/bash

# Change to tmp directory
cd ~/projectlab/tmp

# Set up variables
WORKSPACE=$1
DB_URL=$2

echo "*** Step: *** Install postgresql client"
sudo apt -y install gnupg2
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" |sudo tee  /etc/apt/sources.list.d/pgdg.list
sudo apt update
sudo apt -y install postgresql-client-12

echo "*** Step: *** Install node"
sudo apt-get install -y gnupg2
curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
sudo apt -y install nodejs gcc g++ make

echo "*** Step: *** Install nginx"
sudo apt install -y nginx ufw
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 8080
echo y | sudo ufw enable
sudo ufw status

echo "*** Step: *** Install yarn"
sudo npm install --global yarn
export PATH="$PATH:$(yarn global bin)"

echo "*** Step: *** Install pm2"
sudo npm install --global pm2
pm2 stop server ## in case it is already running

echo "*** Step: *** Set up env"
mv env-tmp .env

echo "*** Step: *** Install dependencies"
yarn install

echo "*** Step: *** Setup nginx"
sudo cp -rf ~/projectlab/tmp/nginx/config /etc/nginx/sites-enabled/default
sudo service nginx restart

if [ ! -f "/etc/systemd/system/wos-sync.service" ]
then
echo "*** Step: *** Enable wos-sync service"
sudo cp ~/projectlab/tmp/systemd/wos-sync.service /etc/systemd/system/wos-sync.service
sudo cp ~/projectlab/tmp/systemd/wos-sync.timer /etc/systemd/system/wos-sync.timer
sudo systemctl daemon-reload
sudo systemctl enable wos-sync.service
fi

echo "*** Step: *** Replace app folders"
rm -rf ~/projectlab/app
mkdir -p ~/projectlab/app
cp -R ~/projectlab/tmp/. ~/projectlab/app/

echo "*** Step: *** Change to app directory"
cd ~/projectlab/app

echo "*** Step: *** Preparations for dev environments"
if [ "$WORKSPACE" != "production" ]
then
  echo "*** Step: *** Install database"
  sudo apt -y install postgresql-12
  sudo -u postgres psql -c "DROP DATABASE projectlab;"
  sudo -u postgres psql -c "CREATE USER admin;"
  sudo -u postgres psql -c "ALTER USER admin WITH ENCRYPTED PASSWORD 'password';"
  sudo -u postgres psql -c "ALTER USER admin WITH SUPERUSER;"
  sudo -u postgres psql -c "CREATE DATABASE projectlab;"
  sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE projectlab TO admin;"
  echo "DATABASE_URL=postgresql://admin:password@localhost/projectlab" >> .env

  echo "*** Step: *** Load prod database and run migrations and seeds"
  pg_dump --dbname $DB_URL --clean --if-exists > db.sql
  psql -d "postgresql://admin:password@localhost/projectlab" < db.sql
  npx blitz prisma migrate deploy
  npx blitz db seed
  npx blitz db seed -f db/seeds.prod

  echo "*** Step: *** Launch prisma studio"
  pm2 stop prisma-studio
  npm run pm2:prisma-studio
fi

if [ "$WORKSPACE" == "production" ]
then
  echo "*** Step: *** Run migrations and seeds in production"
  npx blitz prisma migrate deploy
  npx blitz db seed -f db/seeds.prod
fi

echo "*** Step: *** Start application"
yarn build
npm run pm2:server

echo "Enable app services"
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u admin --hp /home/admin
sudo systemctl enable pm2-admin
sudo systemctl restart wos-sync.service
