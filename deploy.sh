#!/bin/sh

# If a command fails then the deploy stops
set -e

printf "\033[0;32mDeploying updates to GitHub...\033[0m\n"

# Build the project.
hugo

# Go To Public folder
cp ./cname ./public/cname
cp ./ads.txt ./public/ads.txt
cd public

git init
git remote add origin git@github.com:zhanglun/zhanglun.github.io.git
git add .
git commit -m ":tada: Updated At: `date +'%Y-%m-%d %H:%M:%S'`"
git push --force origin master

# # Add changes to git.
# git add .

# # Commit changes.
# msg="rebuilding site $(date)"
# if [ -n "$*" ]; then
#         msg="$*"
# fi
# git commit -m "$msg"

# # Push source and build repos.
# git push upstream master