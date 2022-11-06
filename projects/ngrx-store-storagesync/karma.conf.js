// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const karmaConfig = require('../../karma.conf');

module.exports = function (config) {
  const conf = Object.assign({}, karmaConfig(config), {
    coverageReporter: {
      dir: require('path').join(__dirname, '../../coverage'),
      subdir: '.',
      reporters: [
        { type: 'lcovonly' }, { type: 'json' }
      ]
    }
  });
  config.set(conf);
};
