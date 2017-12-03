// Karma configuration

function browser(browserName, browserVersion, os, osVersion) {
  return {
    base: 'BrowserStack',
    browser: browserName,
    browser_version: browserVersion,
    os: os,
    os_version: osVersion
  };
}

module.exports = function(config) {

  // Browsers to run on BrowserStack
  var customLaunchers = {
    'Safari_9': browser('safari', '9.1','OS X', 'El Capitan'),
    'Safari_8': browser('safari', '8','OS X', 'Yosemite'),
    'Chrome_57': browser('chrome', '57','OS X', 'Sierra'),
    'Chrome_48': browser('chrome', '48','OS X', 'Yosemite'),
    'Firefox_57': browser('firefox', '57','OS X', 'Sierra'),
    'Opera_40': browser('opera', '40', 'Windows', '7'),
    'Edge': browser('edge', '14','Windows', '10'),
    'IE_10': browser('ie', '10','Windows', '7'),
    'IE_9': browser('ie', '9','Windows', '7')
  };

  const useBrowserStack = process.env.BROWSER_STACK_USERNAME !== undefined;
  const browsers = useBrowserStack ? Object.keys(customLaunchers) : [];

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    browserStack: {
      forcelocal: true,
      project: "js_browser_headers-" + (process.env.TRAVIS_BRANCH || "dev"),
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
    reporters: ['dots'],

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
    singleRun: useBrowserStack,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: 2
  })
};
