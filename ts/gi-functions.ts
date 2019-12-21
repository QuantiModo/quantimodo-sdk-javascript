import * as qmEnv from "./env-helper"
import * as qmGit from "./qm.git"
import * as qmLog from "./qm.log"
import * as th from "./test-helpers"
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
    getStartUrl(): string {
        if (gi.suiteType === "api") {
            return th.getApiUrl() + `/api/v2/auth/login`
        }
        let defaultValue = "https://web.quantimo.do"
        if (th.getApiUrl().indexOf("utopia") !== -1) {
            defaultValue = "https://dev-web.quantimo.do"
        }
        const startUrl = qmEnv.getArgumentOrEnv("START_URL", defaultValue)
        if (!startUrl) {
            throw Error("Please set START_URL env")
        }
        return startUrl
    },
    getSha(): string {
        let sha = qmGit.getCurrentGitCommitSha()
        if (!sha) {
            sha = qmEnv.getArgumentOrEnv("SHA", null)
        }
        if (!sha) {
            throw Error("Please set GIT_COMMIT env")
        }
        return sha
    },
    outputErrorsForTest(testResults: { testName: any; name: any; _id: string; dateExecutionStarted: any;
        dateExecutionFinished: any; console: string | any[] },
                        context: string) {
        const name = testResults.testName || testResults.name
        const url = `https://app.ghostinspector.com/results/` + testResults._id
        console.error(name + ` FAILED: ${url}`)
        qmGit.setGithubStatus(qmGit.githubStatusStates.failure, context, name, url)
        qmLog.logBugsnagLink("ionic", testResults.dateExecutionStarted, testResults.dateExecutionFinished)
        qmLog.logBugsnagLink("slim-api", testResults.dateExecutionStarted, testResults.dateExecutionFinished)
        console.error(`=== CONSOLE ERRORS ====`)
        let logObject
        for (logObject of testResults.console) {
            if (logObject.error || logObject.output.toLowerCase().indexOf(`error`) !== -1) {
                console.error(logObject.output + ` at ` + logObject.url)
            }
        }
        process.exit(1)
    },
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
        return qmEnv.getArgumentOrEnv("TEST_SUITE", gi.suites[type][th.getReleaseStage()])
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
        qmGit.setGithubStatus(qmGit.githubStatusStates.pending, context, options.apiUrl, testUrl)
        logTestParameters(options.apiUrl, options.startUrl, testUrl)
        getGhostInspector().executeTest(test._id, options, function(err: string, testResults: any, passing: any) {
            console.info(`RESULTS:`)
            if (err) {
                qmGit.setGithubStatus(qmGit.githubStatusStates.error, context, err, testUrl)
                throw new Error(test.name + ` Error: ` + err)
            }
            if (!passing) {
                qmGit.setGithubStatus(qmGit.githubStatusStates.failure, context, options.apiUrl, testUrl)
                gi.outputErrorsForTest(testResults, context)
                process.exit(1)
            }
            console.log(test.name + " passed! :D")
            qmGit.setGithubStatus(qmGit.githubStatusStates.success, context, test.name + " passed! :D", testUrl)
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
        qmGit.setGithubStatus(qmGit.githubStatusStates.pending, context, options.apiUrl, testSuiteUrl)
        getGhostInspector().executeSuite(suiteId, options, function(err: string, suiteResults: string |
            any[],                                                  passing: boolean) {
            console.info(`RESULTS:`)
            if (err) {
                qmGit.setGithubStatus(qmGit.githubStatusStates.error, context, err, testSuiteUrl)
                throw new Error(testSuiteUrl + ` Error: ` + err)
            }
            console.log(passing ? "Passed" : "Failed")
            if (!passing) {
                let testResults
                for (testResults of suiteResults) {
                    if (!testResults.passing) {
                        gi.outputErrorsForTest(testResults, context)
                    }
                }
            }
            qmGit.setGithubStatus(qmGit.githubStatusStates.success, context, options.apiUrl, testSuiteUrl)
            console.log(testSuiteUrl + " " + " passed! :D")
            callback()
        })
    },
    getOptions(startUrl: any) {
        return {
            apiUrl: th.getApiUrl(),
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
