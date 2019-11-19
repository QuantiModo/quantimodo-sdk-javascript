const dotenv = require('dotenv')

dotenv.config() // https://github.com/motdotla/dotenv#what-happens-to-environment-variables-that-were-already-set
const gulp = require('gulp')
const qmTests = require('./src/helpers/qm.tests')
const s2c = require('./src/helpers/selenium-2-cypress')

gulp.task('selenium-to-cypress-ionic', function () {
  s2c.convertSeleniumToCypress('cypress/integration/ionic',
    'ghost_inspector/ionic-test-components-side-format.json')
})
gulp.task('selenium-to-cypress-api', function () {
  s2c.convertSeleniumToCypress('cypress/integration/api',
    'ghost_inspector/api-test-components-side-format.json')
})
gulp.task('cypress', function (cb) {
  qmTests.runLastFailedCypressTest(function (err) {
    if (err) throw err

    qmTests.runCypressTests(cb)
  })
})
gulp.task('cypress-one', function (cb) {
  qmTests.runCypressTests(cb, 'physician')
})
gulp.task('cypress-failed', function (cb) {
  qmTests.runLastFailedCypressTest(cb)
})
gulp.task('test-typescript-node', function (cb) {
  const qm = require('./typescript-node-client/api')
  let api = new qm.AppSettingsApi()

  api.getAppSettings('medimodo').then(function (res) {
    console.log(res)
    cb()
  })
})
