// ***********************************************************
// This example support/index.js is processed and loaded automatically before your test files.
// This is a great place to put global configuration and behavior that modifies Cypress.
// You can change the location of this file or turn off automatically serving support files with the 'supportFile'
// configuration option. You can read more here: https://on.cypress.io/configuration
// ***********************************************************
require('cypress-plugin-retries')
import './commands' // Import commands.js using ES2015 syntax:
// eslint-disable-next-line no-unused-vars
Cypress.on('uncaught:exception', (err, runnable) => {
    if(err.message.indexOf('runnable must have an id') !== false){
        cy.log(err.message)
        return false
    }
    let expectedErrorMessage = Cypress.env('expectedErrorMessage')
    if(expectedErrorMessage){
        expect(err.message).to.include(expectedErrorMessage)
        return false
    }
    cy.log(`Uncaught exception: ${err.message}`)
})
beforeEach(function(){ // runs before each test in the block
    let url = Cypress.config('baseUrl')
    if(!url){
        debugger
        throw "baseUrl not set!"
    }
    cy.log(`baseUrl is ${url}`)
    cy.log(`API_HOST is ${Cypress.env('API_HOST')}`)
})
import addContext from 'mochawesome/addContext'
Cypress.on('test:after:run', (test, runnable) => {
    // https://medium.com/@nottyo/generate-a-beautiful-test-report-from-running-tests-on-cypress-io-371c00d7865a
    if(test.state === 'failed'){
        let specName = Cypress.spec.name
        let runnableTitle = runnable.parent.title
        let testTitle = test.title
        const screenshotFileName = `${runnableTitle} -- ${testTitle} (failed).png`
        const folder = Cypress.config('screenshotsFolder') + `/${specName}/`
        const screenshotPath = folder + screenshotFileName
        //const screenshotFileName =  `./${specName}/${runnableTitle.replace(':', '')} -- ${testTitle} (failed).png`
        console.error(`screenshotPath ${screenshotPath}`)
        addContext({test}, screenshotPath)
    }
})
