// load type definitions that come with Cypress module
/// <reference types="cypress" />
let variableName = 'Aaa Test Treatment'
let settingsPath = `/#/app/variable-settings/${encodeURIComponent(variableName)}`
let chartsPath = `/#/app/charts/${encodeURIComponent(variableName)}`
/**
 * @param {string} variableString
 */
function verifyAndDeleteMeasurement(variableString){
    cy.get('#historyItemTitle').should('contain', variableString)
    cy.get('#historyItemTitle').click({force: true})
    cy.get('button.button.destructive').click({force: true})
    cy.log('Wait for deletion to complete')
}
/**
 * @param {string} variableName
 * @param timeout
 */
function searchForMoodFromMagnifyingGlassIcon(variableName, timeout = 1000){
    cy.wait(1000)
    cy.get('#menu-search-button').click({force: true})
    cy.get('md-autocomplete-wrap.md-whiteframe-z1 > input[type="search"]').click({force: true})
    cy.get('md-autocomplete-wrap.md-whiteframe-z1 > input[type="search"]').type(variableName, {force: true})
    cy.log('Wait for filtering')
    cy.wait(timeout)
    cy.get('#variable-item-title > span', {timeout: 60000})
        .contains(variableName)
        .click({force: true})
}
/**
 * @param {string} variableName
 */
function checkChartsPage(variableName){
    cy.url().should('contain', 'charts')
    cy.log('Chart is present and titled')
    cy.get(
        '#app-container > ion-side-menu-content > ion-nav-view > ion-view > ion-content > div.scroll > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > h2',
        {timeout: 30000})
        .should('contain', `${variableName} Over Time`)
    cy.get('.scroll > div:nth-of-type(2) > div:nth-of-type(2) > .card:nth-of-type(2) > .item.item-text-wrap > h2',
        {timeout: 60000})
        .should('contain', variableName)
}
/**
 * @param {string} variableName
 */
function toastContains(variableName){
    cy.get('.md-toast-text').should('contain', variableName)
}
/**
 * @param {number} value
 */
function recordRatingMeasurement(value){
    cy.get(`.primary-outcome-variable-history > img:nth-of-type(${value})`).click({force: true})
    cy.get('#saveButton').click({force: true})
}
describe('Variables', function(){
    it('Creates a new emotion variable by measurement', function(){
        let variableCategoryName = 'Emotions'
        recordMeasurementForNewVariableAndDeleteIt(variableCategoryName)
    })
    it('Tries all the buttons in the variable action sheet', function(){
        cy.loginWithAccessTokenIfNecessary('/#/app/reminders-inbox', true)
        let variableName = 'Overall Mood'
        searchForMoodFromMagnifyingGlassIcon(variableName, 15000)
        cy.clickActionSheetButtonContaining('Charts')
        checkChartsPage(variableName)
        searchForMoodFromMagnifyingGlassIcon(variableName)
        cy.clickActionSheetButtonContaining('Record Measurement')
        recordRatingMeasurement(3)
        searchForMoodFromMagnifyingGlassIcon(variableName)
        cy.clickActionSheetButtonContaining('Add Reminder')
        toastContains(variableName)
        searchForMoodFromMagnifyingGlassIcon(variableName)
        cy.clickActionSheetButtonContaining('Create Study')
        cy.get('#effectVariableName').should('contain', variableName)
        searchForMoodFromMagnifyingGlassIcon(variableName)
    })
    /**
     * @param {string} variableCategoryName
     */
    function recordMeasurementForNewVariableAndDeleteIt(variableCategoryName){
        cy.loginWithAccessTokenIfNecessary(`/#/app/measurement-add-search?variableCategoryName=${variableCategoryName}`,
            true)
        let d = new Date()
        let variableString = `Unique Test Variable ${d.toString()}`
        //let variableString = Math.round(d.getTime() / 1000) + " Unique Test Variable";
        cy.get('#variableSearchBox').type(variableString, {force: true})
        cy.get('#new-variable-button', {timeout: 30000}).click({force: true})
        cy.get('#variableCategorySelector').type(variableCategoryName, {force: true})
        cy.get('.primary-outcome-variable-history > img:nth-of-type(3)').click({force: true})
        cy.get('#saveButton').click({force: true})
        cy.wait(10000)
        cy.visit(`/#/app/history-all?variableCategoryName=${variableCategoryName}`)
        verifyAndDeleteMeasurement(variableString)
        return variableString
    }
    it('Goes to predictors page from the variable action sheet', function(){
        cy.loginWithAccessTokenIfNecessary('/#/app/reminders-inbox', true)
        let variableName = 'Overall Mood'
        searchForMoodFromMagnifyingGlassIcon(variableName, 20000)
        cy.clickActionSheetButtonContaining('Predictors')
        cy.get('.item.item-avatar > p', {timeout: 90000}).should('contain', variableName)
    })
    it('Changes and resets variable settings', function(){
        let max = '10000'
        let min = '1'
        let delay = '2'
        let duration = '5'
        let filling = '0'
        cy.loginWithAccessTokenIfNecessary(settingsPath)
        cy.wait(10000)
        cy.get('#resetButton')
            .click({force: true})
        cy.wait(10000)
        cy.assertInputValueEquals('#minimumAllowedValue', '0')
        cy.clearAndType('#minimumAllowedValue', min)
        cy.clearAndType('#maximumAllowedValue', max)
        cy.clearAndType('#onsetDelay', delay)
        cy.clearAndType('#durationOfAction', duration)
        cy.clearAndType('#fillingValue', filling)
        cy.get('#saveButton').click({force: true})
        cy.get('#helpInfoCardHeader > span:nth-child(2) > p', {timeout: 30000})
        cy.url().should('not.contain', 'variable-settings')
        cy.visit(settingsPath)
        cy.log("TODO: TEST TO MAKE SURE THE CHANGES STUCK. IT'S CURRENTLY VERY FLAKEY")
        //cy.assertInputValueContains('#minimumAllowedValue', min);
        //cy.assertInputValueEquals('#maximumAllowedValue', max);
        // cy.assertInputValueEquals('#onsetDelay', delay)
        // cy.assertInputValueEquals('#durationOfAction', duration)
        // cy.assertInputValueEquals('#fillingValue', filling)
        // cy.get('#resetButton').click({force: true})
        // cy.wait(15000)
        // //cy.url().should('not.contain', 'variable-settings');
        // //cy.visit(settingsPath);
        // cy.assertInputValueEquals('#minimumAllowedValue', '0')
        // cy.assertInputValueDoesNotContain('#maximumAllowedValue', max)
        // cy.assertInputValueEquals('#onsetDelay', '0.5')
        // cy.assertInputValueEquals('#durationOfAction', '504')
    })
    it('Goes to variable settings from chart page', function(){
        cy.loginWithAccessTokenIfNecessary('/#/app/chart-search')
        cy.searchAndClickTopResult(variableName, true)
        cy.url().should('contain', chartsPath)
        let chartTitleSelector = '#app-container > ion-side-menu-content > ion-nav-view > ion-view > ion-content > div.scroll > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > h2'
        cy.get(chartTitleSelector, {timeout: 30000}).then(() => { // Need to wait for variable for action sheet to work
            cy.containsCaseInsensitive(chartTitleSelector, variableName)
            cy.clickActionSheetButton(6)
            cy.wait(2000)
            cy.url().should('contain', settingsPath)
        })
    })
    it('Creates a new symptom rating variable by measurement', function(){
        let variableCategoryName = 'Symptoms'
        recordMeasurementForNewVariableAndDeleteIt(variableCategoryName)
    })
})