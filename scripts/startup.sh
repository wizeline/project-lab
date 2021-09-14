#!/bin/bash

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