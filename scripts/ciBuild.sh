#!/bin/bash


# Copyright 2017 California Institute of Technology.
#
# This source code is licensed under the APACHE 2.0 license found in the
# LICENSE.txt file in the root directory of this source tree.


# remove origin/ from branch name
SOURCE_BRANCH=${GIT_BRANCH#*/}

BUILD_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')
PROJECT_NAME="common-mapping-client/cmc-core"
CONTAINER_NAME="common-mapping-client_cmc-core"
IMAGE_NAME="${PROJECT_NAME}:latest"
IMAGE_NAME_TAG="${PROJECT_NAME}:${BUILD_VERSION}-${BUILD_NUMBER}"
BUNDLE_NAME="cmc-core-${BUILD_VERSION}-${BUILD_NUMBER}"

if [[ -z "${SOURCE_BRANCH// }" ]]; then
  echo "Could not resolve branch. Exiting."
  exit 0
else
  echo "Building branch: ${SOURCE_BRANCH}"
fi

echo "Installing dependencies..."
npm install

if [ ! $? -eq 0 ]; then
  echo "Install failed."
  exit 1
fi

echo "Testing..."
npm run test --nowebgl --includecoretests

if [ ! $? -eq 0 ]; then
  echo "Test failed."
  exit 1
fi

echo "Building..."
npm run build

echo "Checking build..."
if [ ! -d "dist" ]; then
  echo "Build failed."
  exit 1
fi

echo "Checking test results..."
if [ ! -d "test-results" ]; then
  echo "No test-results available."
  exit 1
fi

echo "Moving test results..."
mv test-results dist/

echo "Checking branches dir..."
if [ ! -d "branches" ]; then
  mkdir branches
fi

echo "Creating target branch directory ${SOURCE_BRANCH}..."
rm -rf branches/${SOURCE_BRANCH} && mv dist branches/${SOURCE_BRANCH}

echo "Moving branches to dist for image build..."
mv branches dist

echo "Moving docker ignore out for build..."
cp scripts/deployAssets/.dockerignore .dockerignore

echo "Clearing old containers and images..."
sudo docker ps | grep ${PROJECT_NAME} | awk '{print $1 }' | xargs -I {} sudo docker stop {}
sudo docker ps -a | grep ${PROJECT_NAME} | awk '{print $1 }' | xargs -I {} sudo docker rm {}
sudo docker images | grep ${PROJECT_NAME} | awk '{print $1":"$2}' | xargs -I {} sudo docker rmi {}

echo "Building docker image..."
sudo docker build -t ${PROJECT_NAME} -f scripts/deployAssets/Dockerfile .

echo "Starting container..."
sudo docker run -d -p 49160:80 --name ${CONTAINER_NAME} ${PROJECT_NAME}

echo "Moving dist back to branches..."
mv dist branches

exit 0
