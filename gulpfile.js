const qmLog = require('./src/helpers/qmLog.js'),
    gulp = require('gulp'),
    https = require('https'),
    expect = require('expect.js'),
    qmFileSystem = require('./src/helpers/qm.file-system.js');
gulp.task('uploadToS3', function(cb){
    qmFileSystem.uploadToS3('ionIcons.js', 'tests', function(uploadResponse){
        const url = require('url');
        const myURL =
            url.parse(uploadResponse.Location);
        const options = {
            hostname: myURL.hostname,
            port: 443,
            path: myURL.path,
            method: 'GET'
        };
        const req = https.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`);
            expect(res.statusCode).to.equal(200);
            res.on('data', d => {
                expect(d).to.contain("iosArrowUp")
            })
        });
        req.on('error', error => {
            console.error(error)
        });
        req.end()
    })
});