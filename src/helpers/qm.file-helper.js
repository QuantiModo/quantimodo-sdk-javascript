"use strict";
// noinspection JSUnusedGlobalSymbols,JSUnusedGlobalSymbols
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
function getS3Client() {
    var AWS_ACCESS_KEY_ID = process.env.QM_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID; // Netlify has their own
    var AWS_SECRET_ACCESS_KEY = process.env.QM_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY; // Netlify has their own
    var s3Options = {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    };
    var AWS = require("aws-sdk");
    return new AWS.S3(s3Options);
}
exports.getS3Client = getS3Client;
function uploadToS3(filePath, s3BasePath, cb, s3Bucket, ACL) {
    if (s3Bucket === void 0) { s3Bucket = "quantimodo"; }
    if (ACL === void 0) { ACL = "public-read"; }
    var s3 = getS3Client();
    var fs = require("fs");
    var fileContent = fs.readFileSync(filePath);
    var fileName = path.basename(filePath);
    var s3Key = s3BasePath + "/" + fileName;
    var params = {
        ACL: ACL,
        Bucket: s3Bucket,
        Key: s3Key,
        Body: fileContent
    };
    s3.upload(params, function (err, data) {
        if (err) {
            throw err;
        }
        console.log("File uploaded successfully. " + data.Location);
        if (cb) {
            cb(data);
        }
    });
}
exports.uploadToS3 = uploadToS3;
function writeToFile(filePath, contents, cb) {
    function ensureDirectoryExistence(filePath) {
        var dirname = path.dirname(filePath);
        if (fs.existsSync(dirname)) {
            return true;
        }
        ensureDirectoryExistence(dirname);
        fs.mkdirSync(dirname);
    }
    ensureDirectoryExistence(filePath);
    fs.writeFile(filePath, contents, function (err) {
        if (err)
            throw err;
        console.log(filePath + ' saved!');
        if (cb) {
            cb();
        }
    });
}
exports.writeToFile = writeToFile;
//# sourceMappingURL=qm.file-helper.js.map