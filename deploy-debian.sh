#!/usr/bin/env bash

curl -sL https://deb.nodesource.com/setup_11.x | bash -
apt-get install -y nodejs
apt-get install -y npm
npm run setup
chmod +x ./launcher.js
npm install -g pm2
pm2 start launcher.js
pm2 startup systemd
