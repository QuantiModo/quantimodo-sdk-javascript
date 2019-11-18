// ***********************************************************
// This example support/index.js is processed and loaded automatically before your test files.
// This is a great place to put global configuration and behavior that modifies Cypress.
// You can change the location of this file or turn off automatically serving support files with the 'supportFile'
// configuration option. You can read more here: https://on.cypress.io/configuration
// ***********************************************************
require('cypress-plugin-retries')
import './commands'  // Import commands.js using ES2015 syntax:
Cypress.on('uncaught:exception', (err, runnable) => {
    if(err.message.indexOf('runnable must have an id') !== false){
        cy.log(err.message)
        return false
    }
    debugger
    let expectedErrorMessage = Cypress.env('expectedErrorMessage')
    if(expectedErrorMessage){
        expect(err.message).to.include(expectedErrorMessage)
        return false
    }
    cy.log(`Uncaught exception: ${err.message}`)
})
let failed = false;
Cypress.on('fail', (error, runnable) => {
    failed = true;
    //debugger
    //sendSlackNotification(error, runnable)
    throw error
})
beforeEach(function(){ // runs before each test in the block
    cy.log(`baseUrl is ${Cypress.config('baseUrl')}`)
    cy.log(`API_HOST is ${Cypress.env('API_HOST')}`)
})
import addContext from 'mochawesome/addContext'
Cypress.on('test:after:run', (test, runnable) => {
    if(test.state === 'failed'){
        addContext({test},
            `./${Cypress.spec.name}/${runnable.parent.title.replace(':', '')} -- ${test.title} (failed).png`)
    }
})