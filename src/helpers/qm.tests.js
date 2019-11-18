"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var qmGit = __importStar(require("./qm.git"));
var fileHelper = __importStar(require("./qm.file-helper"));
var qmLog = __importStar(require("./qm.log"));
var fs = __importStar(require("fs"));
var cypress = __importStar(require("cypress"));
var sdkRepo = require('app-root-path');
var rimraf = require("rimraf");
var ciProvider = getCiProvider();
var isWin = process.platform === "win32";
var outputReportDir = sdkRepo + "/mochawesome-report";
var screenshotDirectory = sdkRepo + "/cypress/screenshots";
var unmerged = sdkRepo + "/cypress/reports/mocha";
var vcsProvider = "github";
var verbose = true;
var videoDirectory = sdkRepo + "/cypress/videos";
var mergedJsonPath = outputReportDir + "/mochawesome.json";
function getReportUrl() {
    if (process.env.JOB_URL) {
        return process.env.JOB_URL + '/ws/tmp/quantimodo-sdk-javascript/mochawesome-report/';
    }
    return getBuildLink();
}
function mochawesome(cb, failed) {
    var marge = require('mochawesome-report-generator');
    var merge = require('mochawesome-merge').merge;
    var slackRunner = require("cypress-slack-reporter/bin/slack/slack-alert.js").slackRunner;
    console.log("Merging reports...");
    merge({
        reportDir: unmerged,
        inline: true,
        saveJson: true,
    }).then(function (mergedJson) {
        fs.writeFileSync(mergedJsonPath, JSON.stringify(mergedJson, null, 2));
        console.log("Generating report from " + unmerged + " and outputting at " + outputReportDir);
        return marge.create(mergedJson, {
            reportDir: outputReportDir,
            inline: true,
            saveJson: true,
            charts: true,
            showPassed: true,
            autoOpen: isWin,
            //cdn: true,
            overwrite: true
        });
    }).then(function (_generatedReport) {
        console.log("Merged report available here:-", _generatedReport[0]);
        // tslint:disable-next-line: no-console
        console.log("Constructing Slack message with the following options", {
            ciProvider: ciProvider,
            vcsProvider: vcsProvider,
            outputReportDir: outputReportDir,
            videoDirectory: videoDirectory,
            screenshotDirectory: screenshotDirectory,
            verbose: verbose
        });
        // @ts-ignore
        // noinspection JSUnusedLocalSymbols
        var slack = slackRunner(ciProvider, vcsProvider, outputReportDir, videoDirectory, screenshotDirectory, verbose);
        for (var j = 0; j < failed.length; j++) {
            var test_1 = failed[j];
            var testName = test_1.title[1];
            var errorMessage = test_1.error;
            console.error(testName + " FAILED!");
            console.error(errorMessage);
            var url = getBuildLink();
            if (process.env.JOB_URL) {
                url = process.env.JOB_URL + "/ws/report";
            }
        }
        // tslint:disable-next-line: no-console
        console.log("Finished slack upload");
        cb();
    });
}
exports.mochawesome = mochawesome;
function runCypressTests(cb, specificSpec) {
    deleteSuccessFile();
    rimraf('./cypress/reports/mocha/*.json', function () {
        var path = sdkRepo + "/cypress/integration";
        var browser = process.env.CYPRESS_BROWSER || "electron";
        fs.readdir(path, function (err, specFileNames) {
            if (!specFileNames) {
                throw "No specFileNames in " + path;
            }
            var _loop_1 = function (i, p) {
                var specName = specFileNames[i];
                if (specificSpec && specName.indexOf(specificSpec) === -1) {
                    console.debug("skipping " + specName);
                    return out_p_1 = p, "continue";
                }
                p = p.then(function (_) { return new Promise(function (resolve) {
                    var specPath = path + '/' + specName;
                    var context = specName.replace('_spec.js', '');
                    qmGit.setGithubStatus("pending", context, "Running " + context + " Cypress tests...");
                    // noinspection JSUnresolvedFunction
                    cypress.run({
                        spec: specPath,
                        browser: browser,
                    }).then(function (results) {
                        if (!results.runs || !results.runs[0]) {
                            console.log("No runs property on " + JSON.stringify(results, null, 2));
                        }
                        else {
                            var tests = results.runs[0].tests;
                            var failed = tests.filter(function (test) {
                                return test.state === "failed";
                            });
                            if (failed && failed.length) {
                                mochawesome(resolve, failed);
                                var failedTestTitle = failed[0].title[1];
                                var description = failedTestTitle + " failed!";
                                qmGit.setGithubStatus("failure", context, failedTestTitle + " failed!", getReportUrl());
                                throw "Stopping because " + description;
                            }
                            console.info(results.totalPassed + " tests PASSED!");
                            qmGit.setGithubStatus("success", context, results.totalPassed + " tests passed");
                        }
                        resolve();
                        if (i === specFileNames.length - 1) {
                            createSuccessFile();
                            deleteEnvFile();
                            cb();
                        }
                    }).catch(function (err) {
                        qmGit.setGithubStatus("error", context, err, getReportUrl());
                        console.error(err);
                        throw err;
                    });
                }); });
                out_p_1 = p;
            };
            var out_p_1;
            for (var i = 0, p = Promise.resolve(); i < specFileNames.length; i++) {
                _loop_1(i, p);
                p = out_p_1;
            }
        });
    });
}
exports.runCypressTests = runCypressTests;
function getBuildLink() {
    if (process.env.BUILD_URL) {
        return process.env.BUILD_URL + "/console";
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
exports.getBuildLink = getBuildLink;
var successFilename = 'success-file';
function createSuccessFile() {
    fileHelper.writeToFile('lastCommitBuilt', qmGit.getCurrentGitCommitSha());
    return fs.writeFileSync(successFilename, qmGit.getCurrentGitCommitSha());
}
exports.createSuccessFile = createSuccessFile;
function deleteSuccessFile() {
    qmLog.info("Deleting success file so we know if build completed...");
    rimraf(successFilename, function (res) {
        qmLog.info("Deleted success file!");
    });
}
exports.deleteSuccessFile = deleteSuccessFile;
function deleteEnvFile() {
    rimraf('.env', function (res) {
        qmLog.info("Deleted env file!");
    });
}
exports.deleteEnvFile = deleteEnvFile;
function getCiProvider() {
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
exports.getCiProvider = getCiProvider;
//# sourceMappingURL=qm.tests.js.map