#!/bin/bash

if [ "${TRAVIS_PULL_REQUEST}" == false ]; then
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis CI"

  git checkout master
  git stash

  mkdir -p projects/ngrx-store-storagesync/.git
  git remote set-url origin "https://${GITHUB_USERNAME}:${GITHUB_API_TOKEN}@github.com/${GITHUB_USERNAME}/ngrx-store-storagesync.git"

  # By default use npm version patch
  version="patch"

  if [[ $TRAVIS_COMMIT_MESSAGE == *"minor"* ]]; then
    version="minor"
  fi

  if [[ $TRAVIS_COMMIT_MESSAGE == *"major"* ]]; then
    version="major"
  fi

  npm version "${version}" --prefix projects/ngrx-store-storagesync -m "[Travis] - #${TRAVIS_BUILD_NUMBER} - ${TRAVIS_COMMIT_MESSAGE}"

  git push --follow-tags
fi
