import sdkRepo from "app-root-path"
import * as cypress from "cypress"
import {slackRunner} from "cypress-slack-reporter/bin/slack/slack-alert.js"
import dotenv from "dotenv"
import * as fs from "fs"
import rimraf from "rimraf"
import * as fileHelper from "./qm.file-helper"
import * as qmGit from "./qm.git"
import * as qmLog from "./qm.log"
dotenv.config() // https://github.com/motdotla/dotenv#what-happens-to-environment-variables-that-were-already-set
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
