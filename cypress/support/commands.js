// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
let logLevel = Cypress.env('LOG_LEVEL') || 'info'
let accessToken = Cypress.env('ACCESS_TOKEN') || 'test-token'
let API_HOST = Cypress.env('API_HOST')
let apiUrl = `https://${API_HOST}`
let baseUrl = Cypress.config('baseUrl')
let testUserName = 'testuser'
let testUserPassword = 'testing123'
Cypress.Commands.add('goToApiLoginPageAndLogin', (email = testUserName, password = testUserPassword) => {
    cy.visitApi(`/api/v2/auth/login?logout=1`)
    cy.enterCredentials('input[name="user_login"]', email,
        'input[name="user_pass"]', password,
        'input[type="submit"]')
})
Cypress.Commands.add('goToMobileConnectPage', () => {
    cy.visitApi(`/api/v1/connect/mobile?log=testuser&pwd=testing123&clientId=ghostInspector`)
    cy.wait(5000)
})
Cypress.Commands.add('logoutViaApiLogoutUrl', () => {
    cy.log('Logging out')
    cy.visitApi(`/api/v2/auth/logout`).then(() => {
        cy.wait(2000)
        cy.visitApi(`/api/v2/auth/login`).then(() => {
            cy.get('input[name="user_login"]')
                .type(testUserName)
                .clear()
        })
    })
})
/**
 * @return {string}
 */
