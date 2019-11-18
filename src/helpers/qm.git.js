"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var Octokit = require("@octokit/rest");
var appRoot = require('app-root-path');
var _str = require("underscore.string");
var remote_origin_url_1 = __importDefault(require("remote-origin-url"));
function getOctoKit() {
    return new Octokit({ auth: getAccessToken() });
}
exports.getOctoKit = getOctoKit;
function getCurrentGitCommitSha() {
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
    }
    catch (error) {
        console.info(error);
    }
}
exports.getCurrentGitCommitSha = getCurrentGitCommitSha;
function getAccessToken() {
    if (process.env.GITHUB_ACCESS_TOKEN) {
        return process.env.GITHUB_ACCESS_TOKEN;
    }
    throw "Please set GITHUB_ACCESS_TOKEN env";
}
exports.getAccessToken = getAccessToken;
function getRepoUrl() {
    if (process.env.GIT_URL) {
        return process.env.GIT_URL;
    }
    var configPath = path.resolve(appRoot, '.git/config');
    // @ts-ignore
    var gitUrl = remote_origin_url_1.default.sync({ path: configPath, cwd: appRoot });
    if (!gitUrl) {
        throw new Error('cannot find ".git/config"');
    }
    return gitUrl;
}
exports.getRepoUrl = getRepoUrl;
function getRepoParts() {
    var gitUrl = getRepoUrl();
    gitUrl = _str.strRight(gitUrl, "github.com/");
    gitUrl = gitUrl.replace(".git", "");
    var parts = gitUrl.split("/");
    if (!parts || parts.length > 2) {
        throw "Could not parse repo name!";
    }
    return parts;
}
exports.getRepoParts = getRepoParts;
function getRepoName() {
    if (process.env.CIRCLE_PROJECT_REPONAME) {
        return process.env.CIRCLE_PROJECT_REPONAME;
    }
    var arr = getRepoParts();
    if (arr) {
        return arr[1];
    }
    throw "Could not determine repo name!";
}
exports.getRepoName = getRepoName;
function getRepoUserName() {
    if (process.env.CIRCLE_PROJECT_USERNAME) {
        return process.env.CIRCLE_PROJECT_USERNAME;
    }
    var arr = getRepoParts();
    if (arr) {
        return arr[0];
    }
    try {
        return require('child_process').execSync('git rev-parse HEAD').toString().trim();
    }
    catch (error) {
        console.info(error);
    }
}
exports.getRepoUserName = getRepoUserName;
function getBuildUrl() {
    return process.env.CIRCLE_BUILD_URL || process.env.BUILD_URL;
}
exports.getBuildUrl = getBuildUrl;
function setGithubStatus(state, context, description, url, cb) {
    console.log(context + " - " + description + " - " + state);
    var params = {
        owner: getRepoUserName(),
        repo: getRepoName(),
        sha: getCurrentGitCommitSha(),
        state: state,
        target_url: url || getBuildUrl(),
        description: description,
        context: context
    };
    getOctoKit().repos.createStatus(params, function (err, res) {
        if (err) {
            throw err;
        }
    }).then(function (data) {
        if (cb) {
            cb(data);
        }
    });
}
exports.setGithubStatus = setGithubStatus;
function getBranchName() {
    var name = process.env.CIRCLE_BRANCH || process.env.BUDDYBUILD_BRANCH || process.env.TRAVIS_BRANCH || process.env.GIT_BRANCH;
    if (!name) {
        throw 'Branch name not set!';
    }
}
exports.getBranchName = getBranchName;
//# sourceMappingURL=qm.git.js.map