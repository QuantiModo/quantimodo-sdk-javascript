import {expect} from "chai";
import * as qmGit from "../ts/qm.git";
import * as fileHelper from "../ts/qm.file-helper";
import * as url from "url";
import * as https from "https";
import * as _str from "underscore.string";
beforeEach(function(done){
  this.timeout(10000) // Default 2000 is too fast for Github API
  // @ts-ignore
  let test = this.currentTest;
  // @ts-ignore
  qmGit.setGithubStatus("pending", test.title, "Running...", null, function(res){
    //console.debug(res)
    done();
  });
});
afterEach(function(done){
  // @ts-ignore
  let test = this.currentTest;
  // @ts-ignore
  if(!test.state){
    console.debug("No test state in afterEach!")
    done();
    return;
  }
  // @ts-ignore
  qmGit.setGithubStatus(test.state, test.title, test.title, null, function(res){
    //console.debug(res)
    done();
  });
});
describe("git", () => {
  it.skip("sets commit status", function(done) { // skipping because it pollutes the status checks
    qmGit.setGithubStatus("pending", "test context", "test description", "https://get-bent.com", function(res) {
      expect(res.status).to.eq(201);
      done();
    });
  });
});
describe("s3 uploader", function () {
  it("uploads a file", function (done) {
    fileHelper.uploadToS3("ionIcons.js", "tests", function(uploadResponse) {
      const myURL = url.parse(uploadResponse.Location)
      const options = {
        hostname: myURL.hostname,
        method: "GET",
        path: myURL.path,
        port: 443,
      }
      const req = https.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`)
        expect(res.statusCode).to.eq(200)
        let str = ""
        res.on("data", (chunk) => {
          str += chunk
        })
        res.on("end", function() {
          console.log("RESPONSE: "+_str.truncate(str, 30))
          expect(str).to.contain("iosArrowUp")
          done()
        })
      })
      req.on("error", (error) => {
        console.error(error)
      })
      req.end()
    })
  })
})