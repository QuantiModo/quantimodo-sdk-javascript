import Octokit from "@octokit/rest"
import appRoot from "app-root-path"
import * as path from "path"
import origin from "remote-origin-url"
// @ts-ignore
import * as git from "simple-git"
import _str from "underscore.string"
import * as qmLog from "./qm.log"
import * as qmShell from "./qm.shell"
import * as qmTests from "./qm.tests"
export function getOctoKit() {
    return new Octokit({auth: getAccessToken()})
}
export function getCurrentGitCommitSha() {
    if (process.env.GIT_COMMIT_FOR_STATUS) {
        return process.env.GIT_COMMIT_FOR_STATUS
    }
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
export function getAccessToken() {
    if (process.env.GITHUB_ACCESS_TOKEN_FOR_STATUS) {
        return process.env.GITHUB_ACCESS_TOKEN_FOR_STATUS
    }
    if (process.env.GITHUB_ACCESS_TOKEN) {
        return process.env.GITHUB_ACCESS_TOKEN
    }
    if (process.env.GH_TOKEN) {
        return process.env.GH_TOKEN
    }
    throw new Error("Please set GITHUB_ACCESS_TOKEN or GH_TOKEN env")
}
export function getRepoUrl() {
    if (process.env.REPOSITORY_URL_FOR_STATUS) {
        return process.env.REPOSITORY_URL_FOR_STATUS
    }
    if (process.env.GIT_URL) {
        return process.env.GIT_URL
    }
    const appRootString = appRoot.toString()
    const configPath = path.resolve(appRootString, ".git/config")
    // @ts-ignore
    const gitUrl = origin.sync({path: configPath, cwd: appRoot})
    if (!gitUrl) {
        throw new Error('cannot find ".git/config"')
    }
    return gitUrl
}
export function getRepoParts() {
    let gitUrl = getRepoUrl()
    gitUrl = _str.strRight(gitUrl, "github.com/")
    gitUrl = gitUrl.replace(".git", "")
    const parts = gitUrl.split("/")
    if (!parts || parts.length > 2) {
        throw new Error("Could not parse repo name!")
    }
    return parts
}
export function getRepoName() {
    if (process.env.REPO_NAME_FOR_STATUS) {
        return process.env.REPO_NAME_FOR_STATUS
    }
    if (process.env.CIRCLE_PROJECT_REPONAME) {
        return process.env.CIRCLE_PROJECT_REPONAME
    }
    const arr = getRepoParts()
    if (arr) {
        return arr[1]
    }
    throw new Error("Could not determine repo name!")
}
export function getRepoUserName() {
    if (process.env.REPO_USERNAME_FOR_STATUS) {
        return process.env.REPO_USERNAME_FOR_STATUS
    }
    if (process.env.CIRCLE_PROJECT_USERNAME) {
        return process.env.CIRCLE_PROJECT_USERNAME
    }
    const arr = getRepoParts()
    if (arr) {
        return arr[0]
    }
    try {
        return require("child_process").execSync("git rev-parse HEAD").toString().trim()
    } catch (error) {
        // tslint:disable-next-line:no-console
        console.info(error)
    }
}
/**
 * state can be one of `error`, `failure`, `pending`, or `success`.
 */
// tslint:disable-next-line:max-line-length
export function setGithubStatus(testState: string, context: string, description: string, url?: string | null, cb?: ((arg0: any) => void) | undefined) {
    const state = convertTestStateToGithubState(testState)
    console.log(`${context} - ${description} - ${state}`)
    description = _str.truncate(description, 135)
    // @ts-ignore
    const params: Octokit.ReposCreateStatusParams = {
        context,
        description,
        owner: getRepoUserName(),
        repo: getRepoName(),
        sha: getCurrentGitCommitSha(),
        state,
        target_url: url || qmTests.getBuildLink(),
    }
    getOctoKit().repos.createStatus(params).then((data: any) => {
        if (cb) {
            cb(data)
        }
    }).catch((err: any) => {
        console.error(err)
        process.exit(1)
        throw err
    })
}
function convertTestStateToGithubState(testState: string): "error" | "failure" | "pending" | "success" {
    let state = testState
    if (testState === "passed") {state = "success" }
    if (testState === "failed") {state = "failure" }
    if (!state) {
        throw new Error("No state!")
    }
    // @ts-ignore
    return state
}
export function getBranchName() {
    // tslint:disable-next-line:max-line-length
    const name = process.env.CIRCLE_BRANCH || process.env.BUDDYBUILD_BRANCH || process.env.TRAVIS_BRANCH || process.env.GIT_BRANCH
    if (!name) {
        throw new Error("Branch name not set!")
    }
}
export function deleteLocalFeatureBranches() {
    git.branchLocal(function(branches: []) {
        branches.forEach(function(branch: string) {
            if(branch.indexOf("feature/") !== -1) {
                git.deleteLocalBranch(branch)
            }
        })
    })
}
export function createFeatureBranch(featureName: string) {
    const branchName = "feature/" + featureName
    try {
        qmShell.executeSynchronously(`git checkout -b ${branchName} develop`, false)
    } catch (e) {
        qmLog.error(e)
        return
    }
}
