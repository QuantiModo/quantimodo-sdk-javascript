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
import {createSuccessFile, deleteEnvFile, deleteSuccessFile, getBuildLink, getCiProvider} from "./test-helpers"

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
