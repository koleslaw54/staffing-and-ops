#!/bin/bash

echo "Launching MongoDB"
mongod --dbpath ~/Documents/data/db &

echo "Launching NodeJS"
nodemon server.js