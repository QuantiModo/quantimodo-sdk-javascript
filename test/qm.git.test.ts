import { expect } from "chai";
import * as qmGit from "../ts/qm.git";
describe("git", () => {
  it.skip("sets commit status", (done) => { // skipping because it pollutes the status checks
    qmGit.setGithubStatus("pending", "test context", "test description", "https://get-bent.com", function(res) {
      expect(res.status).to.eq(201);
      done();
    });
  });
});
