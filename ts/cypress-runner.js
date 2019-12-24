"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = __importStar(require("dotenv"));
dotenv.config(); // https://github.com/motdotla/dotenv#what-happens-to-environment-variables-that-were-already-set
var qmTests = __importStar(require("./cypress-functions"));
process.env.ELECTRON_ENABLE_LOGGING = "1";
if (process.env.SPEC_NAME) {
    qmTests.runCypressTests(function () {
        console.info("Done with " + process.env.SPEC_NAME);
    }, process.env.SPEC_NAME);
}
else {
    qmTests.runLastFailedCypressTest(function (err) {
        if (err) {
            throw err;
        }
        qmTests.runCypressTests();
    });
}
//# sourceMappingURL=cypress-runner.js.map