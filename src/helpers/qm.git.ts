import * as path from "path";
import * as qmTests from "./qm.tests";
const Octokit = require("@octokit/rest");
const appRoot = require('app-root-path');
const _str = require("underscore.string");
import origin from "remote-origin-url";
export function getOctoKit(){
    return new Octokit({auth: getAccessToken()});
}
export function getCurrentGitCommitSha() {
    if (process.env.SOURCE_VERSION) {
        return process.env.SOURCE_VERSION;
    }
    if (process.env.GIT_COMMIT) {
        return process.env.GIT_COMMIT;
    }
    if (process.env.CIRCLE_SHA1) {
        return process.env.CIRCLE_SHA1;
    }
    try {
        return require('child_process').execSync('git rev-parse HEAD').toString().trim();
    } catch (error) {
        console.info(error);
    }
}
export function getAccessToken() {
    if (process.env.GITHUB_ACCESS_TOKEN) {
        return process.env.GITHUB_ACCESS_TOKEN;
    }
    throw "Please set GITHUB_ACCESS_TOKEN env"
}
export function getRepoUrl() {
    if (process.env.GIT_URL) {
        return process.env.GIT_URL;
    }
    let appRootString = appRoot.toString();
    let configPath = path.resolve(appRootString, '.git/config');
    // @ts-ignore
    let gitUrl = origin.sync({path: configPath, cwd: appRoot});
    if (!gitUrl) {
        throw new Error('cannot find ".git/config"');
    }
    return gitUrl;
}
export function getRepoParts() {
    let gitUrl = getRepoUrl();
    gitUrl = _str.strRight(gitUrl, "github.com/");
    gitUrl = gitUrl.replace(".git", "");
    let parts = gitUrl.split("/");
    if(!parts || parts.length > 2){
        throw "Could not parse repo name!"
    }
    return parts;
}
export function getRepoName() {
    if (process.env.CIRCLE_PROJECT_REPONAME) {
        return process.env.CIRCLE_PROJECT_REPONAME;
    }
    const arr = getRepoParts();
    if (arr) {
        return arr[1];
    }
    throw "Could not determine repo name!"
}
export function getRepoUserName() {
    if (process.env.CIRCLE_PROJECT_USERNAME) {
        return process.env.CIRCLE_PROJECT_USERNAME;
    }
    const arr = getRepoParts();
    if (arr) {
        return arr[0];
    }
    try {
        return require('child_process').execSync('git rev-parse HEAD').toString().trim();
    } catch (error) {
        console.info(error);
    }
}
/**
 * state can be one of `error`, `failure`, `pending`, or `success`.
 */
export function setGithubStatus(state: any, context: any, description: any, url?: any, cb?: ((arg0: any) => void) | undefined){
    console.log(`${context} - ${description} - ${state}`);
    const params = {
        owner: getRepoUserName(),
        repo: getRepoName(),
        sha: getCurrentGitCommitSha(),
        state: state,
        target_url: url || qmTests.getBuildLink(),
        description: description,
        context: context
    };
    getOctoKit().repos.createStatus(params, function (err: any, res: any) {
            if (err) {
                throw err
            }
        }
    ).then((data: any) => {
        if (cb) {
            cb(data);
        }
    }).catch((err: any) => {
        throw err
    })
}
export function getBranchName () {
    let name = process.env.CIRCLE_BRANCH || process.env.BUDDYBUILD_BRANCH || process.env.TRAVIS_BRANCH || process.env.GIT_BRANCH;
    if(!name){
        throw 'Branch name not set!';
    }
}
