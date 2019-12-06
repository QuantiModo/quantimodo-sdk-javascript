// load type definitions that come with Cypress module
/// <reference types="cypress" />
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
   * @param {string} cause
   */
  function selectCause (cause) {
    cy.get('#select-predictor-button').click({ force: true })
    cy.get('#input-4').type(cause, { force: true })
    cy.wait(2000)
    cy.get('#variable-item-title > span').contains(cause).click({ force: true })
    cy.get('button[type="button"].md-button > span').click({ force: true })
  }
  it('Logs out so the next test works', function () {
    cy.log("Can't visit different hosts in the same test")
    cy.logoutViaApiLogoutUrl()
  })
  it('Tries to joins a study and is sent to login', function () {
    cy.visitIonicAndSetApiUrl(
      '/#/app/study-join?causeVariableName=Flaxseed%20Oil&effectVariableName=Overall%20Mood&studyId=cause-53530-effect-1398-population-study')
    cy.get('#joinStudyButton').click({ force: true })
    cy.get('#signInButton > span').click({ force: true })
  })
  it('Creates a study and votes on it', function () {
    let effect = 'Overall Mood'
    let cause = 'Sleep Duration'
    cy.loginWithAccessTokenIfNecessary('/#/app/study-creation')
    selectCause(cause)
    cy.get('#select-outcome-button').click({ force: true })
    cy.get('#input-6').type(effect, { force: true })
    cy.log('Wait for filtering')
    cy.wait(2000)
    cy.get('#variable-item-title > span', {timeout: 10000})
        .contains(effect).click({ force: true })
    cy.get('button[type="button"].md-button > span').click({ force: true }).then(function(){
      debugger
      // TODO:  Update this
      // cy.get('#createStudyButton', { timeout: 3000 }).click({ force: true })
      // cy.get('#goToStudyButton', { timeout: 30000 }).click({ force: true })
      // checkStudyPage(effect, cause)
      // cy.get('.voteButtons').click({ force: true })
      // cy.visitIonicAndSetApiUrl(`/#/app/study?causeVariableName=${cause}&effectVariableName=${effect}`)
      // checkStudyPage(effect, cause)
    })
  })
  it('Looks at a study anonymously', function () {
    let effect = 'Overall Mood'
    let cause = 'Sleep Duration'

    cy.visitIonicAndSetApiUrl(`/#/app/study?causeVariableName=${cause}&effectVariableName=${effect}`)
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
