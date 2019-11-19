"use strict"
let __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod
    let result = {}
    if (mod != null) for (let k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k]
    result["default"] = mod
    return result
}
Object.defineProperty(exports, "__esModule", { value: true })
let cypress = __importStar(require("cypress"))
let fs = __importStar(require("fs"))
let fileHelper = __importStar(require("./qm.file-helper"))
let qmGit = __importStar(require("./qm.git"))
let qmLog = __importStar(require("./qm.log"))
let sdkRepo = require("app-root-path")
let rimraf = require("rimraf")
let marge = require("mochawesome-report-generator")
let merge = require("mochawesome-merge").merge
let slackRunner = require("cypress-slack-reporter/bin/slack/slack-alert.js").slackRunner
let dotenv = require("dotenv")
dotenv.config() // https://github.com/motdotla/dotenv#what-happens-to-environment-variables-that-were-already-set
let ciProvider = getCiProvider()
let isWin = process.platform === "win32"
let outputReportDir = sdkRepo + "/mochawesome-report"
let screenshotDirectory = sdkRepo + "/mochawesome-report/assets"
let unmerged = sdkRepo + "/cypress/reports/mocha"
let vcsProvider = "github"
let verbose = true
let videoDirectory = sdkRepo + "/cypress/videos"
let mergedJsonPath = outputReportDir + "/mochawesome.json"
let lastFailedCypressTestPath = "last-failed-cypress-test"
let cypressEnvPath = fileHelper.getAbsolutePath("cypress.env.json")
let releaseStage = process.env.RELEASE_STAGE || "development"
let cypressConfigPath = fileHelper.getAbsolutePath("cypress/config/cypress." + releaseStage + ".json")
function getReportUrl() {
    if (process.env.JOB_URL) {
        return process.env.JOB_URL + "ws/tmp/quantimodo-sdk-javascript/mochawesome-report/mochawesome.html"
    }
    return getBuildLink()
}
function mochawesome(failedTests, cb) {
    console.log("Merging reports...")
    merge({
        reportDir: unmerged,
        inline: true,
        saveJson: true,
    }).then(function (mergedJson) {
        fs.writeFileSync(mergedJsonPath, JSON.stringify(mergedJson, null, 2))
        console.log("Generating report from " + unmerged + " and outputting at " + outputReportDir)
        return marge.create(mergedJson, {
            reportDir: outputReportDir,
            inline: true,
            saveJson: true,
            charts: true,
            showPassed: true,
            autoOpen: isWin,
            // cdn: true,
            overwrite: true,
        })
    }).then(function (_generatedReport) {
        console.log("Merged report available here:-", _generatedReport[0])
        // tslint:disable-next-line: no-console
        console.log("Constructing Slack message with the following options", {
            ciProvider,
            vcsProvider,
            outputReportDir,
            videoDirectory,
            screenshotDirectory,
            verbose,
        })
        try {
            // @ts-ignore
            // noinspection JSUnusedLocalSymbols
            if (!process.env.SLACK_WEBHOOK_URL) {
                console.error("env SLACK_WEBHOOK_URL not set!")
            } else {
                slackRunner(ciProvider, vcsProvider, outputReportDir, videoDirectory, screenshotDirectory, verbose).catch(function (err) {
                    throw err
                })
                // tslint:disable-next-line: no-console
                console.log("Finished slack upload")
            }
        } catch (error) {
            console.error(error)
        }
        cb(_generatedReport[0])
    })
}
exports.mochawesome = mochawesome
function runCypressTests(cb, specificSpec) {
    deleteSuccessFile()
    if (!fs.existsSync(cypressEnvPath)) {
        console.info("No cypress.env.json present so copying " + cypressConfigPath)
        fs.copyFileSync(cypressConfigPath, cypressEnvPath)
    }
    rimraf("./cypress/reports/mocha/*.json", function () {
        let path = sdkRepo + "/cypress/integration"
        let browser = process.env.CYPRESS_BROWSER || "electron"
        fs.readdir(path, function (err, specFileNames) {
            if (!specFileNames) {
                throw new Error("No specFileNames in " + path)
            }
            let _loop_1 = function (i, p) {
                let specName = specFileNames[i]
                if (specificSpec && specName.indexOf(specificSpec) === -1) {
                    console.debug("skipping " + specName)
                    return out_p_1 = p, "continue"
                }
                p = p.then(function (_) {
 return new Promise(function (resolve) {
                    let specPath = path + "/" + specName
                    let context = specName.replace("_spec.js", "")
                    qmGit.setGithubStatus("pending", context, "Running " + context + " Cypress tests...")
                    // noinspection JSUnresolvedFunction
                    cypress.run({
                        spec: specPath,
                        browser,
                    }).then(function (results) {
                        if (!results.runs || !results.runs[0]) {
                            console.log("No runs property on " + JSON.stringify(results, null, 2))
                        } else {
                            let tests = results.runs[0].tests
                            let failedTests_1 = tests.filter(function (test) {
                                return test.state === "failed"
                            })
                            if (failedTests_1 && failedTests_1.length) {
                                fs.writeFileSync(lastFailedCypressTestPath, specName)
                                for (let j = 0; j < failedTests_1.length; j++) {
                                    let test_1 = failedTests_1[j]
                                    let testName = test_1.title[1]
                                    let errorMessage = test_1.error
                                    console.error(testName + " FAILED because " + errorMessage)
                                }
                                mochawesome(failedTests_1, function () {
                                    let failedTestTitle = failedTests_1[0].title[1]
                                    let errorMessage = failedTests_1[0].error
                                    qmGit.setGithubStatus("failure", context, failedTestTitle + ": " +
                                        errorMessage, getReportUrl(), function () {
                                        console.error(errorMessage)
                                        //cb(errorMessage);
                                        process.exit(1)
                                        //resolve();
                                    })
                                })
                            } else {
                                deleteLastFailedCypressTest()
                                console.info(results.totalPassed + " tests PASSED!")
                                qmGit.setGithubStatus("success", context, results.totalPassed + " tests passed")
                            }
                        }
                        resolve()
                        if (i === specFileNames.length - 1) {
                            createSuccessFile()
                            deleteEnvFile()
                            cb(false)
                        }
                    }).catch(function (err) {
                        qmGit.setGithubStatus("error", context, err, getReportUrl(), function () {
                            console.error(err)
                            process.exit(1)
                        })
                    })
                })
})
                out_p_1 = p
            }
            let out_p_1
            for (let i = 0, p = Promise.resolve(); i < specFileNames.length; i++) {
                _loop_1(i, p)
                p = out_p_1
            }
        })
    })
}
exports.runCypressTests = runCypressTests
function getBuildLink() {
    if (process.env.BUILD_URL) {
        return process.env.BUILD_URL + "/console"
    }
    if (process.env.BUDDYBUILD_APP_ID) {
        return "https://dashboard.buddybuild.com/apps/" + process.env.BUDDYBUILD_APP_ID + "/build/" + process.env.BUDDYBUILD_APP_ID
    }
    if (process.env.CIRCLE_BUILD_NUM) {
        return "https://circleci.com/gh/QuantiModo/quantimodo-android-chrome-ios-web-app/" + process.env.CIRCLE_BUILD_NUM
    }
    if (process.env.TRAVIS_BUILD_ID) {
        return "https://travis-ci.org/" + process.env.TRAVIS_REPO_SLUG + "/builds/" + process.env.TRAVIS_BUILD_ID
    }
}
exports.getBuildLink = getBuildLink
let successFilename = "success-file"
function createSuccessFile() {
    fileHelper.writeToFile("lastCommitBuilt", qmGit.getCurrentGitCommitSha())
    return fs.writeFileSync(successFilename, qmGit.getCurrentGitCommitSha())
}
exports.createSuccessFile = createSuccessFile
function deleteSuccessFile() {
    qmLog.info("Deleting success file so we know if build completed...")
    rimraf(successFilename, function () {
        qmLog.info("Deleted success file!")
    })
}
exports.deleteSuccessFile = deleteSuccessFile
function deleteEnvFile() {
    rimraf(".env", function () {
        qmLog.info("Deleted env file!")
    })
}
exports.deleteEnvFile = deleteEnvFile
function getCiProvider() {
    if (process.env.CIRCLE_BRANCH) {
        return "circleci"
    }
    if (process.env.BUDDYBUILD_BRANCH) {
        return "buddybuild"
    }
    if (process.env.JENKINS_URL) {
        return "jenkins"
    }
    return process.env.HOSTNAME
}
exports.getCiProvider = getCiProvider
function getLastFailedCypressTest() {
    try {
        return fs.readFileSync(lastFailedCypressTestPath, "utf8")
    } catch (error) {
        return null
    }
}
function deleteLastFailedCypressTest() {
    try {
        fs.unlinkSync(lastFailedCypressTestPath)
    } catch (err) { }
}
function runLastFailedCypressTest(cb) {
    let name = getLastFailedCypressTest()
    if (!name) {
        console.info("No previously failed test!")
        cb(false)
        return
    }
    runCypressTests(cb, name)
}
exports.runLastFailedCypressTest = runLastFailedCypressTest
//# sourceMappingURL=qm.tests.js.map
