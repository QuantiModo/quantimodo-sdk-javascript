import sdkRepo from "app-root-path"
import * as cypress from "cypress"
import {slackRunner} from "cypress-slack-reporter/bin/slack/slack-alert.js"
import dotenv from "dotenv"
import * as fs from "fs"
// @ts-ignore
import {merge} from "mochawesome-merge"
// @ts-ignore
import marge from "mochawesome-report-generator"
import rimraf from "rimraf"
import * as fileHelper from "./qm.file-helper"
import * as qmGit from "./qm.git"
import * as qmLog from "./qm.log"

dotenv.config() // https://github.com/motdotla/dotenv#what-happens-to-environment-variables-that-were-already-set
const ciProvider = getCiProvider()
const isWin = process.platform === "win32"
const outputReportDir = sdkRepo + "/mochawesome-report"
const screenshotDirectory = `${sdkRepo}/mochawesome-report/assets`
const unmerged = sdkRepo + "/cypress/reports/mocha"
const vcsProvider = "github"
const verbose = true
const videoDirectory = `${sdkRepo}/cypress/videos`
const mergedJsonPath = outputReportDir + "/mochawesome.json"
const lastFailedCypressTestPath = "last-failed-cypress-test"
const cypressJson = fileHelper.getAbsolutePath("cypress.json")
const releaseStage = process.env.RELEASE_STAGE || "production"
const envPath = fileHelper.getAbsolutePath(`cypress/config/cypress.${releaseStage}.json`)
const paths = {
    reports: {
        junit: "./cypress/reports/junit",
        mocha: "./cypress/reports/mocha",
    },
}

function getReportUrl() {
    if (process.env.JOB_URL && process.env.JOB_URL.indexOf("DEPLOY-") === 0) {
        return process.env.JOB_URL + "ws/tmp/quantimodo-sdk-javascript/mochawesome-report/mochawesome.html"
    }
    return getBuildLink()
}

export function mochawesome(failedTests: any[], cb: (err: any) => void) {
    console.log("Merging reports...")
    merge({
        inline: true,
        reportDir: unmerged,
        saveJson: true,
    }).then((mergedJson: any) => {
        fs.writeFileSync(mergedJsonPath, JSON.stringify(mergedJson, null, 2))
        console.log("Generating report from " + unmerged + " and outputting at " + outputReportDir)
        return marge.create(mergedJson, {
            // cdn: true,
            autoOpen: isWin,
            charts: true,
            inline: true,
            overwrite: true,
            reportDir: outputReportDir,
            saveJson: true,
            showPassed: true,
        })
    }).then((generatedReport: any[]) => {
        console.log("Merged report available here:-", generatedReport[0])
        // tslint:disable-next-line: no-console
        console.log("Constructing Slack message with the following options", {
            ciProvider,
            outputReportDir,
            screenshotDirectory,
            vcsProvider,
            verbose,
            videoDirectory,
        })
        try {
            // @ts-ignore
            // noinspection JSUnusedLocalSymbols
            if (!process.env.SLACK_WEBHOOK_URL) {
                console.error("env SLACK_WEBHOOK_URL not set!")
            } else {
                // @ts-ignore
                slackRunner(
                    ciProvider,
                    vcsProvider,
                    outputReportDir,
                    videoDirectory,
                    screenshotDirectory,
                    verbose,
                )
                // tslint:disable-next-line: no-console
                console.log("Finished slack upload")
            }
        } catch (error) {
            console.error(error)
        }
        cb(generatedReport[0])
    })
}

function copyCypressEnvConfigIfNecessary() {
    console.info(`Copying ${envPath} to cypress.json`)
    fs.copyFileSync(envPath, cypressJson)
    console.info("Cypress Configuration: " + fs.readFileSync(cypressJson))
}

function setGithubStatusAndUploadTestResults(failedTests: any[] | null, context: string) {
    // @ts-ignore
    const failedTestTitle = failedTests[0].title[1]
    // @ts-ignore
    const errorMessage = failedTests[0].error
    qmGit.setGithubStatus("failure", context, failedTestTitle + ": " +
        errorMessage, getReportUrl(), function() {
        uploadTestResults(function() {
            console.error(errorMessage)
            // cb(errorMessage);
            process.exit(1)
            // resolve();
        })
    })
}

function deleteJUnitTestResults() {
    const jUnitFiles = paths.reports.junit + "/*.xml"
    rimraf(jUnitFiles, function() {
        console.debug(`Deleted ${jUnitFiles}`)
    })
}

