// Usage:
// npm install typescript ts-node
// npx ts-node ts/gi-run.ts
import * as gi from "./gi-functions"
// process.env.RELEASE_STAGE = "staging"
gi.runEverything(function() {
    process.exit(0)
})
