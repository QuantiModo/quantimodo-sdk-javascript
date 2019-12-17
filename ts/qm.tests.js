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
var qmLog = __importStar(require("./qm.log"));
dotenv_1.default.config(); // https://github.com/motdotla/dotenv#what-happens-to-environment-variables-that-were-already-set
var ciProvider = getCiProvider();
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
    return getBuildLink();
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
    console.info("Cypress Configuration: " + fs.readFileSync(cypressJson));
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
    deleteSuccessFile();
    copyCypressEnvConfigIfNecessary();
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
                            createSuccessFile();
                            deleteEnvFile();
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
function getBuildLink() {
    if (process.env.BUILD_URL_FOR_STATUS) {
        return process.env.BUILD_URL_FOR_STATUS + "/console";
    }
    if (process.env.BUILD_URL) {
        return process.env.BUILD_URL + "/console";
    }
    if (process.env.BUDDYBUILD_APP_ID) {
        return "https://dashboard.buddybuild.com/apps/" + process.env.BUDDYBUILD_APP_ID + "/build/" +
            process.env.BUDDYBUILD_APP_ID;
    }
    if (process.env.CIRCLE_BUILD_NUM) {
        return "https://circleci.com/gh/QuantiModo/quantimodo-android-chrome-ios-web-app/" +
            process.env.CIRCLE_BUILD_NUM;
    }
    if (process.env.TRAVIS_BUILD_ID) {
        return "https://travis-ci.org/" + process.env.TRAVIS_REPO_SLUG + "/builds/" + process.env.TRAVIS_BUILD_ID;
    }
}
exports.getBuildLink = getBuildLink;
var successFilename = "success-file";
function createSuccessFile() {
    fileHelper.writeToFile("lastCommitBuilt", qmGit.getCurrentGitCommitSha());
    return fs.writeFileSync(successFilename, qmGit.getCurrentGitCommitSha());
}
exports.createSuccessFile = createSuccessFile;
function deleteSuccessFile() {
    qmLog.info("Deleting success file so we know if build completed...");
    rimraf_1.default(successFilename, function () {
        qmLog.info("Deleted success file!");
    });
}
exports.deleteSuccessFile = deleteSuccessFile;
function deleteEnvFile() {
    rimraf_1.default(".env", function () {
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
    // @ts-ignore
    return process.env.HOSTNAME;
}
exports.getCiProvider = getCiProvider;
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
        console.log(err);
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
var timeHelper = {
    getUnixTimestampInMilliseconds: function (dateTimeString) {
        if (!dateTimeString) {
            return new Date().getTime();
        }
        return new Date(dateTimeString).getTime();
    },
    getTimeSinceString: function (unixTimestamp) {
        if (!unixTimestamp) {
            return "never";
        }
        var secondsAgo = timeHelper.secondsAgo(unixTimestamp);
        if (secondsAgo > 2 * 24 * 60 * 60) {
            return Math.round(secondsAgo / (24 * 60 * 60)) + " days ago";
        }
        if (secondsAgo > 2 * 60 * 60) {
            return Math.round(secondsAgo / (60 * 60)) + " hours ago";
        }
        if (secondsAgo > 2 * 60) {
            return Math.round(secondsAgo / (60)) + " minutes ago";
        }
        return secondsAgo + " seconds ago";
    },
    secondsAgo: function (unixTimestamp) {
        return Math.round((new Date().getTime() - unixTimestamp));
    },
};
exports.giTests = {
    getArgumentOrEnv: function (name, defaultValue) {
        if (typeof process.env[name] !== "undefined") {
            // @ts-ignore
            return process.env[name];
        }
        if (typeof defaultValue === "undefined") {
            throw new Error("Please specify " + name + " env or argument");
        }
        return defaultValue;
    },
    getReleaseStage: function () {
        if (exports.giTests.getApiUrl().indexOf("utopia") !== -1) {
            return "development";
        }
        if (exports.giTests.getApiUrl().indexOf("production") !== -1) {
            return "production";
        }
        if (exports.giTests.getApiUrl().indexOf("app.") !== -1) {
            return "production";
        }
        if (exports.giTests.getApiUrl().indexOf("staging") !== -1) {
            return "staging";
        }
        return exports.giTests.getArgumentOrEnv("RELEASE_STAGE", null);
    },
    getStartUrl: function () {
        if (exports.giTests.suiteType === "api") {
            return exports.giTests.getApiUrl() + "/api/v2/auth/login";
        }
        var defaultValue = "https://web.quantimo.do";
        if (exports.giTests.getApiUrl().indexOf("utopia") !== -1) {
            defaultValue = "https://dev-web.quantimo.do";
        }
        var startUrl = exports.giTests.getArgumentOrEnv("START_URL", defaultValue);
        if (!startUrl) {
            throw Error("Please set START_URL env");
        }
        return startUrl;
    },
    getSha: function () {
        var sha = qmGit.getCurrentGitCommitSha();
        if (!sha) {
            sha = exports.giTests.getArgumentOrEnv("SHA", null);
        }
        if (!sha) {
            throw Error("Please set GIT_COMMIT env");
        }
        return sha;
    },
    getApiUrl: function () {
        var url = exports.giTests.getArgumentOrEnv("API_URL", "app.quantimo.do");
        if (!url) {
            throw new Error("Please provide API_URL");
        }
        url = url.replace("production.quantimo.do", "app.quantimo.do");
        if (url.indexOf("http") !== 0) {
            url = "https://" + url;
        }
        return url;
    },
    logBugsnagLink: function (suite, start, end) {
        var query = "filters[event.since][0]=" + start +
            "&filters[error.status][0]=open&filters[event.before][0]=" + end +
            "&sort=last_seen";
        console.error(suite.toUpperCase() + " ERRORS: ");
        console.error("https://app.bugsnag.com/quantimodo/" + suite + "/errors?" + query);
    },
    outputErrorsForTest: function (testResults) {
        var name = testResults.testName || testResults.name;
        console.error(name + " FAILED: https://app.ghostinspector.com/results/" + testResults._id);
        exports.giTests.logBugsnagLink("ionic", testResults.dateExecutionStarted, testResults.dateExecutionFinished);
        exports.giTests.logBugsnagLink("slim-api", testResults.dateExecutionStarted, testResults.dateExecutionFinished);
        console.error("=== CONSOLE ERRORS ====");
        var logObject;
        for (var _i = 0, _a = testResults.console; _i < _a.length; _i++) {
            logObject = _a[_i];
            if (logObject.error || logObject.output.toLowerCase().indexOf("error") !== -1) {
                console.error(logObject.output + " at " + logObject.url);
            }
        }
        process.exit(1);
    },
    startUrl: null,
    suiteType: "",
    suites: {
        api: {
            development: "5c0a8e87c4036f64df154e77",
            production: "5c0a8c83c4036f64df153b3f",
            staging: "5c0a8e5ac4036f64df154d8e",
        },
        ionic: {
            development: "5c072f704182f16946402eb3",
            production: "5c0729fb4182f16946402914",
            staging: "5c0716164a85d01c022def70",
        },
    },
    getSuiteId: function (type) {
        exports.giTests.suiteType = type;
        // @ts-ignore
        return exports.giTests.getArgumentOrEnv("TEST_SUITE", exports.giTests.suites[type][exports.giTests.getReleaseStage()]);
    },
    tests: {
        getStartUrl: function () {
            if (exports.giTests.suiteType === "api") {
                return exports.giTests.getApiUrl() + "/api/v2/auth/login";
            }
            var defaultValue = "https://web.quantimo.do";
            if (exports.giTests.getApiUrl().indexOf("utopia") !== -1) {
                defaultValue = "https://dev-web.quantimo.do";
            }
            // @ts-ignore
            return exports.giTests.getArgumentOrEnv("START_URL", defaultValue);
        },
        giEverything: function (callback) {
            exports.giTests.tests.giApiFailed(function () {
                exports.giTests.tests.giIonicFailed(function () {
                    exports.giTests.tests.giIonicAll(function () {
                        exports.giTests.tests.giApiAll(function () {
                            if (callback) {
                                callback();
                            }
                            process.exit(0);
                        });
                    });
                });
            });
        },
        giIonicAll: function (callback) {
            // qmTests.currentTask = this.currentTask.name;
            exports.giTests.tests.executeTestSuite(exports.giTests.getSuiteId("ionic"), callback, exports.giTests.tests.getStartUrl(), "all-gi-ionic-tests");
        },
        giIonicFailed: function (callback) {
            // qmTests.currentTask = this.currentTask.name;
            exports.giTests.tests.getSuiteTestsAndExecute(exports.giTests.getSuiteId("ionic"), true, callback, exports.giTests.tests.getStartUrl());
        },
        giApiFailed: function (callback) {
            // qmTests.currentTask = this.currentTask.name;
            exports.giTests.tests.getSuiteTestsAndExecute(exports.giTests.getSuiteId("api"), true, callback, exports.giTests.tests.getStartUrl());
        },
        giApiAll: function (callback) {
            // qmTests.currentTask = this.currentTask.name;
            exports.giTests.tests.executeTestSuite(exports.giTests.getSuiteId("api"), callback, exports.giTests.tests.getStartUrl(), "all-gi-api-tests");
        },
        executeTests: function (tests, callback, startUrl, context) {
            var GhostInspector = getGhostInspector();
            var options = exports.giTests.tests.getOptions(startUrl);
            var test = tests.pop();
            var time = new Date(Date.now()).toLocaleString();
            console.info(time + ": Testing " + test.name + " from " + test.suite.name + " on startUrl " +
                options.startUrl.replace("https://", "") +
                "with api url " + options.apiUrl + "...");
            var testUrl = "https://app.ghostinspector.com/tests/" + test._id;
            qmGit.setGithubStatus("pending", context, options.apiUrl, testUrl);
            console.info("Check " + test.suite.name + " test " + test._id + " progress at " + testUrl);
            GhostInspector.executeTest(test._id, options, function (err, testResults, passing) {
                if (err) {
                    throw new Error(test.name + " Error: " + err);
                }
                if (!passing) {
                    exports.giTests.outputErrorsForTest(testResults);
                    process.exit(1);
                }
                console.log(test.name + " passed! :D");
                if (tests && tests.length) {
                    exports.giTests.tests.executeTests(tests, callback, startUrl, context);
                }
                else if (callback) {
                    callback();
                }
            });
        },
        getSuiteTestsAndExecute: function (suiteId, failedOnly, callback, startUrl) {
            var GhostInspector = getGhostInspector();
            var failedAll = (failedOnly) ? "failed" : "all";
            if (failedOnly) {
                console.info("\n=== FAILED " + exports.giTests.suiteType + " GI TESTS ===\n");
            }
            else {
                console.info("\n===  " + exports.giTests.suiteType + " GI TESTS ===\n");
            }
            console.info("Running " + failedAll + " GI tests on " + startUrl + " using API at " + exports.giTests.getApiUrl());
            GhostInspector.getSuiteTests(suiteId, function (err, tests) {
                if (err) {
                    return console.log("Error: " + err);
                }
                if (failedOnly) {
                    var failedTests = tests.filter(function (test) {
                        return !test.passing;
                    });
                    if (!failedTests || !failedTests.length) {
                        console.info("No failed tests!");
                        if (callback) {
                            callback();
                        }
                        return;
                    }
                    else {
                        tests = failedTests;
                    }
                }
                var testResult;
                for (var _i = 0, tests_1 = tests; _i < tests_1.length; _i++) {
                    testResult = tests_1[_i];
                    var passFail = (testResult.passing) ? "passed" : "failed";
                    console.info(testResult.name + " recently " + passFail);
                }
                exports.giTests.tests.executeTests(tests, callback, startUrl, exports.giTests.suiteType + " " + failedAll + " GI ");
            });
        },
        executeTestSuite: function (suiteId, callback, startUrl, context) {
            var GhostInspector = getGhostInspector();
            var options = exports.giTests.tests.getOptions(startUrl);
            console.info("Testing suite on startUrl " + options.startUrl + "...");
            var suiteUrl = "https://app.ghostinspector.com/suites/" + suiteId;
            console.info("Check " + suiteId + " suite progress at " + suiteUrl);
            qmGit.setGithubStatus("pending", context, options.apiUrl, suiteUrl);
            GhostInspector.executeSuite(suiteId, options, function (err, suiteResults, passing) {
                if (err) {
                    throw new Error(suiteUrl + " Error: " + err);
                }
                console.log(passing ? "Passed" : "Failed");
                if (!passing) {
                    var testResults = void 0;
                    for (var _i = 0, suiteResults_1 = suiteResults; _i < suiteResults_1.length; _i++) {
                        testResults = suiteResults_1[_i];
                        if (!testResults.passing) {
                            exports.giTests.outputErrorsForTest(testResults);
                        }
                    }
                }
                console.log(suiteUrl + " " + " passed! :D");
                callback();
            });
        },
        getOptions: function (startUrl) {
            return {
                apiUrl: exports.giTests.getApiUrl(),
                sha: exports.giTests.getSha(),
                startUrl: startUrl || exports.giTests.getStartUrl(),
            };
        },
    },
};
function getGhostInspector() {
    if (!process.env.GI_API_KEY) {
        throw new Error("Please set GI_API_KEY env from https://app.ghostinspector.com/account");
    }
    console.debug("Using GI_API_KEY starting with " + process.env.GI_API_KEY.substr(0, 4) + "...");
    return require("ghost-inspector")(process.env.GI_API_KEY);
}
//# sourceMappingURL=qm.tests.js.map