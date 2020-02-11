// ***********************************************************
// This example support/index.js is processed and loaded automatically before your test files.
// This is a great place to put global configuration and behavior that modifies Cypress.
// You can change the location of this file or turn off automatically serving support files with the 'supportFile'
// configuration option. You can read more here: https://on.cypress.io/configuration
// ***********************************************************
require('cypress-plugin-retries')
import './commands' // Import commands.js using ES2015 syntax:
// eslint-disable-next-line no-unused-vars
// noinspection JSUnusedLocalSymbols
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
let skip = [
    "[bugsnag] Loaded!"
]

let remove = [
    "https://app.quantimo.do/__cypress/tests?p=",
    "https://staging.quantimo.do/__cypress/tests?p=",
]
Cypress.on('window:before:load', (win) => {
    // Cypress.log({ // Needs ELECTRON_ENABLE_LOGGING=1
    //     name: 'console.log',
    //     message: 'wrap on console.log',
    // });

    // pass through cypress log so we can see log inside command execution order
    win.console.log = (...args) => {  // Needs ELECTRON_ENABLE_LOGGING=1
        try {
            let str = JSON.stringify(args);
            //let baseUrl = Cypress.env('baseUrl');
            //if(str.indexOf('/api/v') !== -1 && str.indexOf(Cypress.env('baseUrl')) === -1){throw "baseUrl is "+baseUrl+" but log message says "+str;}
            if(str && str.length > 1000){
                let obj = JSON.parse(str);
                delete obj.consoleProps // Fix for logrocket spam
                str = JSON.stringify(obj);
            }
            if (new RegExp(skip.join("|")).test(str)) {
                return;
            }
            for (let i = 0; i < remove.length; i++) {
                const removeElement = remove[i];
                str = str.replace(removeElement, '');
            }
            args = JSON.parse(str);
        } catch (e) {
            Cypress.log({
                name: 'console.log',
                message: "Could not format log because "+e.message,
            });
        }
        Cypress.log({
            name: 'console.log',
            message: args,
        });
    };
});

Cypress.on('log:added', (options) => {
    if (options.instrument === 'command') {  // Needs ELECTRON_ENABLE_LOGGING=1
        // eslint-disable-next-line no-console
        let message = `${(options.displayName || options.name || '').toUpperCase()} ${
            options.message
        }`;
        if(!options.message || options.message === ""){
            try {
                message = JSON.stringify(options, null, 2)
            }catch (e) {
                console.log("Could not format log because "+e.message);
            }
        }
        console.log(message);
    }
});