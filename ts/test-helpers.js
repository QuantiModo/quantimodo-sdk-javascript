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
var dotenv_1 = __importDefault(require("dotenv"));
var fs = __importStar(require("fs"));
var rimraf_1 = __importDefault(require("rimraf"));
var fileHelper = __importStar(require("./qm.file-helper"));
var qmGit = __importStar(require("./qm.git"));
var qmLog = __importStar(require("./qm.log"));
dotenv_1.default.config(); // https://github.com/motdotla/dotenv#what-happens-to-environment-variables-that-were-already-set
function getBuildLink() {
    if (process.env.BUILD_URL_FOR_STATUS) {
        return process.env.BUILD_URL_FOR_STATUS + "/console";
    }
    if (process.env.BUILD_URL) {
        return process.env.BUILD_URL + "/console";
    }
    if (process.env.BUDDYBUILD_APP_ID) {
        return "https://dashboard.buddybuild.com/apps/" + process.env.BUDDYBUILD_APP_ID + "/build/" +
            process.env.BUDDYBUILD_APP_ID;
    }
    if (process.env.CIRCLE_BUILD_NUM) {
        return "https://circleci.com/gh/QuantiModo/quantimodo-android-chrome-ios-web-app/" +
            process.env.CIRCLE_BUILD_NUM;
    }
    if (process.env.TRAVIS_BUILD_ID) {
        return "https://travis-ci.org/" + process.env.TRAVIS_REPO_SLUG + "/builds/" + process.env.TRAVIS_BUILD_ID;
    }
}
exports.getBuildLink = getBuildLink;
var successFilename = "success-file";
function createSuccessFile() {
    fileHelper.writeToFile("lastCommitBuilt", qmGit.getCurrentGitCommitSha());
    return fs.writeFileSync(successFilename, qmGit.getCurrentGitCommitSha());
}
exports.createSuccessFile = createSuccessFile;
function deleteSuccessFile() {
    qmLog.info("Deleting success file so we know if build completed...");
    rimraf_1.default(successFilename, function () {
        qmLog.info("Deleted success file!");
    });
}
exports.deleteSuccessFile = deleteSuccessFile;
function deleteEnvFile() {
    rimraf_1.default(".env", function () {
        qmLog.info("Deleted env file!");
    });
}
exports.deleteEnvFile = deleteEnvFile;
function getCiProvider() {
    if (process.env.CIRCLE_BRANCH) {
        return "circleci";
    }
    if (process.env.BUDDYBUILD_BRANCH) {
        return "buddybuild";
    }
    if (process.env.JENKINS_URL) {
        return "jenkins";
    }
    // @ts-ignore
    return process.env.HOSTNAME;
}
exports.getCiProvider = getCiProvider;
//# sourceMappingURL=test-helpers.js.map