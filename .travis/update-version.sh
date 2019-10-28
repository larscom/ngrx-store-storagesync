if [ $TRAVIS_PULL_REQUEST == false ] && [ $TRAVIS_BRANCH == "master" ]; then
  mkdir -p projects/ngrx-store-storagesync/.git

  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis CI"

  git remote set-url origin "https://${GITHUB_USERNAME}:${GITHUB_API_TOKEN}@github.com/larscom/ngrx-store-storagesync.git"
  git checkout master

  npm version patch --prefix projects/ngrx-store-storagesync -m "[ ${TRAVIS_BUILD_NUMBER} ] - Updated npm version"

  sleep 5

  git push --follow-tags
fi
