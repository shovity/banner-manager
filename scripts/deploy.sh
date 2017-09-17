#!/bin/bash

# Build client
node scripts/build.js
# Clean static
rm -rf server/static
# Copy client builded
cp -rf build/* server/
# Remove map file
find server -name '*.map' -exec rm {} +
# Remove service-worker
rm server/service-worker.js
