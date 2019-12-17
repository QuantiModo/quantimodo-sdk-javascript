import * as dotenv from "dotenv"
dotenv.config() // https://github.com/motdotla/dotenv#what-happens-to-environment-variables-that-were-already-set
import * as qmTests from "./qm.tests"
qmTests.giTests.tests.giEverything(function() {
    process.exit(0)
})
