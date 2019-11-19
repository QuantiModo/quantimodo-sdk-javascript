"use strict"
let __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod
    let result = {}
    if (mod != null) for (let k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k]
    result["default"] = mod
    return result
}
Object.defineProperty(exports, "__esModule", { value: true })
// noinspection JSUnusedGlobalSymbols,JSUnusedGlobalSymbols
let fs = __importStar(require("fs"))
let path = __importStar(require("path"))
let appRoot = require("app-root-path")
function getS3Client() {
    let AWS_ACCESS_KEY_ID = process.env.QM_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID // Netlify has their own
    let AWS_SECRET_ACCESS_KEY = process.env.QM_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY // Netlify has their own
    let s3Options = {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    }
    let AWS = require("aws-sdk")
    return new AWS.S3(s3Options)
}
exports.getS3Client = getS3Client
function uploadToS3(filePath, s3BasePath, cb, s3Bucket, ACL) {
    if (s3Bucket === void 0) { s3Bucket = "quantimodo" }
    if (ACL === void 0) { ACL = "public-read" }
    let s3 = getS3Client()
    let fileContent = fs.readFileSync(filePath)
    let fileName = path.basename(filePath)
    let s3Key = s3BasePath + "/" + fileName
    let params = {
        ACL,
        Bucket: s3Bucket,
        Key: s3Key,
        Body: fileContent,
    }
    s3.upload(params, function (err, data) {
        if (err) {
            throw err
        }
        console.log("File uploaded successfully. " + data.Location)
        if (cb) {
            cb(data)
        }
    })
}
exports.uploadToS3 = uploadToS3
function writeToFile(filePath, contents, cb) {
    function ensureDirectoryExistence(filePath) {
        let dirname = path.dirname(filePath)
        if (fs.existsSync(dirname)) {
            return true
        }
        ensureDirectoryExistence(dirname)
        fs.mkdirSync(dirname)
    }
    ensureDirectoryExistence(filePath)
    fs.writeFile(filePath, contents, function (err) {
        if (err) {
            throw err
        }
        console.log(filePath + " saved!")
        if (cb) {
            cb()
        }
    })
}
exports.writeToFile = writeToFile
function getAbsolutePath(relativePath) {
    return path.resolve(appRoot.toString(), relativePath)
}
exports.getAbsolutePath = getAbsolutePath
//# sourceMappingURL=qm.file-helper.js.map
