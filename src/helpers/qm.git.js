"use strict"
let __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod
    let result = {}
    if (mod != null) for (let k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k]
    result["default"] = mod
    return result
}
let __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod }
}
Object.defineProperty(exports, "__esModule", { value: true })
let path = __importStar(require("path"))
let qmTests = __importStar(require("./qm.tests"))
let Octokit = require("@octokit/rest")
let appRoot = require("app-root-path")
let _str = require("underscore.string")
let remote_origin_url_1 = __importDefault(require("remote-origin-url"))
function getOctoKit() {
    return new Octokit({ auth: getAccessToken() })
}
exports.getOctoKit = getOctoKit
function getCurrentGitCommitSha() {
    if (process.env.SOURCE_VERSION) {
        return process.env.SOURCE_VERSION
    }
    if (process.env.GIT_COMMIT) {
        return process.env.GIT_COMMIT
    }
    if (process.env.CIRCLE_SHA1) {
        return process.env.CIRCLE_SHA1
    }
    try {
        return require("child_process").execSync("git rev-parse HEAD").toString().trim()
    } catch (error) {
        console.info(error)
    }
}
exports.getCurrentGitCommitSha = getCurrentGitCommitSha
function getAccessToken() {
    if (process.env.GITHUB_ACCESS_TOKEN) {
        return process.env.GITHUB_ACCESS_TOKEN
    }
    throw new Error("Please set GITHUB_ACCESS_TOKEN env")
}
exports.getAccessToken = getAccessToken
function getRepoUrl() {
    if (process.env.GIT_URL) {
        return process.env.GIT_URL
    }
    let appRootString = appRoot.toString()
    let configPath = path.resolve(appRootString, ".git/config")
    // @ts-ignore
    let gitUrl = remote_origin_url_1.default.sync({ path: configPath, cwd: appRoot })
    if (!gitUrl) {
        throw new Error('cannot find ".git/config"')
    }
    return gitUrl
}
exports.getRepoUrl = getRepoUrl
function getRepoParts() {
    let gitUrl = getRepoUrl()
    gitUrl = _str.strRight(gitUrl, "github.com/")
    gitUrl = gitUrl.replace(".git", "")
    let parts = gitUrl.split("/")
    if (!parts || parts.length > 2) {
        throw new Error("Could not parse repo name!")
    }
    return parts
}
exports.getRepoParts = getRepoParts
function getRepoName() {
    if (process.env.CIRCLE_PROJECT_REPONAME) {
        return process.env.CIRCLE_PROJECT_REPONAME
    }
    let arr = getRepoParts()
    if (arr) {
        return arr[1]
    }
    throw new Error("Could not determine repo name!")
}
exports.getRepoName = getRepoName
function getRepoUserName() {
    if (process.env.CIRCLE_PROJECT_USERNAME) {
        return process.env.CIRCLE_PROJECT_USERNAME
    }
    let arr = getRepoParts()
    if (arr) {
        return arr[0]
    }
    try {
        return require("child_process").execSync("git rev-parse HEAD").toString().trim()
    } catch (error) {
        console.info(error)
    }
}
exports.getRepoUserName = getRepoUserName
/**
 * state can be one of `error`, `failure`, `pending`, or `success`.
 */
function setGithubStatus(state, context, description, url, cb) {
    console.log(context + " - " + description + " - " + state)
    description = _str.truncate(description, 135)
    let params = {
        owner: getRepoUserName(),
        repo: getRepoName(),
        sha: getCurrentGitCommitSha(),
        state,
        target_url: url || qmTests.getBuildLink(),
        description,
        context,
    }
    getOctoKit().repos.createStatus(params, function (err, res) {
        if (err) {
            console.error(err)
            process.exit(1)
            throw err
        }
    }).then(function (data) {
        if (cb) {
            cb(data)
        }
    }).catch(function (err) {
        console.error(err)
        process.exit(1)
        throw err
    })
}
exports.setGithubStatus = setGithubStatus
function getBranchName() {
    let name = process.env.CIRCLE_BRANCH || process.env.BUDDYBUILD_BRANCH || process.env.TRAVIS_BRANCH || process.env.GIT_BRANCH
    if (!name) {
        throw new Error("Branch name not set!")
    }
}
exports.getBranchName = getBranchName
//# sourceMappingURL=qm.git.js.map
