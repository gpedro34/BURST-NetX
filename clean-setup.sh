#!/usr/bin/env bash

npm cache verify

rm -rf node_modules && rm ./package-lock.json && npm install && chmod -R a+rwx ./node_modules

exit
