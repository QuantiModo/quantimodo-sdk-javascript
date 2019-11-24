const dotenv = require('dotenv')
dotenv.config() // https://github.com/motdotla/dotenv#what-happens-to-environment-variables-that-were-already-set
const qmTests = require('./qm.tests')
qmTests.runLastFailedCypressTest(function (err: any) {
    if (err) throw err
    qmTests.runCypressTests()
})
