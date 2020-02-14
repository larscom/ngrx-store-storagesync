#!/bin/bash -e

if [ "${TRAVIS_BRANCH}" = "master" ]; then
  export GIT_COMMITTER_EMAIL='netlify@travis-ci.org'
  export GIT_COMMITTER_NAME='Travis CI'

  repo_dir="$(mktemp -d)"
  repo_name="ngrx-store-storagesync"
  repo_url="https://github.com/larscom/${repo_name}.git"
  repo_url_push="https://${GITHUB_SECRET}@github.com/larscom/${repo_name}.git"

  # merge master into netlify branch
  target_branch="netlify"

  git clone "${repo_url}" "${repo_dir}"

  echo "Change directory: ${repo_dir}"
  cd "${repo_dir}"

  echo "Checking out: ${target_branch}"
  git checkout "${target_branch}" >/dev/null 2>&1

  echo "Merging master into ${target_branch}"
  git merge master >/dev/null 2>&1

  echo "Pushing to ${repo_name}/${target_branch}"
  git push "${repo_url_push}" "${target_branch}" >/dev/null 2>&1
fi