export function runCypressTests(cb?: (err: any) => void, specificSpec?: string) {
    deleteSuccessFile()
    copyCypressEnvConfigIfNecessary()
    deleteJUnitTestResults()
    rimraf(paths.reports.mocha + "/*.json", function() {
        const specsPath = sdkRepo + "/cypress/integration"
        const browser = process.env.CYPRESS_BROWSER || "electron"
        fs.readdir(specsPath, function(err: any, specFileNames: string[]) {
            if (!specFileNames) {
                throw new Error("No specFileNames in " + specsPath)
            }
            for (let i = 0, p = Promise.resolve(); i < specFileNames.length; i++) {
                const specName = specFileNames[i]
                if (specificSpec && specName.indexOf(specificSpec) === -1) {
                    console.debug("skipping " + specName)
                    continue
                }
                p = p.then((_) => new Promise((resolve) => {
                    const specPath = specsPath + "/" + specName
                    const context = specName.replace("_spec.js", "") + "-" + releaseStage
                    qmGit.setGithubStatus("pending", context, `Running ${context} Cypress tests...`)
                    // noinspection JSUnresolvedFunction
                    cypress.run({
                        browser,
                        spec: specPath,
                    }).then((results) => {
                        if (!results.runs || !results.runs[0]) {
                            console.log("No runs property on " + JSON.stringify(results, null, 2))
                        } else {
                            const tests = results.runs[0].tests
                            let failedTests: any[] | null = null
                            if (tests) {
                                failedTests = tests.filter(function(test: { state: string; }) {
                                    return test.state === "failed"
                                })
                            } else {
                                console.error("No tests on ", results.runs[0])
                            }
                            if (failedTests && failedTests.length) {
                                fs.writeFileSync(lastFailedCypressTestPath, specName)
                                // tslint:disable-next-line:prefer-for-of
                                for (let j = 0; j < failedTests.length; j++) {
                                    const test = failedTests[j]
                                    const testName = test.title[1]
                                    const errorMessage = test.error
                                    console.error(testName + " FAILED because " + errorMessage)
                                }
                                mochawesome(failedTests, function() {
                                    setGithubStatusAndUploadTestResults(failedTests, context)
                                })
                            } else {
                                deleteLastFailedCypressTest()
                                console.info(results.totalPassed + " tests PASSED!")
                                qmGit.setGithubStatus("success", context, results.totalPassed +
                                    " tests passed")
                            }
                        }
                        if (specificSpec || i === specFileNames.length - 1) {
                            createSuccessFile()
                            deleteEnvFile()
                            if (cb) {
                                cb(false)
                            }
                        }
                        resolve()
                    }).catch((runtimeError: any) => {
                        qmGit.setGithubStatus("error", context, runtimeError, getReportUrl(), function() {
                            console.error(runtimeError)
                            process.exit(1)
                        })
                    })
                }))
            }
        })
    })
}

export function getBuildLink() {
    if (process.env.BUILD_URL_FOR_STATUS) {
        return process.env.BUILD_URL_FOR_STATUS + "/console"
    }
    if (process.env.BUILD_URL) {
        return process.env.BUILD_URL + "/console"
    }
    if (process.env.BUDDYBUILD_APP_ID) {
        return "https://dashboard.buddybuild.com/apps/" + process.env.BUDDYBUILD_APP_ID + "/build/" +
            process.env.BUDDYBUILD_APP_ID
    }
    if (process.env.CIRCLE_BUILD_NUM) {
        return "https://circleci.com/gh/QuantiModo/quantimodo-android-chrome-ios-web-app/" +
            process.env.CIRCLE_BUILD_NUM
    }
    if (process.env.TRAVIS_BUILD_ID) {
        return "https://travis-ci.org/" + process.env.TRAVIS_REPO_SLUG + "/builds/" + process.env.TRAVIS_BUILD_ID
    }
}

const successFilename = "success-file"

export function createSuccessFile() {
    fileHelper.writeToFile("lastCommitBuilt", qmGit.getCurrentGitCommitSha())
    return fs.writeFileSync(successFilename, qmGit.getCurrentGitCommitSha())
}

export function deleteSuccessFile() {
    qmLog.info("Deleting success file so we know if build completed...")
    rimraf(successFilename, function() {
        qmLog.info("Deleted success file!")
    })
}

