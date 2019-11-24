"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // https://github.com/motdotla/dotenv#what-happens-to-environment-variables-that-were-already-set
var qmTests = __importStar(require("./qm.tests"));
qmTests.runLastFailedCypressTest(function (err) {
    if (err)
        throw err;
    qmTests.runCypressTests();
});
//# sourceMappingURL=qm.cypress.js.map