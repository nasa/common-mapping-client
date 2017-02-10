#!/bin/bash

# http://stackoverflow.com/a/125340
# remove origin/ from branch name
SOURCE_BRANCH=${GIT_BRANCH#*/}

if [ ! -d "dist" ]; then
  echo "The dist/ directory doesn't exist; you must \`npm run build\` before deploying."
  exit 1
fi

# Make the branches dir if it doesn't exist
echo "Checking branches dir"
if [ ! -d "branches" ]; then
  mkdir branches
fi

# Move the built bundle into branches
echo "Creating target branch directory $SOURCE_BRANCH"
rm -rf branches/$SOURCE_BRANCH && mv dist branches/$SOURCE_BRANCH

# copy over test results if they exist
if [ -d "test-results" ]; then
  echo "Copying test results"
  mv test-results branches/$SOURCE_BRANCH/test-results
  if [ -d "coverage" ]; then
    echo "Copying test coverage"
    mv coverage branches/$SOURCE_BRANCH/test-results/coverage
  fi
fi

# clear old docker images and containers
echo "Clearing old containers and images"
sudo docker ps | awk '{ print $1,$2 }' | grep jenkins/cmc-core | awk '{print $1 }' | xargs -I {} sudo docker stop {}
sudo docker ps -a | awk '{ print $1,$2 }' | grep jenkins/cmc-core | awk '{print $1 }' | xargs -I {} sudo docker rm {}
sudo docker images | awk '{ print $1,$2 }' | grep jenkins/cmc-core | awk '{print $1":"$2}' | xargs -I {} sudo docker rmi {}

# create a docker ignore file to deal with some read-only issues
echo $'node_modules\nnpm-debug.log' > .dockerignore

# build the new container
echo "Building new image"
sudo docker build -t jenkins/cmc-core -f scripts/deployAssets/Dockerfile .

# run the new container
echo "Starting container"
sudo docker run -d -p 49160:80 --name cmc-core_auto-deploy jenkins/cmc-core;

echo "Deploy complete"
