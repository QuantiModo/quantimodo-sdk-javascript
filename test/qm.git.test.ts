import { expect } from "chai";
import * as qmGit from "../ts/qm.git";
describe("git", () => {
  it("sets commit status", (done) => {
    qmGit.setGithubStatus("pending", "test context", "test description", "https://get-bent.com", function(res) {
      expect(res.status).to.eq(201);
      done();
    });
  });
});
