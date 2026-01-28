#!/bin/bash

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use the version specified in .nvmrc (looks up from current directory)
nvm use

# Run the analyze command
yarn build && source-map-explorer dist/providers-*.mjs --no-border-checks
