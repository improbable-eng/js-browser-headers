// Karma configuration
// Generated on Wed Feb 17 2016 15:48:21 GMT+0000 (GMT)

module.exports = function(config) {

  // Browsers to run on Sauce Labs
  // Check out https://saucelabs.com/platforms for all browser/OS combos
  var customLaunchers = {
    'SL_Safari_Latest': {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.11'
    },
    'SL_Safari_8': {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.10',
      version: '8',
    },
    'SL_Chrome_Latest': {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'linux'
    },
    'SL_Chrome_48': {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'OS X 10.10',
      version: '48',
    },
    'SL_Firefox_Latest': {
      base: 'SauceLabs',
      browserName: 'firefox',
      platform: 'linux'
    },
    'SL_Opera_12': {
      base: 'SauceLabs',
      browserName: 'opera',
      platform: 'Windows 7',
      version: '12'
    },
    'SL_Edge': {
      base: 'SauceLabs',
      browserName: 'microsoftedge',
      platform: 'Windows 10'
    },
    'SL_IE_10': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 7',
      version: '10'
    },
    'SL_IE_9': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 7',
      version: '9'
    }
  };

  var reporters = ['dots'];
  var browsers = [];
  var singlerun = false;
  var concurrency = Infinity;

  if (process.env.SAUCE_USERNAME) {
    reporters.push('saucelabs');
    Array.prototype.push.apply(browsers, Object.keys(customLaunchers));
    singlerun = true;
    concurrency = 4;
  }

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    sauceLabs: {
      recordScreenshots: false,
      connectOptions: {
        port: 5757,
        logfile: 'sauce_connect.log'
      },
      public: 'public'
    },

    // list of files / patterns to load in the browser
    files: [
      'test/build/integration-tests.js'
    ],


    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '**/*.js': ['sourcemap']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: reporters,

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    browsers: browsers,
    captureTimeout: 120000,
    customLaunchers: customLaunchers,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: singlerun,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: concurrency
  })
};