function UpdateQueryString(key, value, uri){
    let re = new RegExp(`([?&])${key}=.*?(&|$)`, 'i')
    let separator = uri.indexOf('?') !== -1 ? '&' : '?'
    if(uri.match(re)){
        return uri.replace(re, `$1${key}=${value}$2`)
    }
    return `${uri + separator + key}=${value}`
}
Cypress.Commands.add('loginWithAccessTokenIfNecessary', (path = '/#/app/reminders-inbox', waitForAvatar = true) => {
    path = UpdateQueryString('logLevel', logLevel, path)
    path = UpdateQueryString('access_token', accessToken, path)
    path = UpdateQueryString('apiUrl', API_HOST, path)
    cy.visit(path)
    if(waitForAvatar){
        cy.get('#navBarAvatar > img', {timeout: 40000})
    }
})
Cypress.Commands.add('visitWithApiUrlParam', (url, options = {}) => {
    if(!options.qs){
        options.qs = {};
    }
    options.qs.apiUrl = API_HOST;
    cy.visit(url, options)
})
Cypress.Commands.add('visitApi', (url, options = {}) => {
    if(!API_HOST || API_HOST === 'undefined'){
        throw 'Please set API_HOST env!'
    }
    if(!options.qs){
        options.qs = {};
    }
    options.qs.XDEBUG_SESSION_START = 'PHPSTORM';
    cy.visit("https://" + API_HOST + url, options)
})
Cypress.Commands.add('clickActionSheetButton', (index) => {
    cy.get('#menu-more-button').click({force: true})
    cy.get(`.action-sheet-group > button.button.action-sheet-option:nth-of-type(${index})`).click({force: true})
})
Cypress.Commands.add('containsCaseInsensitive', (selector, content) => {
    function caseInsensitive(str){
        // escape special characters
        let input = str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
        return new RegExp(`${input}`, 'i')
    }
    cy.get(selector, {timeout: 10000}).contains(caseInsensitive(content))
    return cy
})
Cypress.Commands.add('urlShouldContainCaseInsensitive', (content) => {
    let url = cy.url()
    url = url.toLowerCase()
    content = content.toLowerCase()
    if(url.indexOf(content) === -1){
        throw `URL ${url} does not contain ${content}`
    }
})
Cypress.Commands.add('assertInputValueEquals', (selector, expectedValue) => {
    cy.get(selector, {timeout: 30000})
        .scrollIntoView()
        .should('be.visible')
        .then(function($el){
            expect($el[0].value).to.eq(expectedValue)
        })
})
Cypress.Commands.add('assertInputValueContains', (selector, expectedValue) => {
    cy.get(selector, {timeout: 30000})
        .scrollIntoView()
        .should('be.visible')
        .then(function($el){
            expect($el[0].value).to.contain(expectedValue)
        })
})
Cypress.Commands.add('assertInputValueDoesNotContain', (selector, expectedValue) => {
    cy.get(selector, {timeout: 15000})
        .scrollIntoView()
        .should('be.visible')
        .then(function($el){
            expect($el[0].value).not.to.contain(expectedValue)
        })
})
Cypress.Commands.add('clearAndType', (selector, text) => {
    cy.get(selector, {timeout: 15000})
        .scrollIntoView()
        .should('be.visible')
        .clear({force: true})
        .type(text, {force: true})
})
Cypress.Commands.add('enterCredentials', (usernameSelector = 'input[name="user_login"]',
                                          username = 'testuser', passwordSelector = 'input[name="user_pass"]',
                                          password = 'testing123', submitSelectors = 'input[type="submit"]') => {
    cy.get(usernameSelector)
        .click({force: true})
        .type(username, {force: true})
    cy.get(passwordSelector)
        .click({force: true})
        .type(password, {force: true})
    cy.log('Clicking submit')
    if(typeof submitSelectors === 'string'){
        submitSelectors = [submitSelectors]
    }
    submitSelectors.forEach(function(selector){
        cy.get(selector)
            .click({force: true})
        cy.log('Clicked submit')
    })
})
Cypress.Commands.add('disableSpeechAndSkipIntro', () => {
    cy.log('Skipping intro...')
    if(Cypress.browser.name === 'chrome'){
        cy.get('.pane > div > div > #disableSpeechButton > span', {timeout: 30000}).click()
    }
    cy.get('.slider > .slider-slides > .slider-slide:nth-child(1) > .button-bar > #skipButtonIntro').click()
})
Cypress.Commands.add('enterNewUserCredentials', () => {
    let d = new Date()
    let newUserLogin = `testuser${d.getTime()}`
    let newUserEmail = `testuser${d.getTime()}@gmail.com`
    cy.get('input[name="user_login"]').type(newUserLogin, {force: true})
    cy.get('input[name="user_email"]').type(newUserEmail, {force: true})
    cy.get('input[name="user_pass"]').click({force: true}).type('qwerty', {force: true})
    cy.get('input[name="user_pass_confirmation"]').click({force: true}).type('qwerty', {force: true})
    cy.get('input[type="submit"]').click({force: true})
})
Cypress.Commands.add('logOutViaSettingsPage', (useMenuButton = false) => {
    if(useMenuButton){
        cy.get('#menu-item-settings').click({force: true})
        cy.get('#menu-item-settings > a').click({force: true})
    }else{
        cy.visit(`${baseUrl}/#/app/settings`)
    }
    cy.get('#userName').click({force: true})
    cy.get('#yesButton').click({force: true})
    cy.log('We should end up back at intro after logout')
    cy.get('#skipButtonIntro').should('exist')
})
Cypress.Commands.add('allowUncaughtException', (expectedErrorMessage) => {
    if(expectedErrorMessage){
        cy.log(`Allowing uncaught exceptions containing ${expectedErrorMessage}`)
    }else{
        cy.log('Disabling allowance of uncaught exceptions')
    }
    Cypress.env('expectedErrorMessage', expectedErrorMessage)
})
Cypress.Commands.add('checkForBrokenImages', () => {
    cy.log('Checking for broken images...')
    cy.get('img', {timeout: 30000})
        .each(($el, index, $list) => {
            if(!$el){
                cy.log(`No $element at index: ${index}`)
                return
            }
            if(!$el[0].naturalWidth){
                debugger
                let src = $el[0].getAttribute('src')
                let message = `The image with src ${src} is broken!  outerHTML is: ${$el[0].outerHTML}`
                cy.log(message)
                throw message
            }
        })
})
Cypress.Commands.add('iframeLoaded', {prevSubject: 'element'}, ($iframe) => {
    const contentWindow = $iframe.prop('contentWindow')
    return new Promise((resolve) => {
        if(
            contentWindow &&
            contentWindow.document.readyState === 'complete'
        ){
            resolve(contentWindow)
        }else{
            $iframe.on('load', () => {
                resolve(contentWindow)
            })
        }
    })
})
Cypress.Commands.add('getInDocument', {prevSubject: 'document'}, (document, selector) => Cypress.$(selector, document))
Cypress.Commands.add('getWithinIframe',
    (targetElement) => cy.get('iframe').iframeLoaded().its('document').getInDocument(targetElement))
