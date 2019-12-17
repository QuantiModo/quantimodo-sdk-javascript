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
            console.info("Running " + failedAll + (" GI tests with startUrl " + startUrl + " with API ") +
                exports.giTests.getApiUrl() + "...");
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
//# sourceMappingURL=gi-functions.js.map