// load type definitions that come with Cypress module
/// <reference types="cypress" />
let variableName = 'Aaa Test Treatment'
/**
 * @param {string} variableName
 */
function checkChartsPage (variableName) {
  cy.url().should('contain', 'charts')
  cy.log('Chart is present and titled')
  cy.get('#app-container > ion-side-menu-content > ion-nav-view > ion-view > ion-content > div.scroll > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > h2',
    { timeout: 30000 })
        .should('contain', `${variableName} Over Time`)
  cy.get('.scroll > div:nth-of-type(2) > div:nth-of-type(2) > .card:nth-of-type(2) > .item.item-text-wrap > h2',
    { timeout: 60000 })
        .should('contain', variableName)
}
/**
 * @param {number} initialMoodValue
 */
function recordMeasurementAndCheckHistoryPage (initialMoodValue) {
  cy.url().should('contain', '/measurement-add')
  cy.get(`.primary-outcome-variable-history > img:nth-of-type(${initialMoodValue})`)
        .click({ force: true })
  cy.get('#saveButton').click({ force: true })
  cy.log('Waiting for measurement to post to API...')
  cy.wait(10000)
  cy.visit('/#/app/history-all-variable/Overall Mood')
  //let desiredImageName = moodValueToImage(initialMoodValue)
  // cy.get("#historyItem-0 > img", {timeout: 30000}).invoke('attr', 'src')
  //     .should('contain', desiredImageName);
}
/**
 * @param {number} [dosageValue]
 */
function recordTreatmentMeasurementAndCheckHistoryPage (dosageValue) {
  if (!dosageValue) {
    let d = new Date()

    dosageValue = d.getMinutes()
  }

  cy.loginWithAccessTokenIfNecessary('/#/app/measurement-add-search?variableCategoryName=Treatments')
  let variableName = 'Aaa Test Treatment'

  searchAndClickTopResult(variableName, true)
  cy.log('Click Remind me to track')
  cy.get('#reminderButton').click({ force: true })
  cy.log('Check that reminders add page was reached')
  cy.url().should('include', '#/app/reminder-add')
  cy.get('#cancelButton').click({ force: true })
  cy.log('Get dosage value from current time (minutes)')
  cy.log('Assign current minutes to dosage')
  cy.get('#defaultValue').type(dosageValue.toString(), { force: true })
  cy.get('#unitSelector').should('contain', 'Milligrams')
  cy.log('Check that mg is selected')
  cy.get('#saveButton').click({ force: true })
  cy.wait(10000)
  cy.visit('/#/app/history-all-category/Treatments')
  let treatmentStringNoQuotes = `${dosageValue} mg Aaa Test Treatment`

  cy.get('#historyItemTitle', { timeout: 40000 })
        .should('contain', treatmentStringNoQuotes)
}
/**
 * @param {string} variableName
 * @param {boolean} topResultShouldContainSearchTerm
 */
function searchAndClickTopResult (variableName, topResultShouldContainSearchTerm) {
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
}
/**
 * @param {string} str
 */
function clickActionSheetButtonContaining (str) {
  cy.log(`Clicking action button containing ${str}`)
  cy.wait(2000)
  let button = '.action-sheet-option'

  if (str.indexOf('Delete') !== -1) {
    button = '.destructive'
  }

  cy.get(button, { timeout: 5000 })
        .contains(str)
        .click({ force: true })
}
/**
 * @param {string} itemTitle
 */
function editHistoryPageMeasurement (itemTitle) {
  cy.log(`Editing history measurement with title containing: ${itemTitle}`)
  cy.get('#historyItemTitle', { timeout: 30000 }).contains(itemTitle)
  cy.get('#action-sheet-button', { timeout: 30000 }).click({ force: true })
  clickActionSheetButtonContaining('Edit')
  cy.wait(2000)
  cy.url().should('include', 'measurement-add')
}
describe('Measurements', function () {
  it('Goes to edit measurement from history page', function () {
    cy.loginWithAccessTokenIfNecessary('/#/app/history-all-category/Anything')
    cy.get('#historyItemTitle', { timeout: 30000 }).click()
    clickActionSheetButtonContaining('Edit')
    cy.wait(2000)
    cy.url().should('include', 'measurement-add')
  })
  it('Records, edits, and deletes a mood measurement', function () {
    cy.loginWithAccessTokenIfNecessary('/#/app/measurement-add-search')
    let variableName = 'Overall Mood'

    searchAndClickTopResult(variableName, true)
    let d = new Date()
    let seconds = d.getSeconds()
    let initialMoodValue = (seconds % 5) + 1

    recordMeasurementAndCheckHistoryPage(initialMoodValue)
    // cy.get('#hidden-measurement-id').then(($el) => {
    //     let measurementId = $el.text();
    //     cy.get(
    //         '.list > [id="historyItem-0"].item.item-avatar.item-button-right:nth-of-type(1) > .buttons >
    // button.button.button-dark') .click({force: true}); clickActionSheetButtonContaining('Edit'); let
    // newMoodValue = ((initialMoodValue % 5) + 1);
    // cy.visit(`/#/app/measurement-add?measurementId=${measurementId}`);
    // recordMeasurementAndCheckHistoryPage(newMoodValue); cy.get("#hidden-measurement-id").then(($el) => { let
    // editedMeasurementId = $el.text(); cy.visit(`/#/app/measurement-add?measurementId=${editedMeasurementId}`);
    // cy.get('#deleteButton').click({force: true}); cy.wait(10000); cy.visit(`/#/app/history-all-variable/Overall
    // Mood`); cy.get("#hidden-measurement-id").should('not.contain', editedMeasurementId); }); });
  })
  it('Record, edit, and delete a treatment measurement', function () {
    let dosageValue = 100

    recordTreatmentMeasurementAndCheckHistoryPage(dosageValue)
    editHistoryPageMeasurement(dosageValue.toString())
    let newDosageValue = dosageValue / 10

    cy.get('#defaultValue').type(newDosageValue.toString(), { force: true })
    cy.get('#saveButton').click({ force: true })
    cy.wait(10000)
    cy.visit('/#/app/history-all-category/Treatments')
    let treatmentStringEditedNoQuotes = `${newDosageValue} mg Aaa Test Treatment`

    editHistoryPageMeasurement(newDosageValue.toString())
    cy.get('button.button.icon-left.ion-trash-a').click({ force: true })
    cy.wait(10000)
    cy.url().should('include', '/#/app/history-all-category/Treatments')
    cy.log('Check that deleted measurement is gone (must use does not equal instead of does not contain because a ' +
            'measurement of 0mg will be true if the value is 50mg)')
    cy.get('#historyItemTitle', { timeout: 40000 })
            .should('not.contain', treatmentStringEditedNoQuotes)
  })
  it('Records a treatment measurement and checks history', function () {
    recordTreatmentMeasurementAndCheckHistoryPage()
  })
})