Cypress.Commands.add('sendSlackNotification', (messageBody) => {
    const reportStats = {};
    let totalTests = reportStats.tests;
    let totalPasses = reportStats.passes;
    let totalFailures = reportStats.failures;
    if(totalTests === undefined || totalTests === 0){
        status = "error";
    }else if(totalFailures > 0 || totalPasses === 0){
        status = "failed";
    }else if(totalFailures === 0){
        status = "passed";
    }
    const _a = process.env, CI_BRANCH = _a.CI_BRANCH, CI_BUILD_URL = _a.CI_BUILD_URL, CI_CIRCLE_JOB = _a.CI_CIRCLE_JOB;
    let branchText;
    if(!CI_BRANCH){
        branchText = "";
    }else{
        branchText = "Branch: " + CI_BRANCH + "\n";
    }
    let jobText;
    if(!CI_CIRCLE_JOB){
        jobText = "";
    }else{
        jobText = "Job: " + CI_CIRCLE_JOB + "\n";
    }
    let
        envSut = "";
    let reportHTMLUrl = '';
    cy.request('POST', 'https://hooks.slack.com/services/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', {
        color: "#ff0000",
        fallback: "Report available at " + reportHTMLUrl,
        title: "Total Failed: " + totalFailures,
        text: "" + branchText + jobText + envSut + "Total Tests: " + totalTests + "\nTotal Passed:  " + totalPasses + " ",
        actions: [
            {
                type: "button",
                text: "CircleCI Logs",
                url: "" + CI_BUILD_URL,
                style: "primary"
            }
        ]
    });
})
function sendSlackNotification(error, runnable){
    cy.request('POST', 'https://hooks.slack.com/services/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', {
        color: "#ff0000",
        fallback: runnable.ctx.test.title + " FAILED",
        title: runnable.ctx.test.title + " FAILED",
        text: error.message + `\n baseUrl is ${Cypress.config('baseUrl')} \n API_HOST is ${Cypress.env('API_HOST')}`,
        actions: [
            {
                type: "button",
                text: "CircleCI Logs",
                url: Cypress.env('CI_BUILD_URL'),
                style: "primary"
            }
        ]
    });
}
/**
 * @param {string} variableName
 * @param {boolean} topResultShouldContainSearchTerm
 */
Cypress.Commands.add('searchAndClickTopResult', (variableName, topResultShouldContainSearchTerm) => {
    cy.log(`Type ${variableName} into search box`)
    cy.wait(2000)
    cy.get('#variableSearchBox')
        .type(variableName, { force: true })
    let firstResultSelector = '#variable-search-result > div > p'
    cy.log('Wait for search results to load')
    cy.wait(2000)
    cy.log(`Click on ${variableName} in dropdown search results`)
    if (topResultShouldContainSearchTerm) {
        cy.get(firstResultSelector, { timeout: 20000 })
            .contains(variableName)
            .click({ force: true })
    } else {
        cy.get(firstResultSelector, { timeout: 20000 })
            .click({ force: true })
    }
});
/**
 * @param {string} str
 */
Cypress.Commands.add('clickActionSheetButtonContaining',  (str) => {
    cy.log(`Clicking action button containing ${str}`)
    cy.wait(2000)
    let button = '.action-sheet-option'
    if (str.indexOf('Delete') !== -1) {
        button = '.destructive'
    }
    cy.get(button, { timeout: 5000 })
        .contains(str)
        .click({ force: true })
})