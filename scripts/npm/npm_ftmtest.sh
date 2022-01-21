# !/usr/bin/env sh

branch=$(git branch --show-current)
echo "${branch}:$(date)" >>./.github/npm_trigger

git add ./.github/npm_trigger

git commit -m "$(date) @${branch} :npm :ftmtest "
git push origin ${branch}:${branch}
