// load type definitions that come with Cypress module
/// <reference types="cypress" />
let variableName = 'Aaa Test Treatment'
/**
 * @param {string} effect
 * @param {string} cause
 */
function checkStudyPage (effect, cause) {
  cy.get('i.ion-social-facebook').should('exist')
  cy.get('.voteButtons').should('exist')
  cy.get('#study-title').should('contain', effect)
  cy.get('#study-title').should('contain', cause)
  cy.checkForBrokenImages()
}
describe('Studies', function () {
  /**
   * @param {string} effect
   */
  function selectEffect (effect) {
    cy.get('#select-outcome-button').click({ force: true })
    cy.get('#input-6').type(effect, { force: true })
    cy.log('Wait for filtering')
    cy.wait(1000)
    cy.get('#variable-item-title > span').contains(effect).click({ force: true })
    cy.get('button[type="button"].md-button > span').click({ force: true })
  }
  /**
   * @param {string} cause
   */
  function selectCause (cause) {
    cy.get('#select-predictor-button').click({ force: true })
    cy.get('#input-4').type(cause, { force: true })
    cy.wait(1000)
    cy.get('#variable-item-title > span').contains(cause).click({ force: true })
    cy.get('button[type="button"].md-button > span').click({ force: true })
  }
  it('Tries to joins a study and is sent to login', function () {
    cy.visit(
      '/#/app/study-join?causeVariableName=Flaxseed%20Oil&effectVariableName=Overall%20Mood&studyId=cause-53530-effect-1398-population-study')
    cy.get('#joinStudyButton').click({ force: true })
    cy.get('#signInButton > span').click({ force: true })
  })
  it('Creates a study and votes on it', function () {
    let effect = 'Overall Mood'
    let cause = 'Sleep Duration'

    cy.loginWithAccessTokenIfNecessary('/#/app/study-creation')
    selectCause(cause)
    selectEffect(effect)
    cy.get('#createStudyButton').click({ force: true })
    cy.get('#goToStudyButton', { timeout: 30000 }).click({ force: true })
    checkStudyPage(effect, cause)
    cy.get('.voteButtons').click({ force: true })
    cy.visit(`/#/app/study?causeVariableName=${cause}&effectVariableName=${effect}`)
    checkStudyPage(effect, cause)
  })
  it('Looks at a study anonymously', function () {
    let effect = 'Overall Mood'
    let cause = 'Sleep Duration'

    cy.visit(`/#/app/study?causeVariableName=${cause}&effectVariableName=${effect}`)
    checkStudyPage(effect, cause)
  })
  it('Goes to study from positive predictors page', function () {
    cy.loginWithAccessTokenIfNecessary('/#/app/predictors-positive')
    cy.log('Click the first study.  TODO: Speed this up and reduce timeout')
    cy.get('#study-tag-line', { timeout: 15000 })
        .click({ force: true })
    cy.log(
        'Study page displays.  TODO: Reduce timeout and make sure that we populate with initial correlation before fetching full study')
    cy.get('#studyHeaderHtml', { timeout: 60000 })
        .should('contain', 'Overall Mood')
  })
})
