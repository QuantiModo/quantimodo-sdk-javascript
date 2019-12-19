import * as qmGit from "./qm.git"

export function runEverything(callback: () => void) {
    gi.runFailedApi(function() {
        gi.runFailedIonic(function() {
            gi.runAllIonic(function() {
                gi.runAllApi(function() {
                    if(callback) {callback()}
                    process.exit(0)
                })
            })
        })
    })
}

function logTestParameters(apiUrl: string, startUrl: string, testUrl: string) {
    console.info(`startUrl: ` + startUrl)
    console.info(`apiUrl: ` + apiUrl)
    console.info(`View test at: ` + testUrl)
}

export const gi = {
    getArgumentOrEnv(name: string, defaultValue: null | string): string | null {
        if (typeof process.env[name] !== "undefined") {
            // @ts-ignore
            return process.env[name]
        }
        if (typeof defaultValue === "undefined") {
            throw new Error(`Please specify ` + name + ` env or argument`)
        }
        return defaultValue
    },
    getReleaseStage() {
        if (gi.getApiUrl().indexOf("utopia") !== -1) {
            return "development"
        }
        if (gi.getApiUrl().indexOf("production") !== -1) {
            return "production"
        }
        if (gi.getApiUrl().indexOf("app.") !== -1) {
            return "production"
        }
        if (gi.getApiUrl().indexOf("staging") !== -1) {
            return "staging"
        }
        return gi.getArgumentOrEnv("RELEASE_STAGE", null)
    },
    getStartUrl(): string {
        if (gi.suiteType === "api") {
            return gi.getApiUrl() + `/api/v2/auth/login`
        }
        let defaultValue = "https://web.quantimo.do"
        if (gi.getApiUrl().indexOf("utopia") !== -1) {
            defaultValue = "https://dev-web.quantimo.do"
        }
        const startUrl = gi.getArgumentOrEnv("START_URL", defaultValue)
        if (!startUrl) {
            throw Error("Please set START_URL env")
        }
        return startUrl
    },
    getSha(): string {
        let sha = qmGit.getCurrentGitCommitSha()
        if (!sha) {
            sha = gi.getArgumentOrEnv("SHA", null)
        }
        if (!sha) {
            throw Error("Please set GIT_COMMIT env")
        }
        return sha
    },
    getApiUrl(): string {
        let url = gi.getArgumentOrEnv("API_URL", "app.quantimo.do")
        if(!url) {
            throw new Error("Please provide API_URL")
        }
        url = url.replace("production.quantimo.do", "app.quantimo.do")
        if (url.indexOf("http") !== 0) {
            url = `https://` + url
        }
        return url
    },
    logBugsnagLink(suite: string, start: string, end: string) {
        const query = `filters[event.since][0]=` + start +
            `&filters[error.status][0]=open&filters[event.before][0]=` + end +
            `&sort=last_seen`
        console.error(suite.toUpperCase() + ` ERRORS: `)
        console.error(`https://app.bugsnag.com/quantimodo/` + suite + `/errors?` + query)
    },
    outputErrorsForTest(testResults: { testName: any; name: any; _id: string; dateExecutionStarted: any;
        dateExecutionFinished: any; console: string | any[] }) {
        const name = testResults.testName || testResults.name
        console.error(name + ` FAILED: https://app.ghostinspector.com/results/` + testResults._id)
        gi.logBugsnagLink("ionic", testResults.dateExecutionStarted, testResults.dateExecutionFinished)
        gi.logBugsnagLink("slim-api", testResults.dateExecutionStarted, testResults.dateExecutionFinished)
        console.error(`=== CONSOLE ERRORS ====`)
        let logObject
        for (logObject of testResults.console) {
            if (logObject.error || logObject.output.toLowerCase().indexOf(`error`) !== -1) {
                console.error(logObject.output + ` at ` + logObject.url)
            }
        }
        process.exit(1)
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
    getSuiteId(type: string): string {
        gi.suiteType = type
        // @ts-ignore
        return gi.getArgumentOrEnv("TEST_SUITE", gi.suites[type][gi.getReleaseStage()])
    },
    runAllIonic(callback: () => void) {
        // qmTests.currentTask = this.currentTask.name;
        gi.runTestSuite(gi.getSuiteId("ionic"), gi.getStartUrl(),
            "all-gi-ionic-tests", callback)
    },
    runFailedIonic(callback: () => void) {
        // qmTests.currentTask = this.currentTask.name;
        gi.runFailedTests(gi.getSuiteId("ionic"), gi.getStartUrl(), callback)
    },
    runFailedApi(callback: () => void) {
        // qmTests.currentTask = this.currentTask.name;
        gi.runFailedTests(gi.getSuiteId("api"), gi.getStartUrl(), callback)
    },
    runAllApi(callback: () => void) {
        // qmTests.currentTask = this.currentTask.name;
        gi.runTestSuite(gi.getSuiteId("api"), gi.getStartUrl(),
            "all-gi-api-tests", callback)
    },
    runTests(tests: any[], callback: () => void, startUrl: string, context: string) {
        const options = gi.getOptions(startUrl)
        const test = tests.pop()
        const testUrl = `https://app.ghostinspector.com/tests/` + test._id
        qmGit.setGithubStatus("pending", context, options.apiUrl, testUrl)
        logTestParameters(options.apiUrl, options.startUrl, testUrl)
        getGhostInspector().executeTest(test._id, options, function(err: string, testResults: any, passing: any) {
            console.info(`RESULTS:`)
            if (err) {
                throw new Error(test.name + ` Error: ` + err)
            }
            if (!passing) {
                gi.outputErrorsForTest(testResults)
                process.exit(1)
            }
            console.log(test.name + " passed! :D")
            if (tests && tests.length) {
                gi.runTests(tests, callback, startUrl, context)
            } else if (callback) {
                callback()
            }
        })
    },
    runFailedTests(suiteId: string, startUrl: string, callback: () => void) {
        console.info(`\n=== Failed ${gi.suiteType.toUpperCase()} GI Tests ===\n`)
        getGhostInspector().getSuiteTests(suiteId, function(err: string, tests: any[]) {
            function runFailedTests() {
                if (err) {
                    return console.error("Error: " + err)
                }
                const failedTests = tests.filter(function(test: { passing: any }) {
                    return !test.passing
                })
                if (!failedTests || !failedTests.length) {
                    console.info(`No failed tests!`)
                    if (callback) {
                        callback()
                    }
                    return
                } else {
                    tests = failedTests
                }
                let testResult
                for (testResult of tests) {
                    const passFail = (testResult.passing) ? "passed" : "failed"
                    console.info(testResult.name + ` recently ` + passFail)
                }
                gi.runTests(tests, callback, startUrl,
                    "Previously failed " + gi.suiteType + " GI tests")
            }
            return runFailedTests()
        })
    },
    runTestSuite(suiteId: string, startUrl: string, context: string, callback: () => void) {
        console.info(`\n=== All ${gi.suiteType.toUpperCase()} GI Tests ===\n`)
        const options = gi.getOptions(startUrl)
        const testSuiteUrl = `https://app.ghostinspector.com/suites/` + suiteId
        logTestParameters(options.apiUrl, startUrl, testSuiteUrl)
        qmGit.setGithubStatus("pending", context, options.apiUrl, testSuiteUrl)
        getGhostInspector().executeSuite(suiteId, options, function(err: string, suiteResults: string |
            any[],                                                  passing: boolean) {
            console.info(`RESULTS:`)
            if (err) {
                throw new Error(testSuiteUrl + ` Error: ` + err)
            }
            console.log(passing ? "Passed" : "Failed")
            if (!passing) {
                let testResults
                for (testResults of suiteResults) {
                    if (!testResults.passing) {
                        gi.outputErrorsForTest(testResults)
                    }
                }
            }
            console.log(testSuiteUrl + " " + " passed! :D")
            callback()
        })
    },
    getOptions(startUrl: any) {
        return {
            apiUrl: gi.getApiUrl(),
            sha: gi.getSha(),
            startUrl: startUrl || gi.getStartUrl(),
        }
    },
}
function getGhostInspector() {
    if (!process.env.GI_API_KEY) {
        throw new Error(`Please set GI_API_KEY env from https://app.ghostinspector.com/account`)
    }
    // console.debug(`Using GI_API_KEY starting with ` + process.env.GI_API_KEY.substr(0, 4) + "...")
    return require("ghost-inspector")(process.env.GI_API_KEY)
}
