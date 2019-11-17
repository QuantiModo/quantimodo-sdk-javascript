const qmLog = require('./qmLog.js');
const qmFileSystem = require('./qmLog.js');
const gulp = require('gulp'),
    beautify = require('js-beautify'),
    fs = require('fs'),
    path = require('path'),
    rimraf = require('rimraf');
gulp.task('uploadToS3', function(cb){
    const qmfs = require('./qmFileSystem.js')
    qmfs.uploadToS3('C:\\Development\\qm-ui-tests\\mochawesome-report\\mochawesome.html', cb)
});