export function deleteEnvFile() {
    rimraf(".env", function() {
        qmLog.info("Deleted env file!")
    })
}

export function getCiProvider(): string {
    if (process.env.CIRCLE_BRANCH) {
        return "circleci"
    }
    if (process.env.BUDDYBUILD_BRANCH) {
        return "buddybuild"
    }
    if (process.env.JENKINS_URL) {
        return "jenkins"
    }
    // @ts-ignore
    return process.env.HOSTNAME
}

function getLastFailedCypressTest() {
    try {
        return fs.readFileSync(lastFailedCypressTestPath, "utf8")
    } catch (error) {
        return null
    }
}

function deleteLastFailedCypressTest() {
    // tslint:disable-next-line:no-empty
    try {
        fs.unlinkSync(lastFailedCypressTestPath)
    } catch (err) {
        console.log(err)
    }
}

// tslint:disable-next-line:unified-signatures
export function runLastFailedCypressTest(cb: (err: any) => void) {
    const name = getLastFailedCypressTest()
    if (!name) {
        console.info("No previously failed test!")
        cb(false)
        return
    }
    runCypressTests(cb, name)
}

export function uploadTestResults(cb: (arg0: any) => void) {
    const path = "mochawesome/" + qmGit.getCurrentGitCommitSha()
    fileHelper.uploadToS3("./mochawesome-report/mochawesome.html", path, cb, "quantimodo",
        "public-read", "text/html")
}

const timeHelper = {
    getUnixTimestampInMilliseconds(dateTimeString: string | number | Date) {
        if (!dateTimeString) {
            return new Date().getTime()
        }
        return new Date(dateTimeString).getTime()
    },
    getTimeSinceString(unixTimestamp: any) {
        if (!unixTimestamp) {
            return "never"
        }
        const secondsAgo = timeHelper.secondsAgo(unixTimestamp)
        if (secondsAgo > 2 * 24 * 60 * 60) {
            return Math.round(secondsAgo / (24 * 60 * 60)) + " days ago"
        }
        if (secondsAgo > 2 * 60 * 60) {
            return Math.round(secondsAgo / (60 * 60)) + " hours ago"
        }
        if (secondsAgo > 2 * 60) {
            return Math.round(secondsAgo / (60)) + " minutes ago"
        }
        return secondsAgo + " seconds ago"
    },
    secondsAgo(unixTimestamp: number) {
        return Math.round((new Date().getTime() - unixTimestamp))
    },
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
            const time = new Date(Date.now()).toLocaleString()
            console.info(time + `: Testing ` + test.name + ` from ` + test.suite.name + " on startUrl " +
                options.startUrl.replace("https://", "") +
                "with api url " + options.apiUrl + "...")
            const testUrl = `https://app.ghostinspector.com/tests/` + test._id
            qmGit.setGithubStatus("pending", context, options.apiUrl, testUrl)
            console.info(`Check ${test.suite.name} test ${test._id} progress at ` + testUrl)
            GhostInspector.executeTest(test._id, options, function(err: string, testResults: any, passing: any) {
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
                console.info(`\n=== FAILED ${giTests.suiteType} GI TESTS ===\n`)
            } else {
                console.info(`\n===  ${giTests.suiteType} GI TESTS ===\n`)
            }
            console.info(`Running ` + failedAll + ` GI tests on ` + startUrl + ` using API at ` + giTests.getApiUrl())
            GhostInspector.getSuiteTests(suiteId, function(err: string, tests: any[]) {
                if (err) {
                    return console.log("Error: " + err)
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
            const GhostInspector = getGhostInspector()
            const options = giTests.tests.getOptions(startUrl)
            console.info("Testing suite on startUrl " + options.startUrl + "...")
            const suiteUrl = `https://app.ghostinspector.com/suites/` + suiteId
            console.info(`Check ${suiteId} suite progress at ` + suiteUrl)
            qmGit.setGithubStatus("pending", context, options.apiUrl, suiteUrl)
            GhostInspector.executeSuite(suiteId, options, function(err: string, suiteResults: string |
                any[],                                             passing: boolean) {
                if (err) {
                    throw new Error(suiteUrl + ` Error: ` + err)
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
                console.log(suiteUrl + " " + " passed! :D")
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
    console.debug(`Using GI_API_KEY starting with ` + process.env.GI_API_KEY.substr(0, 4) + "...")
    return require("ghost-inspector")(process.env.GI_API_KEY)
}
