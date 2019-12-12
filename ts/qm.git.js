"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var rest_1 = __importDefault(require("@octokit/rest"));
var app_root_path_1 = __importDefault(require("app-root-path"));
var path = __importStar(require("path"));
var remote_origin_url_1 = __importDefault(require("remote-origin-url"));
// @ts-ignore
var git = __importStar(require("simple-git"));
var underscore_string_1 = __importDefault(require("underscore.string"));
var qmLog = __importStar(require("./qm.log"));
var qmShell = __importStar(require("./qm.shell"));
var qmTests = __importStar(require("./qm.tests"));
function getOctoKit() {
    return new rest_1.default({ auth: getAccessToken() });
}
exports.getOctoKit = getOctoKit;
function getCurrentGitCommitSha() {
    if (process.env.GIT_COMMIT_FOR_STATUS) {
        return process.env.GIT_COMMIT_FOR_STATUS;
    }
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
        return require("child_process").execSync("git rev-parse HEAD").toString().trim();
    }
    catch (error) {
        console.info(error);
    }
}
exports.getCurrentGitCommitSha = getCurrentGitCommitSha;
function getAccessToken() {
    if (process.env.GITHUB_ACCESS_TOKEN_FOR_STATUS) {
        return process.env.GITHUB_ACCESS_TOKEN_FOR_STATUS;
    }
    if (process.env.GITHUB_ACCESS_TOKEN) {
        return process.env.GITHUB_ACCESS_TOKEN;
    }
    if (process.env.GH_TOKEN) {
        return process.env.GH_TOKEN;
    }
    throw new Error("Please set GITHUB_ACCESS_TOKEN or GH_TOKEN env");
}
exports.getAccessToken = getAccessToken;
function getRepoUrl() {
    if (process.env.REPOSITORY_URL_FOR_STATUS) {
        return process.env.REPOSITORY_URL_FOR_STATUS;
    }
    if (process.env.GIT_URL) {
        return process.env.GIT_URL;
    }
    var appRootString = app_root_path_1.default.toString();
    var configPath = path.resolve(appRootString, ".git/config");
    // @ts-ignore
    var gitUrl = remote_origin_url_1.default.sync({ path: configPath, cwd: app_root_path_1.default });
    if (!gitUrl) {
        throw new Error('cannot find ".git/config"');
    }
    return gitUrl;
}
exports.getRepoUrl = getRepoUrl;
function getRepoParts() {
    var gitUrl = getRepoUrl();
    gitUrl = underscore_string_1.default.strRight(gitUrl, "github.com/");
    gitUrl = gitUrl.replace(".git", "");
    var parts = gitUrl.split("/");
    if (!parts || parts.length > 2) {
        throw new Error("Could not parse repo name!");
    }
    return parts;
}
exports.getRepoParts = getRepoParts;
function getRepoName() {
    if (process.env.REPO_NAME_FOR_STATUS) {
        return process.env.REPO_NAME_FOR_STATUS;
    }
    if (process.env.CIRCLE_PROJECT_REPONAME) {
        return process.env.CIRCLE_PROJECT_REPONAME;
    }
    var arr = getRepoParts();
    if (arr) {
        return arr[1];
    }
    throw new Error("Could not determine repo name!");
}
exports.getRepoName = getRepoName;
function getRepoUserName() {
    if (process.env.REPO_USERNAME_FOR_STATUS) {
        return process.env.REPO_USERNAME_FOR_STATUS;
    }
    if (process.env.CIRCLE_PROJECT_USERNAME) {
        return process.env.CIRCLE_PROJECT_USERNAME;
    }
    var arr = getRepoParts();
    if (arr) {
        return arr[0];
    }
    try {
        return require("child_process").execSync("git rev-parse HEAD").toString().trim();
    }
    catch (error) {
        // tslint:disable-next-line:no-console
        console.info(error);
    }
}
exports.getRepoUserName = getRepoUserName;
/**
 * state can be one of `error`, `failure`, `pending`, or `success`.
 */
// tslint:disable-next-line:max-line-length
function setGithubStatus(testState, context, description, url, cb) {
    var state = convertTestStateToGithubState(testState);
    console.log(context + " - " + description + " - " + state);
    description = underscore_string_1.default.truncate(description, 135);
    // @ts-ignore
    var params = {
        context: context,
        description: description,
        owner: getRepoUserName(),
        repo: getRepoName(),
        sha: getCurrentGitCommitSha(),
        state: state,
        target_url: url || qmTests.getBuildLink(),
    };
    getOctoKit().repos.createStatus(params).then(function (data) {
        if (cb) {
            cb(data);
        }
    }).catch(function (err) {
        console.error(err);
        process.exit(1);
        throw err;
    });
}
exports.setGithubStatus = setGithubStatus;
function convertTestStateToGithubState(testState) {
    var state = testState;
    if (testState === "passed") {
        state = "success";
    }
    if (testState === "failed") {
        state = "failure";
    }
    if (!state) {
        throw new Error("No state!");
    }
    // @ts-ignore
    return state;
}
function getBranchName() {
    // tslint:disable-next-line:max-line-length
    var name = process.env.CIRCLE_BRANCH || process.env.BUDDYBUILD_BRANCH || process.env.TRAVIS_BRANCH || process.env.GIT_BRANCH;
    if (!name) {
        throw new Error("Branch name not set!");
    }
}
exports.getBranchName = getBranchName;
function deleteLocalFeatureBranches() {
    git.branchLocal(function (branches) {
        branches.forEach(function (branch) {
            if (branch.indexOf("feature/") !== -1) {
                git.deleteLocalBranch(branch);
            }
        });
    });
}
exports.deleteLocalFeatureBranches = deleteLocalFeatureBranches;
function createFeatureBranch(featureName) {
    var branchName = "feature/" + featureName;
    try {
        qmShell.executeSynchronously("git checkout -b " + branchName + " develop", false);
    }
    catch (e) {
        qmLog.error(e);
        return;
    }
}
exports.createFeatureBranch = createFeatureBranch;
//# sourceMappingURL=qm.git.js.map