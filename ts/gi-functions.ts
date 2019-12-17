import * as qmGit from "./qm.git"

function logTestParameters(apiUrl: string, startUrl: string, testUrl: string) {
    console.info(`startUrl: ` + startUrl)
    console.info(`apiUrl: ` + apiUrl)
    console.info(`View test at: ` + testUrl)
}

export const giTests = {
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
        if (giTests.getApiUrl().indexOf("utopia") !== -1) {
            return "development"
        }
        if (giTests.getApiUrl().indexOf("production") !== -1) {
            return "production"
        }
        if (giTests.getApiUrl().indexOf("app.") !== -1) {
            return "production"
        }
        if (giTests.getApiUrl().indexOf("staging") !== -1) {
            return "staging"
        }
        return giTests.getArgumentOrEnv("RELEASE_STAGE", null)
    },
    getStartUrl(): string {
        if (giTests.suiteType === "api") {
            return giTests.getApiUrl() + `/api/v2/auth/login`
        }
        let defaultValue = "https://web.quantimo.do"
        if (giTests.getApiUrl().indexOf("utopia") !== -1) {
            defaultValue = "https://dev-web.quantimo.do"
        }
        const startUrl = giTests.getArgumentOrEnv("START_URL", defaultValue)
        if (!startUrl) {
            throw Error("Please set START_URL env")
        }
        return startUrl
    },
    getSha(): string {
        let sha = qmGit.getCurrentGitCommitSha()
        if (!sha) {
            sha = giTests.getArgumentOrEnv("SHA", null)
        }
        if (!sha) {
            throw Error("Please set GIT_COMMIT env")
        }
        return sha
    },
    getApiUrl(): string {
        let url = giTests.getArgumentOrEnv("API_URL", "app.quantimo.do")
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
        giTests.logBugsnagLink("ionic", testResults.dateExecutionStarted, testResults.dateExecutionFinished)
        giTests.logBugsnagLink("slim-api", testResults.dateExecutionStarted, testResults.dateExecutionFinished)
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
        giTests.suiteType = type
        // @ts-ignore
        return giTests.getArgumentOrEnv("TEST_SUITE", giTests.suites[type][giTests.getReleaseStage()])
    },
    tests: {
        getStartUrl(): string {
            if (giTests.suiteType === "api") {
                return giTests.getApiUrl()+`/api/v2/auth/login`
            }
            let defaultValue = "https://web.quantimo.do"
            if(giTests.getApiUrl().indexOf("utopia") !== -1) {defaultValue = "https://dev-web.quantimo.do"}
            // @ts-ignore
            return giTests.getArgumentOrEnv("START_URL", defaultValue)
        },
        giEverything(callback: () => void) {
            giTests.tests.giApiFailed(function() {
                giTests.tests.giIonicFailed(function() {
                    giTests.tests.giIonicAll(function() {
                        giTests.tests.giApiAll(function() {
                            if(callback) {callback()}
                            process.exit(0)
                        })
                    })
                })
            })
        },
        giIonicAll(callback: () => void) {
            // qmTests.currentTask = this.currentTask.name;
            giTests.tests.executeTestSuite(giTests.getSuiteId("ionic"), callback, giTests.tests.getStartUrl(), "all-gi-ionic-tests")
        },
        giIonicFailed(callback: () => void) {
            // qmTests.currentTask = this.currentTask.name;
            giTests.tests.getSuiteTestsAndExecute(giTests.getSuiteId("ionic"), true, callback,
                giTests.tests.getStartUrl())
        },
        giApiFailed(callback: () => void) {
            // qmTests.currentTask = this.currentTask.name;
            giTests.tests.getSuiteTestsAndExecute(giTests.getSuiteId("api"), true, callback,
                giTests.tests.getStartUrl())
        },
        giApiAll(callback: () => void) {
            // qmTests.currentTask = this.currentTask.name;
            giTests.tests.executeTestSuite(giTests.getSuiteId("api"), callback, giTests.tests.getStartUrl(), "all-gi-api-tests")
        },
        executeTests(tests: any[], callback: () => void, startUrl: string, context: string) {
            const GhostInspector = getGhostInspector()
            const options = giTests.tests.getOptions(startUrl)
            const test = tests.pop()
            const testUrl = `https://app.ghostinspector.com/tests/` + test._id
            qmGit.setGithubStatus("pending", context, options.apiUrl, testUrl)
            logTestParameters(options.apiUrl, options.startUrl, testUrl)
            GhostInspector.executeTest(test._id, options, function(err: string, testResults: any, passing: any) {
                console.info(`RESULTS:`)
                if (err) {
                    throw new Error(test.name + ` Error: ` + err)
                }
                if (!passing) {
                    giTests.outputErrorsForTest(testResults)
                    process.exit(1)
                }
                console.log(test.name + " passed! :D")
                if (tests && tests.length) {
                    giTests.tests.executeTests(tests, callback, startUrl, context)
                } else if (callback) {
                    callback()
                }
            })
        },
        getSuiteTestsAndExecute(suiteId: string, failedOnly: boolean, callback: () => void, startUrl: string) {
            const GhostInspector = getGhostInspector()
            const failedAll = (failedOnly) ? "failed" : "all"
            if (failedOnly) {
                console.info(`\n=== Failed ${giTests.suiteType.toUpperCase()} GI Tests ===\n`)
            } else {
                console.info(`\n=== All ${giTests.suiteType.toUpperCase()} GI Tests ===\n`)
            }
            GhostInspector.getSuiteTests(suiteId, function(err: string, tests: any[]) {
                if (err) {
                    return console.error("Error: " + err)
                }
                if (failedOnly) {
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
                }
                let testResult
                for (testResult of tests) {
                    const passFail = (testResult.passing) ? "passed" : "failed"
                    console.info(testResult.name + ` recently ` + passFail)
                }
                giTests.tests.executeTests(tests, callback, startUrl, giTests.suiteType+ " "+failedAll+" GI ")
            })
        },
        executeTestSuite(suiteId: string, callback: () => void, startUrl: any, context: string) {
            console.info(`\n=== All ${giTests.suiteType.toUpperCase()} GI Tests ===\n`)
            const GhostInspector = getGhostInspector()
            const options = giTests.tests.getOptions(startUrl)
            const testSuiteUrl = `https://app.ghostinspector.com/suites/` + suiteId
            logTestParameters(options.apiUrl, startUrl, testSuiteUrl)
            qmGit.setGithubStatus("pending", context, options.apiUrl, testSuiteUrl)
            GhostInspector.executeSuite(suiteId, options, function(err: string, suiteResults: string |
                any[],                                             passing: boolean) {
                console.info(`RESULTS:`)
                if (err) {
                    throw new Error(testSuiteUrl + ` Error: ` + err)
                }
                console.log(passing ? "Passed" : "Failed")
                if (!passing) {
                    let testResults
                    for (testResults of suiteResults) {
                        if (!testResults.passing) {
                            giTests.outputErrorsForTest(testResults)
                        }
                    }
                }
                console.log(testSuiteUrl + " " + " passed! :D")
                callback()
            })
        },
        getOptions(startUrl: any) {
            return {
                apiUrl: giTests.getApiUrl(),
                sha: giTests.getSha(),
                startUrl: startUrl || giTests.getStartUrl(),
            }
        },
    },
}
function getGhostInspector() {
    if (!process.env.GI_API_KEY) {
        throw new Error(`Please set GI_API_KEY env from https://app.ghostinspector.com/account`)
    }
    // console.debug(`Using GI_API_KEY starting with ` + process.env.GI_API_KEY.substr(0, 4) + "...")
    return require("ghost-inspector")(process.env.GI_API_KEY)
}
