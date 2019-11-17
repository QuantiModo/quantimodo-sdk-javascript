// noinspection JSUnusedGlobalSymbols,JSUnusedGlobalSymbols
const qmFileSystem = {
    uploadToDigitalOcean: function(filePath, cb) {
        const fs = require('fs');
        const AWS = require('aws-sdk');
        let bucketName = 'qm-public';
        const endpoint = 'nyc3.digitaloceanspaces.com';
        const keyName = 'cypress.html';
        bucketName += '.'+endpoint;
        const spacesEndpoint = new AWS.Endpoint(endpoint);
        const s3 = new AWS.S3({
            endpoint: spacesEndpoint,
            accessKeyId: process.env.DO_SPACES_KEY,
            secretAccessKey: process.env.DO_SPACES_SECRET
        });
        //let params = {Bucket: bucketName, Key: keyName, Body: fs.readFileSync(filePath)};
        let params = {Bucket: bucketName, Key: keyName, Body: fs.readFileSync(filePath)};
        // noinspection JSUnusedLocalSymbols
        s3.putObject(params, function(err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
            }
            if(cb){cb();}
        });
    },
    uploadToS3: function(filePath) {
        function checkAwsEnvs() {
            if(!AWS_ACCESS_KEY_ID){
                qmLog.info("Please set environmental variable QM_AWS_ACCESS_KEY_ID");
                return false;
            }
            if(!AWS_SECRET_ACCESS_KEY){
                qmLog.info("Please set environmental variable QM_AWS_SECRET_ACCESS_KEY");
                return false;
            }
            return true;
        }
        let AWS_ACCESS_KEY_ID = process.env.QM_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID; // Netlify has their own
        let AWS_SECRET_ACCESS_KEY = process.env.QM_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY; // Netlify has their own
        const s3Options = {accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY};
        const s3 = require('gulp-s3-upload')(s3Options);
        if(!checkAwsEnvs()){
            qmLog.info("No S3 credentials to upload " + filePath);
            return;
        }
        const fs = require('fs');
        const gulp = require('gulp');
        // noinspection JSUnusedLocalSymbols
        fs.stat(filePath, function (err, stat) {
            if (!err) {
                qmLog.info("Uploading " + filePath + " to S3...");
                // noinspection JSUnusedGlobalSymbols
                return gulp.src([filePath]).pipe(s3({
                    Bucket: 'quantimodo',
                    ACL: 'public-read',
                    keyTransform: function(relative_filename) {
                        qmLog.info("S3 path: " + relative_filename);
                        return relative_filename;
                    }
                }, {
                    maxRetries: 5,
                    logger: console
                }));
            } else {
                qmLog.error('Could not find ' + filePath);
                qmLog.error(err);
            }
        });
    }
};
if(typeof window !== "undefined"){
    if(typeof bugsnag !== "undefined"){// noinspection JSUnresolvedFunction
        window.bugsnagClient = bugsnag("ae7bc49d1285848342342bb5c321a2cf");}
    window.qmFileSystem = qmFileSystem;
}else{
    module.exports = qmFileSystem;
}