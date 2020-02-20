import * as dotenv from "dotenv"
dotenv.config() // https://github.com/motdotla/dotenv#what-happens-to-environment-variables-that-were-already-set
try {
    dotenv.config({path: "secrets/.env.local"})
} catch (e) {
    console.info(e.message)
}
import * as qmTests from "./cypress-functions"
if(!process.env.ELECTRON_ENABLE_LOGGING) {
    console.log("set env ELECTRON_ENABLE_LOGGING=\"1\" if you want to log to CI.  Disabled by default to avoid leaking secrets on Travis")
}
if (process.env.SPEC_NAME) {
    console.log("Only running process.env.SPEC_NAME "+process.env.SPEC_NAME)
    qmTests.runOneCypressSpec(process.env.SPEC_NAME, function() {
        console.info("Done with "+process.env.SPEC_NAME)
    })
} else {
    console.log("runLastFailedCypressTest and then run runCypressTests")
    qmTests.runLastFailedCypressTest(function(err: any): void {
        console.log("Done with runLastFailedCypressTest. Going to run all now...")
        if (err) { throw err }
        qmTests.runCypressTests()
    })
}
