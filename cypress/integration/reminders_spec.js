// load type definitions that come with Cypress module
/// <reference types="cypress" />

/**
 * @param {string} path
 */
function visitAndCheckUrl (path) {
  cy.visit(path)
  cy.wait(2000)
  cy.url().should('include', path)
}
describe('Reminders', function () {
  /**
   * @param {string} variableCategoryName
   */
  function goToCategoryInbox (variableCategoryName) {
    visitAndCheckUrl(`/#/app/reminders-inbox?variableCategoryName=${variableCategoryName}`)
    cy.get('#TodayReminders', { timeout: 40000 }).should('exist')
    cy.get('#TodayReminders').children().should('have.length.above', 0)
  }
  /**
   * @param {string} frequency
   */
  function setFrequency (frequency) {
    cy.log(`Setting frequency to ${frequency}`)
    cy.get('#frequencySelectorMaterial').click()
      cy.get('md-option').contains(frequency).click({force: true})
  }
  /**
   * @param {number} hour
   * @param {number} minute
   * @param {string} ampm
   */
  function setReminderTime (hour, minute, ampm) {
    cy.log(`Change to ${hour}:${minute} ${ampm} (We want this to be slightly later than other reminders so its always at the top of ` +
            'the reminder inbox.  (Warning: This will fail for 15 minutes every day)')
    cy.get('#materialFirstReminderStartTime', { timeout: 30000 }).click({ force: true })
    cy.get('.dtp-picker-time').contains(hour).click()
    cy.wait(1000)
    cy.get('a').contains(ampm).click()
    cy.wait(1000)
    cy.get('.dtp-picker-time').contains(minute).click()
    cy.wait(1000)
    cy.get('.dtp-btn-ok').contains('OK').click()
    cy.wait(1000)
  }
  function deleteReminders () {
    cy.log('Deleting reminders...')
    cy.wait(1000)
    let reminderListSelector = '#remindersList > div'
    let deleted = false

    cy.get(reminderListSelector, { timeout: 30000 })
    // eslint-disable-next-line no-unused-vars
            .each(($el, _index, _$list) => {
              let html = $el.html() // $el is a wrapped jQuery element

              if (html.indexOf('showActionSheet') !== -1 && $el.is('visible')) {
                cy.log(`Deleting ${$el.text()} reminder`)
                cy.wrap($el).click()
                cy.clickActionSheetButtonContaining('Delete')
                deleted = true
              } else {
                // It's a header
              }
            })
    if (deleted) {
      cy.log('Waiting for deletions to post...')
      cy.wait(5000)
    }
  }
  /**
   * @param {string} unitName
   */
  function changeUnit (unitName) {
    cy.log(`Changing unit to ${unitName}`)
    cy.get('#unitSelectorMaterial').click()
    cy.get('md-option').contains(unitName).click({ force: true })
  }
  /**
   * @param {string} variableName
   * @param {string} [frequency]
   */
  function addReminder (variableName, frequency) {
    cy.log(`Click Add new reminder for ${variableName}`)
    cy.get('#addReminderButton').click({ force: true })
    cy.searchAndClickTopResult(variableName, true)
    cy.get('#reminder-header').should('contain', variableName)
    if (frequency) {
      setFrequency(frequency)
    }
  }
  /**
   * @param {string} variableCategoryName
   */
  function getManagePathForCategory (variableCategoryName) {
    return `/#/app/variable-list-category/${variableCategoryName}`
  }
  /**
   * @param {string} variableName
   * @param {string} frequency
   * @param {string} variableCategoryName
   */
  function deleteRemindersAddOneAndGoToCategoryInbox (variableName, frequency, variableCategoryName) {
    deleteReminders()
    addReminder(variableName, frequency)
    saveReminderAndGoToCategoryInbox(variableCategoryName)
  }
  /**
   * @param {string} variableCategoryName
   */
  function saveReminderAndGoToCategoryInbox (variableCategoryName) {
    cy.get('#saveButton').click({ force: true })
    cy.wait(25000) // Have to wait for save to complete
    goToCategoryInbox(variableCategoryName)
  }
  it('Create a nutrient reminder and skip it', function () {
    let variableName = 'Aaa Test Reminder Skip'
    let variableCategoryName = 'Nutrients'
    let frequency = '30 minutes'
    let manageUrl = getManagePathForCategory(variableCategoryName)

    cy.loginWithAccessTokenIfNecessary(manageUrl)
    deleteRemindersAddOneAndGoToCategoryInbox(variableName, frequency, variableCategoryName)
    cy.get('#notification-skip').click({ force: true })
    cy.get('#notification-skip').should('not.exist')
    cy.visit(manageUrl)
    deleteReminders()
  })
  it('Creates a sleep reminder and changes unit', function () {
    let variableName = 'Sleep Duration'
    let variableCategoryName = 'Sleep'
    let manageUrl = getManagePathForCategory(variableCategoryName)

    cy.loginWithAccessTokenIfNecessary(manageUrl)
    deleteReminders()
    addReminder(variableName)
    cy.get('#defaultValue').should('not.exist')
    let hour = 8
    let minute = 15
    let ampm = 'AM'

    setReminderTime(hour, minute, ampm)
    cy.get('#saveButton').click({ force: true })
    cy.visit(manageUrl)
    cy.log('Should not contain reminder time because the frequency is below a day')
    //let firstReminderTime = '#remindersList > div > div > div:nth-child(1) > div.col.col-70 > p';
    let firstReminderTime = '#remindersList'
    let time = `${hour}:${minute}`

    //assertReminderListContains(time);
    cy.get(firstReminderTime).should('contain', time)
    cy.wait(25000) // Have to wait for save to complete
    goToCategoryInbox(variableCategoryName)
    cy.get('#notification-settings').click({ force: true })
    cy.url().should('include', '#/app/reminder-add/')
    cy.get('#reminder-header').should('contain', variableName)
    changeUnit('Minutes')
    saveReminderAndGoToCategoryInbox(variableCategoryName)
    cy.log('Click Record different value/time')
    cy.get('#other-value-time-note-button').click({ force: true })
    cy.url().should('include', '#/app/measurement-add')
    //cy.get('#measurementAddCard > div', {timeout: 10000}).should('contain', variableName);
    //cy.get('#defaultValue').type("480", {force: true});
    cy.visit(manageUrl)
    deleteReminders()
  })
  it('Deletes reminders', function () {
    let path = getManagePathForCategory('Sleep')

    cy.loginWithAccessTokenIfNecessary(path, true)
    deleteReminders()
  })
  it('Creates a food reminder and snoozes it', function () {
    let variableName = 'Aaa Test Reminder Snooze'
    let variableCategoryName = 'Foods'
    let frequency = '30 minutes'
    let manageUrl = getManagePathForCategory(variableCategoryName)

    cy.loginWithAccessTokenIfNecessary(manageUrl)
    deleteRemindersAddOneAndGoToCategoryInbox(variableName, frequency, variableCategoryName)
    cy.get('#notification-snooze').click({ force: true })
    cy.get('#notification-snooze').should('not.exist')
    cy.visit(manageUrl)
    deleteReminders()
  })
  it('Creates a symptoms reminder and tracks it', function () {
    let variableName = 'Aaa Test Reminder Variable'
    let variableCategoryName = 'Symptoms'
    let manageUrl = getManagePathForCategory(variableCategoryName)
    let frequency = '30 minutes'

    cy.loginWithAccessTokenIfNecessary(manageUrl)
    deleteRemindersAddOneAndGoToCategoryInbox(variableName, frequency, variableCategoryName)
    cy.get('#negativeRatingOptions4').click({ force: true })
    cy.visit(`/#/app/charts/${variableName}`)
    cy.get('#menu-more-button').click({ force: true })
    cy.clickActionSheetButtonContaining('History')
    cy.get('#historyItemTitle', { timeout: 30000 })
            .should('contain', `4/5 ${variableName}`)
    cy.get('#historyItemTitle').click({ force: true })
    cy.get('#menu-more-button').click({ force: true })
    cy.clickActionSheetButtonContaining('Analysis Settings')
    cy.get('#variableName', { timeout: 30000 }).should('contain', variableName)
    cy.log('Waiting for action sheet button to update...')
    cy.wait(5000)
    cy.get('#menu-more-button').click({ force: true })
    cy.clickActionSheetButtonContaining('Delete All')
    cy.get('#yesButton').click({ force: true })
    cy.visit(manageUrl)
    cy.wait(15000)
    deleteReminders()
  })
  it('Selects a reminder time', function () {
    cy.loginWithAccessTokenIfNecessary('/#/app/reminder-add/', false)
    setReminderTime(8, 15, 'AM')
  })
  it('Sets frequency to 30 minutes', function () {
    cy.loginWithAccessTokenIfNecessary('/#/app/reminder-add/', false)
    setFrequency('30 minutes')
  })
  it('Changes unit', function () {
    cy.loginWithAccessTokenIfNecessary('/#/app/reminder-add/', false)
    changeUnit('Minutes')
  })
})
