// load type definitions that come with Cypress module
/// <reference types="cypress" />
let variableName = 'Aaa Test Treatment'
let settingsPath = `/#/app/variable-settings/${encodeURIComponent(variableName)}`
let chartsPath = `/#/app/charts/${encodeURIComponent(variableName)}`

/**
 * @param {string} variableName
 */
function goToChartPage (variableName) {
  cy.loginWithAccessTokenIfNecessary('/#/app/chart-search', true)
  cy.wait(2000)
  searchAndClickTopResult(variableName, true)
  cy.wait(2000)
  checkChartsPage(variableName)
}
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
/**
 * @param {string} variableString
 */
function verifyAndDeleteMeasurement (variableString) {
  cy.get('#historyItemTitle').should('contain', variableString)
  cy.get('#historyItemTitle').click({ force: true })
  cy.get('button.button.destructive').click({ force: true })
  cy.log('Wait for deletion to complete')
}
/**
 * @param {string} variableName
 */
function searchForMoodFromMagnifyingGlassIcon (variableName, timeout = 1000) {
  cy.wait(1000)
  cy.get('#menu-search-button').click({ force: true })
  cy.get('md-autocomplete-wrap.md-whiteframe-z1 > input[type="search"]').click({ force: true })
  cy.get('md-autocomplete-wrap.md-whiteframe-z1 > input[type="search"]').type(variableName, { force: true })
  cy.log('Wait for filtering')
  cy.wait(timeout)
  cy.get('#variable-item-title > span', { timeout: 60000 })
        .contains(variableName)
        .click({ force: true })
}
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
 * @param {string} variableName
 */
function toastContains (variableName) {
  cy.get('.md-toast-text').should('contain', variableName)
}
/**
 * @param {number} value
 */
function recordRatingMeasurement (value) {
  cy.get(`.primary-outcome-variable-history > img:nth-of-type(${value})`).click({ force: true })
  cy.get('#saveButton').click({ force: true })
}
/**
 * @param {number} value
 */
