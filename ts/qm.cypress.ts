import * as dotenv from "dotenv";
dotenv.config(); // https://github.com/motdotla/dotenv#what-happens-to-environment-variables-that-were-already-set
import * as qmTests from "./qm.tests";
if(process.env.SPEC_NAME){
    qmTests.runCypressTests(function () {
        }, process.env.SPEC_NAME);
} else {
    qmTests.runLastFailedCypressTest(function(err: any): void {
        if (err) { throw err; }
        qmTests.runCypressTests();
    });
}
