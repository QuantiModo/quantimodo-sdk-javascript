import { expect } from 'chai';
import * as https from "https";
import * as qmFileSystem from "../src/helpers/qm.file-system";
import * as url from "url";
const isWin = process.platform === "win32";
describe("s3 uploader", () => {
  it("uploads a file", () => {
    qmFileSystem.uploadToS3("ionIcons.js", "tests", function(uploadResponse) {
      const myURL = url.parse(uploadResponse.Location);
      const options = {
        hostname: myURL.hostname,
        port: 443,
        path: myURL.path,
        method: "GET"
      };
      const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`);
        expect(res.statusCode).to.eq(200);
        res.on("data", d => {
          var buffer = Buffer.concat(d);
          d = buffer.toString('base64');
          expect(d).to.contain("iosArrowUp");
        });
      });
      req.on("error", error => {
        console.error(error);
      });
      req.end();
    });
  });
});
