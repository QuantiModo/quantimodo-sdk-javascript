"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Usage:
// npm install typescript ts-node
// npx ts-node ts/gi-run.ts
var gi = __importStar(require("./gi-functions"));
gi.giTests.tests.giEverything(function () {
    process.exit(0);
});
//# sourceMappingURL=gi-runner.js.map