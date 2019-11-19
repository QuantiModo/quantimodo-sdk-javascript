const dotenv = require('dotenv');
dotenv.config(); // https://github.com/motdotla/dotenv#what-happens-to-environment-variables-that-were-already-set
const gulp = require('gulp'),
    rimraf = require('rimraf');
const qmGit = require('./src/helpers/qm.git')
const qmTests = require('./src/helpers/qm.tests')
const s2c = require('./src/helpers/selenium-2-cypress')
gulp.task('selenium-to-cypress-ionic', function(){
    s2c.convertSeleniumToCypress("cypress/integration/ionic",
        'ghost_inspector/ionic-test-components-side-format.json');
});
gulp.task('selenium-to-cypress-api', function(){
    s2c.convertSeleniumToCypress("cypress/integration/api",
        'ghost_inspector/api-test-components-side-format.json');
});
// noinspection JSUnusedLocalSymbols
function executeSynchronously(cmd, catchExceptions, cb){
    const execSync = require('child_process').execSync;
    console.info(cmd);
    try{
        execSync(cmd);
        if(cb){
            cb();
        }
    }catch (error){
        if(catchExceptions){
            console.error(error);
        }else{
            throw error;
        }
    }
}
gulp.task('cypress', function(cb){
    qmTests.runCypressTests(cb)
});
gulp.task('cypress-connectors', function(cb){
    qmTests.runCypressTests(cb, 'connectors')
});
gulp.task('cypress-failed', function(cb){
    qmTests.runLastFailedCypressTest(cb)
});
gulp.task('test-typescript-node', function(cb){
    const qm = require('./typescript-node-client/api')
    let api = new qm.AppSettingsApi()
    api.getAppSettings("medimodo").then(function(res){
        console.log(res)
        cb()
    });
});