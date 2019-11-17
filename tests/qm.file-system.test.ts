// tslint:disable-next-line: no-reference
import * as https from "https";
import * as qmFileSystem from "../src/helpers/qm.file-system";
const isWin = process.platform === "win32";
jest.setTimeout(10000);
describe("s3 uploader", () => {
  test("uploads a file", () => {
    qmFileSystem.uploadToS3("ionIcons.js", "tests", function(uploadResponse) {
      const url = require("url");
      const myURL = url.parse(uploadResponse.Location);
      const options = {
        hostname: myURL.hostname,
        port: 443,
        path: myURL.path,
        method: "GET"
      };
      const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`);
        expect(res.statusCode).toEqual(200);
        res.on("data", d => {
          expect(d).toContain("iosArrowUp");
        });
      });
      req.on("error", error => {
        console.error(error);
      });
      req.end();
    });
  });
});
