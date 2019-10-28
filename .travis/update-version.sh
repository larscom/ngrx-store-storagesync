git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"

if [ $TRAVIS_PULL_REQUEST == false ] && [ $TRAVIS_BRANCH == "auto-versioning" ]; then
  git checkout $TRAVIS_BRANCH
  npm version patch --prefix projects/ngrx-store-storagesync -m "[ ${TRAVIS_BUILD_NUMBER} ] - Updated npm version"
  git remote set-url origin "https://${GITHUB_USERNAME}:${GITHUB_API_TOKEN}@github.com/larscom/ngrx-store-storagesync.git"
  git push --follow-tags
fi
