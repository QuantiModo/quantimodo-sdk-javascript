import * as path from "path";
import * as qmTests from "./qm.tests";
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
    const origin = require('remote-origin-url');
    let cwd = process.cwd();
    let configPath = path.resolve(cwd, '.git/config');
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
export function setGithubStatus(state: any, context: any, description: any, url: any){
    console.log(`${context} - ${description} - ${state}`);
    const github = require('gulp-github');
    let result = {
        "state": state, // Commit state. Possible values are pending, success, error or failure
        "context": context, // Status label. Could be the name of a CI environment (e.g. my-ci)
        "description": description, // Short high level summary of the status
        "url": url || qmTests.getBuildUrl(), // 	URL of the page representing the status
    };
    // noinspection JSUnusedGlobalSymbols,JSUnusedGlobalSymbols,JSUnusedLocalSymbols,JSUnusedLocalSymbols
    let opt = {
        git_token: getAccessToken(),
        git_repo: getRepoUserName() + '/' + getRepoName(),
        //git_prid: '1',
        git_sha: getCurrentGitCommitSha(),      // create status to this commit, optional
    };
    github.createStatusToCommit(result, opt, function(res: any){
        console.debug("done!")
    });
}