#!/usr/bin/env bash

rmdir --ignore-fail-on-non-empty node_modules && rm ./package-lock.json && npm install && chmod -R a+rwx ./node_modules

cd client && rmdir --ignore-fail-on-non-empty node_modules && npm install && chmod -R a+rwx ./node_modules && cd ..

exit
