#!/bin/bash

# Deploy script based on https://github.jpl.nasa.gov/M2020-CS3/m2020-app-template/blob/master/scripts/deploy.bash

set -e          # Exit with nonzero exit code if anything fails
set -o verbose  # Print commands that are executed

SOURCE_BRANCH=$TRAVIS_BRANCH
TARGET_BRANCH="gh-pages"

# Check if this is travis or local deployment
if [ ! "$CI" ]; then
  echo "Travis environment not detected, proceeding with a locally sourced deployment."
  if [ ! "$1" ]; then
    echo "Local deployment passed no BUILD_HOMEPAGE, exiting."
    exit 0
  else
    BUILD_HOMEPAGE=$1
    SOURCE_BRANCH="master"
  fi
fi


if [ "$TRAVIS_PULL_REQUEST" != "false" ] && [ "$CI" ]; then
  echo "Skipping deployment because this is a PR merge build."
  exit 0
fi

if [ ! -d "dist" ]; then
  echo "The dist/ directory doesn't exist; you must \`npm run build\` before deploying."
  exit 1
fi

if [ ! -d "coverage" ]; then
  echo "The coverage/ directory doesn't exist; you must \`npm run test:cover\` before deploying."
  exit 1
fi

if [ ! -d "test-results" ]; then
  echo "The test-results/ directory doesn't exist; you must \`npm run test:cover\` before deploying."
  exit 1
fi


# If user.(name|email) aren't set, use the values from the latest commit
git config user.name > /dev/null || git config user.name 'Travis CI'
git config user.email > /dev/null || git config user.email 'travis@no-reply.jpl.nasa.gov'

ls -la

# Move everything over to the gh-pages branch
git remote set-branches --add origin $TARGET_BRANCH
git add --all
git commit -m "Dummy commit"
(git fetch origin $TARGET_BRANCH && git checkout -t origin/$TARGET_BRANCH) \
  || git checkout --orphan $TARGET_BRANCH # In case the gh-pages branch didn't exist before

ls -la
ls -la branches/$SOURCE_BRANCH

if [ ! -d "branches" ]; then
  # Make the branches dir if it doesn't exist
  mkdir branches
fi

# Remove old files in branches/$SOURCE_BRANCH
if [ -d branches/$SOURCE_BRANCH ]; then
  rm -rf branches/$SOURCE_BRANCH
fi

ls -la
ls -la branches/$SOURCE_BRANCH

# Rename the dist directory to match the source branch name
mv dist branches/$SOURCE_BRANCH

# Remove unneeded files from gh-pages
shopt -s extglob
rm -rf !(coverage|test-results|dist|public|branches)

# Clean out existing contents
# rm -rf $SOURCE_BRANCH

# mv dist branches/$SOURCE_BRANCH

# Move coverage output into source branch
mv coverage branches/$SOURCE_BRANCH/code-coverage

# Move test-results output into source branch
mv test-results branches/$SOURCE_BRANCH/unit-tests

# Add .nojekyll file to tell gh-pages not to use jekyll so that we can use _ in file/folder names
touch .nojekyll
git add .nojekyll

# Move public folders into root of app
mv public/* branches/$SOURCE_BRANCH

# Touch every file so it's fresh 
touch .

ls -la
ls -la branches/$SOURCE_BRANCH
git status

git add -u . # Commit deleted files
git add branches/$SOURCE_BRANCH # Add source branch

# If there are no changes to the compiled out (e.g. this is a README update) then just bail.
set +e
git diff --cached --name-status --exit-code > /dev/null
if [ $? -eq 0 ]; then
  echo "No changes to the output on this push; exiting."
  exit 0
fi
set -e

git commit -m "Deploy [$SOURCE_BRANCH] to $BUILD_HOMEPAGE"
git push -u origin $TARGET_BRANCH

echo "Finished deployment"