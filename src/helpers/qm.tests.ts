import * as qmGit from "./qm.git";
import * as fileHelper from "./qm.file-helper";
import * as qmLog from "./qm.log";
import * as fs from "fs";
import * as cypress from "cypress";
const sdkRepo = require('app-root-path');
const rimraf = require("rimraf");

const ciProvider = getCiProvider();
const isWin = process.platform === "win32";
const outputReportDir = sdkRepo + "/mochawesome-report"
const screenshotDirectory = `${sdkRepo}/cypress/screenshots`;
const unmerged = sdkRepo + "/cypress/reports/mocha"
const vcsProvider = "github";
const verbose = true;
const videoDirectory = `${sdkRepo}/cypress/videos`;
const mergedJsonPath = outputReportDir + "/mochawesome.json";

function getReportUrl() {
    if(process.env.JOB_URL){
        return process.env.JOB_URL+'/ws/tmp/quantimodo-sdk-javascript/mochawesome-report/';
    }
    return getBuildLink();
}

export function mochawesome(cb: () => void, failed: string | any[]){
    const marge = require('mochawesome-report-generator')
    const {merge} = require('mochawesome-merge')
    const {slackRunner} = require("cypress-slack-reporter/bin/slack/slack-alert.js");
    console.log("Merging reports...")
    merge({
        reportDir: unmerged,
        inline: true,
        saveJson: true,
    }).then((mergedJson: any) => {
        fs.writeFileSync(mergedJsonPath, JSON.stringify(mergedJson, null, 2));
        console.log("Generating report from " + unmerged + " and outputting at " + outputReportDir)
        return marge.create(mergedJson, {
            reportDir: outputReportDir,
            inline: true,
            saveJson: true,
            charts: true,
            showPassed: true,
            autoOpen: isWin,
            //cdn: true,
            overwrite: true
        })
    }).then((_generatedReport: any[]) => {
        console.log("Merged report available here:-", _generatedReport[0]);
        // tslint:disable-next-line: no-console
        console.log("Constructing Slack message with the following options", {
            ciProvider,
            vcsProvider,
            outputReportDir,
            videoDirectory,
            screenshotDirectory,
            verbose
        });
        // @ts-ignore
        // noinspection JSUnusedLocalSymbols
        const slack = slackRunner(
            ciProvider,
            vcsProvider,
            outputReportDir,
            videoDirectory,
            screenshotDirectory,
            verbose
        );
        for(let j = 0; j < failed.length; j++){
            let test = failed[j];
            let testName = test.title[1];
            let errorMessage = test.error
            console.error(testName + " FAILED!")
            console.error(errorMessage)
            let url = getBuildLink();
            if(process.env.JOB_URL){
                url = process.env.JOB_URL+"/ws/report"
            }
        }
        // tslint:disable-next-line: no-console
        console.log("Finished slack upload")
        cb();
    })
}
export function runCypressTests(cb: () => void, specificSpec?: string) {
    deleteSuccessFile();
    rimraf('./cypress/reports/mocha/*.json', function(){
        const path = sdkRepo + "/cypress/integration";
        let browser = process.env.CYPRESS_BROWSER || "electron";
        fs.readdir(path, function(err: any, specFileNames: string[]){
            if(!specFileNames){
                throw "No specFileNames in "+path
            }
            for(let i = 0, p = Promise.resolve(); i < specFileNames.length; i++){
                let specName = specFileNames[i]
                if(specificSpec && specName.indexOf(specificSpec) === -1){
                    console.debug("skipping "+specName)
                    continue;
                }
                p = p.then(_ => new Promise(resolve => {
                    let specPath = path + '/' + specName
                    let context = specName.replace('_spec.js', '');
                    qmGit.setGithubStatus("pending", context, `Running ${context} Cypress tests...`)
                    // noinspection JSUnresolvedFunction
                    cypress.run({
                        spec: specPath,
                        browser: browser,
                    }).then((results) => {
                        if(!results.runs || !results.runs[0]){
                            console.log("No runs property on " + JSON.stringify(results, null, 2))
                        }else{
                            let tests = results.runs[0].tests;
                            let failed = tests.filter(function(test: { state: string; }){
                                return test.state === "failed";
                            })
                            if(failed && failed.length){
                                mochawesome(resolve, failed);
                                let failedTestTitle = failed[0].title[1];
                                let description = failedTestTitle+" failed!"
                                qmGit.setGithubStatus("failure", context, failedTestTitle+" failed!", getReportUrl())
                                throw "Stopping because "+description
                            }
                            console.info(results.totalPassed + " tests PASSED!")
                            qmGit.setGithubStatus("success", context, results.totalPassed + " tests passed")
                        }
                        resolve();
                        if(i === specFileNames.length - 1){
                            createSuccessFile();
                            deleteEnvFile()
                            cb();
                        }
                    }).catch((err: any) => {
                        qmGit.setGithubStatus("error", context, err, getReportUrl())
                        console.error(err)
                        throw err;
                    })
                }));
            }
        });
    });
}
export function getBuildLink() {
    if (process.env.BUILD_URL) {
        return process.env.BUILD_URL+"/console";
    }
    if (process.env.BUDDYBUILD_APP_ID) {
        return "https://dashboard.buddybuild.com/apps/" + process.env.BUDDYBUILD_APP_ID + "/build/" + process.env.BUDDYBUILD_APP_ID;
    }
    if (process.env.CIRCLE_BUILD_NUM) {
        return "https://circleci.com/gh/QuantiModo/quantimodo-android-chrome-ios-web-app/" + process.env.CIRCLE_BUILD_NUM;
    }
    if (process.env.TRAVIS_BUILD_ID) {
        return "https://travis-ci.org/" + process.env.TRAVIS_REPO_SLUG + "/builds/" + process.env.TRAVIS_BUILD_ID;
    }
}
const successFilename = 'success-file'
export function createSuccessFile() {
    fileHelper.writeToFile('lastCommitBuilt', qmGit.getCurrentGitCommitSha());
    return fs.writeFileSync(successFilename, qmGit.getCurrentGitCommitSha());
}
export function deleteSuccessFile () {
    qmLog.info("Deleting success file so we know if build completed...");
    rimraf(successFilename, function (res: any) {
        qmLog.info("Deleted success file!");
    })
}
export function deleteEnvFile () {
    rimraf('.env', function (res: any) {
        qmLog.info("Deleted env file!");
    })
}
export function getCiProvider() {
    if (process.env.CIRCLE_BRANCH) {
        return "circleci";
    }
    if (process.env.BUDDYBUILD_BRANCH) {
        return "buddybuild";
    }
    if (process.env.JENKINS_URL) {
        return "jenkins";
    }
    return process.env.HOSTNAME;
}