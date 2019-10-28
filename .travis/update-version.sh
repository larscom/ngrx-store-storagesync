if [ $TRAVIS_PULL_REQUEST == false ] && [ $TRAVIS_BRANCH == "master" ]; then
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis CI"

  git remote -v

  git commit -m "${TRAVIS_COMMIT_MESSAGE}"

  mkdir -p projects/ngrx-store-storagesync/.git

  git status

  git remote set-url origin "https://${GITHUB_USERNAME}:${GITHUB_API_TOKEN}@github.com/larscom/ngrx-store-storagesync.git"
  git checkout master

  git status

  npm version patch --prefix projects/ngrx-store-storagesync -m "[ ${TRAVIS_BUILD_NUMBER} ] - ${TRAVIS_COMMIT_MESSAGE}"

  sleep 5

  git push --follow-tags
fi
