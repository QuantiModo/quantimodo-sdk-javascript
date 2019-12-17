// Usage:
// npm install typescript ts-node
// npx ts-node ts/gi-run.ts
import * as gi from "./gi-functions"
gi.giTests.tests.giEverything(function() {
    process.exit(0)
})
