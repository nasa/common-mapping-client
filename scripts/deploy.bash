#!/bin/bash

# Deploy script based on https://github.jpl.nasa.gov/M2020-CS3/m2020-app-template/blob/master/scripts/deploy.bash

set -e          # Exit with nonzero exit code if anything fails
set -o verbose  # Print commands that are executed

SOURCE_BRANCH=$TRAVIS_BRANCH
TARGET_BRANCH="gh-pages"

if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
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

# Move everything over to the gh-pages branch
git remote set-branches --add origin $TARGET_BRANCH
(git fetch origin $TARGET_BRANCH && git checkout -t origin/$TARGET_BRANCH) \
  || git checkout --orphan $TARGET_BRANCH # In case the gh-pages branch didn't exist before

ls -la

git status

# Remove unneeded files from gh-pages
shopt -s extglob
rm -rf !(coverage|test-results|dist|public)

# Clean out existing contents
# rm -rf $SOURCE_BRANCH

# Rename the dist directory to match the source branch name
mv dist $SOURCE_BRANCH

echo "what's here now"
ls -la

# Move coverage output into source branch
mv coverage $SOURCE_BRANCH/code-coverage

# Move test-results output into source branch
mv test-results $SOURCE_BRANCH/unit-tests

echo "What's in source branch"
ls $SOURCE_BRANCH -la 

# Add .nojekyll file to tell gh-pages not to use jekyll so that we can use _ in file/folder names
touch .nojekyll
git add .nojekyll

# Move public folders into root of app
mv public/* $SOURCE_BRANCH
git add -u . # Commit deleted files
git add $SOURCE_BRANCH # Add source branch

git status


# If there are no changes to the compiled out (e.g. this is a README update) then just bail.
set +e
git diff --cached --name-status --exit-code > /dev/null
if [ $? -eq 0 ]; then
  echo "No changes to the output on this push; exiting."
  exit 0
fi
set -e

git commit -m "Deploy [$SOURCE_BRANCH] to $BUILD_HOMEPAGE"
git push -u -f origin $TARGET_BRANCH

echo "Finished deployment"