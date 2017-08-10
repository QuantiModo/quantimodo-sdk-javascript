# Quantimodo.TrackingReminder

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **Number** | id | [optional] 
**clientId** | **String** | clientId | [optional] 
**userId** | **Number** | ID of User | [optional] 
**variableId** | **Number** | Id for the variable to be tracked | [optional] 
**defaultValue** | **Number** | Default value to use for the measurement when tracking | [optional] 
**reminderStartTime** | **String** | Earliest time of day at which reminders should appear in UTC HH:MM:SS format | [optional] 
**reminderEndTime** | **String** | Latest time of day at which reminders should appear in UTC HH:MM:SS format | [optional] 
**reminderSound** | **String** | String identifier for the sound to accompany the reminder | [optional] 
**reminderFrequency** | **Number** | Number of seconds between one reminder and the next | 
**popUp** | **Boolean** | True if the reminders should appear as a popup notification | [optional] 
**sms** | **Boolean** | True if the reminders should be delivered via SMS | [optional] 
**email** | **Boolean** | True if the reminders should be delivered via email | [optional] 
**notificationBar** | **Boolean** | True if the reminders should appear in the notification bar | [optional] 
**latestTrackingReminderNotificationReminderTime** | **Date** | UTC ISO 8601 &#x60;YYYY-MM-DDThh:mm:ss&#x60;  timestamp for the reminder time of the latest tracking reminder notification that has been pre-emptively generated in the database | [optional] 
**lastTracked** | **Date** | UTC ISO 8601 &#x60;YYYY-MM-DDThh:mm:ss&#x60;  timestamp for the last time a measurement was received for this user and variable | [optional] 
**startTrackingDate** | **String** | Earliest date on which the user should be reminded to track in YYYY-MM-DD format | [optional] 
**stopTrackingDate** | **String** | Latest date on which the user should be reminded to track in YYYY-MM-DD format | [optional] 
**updatedAt** | **Date** | When the record in the database was last updated. Use UTC ISO 8601 &#x60;YYYY-MM-DDThh:mm:ss&#x60;  datetime format. Time zone should be UTC and not local. | [optional] 
**variableName** | **String** | Name of the variable to be used when sending measurements | 
**variableCategoryName** | **String** | Name of the variable category to be used when sending measurements | 
**unitAbbreviatedName** | **String** | Abbreviated name of the unit to be used when sending measurements | 
**combinationOperation** | **String** | The way multiple measurements are aggregated over time | [optional] 
**createdAt** | **Date** | Example: 2016-05-18 02:24:08 | [optional] 
**trackingReminderId** | **Number** | Example: 11841 | [optional] 
**defaultUnitId** | **Number** | Example: 10 | [optional] 
**variableDescription** | **String** | Example: negative | [optional] 
**valence** | **String** | Example: negative | [optional] 
**ionIcon** | **String** | Example: ion-sad-outline | [optional] 
**variableCategoryId** | **Number** | Example: 10 | [optional] 
**lastValue** | **Number** | Example: 2 | [optional] 
**secondToLastValue** | **Number** | Example: 1 | [optional] 
**thirdToLastValue** | **Number** | Example: 3 | [optional] 
**userVariableDefaultUnitId** | **Number** | Example: 10 | [optional] 
**userVariableVariableCategoryId** | **Number** | Example: 10 | [optional] 
**numberOfRawMeasurements** | **Number** | Example: 445 | [optional] 
**svgUrl** | **String** | Example: https://app.quantimo.do/ionic/Modo/www/img/variable_categories/symptoms.svg | [optional] 
**pngUrl** | **String** | Example: https://app.quantimo.do/ionic/Modo/www/img/variable_categories/symptoms.png | [optional] 
**pngPath** | **String** | Example: img/variable_categories/symptoms.png | [optional] 
**variableCategoryImageUrl** | **String** | Example: https://maxcdn.icons8.com/Color/PNG/96/Messaging/sad-96.png | [optional] 
**manualTracking** | **Boolean** | Example: 1 | [optional] 
**userVariableVariableCategoryName** | **String** | Example: Symptoms | [optional] 
**reminderStartTimeLocal** | **Date** | Example: 21:45:20 | [optional] 
**reminderStartTimeLocalHumanFormatted** | **Date** | Example: 09:45 PM | [optional] 
**lastValueInUserVariableDefaultUnit** | **Number** | Example: 2 | [optional] 
**secondToLastValueInUserVariableDefaultUnit** | **Number** | Example: 1 | [optional] 
**thirdToLastValueInUserVariableDefaultUnit** | **Number** | Example: 3 | [optional] 
**unitId** | **Number** | Example: 10 | [optional] 
**unitName** | **String** | Example: 1 to 5 Rating | [optional] 
**unitCategoryId** | **Number** | Example: 5 | [optional] 
**unitCategoryName** | **String** | Example: Rating | [optional] 
**defaultUnitName** | **String** | Example: 1 to 5 Rating | [optional] 
**defaultUnitAbbreviatedName** | **String** | Example: /5 | [optional] 
**defaultUnitCategoryId** | **Number** | Example: 5 | [optional] 
**defaultUnitCategoryName** | **String** | Example: Rating | [optional] 
**userVariableDefaultUnitName** | **String** | Example: 1 to 5 Rating | [optional] 
**userVariableDefaultUnitAbbreviatedName** | **String** | Example: /5 | [optional] 
**userVariableDefaultUnitCategoryId** | **Number** | Example: 5 | [optional] 
**userVariableDefaultUnitCategoryName** | **String** | Example: Rating | [optional] 
**minimumAllowedValue** | **Number** | Example: 1 | [optional] 
**maximumAllowedValue** | **Number** | Example: 5 | [optional] 
**inputType** | **String** | Example: saddestFaceIsFive | [optional] 
**reminderStartEpochSeconds** | **Number** | Example: 1469760320 | [optional] 
**nextReminderTimeEpochSeconds** | **Number** | Example: 1501555520 | [optional] 
**firstDailyReminderTime** | **Date** | Example: 02:45:20 | [optional] 
**frequencyTextDescription** | **String** | Example: Daily | [optional] 
**frequencyTextDescriptionWithTime** | **String** | Example: Daily at 09:45 PM | [optional] 
**valueAndFrequencyTextDescription** | **String** | Example: Rate daily | [optional] 
**valueAndFrequencyTextDescriptionWithTime** | **String** | Example: Rate daily at 09:45 PM | [optional] 
**fillingValue** | **Number** | Example: 0 | [optional] 
**availableDefaultUnits** | [**[Unit]**](Unit.md) |  | [optional] 
**localDailyReminderNotificationTimes** | **[String]** |  | [optional] 
**localDailyReminderNotificationTimesForAllReminders** | **[String]** |  | [optional] 
**repeating** | **Boolean** | Example: true | [optional] 
**numberOfUniqueValues** | **Number** | Example: 1 | [optional] 
**instructions** | **String** | Example: I am an instruction! | [optional] 
**secondDailyReminderTime** | **Date** | Example: 01:00:00 | [optional] 
**thirdDailyReminderTime** | **Date** | Example: 20:00:00 | [optional] 
**errorMessage** | **String** | Example: reminderStartTimeLocal is less than  $user-&gt;earliestReminderTime or greater than  $user-&gt;latestReminderTime | [optional] 
**trackingReminderImageUrl** | **String** | Example: Not Found | [optional] 


<a name="CombinationOperationEnum"></a>
## Enum: CombinationOperationEnum


* `MEAN` (value: `"MEAN"`)

* `SUM` (value: `"SUM"`)




