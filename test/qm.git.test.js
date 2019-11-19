"use strict"
let __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod
    let result = {}
    if (mod != null) for (let k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k]
    result["default"] = mod
    return result
}
Object.defineProperty(exports, "__esModule", { value: true })
let chai_1 = require("chai")
let qmGit = __importStar(require("../src/helpers/qm.git"))
let isWin = process.platform === "win32"
describe("git", function () {
    it("sets commit status", function (done) {
        qmGit.setGithubStatus("pending", "test context", "test description", "https://get-bent.com", function (res) {
            chai_1.expect(res.status).to.eq(201)
            done()
        })
    })
})
//# sourceMappingURL=qm.git.test.js.map
