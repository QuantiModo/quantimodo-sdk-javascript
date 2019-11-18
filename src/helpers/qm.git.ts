import * as path from "path";
import * as qmTests from "./qm.tests";
// @ts-ignore
import * as github from 'github';
const Octokit = require("@octokit/rest");

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
    let cwd = process.cwd();
    let configPath = path.resolve(cwd, '.git/config');
    // @ts-ignore
    let gitUrl = origin.sync({path: configPath, cwd: cwd});
    if (!gitUrl) {
        throw new Error('cannot find ".git/config"');
    }
    return gitUrl;
}
export function getRepoParts()
{
    let gitUrl = getRepoUrl();
    gitUrl = gitUrl.replace(
        "https://github.com/",
        ""
    ).replace(".git", "");
    return gitUrl.split("/");
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
export function getBuildUrl() {
    return process.env.CIRCLE_BUILD_URL || process.env.BUILD_URL
}
export function setGithubStatus(state: any, context: any, description: any, url: any, cb: ((arg0: any) => void) | undefined){
    console.log(`${context} - ${description} - ${state}`);
    // @ts-ignore
    // @ts-ignore
    getOctoKit().repos.createStatus(
        {
            owner: getRepoUserName(),
            repo: getRepoName(),
            sha: getCurrentGitCommitSha(),
            state: state,
            target_url: url || getBuildUrl(),
            description: description,
            context: context
        },
        function (err: any, res: any) {
            if (err) {
                throw err
            }
        }
    ).then((data: any) => {
        if (cb) {
            cb(data);
        }
    });

}