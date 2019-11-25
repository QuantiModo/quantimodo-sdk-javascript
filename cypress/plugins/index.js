// ***********************************************************
// This example plugins/index.js can be used to load plugins
// You can change the location of this file or turn off loading the plugins file with the 'pluginsFile' configuration option.
// You can read more here: https://on.cypress.io/plugins-guide
// ***********************************************************
// This function is called when a project is opened or re-opened (e.g. due to the project's config changing)


// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits `config` is the resolved Cypress config
  on('before:browser:launch', (browser = {}, args) => {
    if (browser.name === 'chrome') {
      args.push('--disable-features=CrossSiteDocumentBlockingIfIsolating,CrossSiteDocumentBlockingAlways,IsolateOrigins,site-per-process')
      args.push('--load-extension=cypress/extensions/Ignore-X-Frame-headers')

      return args
    }
  })
}

// Error: EISDIR: illegal operation on a directory
// https://github.com/cypress-io/cypress/issues/1244
// const cucumber = require('cypress-cucumber-preprocessor').default;
// const path = require('path');
// let currentFile;
// const preprocessor = (options) => (file = {}) => {
//     let nextFile = file;
//     const { filePath } = file;
//     const { ext } = path.parse(filePath);
//     if (!ext) {
//         console.warn(`retrying current test ${JSON.stringify(file)}`);
//         nextFile = currentFile;
//     } else {
//         currentFile = file;
//     }
//     return cucumber(options)(nextFile);
// };
// module.exports = (on) => {
//     on('file:preprocessor', preprocessor());
// };
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  on('task', {
    failed: require('cypress-failed-log/src/failed')(),
  })
}