function moodValueToImage (value) {
  let image

  if (value === 5) {
    image = 'ecstatic.png'
  } else if (value === 4) {
    image = 'happy.png'
  } else if (value === 3) {
    image = 'ok.png'
  } else if (value === 2) {
    image = 'sad.png'
  } else if (value === 1) {
    image = 'depressed.png'
  } else {
    throw `invalid mood value${value}`
  }

  return image
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
            .each(($el, _index, _$list) => {
              let html = $el.html() // $el is a wrapped jQuery element

              if (html.indexOf('showActionSheet') !== -1) {
                cy.log(`Deleting ${$el.text()} reminder`)
                cy.wrap($el).click()
                clickActionSheetButtonContaining('Delete')
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
    searchAndClickTopResult(variableName, true)
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
    clickActionSheetButtonContaining('History')
    cy.get('#historyItemTitle', { timeout: 30000 })
            .should('contain', `4/5 ${variableName}`)
    cy.get('#historyItemTitle').click({ force: true })
    cy.get('#menu-more-button').click({ force: true })
    clickActionSheetButtonContaining('Analysis Settings')
    cy.get('#variableName', { timeout: 30000 }).should('contain', variableName)
    cy.log('Waiting for action sheet button to update...')
    cy.wait(5000)
    cy.get('#menu-more-button').click({ force: true })
    clickActionSheetButtonContaining('Delete All')
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
describe('Import Data', function () {
  function goToImportPageFromInbox () {
    cy.loginWithAccessTokenIfNecessary('/#/app/reminders-inbox')
    cy.get('a[href="#/app/import"] > i.ion-ios-cloud-download-outline').click({ force: true })
  }
  it.skip('Check that we can go to demo import page without logging in', function () {
    cy.visit('https://demo.quantimo.do/#/app/import')
    cy.get('#navBarAvatar > img', { timeout: 40000 })
    cy.get('#disconnect-worldweatheronline-button', { timeout: 30000 })
            .scrollIntoView()
            .click()
  })
  it.skip('Connect Canada Weather', function () {
    cy.loginWithAccessTokenIfNecessary('/#/app/import')
    cy.get('#connect-worldweatheronline-button').click()
  })
  it.skip('Connects Tigerview', function () {
    goToImportPageFromInbox()
    cy.get('#connect-tigerview-button').click()
  })
  it('Connects Withings', function () {
    goToImportPageFromInbox()
    cy.get('#connect-withings-button', { timeout: 30000 }).click({ force: true })
    cy.url().should('contain', 'upgrade')
    // TODO: Implement check for upgrade stuff
    // cy.get('input[name="email"]').click({ force: true });
    // cy.get('input[name="password"]').click({ force: true });
    // cy.get('input[name="password"]').click({ force: true });
    // cy.get('input[name="password"]').type("{enter}", { force: true });
    // cy.get('.list-group > a.list-group-item:nth-of-type(1)').click({ force: true });
    // cy.get('button[name="authorized"].btn.btn-main.dark-blue').click({ force: true });
    // cy.get('#disconnect-withings-button').click({ force: true });
    // cy.get('i.ion-ios-gear-outline').click({ force: true });
    // cy.get('#userName > p').click({ force: true });
    // cy.get('#yesButton > span').click({ force: true });
  })
})
describe('Variables', function () {
  /**
   * @param {string} variableCategoryName
   */
  function recordMeasurementForNewVariableAndDeleteIt (variableCategoryName) {
    cy.loginWithAccessTokenIfNecessary(`/#/app/measurement-add-search?variableCategoryName=${variableCategoryName}`,
      true)
    let d = new Date()
    let variableString = `Unique Test Variable ${d.toString()}`

    //let variableString = Math.round(d.getTime() / 1000) + " Unique Test Variable";
    cy.get('#variableSearchBox').type(variableString, { force: true })
    cy.get('#new-variable-button', { timeout: 30000 }).click({ force: true })
    cy.get('#variableCategorySelector').type(variableCategoryName, { force: true })
    cy.get('.primary-outcome-variable-history > img:nth-of-type(3)').click({ force: true })
    cy.get('#saveButton').click({ force: true })
    cy.wait(10000)
    cy.visit(`/#/app/history-all?variableCategoryName=${variableCategoryName}`)
    verifyAndDeleteMeasurement(variableString)

    return variableString
  }
  it('Goes to predictors page from the variable action sheet', function () {
    cy.loginWithAccessTokenIfNecessary('/#/app/reminders-inbox', true)
    let variableName = 'Overall Mood'

    searchForMoodFromMagnifyingGlassIcon(variableName, 20000)
    clickActionSheetButtonContaining('Predictors')
    cy.get('.item.item-avatar > p', { timeout: 90000 }).should('contain', variableName)
  })
  it('Changes and resets variable settings', function () {
    let max = '10000'
    let min = '1'
    let delay = '2'
    let duration = '5'
    let filling = '0'

    cy.loginWithAccessTokenIfNecessary(settingsPath)
    cy.wait(10000)
    cy.get('#resetButton')
            .click({ force: true })
    cy.wait(10000)
    cy.assertInputValueEquals('#minimumAllowedValue', '0')
    cy.clearAndType('#minimumAllowedValue', min)
    cy.clearAndType('#maximumAllowedValue', max)
    cy.clearAndType('#onsetDelay', delay)
    cy.clearAndType('#durationOfAction', duration)
    cy.clearAndType('#fillingValue', filling)
    cy.get('#saveButton').click({ force: true })
    cy.get('#helpInfoCardHeader > span:nth-child(2) > p', { timeout: 30000 })
    cy.url().should('not.contain', 'variable-settings')
    cy.visit(settingsPath)
    //cy.assertInputValueContains('#minimumAllowedValue', min);
    //cy.assertInputValueEquals('#maximumAllowedValue', max);
    cy.assertInputValueEquals('#onsetDelay', delay)
    cy.assertInputValueEquals('#durationOfAction', duration)
    cy.assertInputValueEquals('#fillingValue', filling)
    cy.get('#resetButton').click({ force: true })
    cy.wait(15000)
    //cy.url().should('not.contain', 'variable-settings');
    //cy.visit(settingsPath);
    cy.assertInputValueEquals('#minimumAllowedValue', '0')
    cy.assertInputValueDoesNotContain('#maximumAllowedValue', max)
    cy.assertInputValueEquals('#onsetDelay', '0.5')
    cy.assertInputValueEquals('#durationOfAction', '504')
  })
  it('Goes to variable settings from chart page', function () {
    cy.loginWithAccessTokenIfNecessary('/#/app/chart-search')
    searchAndClickTopResult(variableName, true)
    cy.url().should('contain', chartsPath)
    let chartTitleSelector = '#app-container > ion-side-menu-content > ion-nav-view > ion-view > ion-content > div.scroll > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > h2'

    cy.get(chartTitleSelector, { timeout: 30000 }).then(() => { // Need to wait for variable for action sheet to work
      cy.containsCaseInsensitive(chartTitleSelector, variableName)
      cy.clickActionSheetButton(6)
      cy.wait(2000)
      cy.url().should('contain', settingsPath)
    })
  })
  it('Creates a new emotion variable by measurement', function () {
    let variableCategoryName = 'Emotions'

    recordMeasurementForNewVariableAndDeleteIt(variableCategoryName)
  })
  it('Creates a new symptom rating variable by measurement', function () {
    let variableCategoryName = 'Symptoms'

    recordMeasurementForNewVariableAndDeleteIt(variableCategoryName)
  })
  it('Tries all the buttons in the variable action sheet', function () {
    cy.loginWithAccessTokenIfNecessary('/#/app/reminders-inbox', true)
    let variableName = 'Overall Mood'

    searchForMoodFromMagnifyingGlassIcon(variableName, 15000)
    clickActionSheetButtonContaining('Charts')
    checkChartsPage(variableName)
    searchForMoodFromMagnifyingGlassIcon(variableName)
    clickActionSheetButtonContaining('Record Measurement')
    recordRatingMeasurement(3)
    searchForMoodFromMagnifyingGlassIcon(variableName)
    clickActionSheetButtonContaining('Add Reminder')
    toastContains(variableName)
    searchForMoodFromMagnifyingGlassIcon(variableName)
    clickActionSheetButtonContaining('Create Study')
    cy.get('#effectVariableName').should('contain', variableName)
    searchForMoodFromMagnifyingGlassIcon(variableName)
  })
})
describe('Favorites', function () {
  it.skip('Adds a favorite and records a measurement with it', function () {
    cy.loginWithAccessTokenIfNecessary('/#/app/favorites')
    let record100mgSelector = '#recordDefaultValue > i'

    cy.log('Click add a favorite variable')
    cy.get('#addFavoriteBtn').click({ force: true })
    searchAndClickTopResult('Aaa Test Treatment', true)
    cy.get('#moreOptions').click({ force: true })
    cy.log('Assign default value to 100mg')
    cy.get('#defaultValue').type('100', { force: true })
    cy.get('#saveButton').click({ force: true })
    cy.log('Wait for favorite to save so we are not redirected back to favoriteAdd')
    cy.wait(9000)
    cy.visit('/#/app/favorites')
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
            .each(($el, _index, _$list) => {
              cy.log(`Deleting ${$el.text()} reminder`)
              cy.wrap($el).click()
              clickActionSheetButtonContaining('Delete')
            })
    cy.log('Since there are no favorites, the explanation card is showing')
    //cy.get("#noFavoritesExplanation").should('exist');
    cy.log('There is no favorites list since there are no favorites')
    //cy.get("#favoritesList").should('not.exist');
    cy.log('Posted value from second click')
    cy.visit('/#/app/history-all?variableCategoryName=Treatments')
    cy.get('#historyItemTitle', { timeout: 20000 }).should('contain', '200 mg Aaa Test Treatment')
  })
})
describe('Charts', function () {
  it('Looks at primary outcome charts', function () {
    cy.visit('/#/app/track')
    cy.get('div.primary-outcome-variable-rating-buttons > img:nth-child(4)').click({ force: true })
    cy.get('g.highcharts-series > rect:nth-of-type(1)').should('exist')
    cy.get('#distributionChart > div > svg > text.highcharts-title > tspan')
            .should('contain', 'Mood Distribution')
    cy.log('Use the scroll bar to see the charts below')
    cy.get('div.scroll-bar.scroll-bar-v > div')
    cy.get('#lineChart > div > svg > text > tspan').should('contain', 'Mood Over Time')
    cy.get('#distributionChart > div > svg > g:nth-child(9)').should('exist')
  })
  it('Goes to variable settings from charts page', function () {
    goToChartPage('Aaa Test Treatment')
    cy.get('ion-view.pane > ion-content.scroll-content.ionic-scroll.has-header').click({ force: true })
    cy.get('#menu-more-button').click({ force: true })
    clickActionSheetButtonContaining('Settings')
  })
  it('Records a measurement and sees it in a chart', function () {
    //cy.loginWithAccessTokenIfNecessary(`/#/app/measurement-add-search?variableCategoryName=Treatments`, true);
    //recordTreatmentMeasurement();
    let variableName = 'Aaa Test Treatment'

    goToChartPage(variableName)
    cy.get('#recordMeasurementButton').click({ force: true })
    cy.get('#measurementAddCard > div').should('contain', variableName)
    cy.get('#cancelButton').click({ force: true })
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
    cy.visit('/#/app/reminders-inbox')
    cy.log('Click Record a Measurement')
    cy.get('#mfb2').click({ force: true })
    cy.log('Check that track factors (record measurement) loaded')
    cy.url().should('include', '#/app/measurement-add-search')
    cy.visit('/#/app/reminders-inbox')
    cy.log('Click Add a Reminder')
    cy.get('#mfb1').click({ force: true })
    cy.log('Check that reminder search page loaded')
    cy.url().should('include', '#/app/reminder-search')
    cy.log('Load reminders inbox')
    cy.visit('/#/app/reminders-inbox')
    cy.get('#floatingActionButton').click({ force: true })
    cy.log('Click the - button to hide menu')
    cy.get(selectors.redMaterialButtonMinus).click({ force: true, multiple: true })
  })
})
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
})
describe('Correlation List', function () {
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
