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
function runEverything(callback) {
    exports.gi.runFailedApi(function () {
        exports.gi.runFailedIonic(function () {
            exports.gi.runAllIonic(function () {
                exports.gi.runAllApi(function () {
                    if (callback) {
                        callback();
                    }
                    process.exit(0);
                });
            });
        });
    });
}
exports.runEverything = runEverything;
function logTestParameters(apiUrl, startUrl, testUrl) {
    console.info("startUrl: " + startUrl);
    console.info("apiUrl: " + apiUrl);
    console.info("View test at: " + testUrl);
}
exports.gi = {
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
        if (exports.gi.getApiUrl().indexOf("utopia") !== -1) {
            return "development";
        }
        if (exports.gi.getApiUrl().indexOf("production") !== -1) {
            return "production";
        }
        if (exports.gi.getApiUrl().indexOf("app.") !== -1) {
            return "production";
        }
        if (exports.gi.getApiUrl().indexOf("staging") !== -1) {
            return "staging";
        }
        return exports.gi.getArgumentOrEnv("RELEASE_STAGE", null);
    },
    getStartUrl: function () {
        if (exports.gi.suiteType === "api") {
            return exports.gi.getApiUrl() + "/api/v2/auth/login";
        }
        var defaultValue = "https://web.quantimo.do";
        if (exports.gi.getApiUrl().indexOf("utopia") !== -1) {
            defaultValue = "https://dev-web.quantimo.do";
        }
        var startUrl = exports.gi.getArgumentOrEnv("START_URL", defaultValue);
        if (!startUrl) {
            throw Error("Please set START_URL env");
        }
        return startUrl;
    },
    getSha: function () {
        var sha = qmGit.getCurrentGitCommitSha();
        if (!sha) {
            sha = exports.gi.getArgumentOrEnv("SHA", null);
        }
        if (!sha) {
            throw Error("Please set GIT_COMMIT env");
        }
        return sha;
    },
    getApiUrl: function () {
        var url = exports.gi.getArgumentOrEnv("API_URL", "app.quantimo.do");
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
        exports.gi.logBugsnagLink("ionic", testResults.dateExecutionStarted, testResults.dateExecutionFinished);
        exports.gi.logBugsnagLink("slim-api", testResults.dateExecutionStarted, testResults.dateExecutionFinished);
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
        exports.gi.suiteType = type;
        // @ts-ignore
        return exports.gi.getArgumentOrEnv("TEST_SUITE", exports.gi.suites[type][exports.gi.getReleaseStage()]);
    },
    runAllIonic: function (callback) {
        // qmTests.currentTask = this.currentTask.name;
        exports.gi.runTestSuite(exports.gi.getSuiteId("ionic"), exports.gi.getStartUrl(), "all-gi-ionic-tests", callback);
    },
    runFailedIonic: function (callback) {
        // qmTests.currentTask = this.currentTask.name;
        exports.gi.runFailedTests(exports.gi.getSuiteId("ionic"), exports.gi.getStartUrl(), callback);
    },
    runFailedApi: function (callback) {
        // qmTests.currentTask = this.currentTask.name;
        exports.gi.runFailedTests(exports.gi.getSuiteId("api"), exports.gi.getStartUrl(), callback);
    },
    runAllApi: function (callback) {
        // qmTests.currentTask = this.currentTask.name;
        exports.gi.runTestSuite(exports.gi.getSuiteId("api"), exports.gi.getStartUrl(), "all-gi-api-tests", callback);
    },
    runTests: function (tests, callback, startUrl, context) {
        var options = exports.gi.getOptions(startUrl);
        var test = tests.pop();
        var testUrl = "https://app.ghostinspector.com/tests/" + test._id;
        qmGit.setGithubStatus("pending", context, options.apiUrl, testUrl);
        logTestParameters(options.apiUrl, options.startUrl, testUrl);
        getGhostInspector().executeTest(test._id, options, function (err, testResults, passing) {
            console.info("RESULTS:");
            if (err) {
                throw new Error(test.name + " Error: " + err);
            }
            if (!passing) {
                exports.gi.outputErrorsForTest(testResults);
                process.exit(1);
            }
            console.log(test.name + " passed! :D");
            if (tests && tests.length) {
                exports.gi.runTests(tests, callback, startUrl, context);
            }
            else if (callback) {
                callback();
            }
        });
    },
    runFailedTests: function (suiteId, startUrl, callback) {
        console.info("\n=== Failed " + exports.gi.suiteType.toUpperCase() + " GI Tests ===\n");
        getGhostInspector().getSuiteTests(suiteId, function (err, tests) {
            function runFailedTests() {
                if (err) {
                    return console.error("Error: " + err);
                }
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
                var testResult;
                for (var _i = 0, tests_1 = tests; _i < tests_1.length; _i++) {
                    testResult = tests_1[_i];
                    var passFail = (testResult.passing) ? "passed" : "failed";
                    console.info(testResult.name + " recently " + passFail);
                }
                exports.gi.runTests(tests, callback, startUrl, "Previously failed " + exports.gi.suiteType + " GI tests");
            }
            return runFailedTests();
        });
    },
    runTestSuite: function (suiteId, startUrl, context, callback) {
        console.info("\n=== All " + exports.gi.suiteType.toUpperCase() + " GI Tests ===\n");
        var options = exports.gi.getOptions(startUrl);
        var testSuiteUrl = "https://app.ghostinspector.com/suites/" + suiteId;
        logTestParameters(options.apiUrl, startUrl, testSuiteUrl);
        qmGit.setGithubStatus("pending", context, options.apiUrl, testSuiteUrl);
        getGhostInspector().executeSuite(suiteId, options, function (err, suiteResults, passing) {
            console.info("RESULTS:");
            if (err) {
                throw new Error(testSuiteUrl + " Error: " + err);
            }
            console.log(passing ? "Passed" : "Failed");
            if (!passing) {
                var testResults = void 0;
                for (var _i = 0, suiteResults_1 = suiteResults; _i < suiteResults_1.length; _i++) {
                    testResults = suiteResults_1[_i];
                    if (!testResults.passing) {
                        exports.gi.outputErrorsForTest(testResults);
                    }
                }
            }
            console.log(testSuiteUrl + " " + " passed! :D");
            callback();
        });
    },
    getOptions: function (startUrl) {
        return {
            apiUrl: exports.gi.getApiUrl(),
            sha: exports.gi.getSha(),
            startUrl: startUrl || exports.gi.getStartUrl(),
        };
    },
};
function getGhostInspector() {
    if (!process.env.GI_API_KEY) {
        throw new Error("Please set GI_API_KEY env from https://app.ghostinspector.com/account");
    }
    // console.debug(`Using GI_API_KEY starting with ` + process.env.GI_API_KEY.substr(0, 4) + "...")
    return require("ghost-inspector")(process.env.GI_API_KEY);
}
//# sourceMappingURL=gi-functions.js.map