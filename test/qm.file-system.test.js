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
let https = __importStar(require("https"))
let url = __importStar(require("url"))
let fileHelper = __importStar(require("../src/helpers/qm.file-helper"))
describe("s3 uploader", function () {
    it("uploads a file", function (done) {
        fileHelper.uploadToS3("ionIcons.js", "tests", function (uploadResponse) {
            let myURL = url.parse(uploadResponse.Location)
            let options = {
                hostname: myURL.hostname,
                port: 443,
                path: myURL.path,
                method: "GET",
            }
            let req = https.request(options, function (res) {
                console.log("statusCode: " + res.statusCode)
                chai_1.expect(res.statusCode).to.eq(200)
                let str = ""
                res.on("data", function (chunk) {
                    str += chunk
                })
                res.on("end", function () {
                    console.log(str)
                    chai_1.expect(str).to.contain("iosArrowUp")
                    done()
                })
            })
            req.on("error", function (error) {
                console.error(error)
            })
            req.end()
        })
    })
})
//# sourceMappingURL=qm.file-system.test.js.map
