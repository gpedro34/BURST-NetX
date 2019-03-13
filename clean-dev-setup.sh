#!/usr/bin/env bash

npm cache verify

rm -rf node_modules && rm -rf fe-build && rm ./package-lock.json && npm install && chmod -R a+rwx ./node_modules && cd client && rm -rf node_modules && rm -rf build && npm install && chmod -R a+rwx ./node_modules && cd ..

exit
