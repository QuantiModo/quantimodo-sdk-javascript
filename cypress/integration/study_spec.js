// load type definitions that come with Cypress module
/// <reference types="cypress" />
describe('Study', function () {
  it('Joins study from static v2/study page', function () {
      cy.visitApi(`/api/v2/study?logLevel=info&effectVariableName=Overall%20Mood&causeVariableName=Flaxseed%20Oil`)
    cy.get('#joinStudyButton')
            .invoke('removeAttr', 'target') // Cypress can't follow to new tab
            .click({ force: true })
    cy.wait(5000)
    cy.checkForBrokenImages()
    cy.get('.button-bar > button[id="joinStudyButton"].button')
            .click({ force: true })
    cy.wait(5000)
    cy.get('#signUpButton').click({ force: true })
    cy.get('#login-page-link').click({ force: true })
    cy.enterCredentials()
    cy.wait(5000)
    cy.get('#go-to-inbox-button').click({ force: true })
    cy.get('#hideHelpInfoCardButton').click({ force: true })
    cy.get('#hideHelpInfoCardButton').click({ force: true })
    cy.get('#hideHelpInfoCardButton').click({ force: true })
  })
})
