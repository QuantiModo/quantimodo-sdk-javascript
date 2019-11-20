"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var https = __importStar(require("https"));
var url = __importStar(require("url"));
var fileHelper = __importStar(require("../src/helpers/qm.file-helper"));
describe("s3 uploader", function () {
    it("uploads a file", function (done) {
        fileHelper.uploadToS3("ionIcons.js", "tests", function (uploadResponse) {
            var myURL = url.parse(uploadResponse.Location);
            var options = {
                hostname: myURL.hostname,
                method: "GET",
                path: myURL.path,
                port: 443,
            };
            var req = https.request(options, function (res) {
                console.log("statusCode: " + res.statusCode);
                chai_1.expect(res.statusCode).to.eq(200);
                var str = "";
                res.on("data", function (chunk) {
                    str += chunk;
                });
                res.on("end", function () {
                    console.log(str);
                    chai_1.expect(str).to.contain("iosArrowUp");
                    done();
                });
            });
            req.on("error", function (error) {
                console.error(error);
            });
            req.end();
        });
    });
});
//# sourceMappingURL=qm.file-system.test.js.map