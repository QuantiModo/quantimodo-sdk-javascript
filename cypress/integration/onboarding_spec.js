// load type definitions that come with Cypress module
/// <reference types="cypress" />
describe('Onboarding', function () {
  function addAnxietyReminderFromOnboarding () {
    cy.get('#goToReminderSearchFromOnboarding', { timeout: 30000 }).click({ force: true })
    cy.wait(5000)
    cy.get('#variable-search-box').click({ force: true })
    cy.get('#variable-search-box').type('Anxiety', { force: true })
    cy.get('#variable-search-box').type('{enter}', { force: true })
    cy.get('#search-cancel-button').click({ force: true })
    cy.get('#hideOnboardingPage').click({ force: true })
    cy.get('#goToReminderSearchFromOnboarding').click({ force: true })
    cy.get('#variable-search-box').click({ force: true })
    cy.get('#variable-search-box').type('Back Pain', { force: true })
    cy.get('#search-cancel-button').click({ force: true })
    cy.get('#hideOnboardingPage').click({ force: true })
    cy.get('#hideOnboardingPage').click({ force: true })
    cy.get('#hideOnboardingPage').click({ force: true })
    cy.get('#hideOnboardingPage').click({ force: true })
    cy.get('#hideOnboardingPage').click({ force: true })
    cy.get('#hideOnboardingPage').click({ force: true })
    cy.get('#goToInboxButton').click({ force: true })
    cy.get('#hideHelpInfoCardButton').click({ force: true })
  }
  it('Creates new use and anxiety reminder during onboarding', function () {
    cy.visit('/')
    cy.disableSpeechAndSkipIntro()
    cy.get('#signUpButton').click({ force: true })
    cy.enterNewUserCredentials()
    //cy.get('#button-approve').click({ force: true });
    //cy.visit(`/#/app/onboarding`);
    addAnxietyReminderFromOnboarding()
  })
})
