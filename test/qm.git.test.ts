import { expect } from 'chai';
import * as https from "https";
import * as qmGit from "../src/helpers/qm.git";
import * as url from "url";
const isWin = process.platform === "win32";
describe("git", () => {
  it("sets commit status", (done) => {
    qmGit.setGithubStatus("pending", "test context", "test description", "https://get-bent.com", function (res) {
      expect(res.status).to.eq(201);
      done();
    })
  });
});
