// load type definitions that come with Cypress module
/// <reference types="cypress" />
describe('Favorites', function () {
  it.skip('Adds a favorite and records a measurement with it', function () {
    cy.loginWithAccessTokenIfNecessary('/#/app/favorites')
    let record100mgSelector = '#recordDefaultValue > i'

    cy.log('Click add a favorite variable')
    cy.get('#addFavoriteBtn').click({ force: true })
    cy.searchAndClickTopResult('Aaa Test Treatment', true)
    cy.get('#moreOptions').click({ force: true })
    cy.log('Assign default value to 100mg')
    cy.get('#defaultValue').type('100', { force: true })
    cy.get('#saveButton').click({ force: true })
    cy.log('Wait for favorite to save so we are not redirected back to favoriteAdd')
    cy.wait(9000)
    cy.visitIonicAndSetApiUrl('/#/app/favorites')
    cy.log('Check that favorite was added')
    cy.get('#favoriteItemTitle').should('contain', 'Aaa Test Treatment')
    cy.get(record100mgSelector, { timeout: 20000 }).should('contain', 'Record 100')
    cy.log('Click Record 100 mg')
    cy.get(record100mgSelector).click({ force: true })
    cy.get('#favoriteItemTitle').should('contain', '100 mg')
    cy.get('#favoriteItemTitle').should('contain', 'Aaa Test Treatment')
    cy.log(
      'Space out clicks so the first post consistently completes before the second one.  This way we have a consistent 100 value on history page to check.')
    cy.log('Click Record 100 mg')
    cy.get(record100mgSelector).click({ force: true })
    cy.log('Displayed value from second click (Not sure why test cant detect but it works in real life)')
    cy.get('#favoriteItemTitle').should('contain', '200 mg')
    cy.get('#favoriteItemTitle').should('contain', 'Aaa Test Treatment')
    cy.log('Click ... settings button')
    cy.get('#favoriteItemSettings', { timeout: 30000 })
    // eslint-disable-next-line no-unused-vars
            .each(($el, _index, _$list) => {
              cy.log(`Deleting ${$el.text()} reminder`)
              cy.wrap($el).click()
              cy.clickActionSheetButtonContaining('Delete')
            })
    cy.log('Since there are no favorites, the explanation card is showing')
    //cy.get("#noFavoritesExplanation").should('exist');
    cy.log('There is no favorites list since there are no favorites')
    //cy.get("#favoritesList").should('not.exist');
    cy.log('Posted value from second click')
    cy.visitIonicAndSetApiUrl('/#/app/history-all?variableCategoryName=Treatments')
    cy.get('#historyItemTitle', { timeout: 20000 }).should('contain', '200 mg Aaa Test Treatment')
  })
})
describe('Floating Action Button', function () {
  it('Tries out all four buttons from inbox', function () {
    let selectors = {
      'redMaterialButtonExpanded': '#floatingActionButton > li > ul',
      'redMaterialButtonPlus': '#floatingActionButton > li > a > i.mfb-component__main-icon--resting.ion-plus-round',
      'redMaterialButtonMinus': '#floatingActionButton > li > a > i.mfb-component__main-icon--active.ion-minus-round',
    }

    cy.loginWithAccessTokenIfNecessary('/#/app/reminders-inbox')
    cy.log('Circle + (record) on bottom left is present')
    cy.get(selectors.redMaterialButtonPlus).should('exist')
    cy.log('Click + button')
    cy.get(selectors.redMaterialButtonPlus).click({ force: true })
    cy.log(
      'There are four buttons above the + (record a symptom, import data, record a measurement, add a reminder)')
    cy.log('Click Add a Favorite Variable')
    cy.get('#mfb4').click({ force: true })
    cy.log('Check that favorite search loaded')
    cy.url().should('include', '#/app/help')
    cy.visitIonicAndSetApiUrl('/#/app/reminders-inbox')
    cy.log('Click Record a Measurement')
    cy.get('#mfb2').click({ force: true })
    cy.log('Check that track factors (record measurement) loaded')
    cy.url().should('include', '#/app/measurement-add-search')
    cy.visitIonicAndSetApiUrl('/#/app/reminders-inbox')
    cy.log('Click Add a Reminder')
    cy.get('#mfb1').click({ force: true })
    cy.log('Check that reminder search page loaded')
    cy.url().should('include', '#/app/reminder-search')
    cy.log('Load reminders inbox')
    cy.visitIonicAndSetApiUrl('/#/app/reminders-inbox')
    cy.get('#floatingActionButton').click({ force: true })
    cy.log('Click the - button to hide menu')
    cy.get(selectors.redMaterialButtonMinus).click({ force: true, multiple: true })
  })
})
