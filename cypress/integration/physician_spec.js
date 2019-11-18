// load type definitions that come with Cypress module
/// <reference types="cypress" />
describe('Physician Dashboard', function () {
  it('List kids on Kiddomodo parent dashboard', function () {
    cy.visit('https://dev-physician.quantimo.do/#/app/physician?clientId=kiddomodo&accessToken=test-token')
    cy.get('md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > #tab-item-4 > .ng-binding', { timeout: 20000 })
            .contains('Kid')
    cy.get('.ng-pristine > #sharing-invitation-card > #card-header > span > .ng-binding', { timeout: 20000 })
            .contains('kid')
  })
})
let unixTime = Math.floor(Date.now() / 1000)
let urls = {
  demo: {
    importPage: 'https://demo.quantimo.do/#/app/import',
  },
  import: '/import',
  register: '/api/v2/auth/register',
  physicianOAuth: '/api/v1/oauth/authorize?response_type=token&scope=readmeasurements&client_id=m-thinkbynumbers-org',
  study: '/api/v2/study?logLevel=info&effectVariableName=Overall%20Mood&causeVariableName=Flaxseed%20Oil',
  variableSettings: '/api/v2/study?logLevel=info&effectVariableName=Overall%20Mood&causeVariableName=Flaxseed%20Oil',
}
let testUsername = `testuser${unixTime}`
let testEmail = `testuser${unixTime}@gmail.com`

function enterPasswordsAndClickRegister () {
  cy.get('#password-group > input').type('testing123')
  cy.get('#password-confirm-group > input').type('testing123')
  cy.get('#submit-button-group > div > input.btn.btn-primary').click()
}
function validRegistration () {
  changeTestUsernameAndEmail()
  cy.get('#username-group > input')
        .clear()
        .type(testUsername)
  cy.get('#email-group > input')
        .clear()
        .type(testEmail)
  enterPasswordsAndClickRegister()
}
function changeTestUsernameAndEmail () {
  unixTime = Math.floor(Date.now() / 1000)
  testUsername = `testuser${unixTime}`
  testEmail = `testuser${unixTime}@gmail.com`
}
function checkIntroWithAccessToken () {
  cy.url().should('include', 'intro')
  cy.url().should('include', 'quantimodoAccessToken')
}
describe('Auth Tests', function () {
  it('Patient creates account and is sent to OAuth url', function () {
    cy.clearCookies()
    cy.visit(urls.physicianOAuth)
    validRegistration()
    cy.url().should('include', urls.physicianOAuth)
    cy.get('#button-approve').click()
    checkIntroWithAccessToken()
    cy.disableSpeechAndSkipIntro()
  })
})
