"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_root_path_1 = __importDefault(require("app-root-path"));
var cypress = __importStar(require("cypress"));
var slack_alert_js_1 = require("cypress-slack-reporter/bin/slack/slack-alert.js");
var dotenv_1 = __importDefault(require("dotenv"));
var fs = __importStar(require("fs"));
// @ts-ignore
var mochawesome_merge_1 = require("mochawesome-merge");
// @ts-ignore
var mochawesome_report_generator_1 = __importDefault(require("mochawesome-report-generator"));
var rimraf_1 = __importDefault(require("rimraf"));
var fileHelper = __importStar(require("./qm.file-helper"));
var qmGit = __importStar(require("./qm.git"));
var test_helpers_1 = require("./test-helpers");
dotenv_1.default.config(); // https://github.com/motdotla/dotenv#what-happens-to-environment-variables-that-were-already-set
var ciProvider = test_helpers_1.getCiProvider();
var isWin = process.platform === "win32";
var outputReportDir = app_root_path_1.default + "/mochawesome-report";
var screenshotDirectory = app_root_path_1.default + "/mochawesome-report/assets";
var unmerged = app_root_path_1.default + "/cypress/reports/mocha";
var vcsProvider = "github";
var verbose = true;
var videoDirectory = app_root_path_1.default + "/cypress/videos";
var mergedJsonPath = outputReportDir + "/mochawesome.json";
var lastFailedCypressTestPath = "last-failed-cypress-test";
var cypressJson = fileHelper.getAbsolutePath("cypress.json");
var releaseStage = process.env.RELEASE_STAGE || "production";
var envPath = fileHelper.getAbsolutePath("cypress/config/cypress." + releaseStage + ".json");
var paths = {
    reports: {
        junit: "./cypress/reports/junit",
        mocha: "./cypress/reports/mocha",
    },
};
function getReportUrl() {
    if (process.env.JOB_URL && process.env.JOB_URL.indexOf("DEPLOY-") === 0) {
        return process.env.JOB_URL + "ws/tmp/quantimodo-sdk-javascript/mochawesome-report/mochawesome.html";
    }
    return test_helpers_1.getBuildLink();
}
function mochawesome(failedTests, cb) {
    console.log("Merging reports...");
    mochawesome_merge_1.merge({
        inline: true,
        reportDir: unmerged,
        saveJson: true,
    }).then(function (mergedJson) {
        fs.writeFileSync(mergedJsonPath, JSON.stringify(mergedJson, null, 2));
        console.log("Generating report from " + unmerged + " and outputting at " + outputReportDir);
        return mochawesome_report_generator_1.default.create(mergedJson, {
            // cdn: true,
            autoOpen: isWin,
            charts: true,
            inline: true,
            overwrite: true,
            reportDir: outputReportDir,
            saveJson: true,
            showPassed: true,
        });
    }).then(function (generatedReport) {
        console.log("Merged report available here:-", generatedReport[0]);
        // tslint:disable-next-line: no-console
        console.log("Constructing Slack message with the following options", {
            ciProvider: ciProvider,
            outputReportDir: outputReportDir,
            screenshotDirectory: screenshotDirectory,
            vcsProvider: vcsProvider,
            verbose: verbose,
            videoDirectory: videoDirectory,
        });
        try {
            // @ts-ignore
            // noinspection JSUnusedLocalSymbols
            if (!process.env.SLACK_WEBHOOK_URL) {
                console.error("env SLACK_WEBHOOK_URL not set!");
            }
            else {
                // @ts-ignore
                slack_alert_js_1.slackRunner(ciProvider, vcsProvider, outputReportDir, videoDirectory, screenshotDirectory, verbose);
                // tslint:disable-next-line: no-console
                console.log("Finished slack upload");
            }
        }
        catch (error) {
            console.error(error);
        }
        cb(generatedReport[0]);
    });
}
exports.mochawesome = mochawesome;
function copyCypressEnvConfigIfNecessary() {
    console.info("Copying " + envPath + " to cypress.json");
    fs.copyFileSync(envPath, cypressJson);
    var cypressJsonString = fs.readFileSync(cypressJson).toString();
    var cypressJsonObject = null;
    try {
        cypressJsonObject = JSON.parse(cypressJsonString);
    }
    catch (e) {
        console.error("Could not parse  " + cypressJson + " because " + e.message + "! Here's the string " + cypressJsonString);
    }
    if (!cypressJsonObject) {
        var before_1 = fs.readFileSync(envPath).toString();
        throw Error("Could not parse " + cypressJson + " after copy! " + envPath + " is " + before_1);
    }
    console.info("Cypress Configuration: " + cypressJsonString);
}
function setGithubStatusAndUploadTestResults(failedTests, context) {
    // @ts-ignore
    var failedTestTitle = failedTests[0].title[1];
    // @ts-ignore
    var errorMessage = failedTests[0].error;
    qmGit.setGithubStatus("failure", context, failedTestTitle + ": " +
        errorMessage, getReportUrl(), function () {
        uploadTestResults(function () {
            console.error(errorMessage);
            // cb(errorMessage);
            process.exit(1);
            // resolve();
        });
    });
}
function deleteJUnitTestResults() {
    var jUnitFiles = paths.reports.junit + "/*.xml";
    rimraf_1.default(jUnitFiles, function () {
        console.debug("Deleted " + jUnitFiles);
    });
}
function runCypressTests(cb, specificSpec) {
    test_helpers_1.deleteSuccessFile();
    try {
        copyCypressEnvConfigIfNecessary();
    }
    catch (e) {
        console.error(e.message + "!  Going to try again...");
        copyCypressEnvConfigIfNecessary();
    }
    deleteJUnitTestResults();
    rimraf_1.default(paths.reports.mocha + "/*.json", function () {
        var specsPath = app_root_path_1.default + "/cypress/integration";
        var browser = process.env.CYPRESS_BROWSER || "electron";
        fs.readdir(specsPath, function (err, specFileNames) {
            if (!specFileNames) {
                throw new Error("No specFileNames in " + specsPath);
            }
            var _loop_1 = function (i, p) {
                var specName = specFileNames[i];
                if (specificSpec && specName.indexOf(specificSpec) === -1) {
                    console.debug("skipping " + specName);
                    return out_p_1 = p, "continue";
                }
                if (releaseStage === "ionic" && specName.indexOf("ionic_") === -1) {
                    console.debug("skipping " + specName + " because it doesn't test ionic app and release stage is " +
                        releaseStage);
                    return out_p_1 = p, "continue";
                }
                p = p.then(function (_) { return new Promise(function (resolve) {
                    var specPath = specsPath + "/" + specName;
                    var context = specName.replace("_spec.js", "") + "-" + releaseStage;
                    qmGit.setGithubStatus("pending", context, "Running " + context + " Cypress tests...");
                    // noinspection JSUnresolvedFunction
                    cypress.run({
                        browser: browser,
                        spec: specPath,
                    }).then(function (results) {
                        if (!results.runs || !results.runs[0]) {
                            console.log("No runs property on " + JSON.stringify(results, null, 2));
                        }
                        else {
                            var tests = results.runs[0].tests;
                            var failedTests_1 = null;
                            if (tests) {
                                failedTests_1 = tests.filter(function (test) {
                                    return test.state === "failed";
                                });
                            }
                            else {
                                console.error("No tests on ", results.runs[0]);
                            }
                            if (failedTests_1 && failedTests_1.length) {
                                fs.writeFileSync(lastFailedCypressTestPath, specName);
                                // tslint:disable-next-line:prefer-for-of
                                for (var j = 0; j < failedTests_1.length; j++) {
                                    var test_1 = failedTests_1[j];
                                    var testName = test_1.title[1];
                                    var errorMessage = test_1.error;
                                    console.error(testName + " FAILED because " + errorMessage);
                                }
                                mochawesome(failedTests_1, function () {
                                    setGithubStatusAndUploadTestResults(failedTests_1, context);
                                });
                            }
                            else {
                                deleteLastFailedCypressTest();
                                console.info(results.totalPassed + " tests PASSED!");
                                qmGit.setGithubStatus("success", context, results.totalPassed +
                                    " tests passed");
                            }
                        }
                        if (specificSpec || i === specFileNames.length - 1) {
                            test_helpers_1.createSuccessFile();
                            test_helpers_1.deleteEnvFile();
                            if (cb) {
                                cb(false);
                            }
                        }
                        resolve();
                    }).catch(function (runtimeError) {
                        qmGit.setGithubStatus("error", context, runtimeError, getReportUrl(), function () {
                            console.error(runtimeError);
                            process.exit(1);
                        });
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
function getLastFailedCypressTest() {
    try {
        return fs.readFileSync(lastFailedCypressTestPath, "utf8");
    }
    catch (error) {
        return null;
    }
}
function deleteLastFailedCypressTest() {
    // tslint:disable-next-line:no-empty
    try {
        fs.unlinkSync(lastFailedCypressTestPath);
    }
    catch (err) {
        console.debug("No last-failed-cypress-test file to delete");
    }
}
// tslint:disable-next-line:unified-signatures
function runLastFailedCypressTest(cb) {
    var name = getLastFailedCypressTest();
    if (!name) {
        console.info("No previously failed test!");
        cb(false);
        return;
    }
    runCypressTests(cb, name);
}
exports.runLastFailedCypressTest = runLastFailedCypressTest;
function uploadTestResults(cb) {
    var path = "mochawesome/" + qmGit.getCurrentGitCommitSha();
    fileHelper.uploadToS3("./mochawesome-report/mochawesome.html", path, cb, "quantimodo", "public-read", "text/html");
}
exports.uploadTestResults = uploadTestResults;
//# sourceMappingURL=cypress-functions.js.map