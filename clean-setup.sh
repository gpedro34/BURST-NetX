#!/usr/bin/env bash

npm cache clean --force

rmdir --ignore-fail-on-non-empty node_modules && rm ./package-lock.json && chmod -R a+rwx ./node_modules

cd client && rmdir --ignore-fail-on-non-empty node_modules && chmod -R a+rwx ./node_modules && cd .. && npm run setup
