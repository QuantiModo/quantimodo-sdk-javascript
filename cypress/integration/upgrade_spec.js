// load type definitions that come with Cypress module
/// <reference types="cypress" />
describe('Upgrade', function () {
  it('Enters credit card info', function () {
    cy.visit('/#/app/upgrade?access_token=test-token&debug=true')
    cy.wait(5000)
    cy.getWithinIframe('[name="cardnumber"]').type('4242424242424242')
    cy.getWithinIframe('[name="exp-date"]').type('1232')
    cy.getWithinIframe('[name="cvc"]').type('987')
    cy.getWithinIframe('[name="postal"]').type('12345')
    cy.get('#upgrade-button').click({ force: true })
  })
})
