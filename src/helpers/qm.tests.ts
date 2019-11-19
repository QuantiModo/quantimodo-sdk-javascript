import * as cypress from "cypress";
import * as fs from "fs";
import * as fileHelper from "./qm.file-helper";
import * as qmGit from "./qm.git";
import * as qmLog from "./qm.log";
const sdkRepo = require("app-root-path");
const rimraf = require("rimraf");
const marge = require("mochawesome-report-generator");
const {merge} = require("mochawesome-merge");
const {slackRunner} = require("cypress-slack-reporter/bin/slack/slack-alert.js");
const dotenv = require("dotenv");
dotenv.config(); // https://github.com/motdotla/dotenv#what-happens-to-environment-variables-that-were-already-set
const ciProvider = getCiProvider();
const isWin = process.platform === "win32";
const outputReportDir = sdkRepo + "/mochawesome-report";
const screenshotDirectory = `${sdkRepo}/mochawesome-report/assets`;
const unmerged = sdkRepo + "/cypress/reports/mocha";
const vcsProvider = "github";
const verbose = true;
const videoDirectory = `${sdkRepo}/cypress/videos`;
const mergedJsonPath = outputReportDir + "/mochawesome.json";
const lastFailedCypressTestPath = "last-failed-cypress-test";
function getReportUrl(reportPath?: string) {
    if (process.env.JOB_URL) {
        return process.env.JOB_URL + "ws/tmp/quantimodo-sdk-javascript/mochawesome-report/mochawesome.html";
    }
    return getBuildLink();
}
export function mochawesome(failedTests: any[], cb: (err: any) => void) {
    console.log("Merging reports...");
    merge({
        reportDir: unmerged,
        inline: true,
        saveJson: true,
    }).then((mergedJson: any) => {
        fs.writeFileSync(mergedJsonPath, JSON.stringify(mergedJson, null, 2));
        console.log("Generating report from " + unmerged + " and outputting at " + outputReportDir);
        return marge.create(mergedJson, {
            reportDir: outputReportDir,
            inline: true,
            saveJson: true,
            charts: true,
            showPassed: true,
            autoOpen: isWin,
            // cdn: true,
            overwrite: true,
        });
    }).then((_generatedReport: any[]) => {
        console.log("Merged report available here:-", _generatedReport[0]);
        // tslint:disable-next-line: no-console
        console.log("Constructing Slack message with the following options", {
            ciProvider,
            vcsProvider,
            outputReportDir,
            videoDirectory,
            screenshotDirectory,
            verbose,
        });
        try {
            // @ts-ignore
            // noinspection JSUnusedLocalSymbols
            if (!process.env.SLACK_WEBHOOK_URL) {
                console.error("env SLACK_WEBHOOK_URL not set!");
            } else {
                const slack = slackRunner(
                    ciProvider,
                    vcsProvider,
                    outputReportDir,
                    videoDirectory,
                    screenshotDirectory,
                    verbose,
                ).catch((err: any) => {
                    throw err;
                });
                // tslint:disable-next-line: no-console
                console.log("Finished slack upload");
            }
        } catch (error) {
            console.error(error);
        }
        cb(_generatedReport[0]);
    });
}
export function runCypressTests(cb: (err: any) => void, specificSpec?: string) {
    deleteSuccessFile();
    rimraf("./cypress/reports/mocha/*.json", function() {
        const path = sdkRepo + "/cypress/integration";
        const browser = process.env.CYPRESS_BROWSER || "electron";
        fs.readdir(path, function(err: any, specFileNames: string[]) {
            if (!specFileNames) {
                throw new Error("No specFileNames in " + path);
            }
            for (let i = 0, p = Promise.resolve(); i < specFileNames.length; i++) {
                const specName = specFileNames[i];
                if (specificSpec && specName.indexOf(specificSpec) === -1) {
                    console.debug("skipping " + specName);
                    continue;
                }
                p = p.then((_) => new Promise((resolve) => {
                    const specPath = path + "/" + specName;
                    const context = specName.replace("_spec.js", "");
                    qmGit.setGithubStatus("pending", context, `Running ${context} Cypress tests...`);
                    // noinspection JSUnresolvedFunction
                    cypress.run({
                        spec: specPath,
                        browser,
                    }).then((results) => {
                        if (!results.runs || !results.runs[0]) {
                            console.log("No runs property on " + JSON.stringify(results, null, 2));
                        } else {
                            const tests = results.runs[0].tests;
                            const failedTests = tests.filter(function(test: { state: string; }) {
                                return test.state === "failed";
                            });
                            if (failedTests && failedTests.length) {
                                fs.writeFileSync(lastFailedCypressTestPath, specName);
                                for (let j = 0; j < failedTests.length; j++) {
                                    const test = failedTests[j];
                                    const testName = test.title[1];
                                    const errorMessage = test.error;
                                    console.error(testName + " FAILED because " + errorMessage);
                                }
                                mochawesome(failedTests, function(reportPath) {
                                    const failedTestTitle = failedTests[0].title[1];
                                    const errorMessage = failedTests[0].error;
                                    qmGit.setGithubStatus("failure", context, failedTestTitle + ": " +
                                        errorMessage, getReportUrl(reportPath), function() {
                                        resolve();
                                        cb(errorMessage);
                                        process.exit(1);
                                    });
                                });
                            } else {
                                deleteLastFailedCypressTest();
                                console.info(results.totalPassed + " tests PASSED!");
                                qmGit.setGithubStatus("success", context, results.totalPassed + " tests passed");
                            }
                        }
                        resolve();
                        if (i === specFileNames.length - 1) {
                            createSuccessFile();
                            deleteEnvFile();
                            cb(false);
                        }
                    }).catch((err: any) => {
                        qmGit.setGithubStatus("error", context, err, getReportUrl(), function() {
                            console.error(err);
                            process.exit(1);
                        });
                    });
                }));
            }
        });
    });
}
export function getBuildLink() {
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
const successFilename = "success-file";
export function createSuccessFile() {
    fileHelper.writeToFile("lastCommitBuilt", qmGit.getCurrentGitCommitSha());
    return fs.writeFileSync(successFilename, qmGit.getCurrentGitCommitSha());
}
export function deleteSuccessFile() {
    qmLog.info("Deleting success file so we know if build completed...");
    rimraf(successFilename, function(res: any) {
        qmLog.info("Deleted success file!");
    });
}
export function deleteEnvFile() {
    rimraf(".env", function(res: any) {
        qmLog.info("Deleted env file!");
    });
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
function getLastFailedCypressTest() {
    try {
        return fs.readFileSync(lastFailedCypressTestPath, "utf8");
    } catch (error) {
        return null;
    }
}
function deleteLastFailedCypressTest() {
    try {fs.unlinkSync(lastFailedCypressTestPath); } catch (err) {}
}
export function runLastFailedCypressTest(cb: { (err: any): void; (): void; }) {
    const name = getLastFailedCypressTest();
    if (!name) {
        console.info("No previously failed test!");
        cb(false);
        return;
    }
    runCypressTests(cb, name);
}
