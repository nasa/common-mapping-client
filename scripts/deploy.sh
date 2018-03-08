#!/bin/bash

set -e          # Exit with nonzero exit code if anything fails
set -o verbose  # Print commands that are executed

SOURCE_BRANCH=$CIRCLE_BRANCH
TARGET_BRANCH="gh-pages"

if [ ! -d "dist" ]; then
  echo "The dist/ directory doesn't exist; you must \`npm run build\` before deploying."
  exit 1
fi

if [ ! -d "test-results" ]; then
  echo "The test-results/ directory doesn't exist; you must \`npm run test\` before deploying."
  exit 1
fi

git config user.name > /dev/null || git config user.name 'Circle CI'
git config user.email > /dev/null || git config user.email 'robots@circleci.com'

# Move everything over to the gh-pages branch
set +e
git remote set-branches --add origin $TARGET_BRANCH
git add --all
git commit -m "Dummy commit"
(git fetch origin $TARGET_BRANCH && git checkout -t origin/$TARGET_BRANCH) \
  || git checkout --orphan $TARGET_BRANCH # In case the gh-pages branch didn't exist before
set -e

if [ ! -d "branches" ]; then
  # Make the branches dir if it doesn't exist
  mkdir branches
fi

if [ -d branches/$SOURCE_BRANCH ]; then
  # Clear the branch if it already exists
  rm -rf branches/$SOURCE_BRANCH
fi

mv dist branches/$SOURCE_BRANCH

# Remove unneeded files from gh-pages
shopt -s extglob
rm -rf !(test-results|dist|assets|branches)

if [ -f .gitignore ]; then
    rm .gitignore # remove our .gitignore so we can grab certain items
fi

# Move test-results output into source branch
mv test-results branches/$SOURCE_BRANCH/test-results

# Add .nojekyll file to tell gh-pages not to use jekyll so that we can use _ in file/folder names
touch .nojekyll
git add .nojekyll

# Touch every file so it's fresh
touch .

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

git commit -m "Deploy [$SOURCE_BRANCH] to gh-pages"
git push -u origin $TARGET_BRANCH

echo "Finished deployment"
