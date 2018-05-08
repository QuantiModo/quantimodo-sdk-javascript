# Quantimodo.TrackingReminder

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**actionArray** | [**[TrackingReminderNotificationAction]**](TrackingReminderNotificationAction.md) |  | [optional] 
**availableUnits** | [**[Unit]**](Unit.md) |  | [optional] 
**clientId** | **String** | clientId | [optional] 
**combinationOperation** | **String** | The way multiple measurements are aggregated over time | [optional] 
**createdAt** | **String** | Example: 2016-05-18 02:24:08 UTC ISO 8601 YYYY-MM-DDThh:mm:ss | [optional] 
**displayName** | **String** | Example: Trader Joe&#39;s Bedtime Tea | [optional] 
**unitAbbreviatedName** | **String** | Example: /5 | 
**unitCategoryId** | **Number** | Example: 5 | [optional] 
**unitCategoryName** | **String** | Example: Rating | [optional] 
**unitId** | **Number** | Example: 10 | [optional] 
**unitName** | **String** | Example: 1 to 5 Rating | [optional] 
**defaultValue** | **Number** | Default value to use for the measurement when tracking | [optional] 
**email** | **Boolean** | True if the reminders should be delivered via email | [optional] 
**errorMessage** | **String** | Example: reminderStartTimeLocal is less than $user-&gt;earliestReminderTime or greater than  $user-&gt;latestReminderTime | [optional] 
**fillingValue** | **Number** | Example: 0 | [optional] 
**firstDailyReminderTime** | **String** | Example: 02:45:20 in UTC timezone | [optional] 
**frequencyTextDescription** | **String** | Example: Daily | [optional] 
**frequencyTextDescriptionWithTime** | **String** | Example: Daily at 09:45 PM | [optional] 
**id** | **Number** | id | [optional] 
**inputType** | **String** | Example: saddestFaceIsFive | [optional] 
**instructions** | **String** | Example: I am an instruction! | [optional] 
**ionIcon** | **String** | Example: ion-sad-outline | [optional] 
**lastTracked** | **String** | UTC ISO 8601 YYYY-MM-DDThh:mm:ss timestamp for the last time a measurement was received for this user and variable | [optional] 
**lastValue** | **Number** | Example: 2 | [optional] 
**latestTrackingReminderNotificationReminderTime** | **String** | UTC ISO 8601 YYYY-MM-DDThh:mm:ss  timestamp for the reminder time of the latest tracking reminder notification that has been pre-emptively generated in the database | [optional] 
**localDailyReminderNotificationTimes** | **[String]** |  | [optional] 
**localDailyReminderNotificationTimesForAllReminders** | **[String]** |  | [optional] 
**manualTracking** | **Boolean** | Example: 1 | [optional] 
**maximumAllowedValue** | **Number** | Example: 5 | [optional] 
**minimumAllowedValue** | **Number** | Example: 1 | [optional] 
**nextReminderTimeEpochSeconds** | **Number** | Example: 1501555520 | [optional] 
**notificationBar** | **Boolean** | True if the reminders should appear in the notification bar | [optional] 
**numberOfRawMeasurements** | **Number** | Example: 445 | [optional] 
**numberOfUniqueValues** | **Number** | Example: 1 | [optional] 
**outcome** | **Boolean** | Indicates whether or not the variable is usually an outcome of interest such as a symptom or emotion | [optional] 
**pngPath** | **String** | Example: img/variable_categories/symptoms.png | [optional] 
**pngUrl** | **String** | Example: https://app.quantimo.do/ionic/Modo/www/img/variable_categories/symptoms.png | [optional] 
**productUrl** | **String** | Link to associated product for purchase | [optional] 
**popUp** | **Boolean** | True if the reminders should appear as a popup notification | [optional] 
**question** | **String** | Example: How is your overall mood? | [optional] 
**reminderEndTime** | **String** | Latest time of day at which reminders should appear in UTC HH:MM:SS format | [optional] 
**reminderFrequency** | **Number** | Number of seconds between one reminder and the next | 
**reminderSound** | **String** | String identifier for the sound to accompany the reminder | [optional] 
**reminderStartEpochSeconds** | **Number** | Example: 1469760320 | [optional] 
**reminderStartTime** | **String** | Earliest time of day at which reminders should appear in UTC HH:MM:SS format | [optional] 
**reminderStartTimeLocal** | **String** | Example: 21:45:20 | [optional] 
**reminderStartTimeLocalHumanFormatted** | **String** | Example: 09:45 PM | [optional] 
**repeating** | **Boolean** | Example: true | [optional] 
**secondDailyReminderTime** | **String** | Example: 01:00:00 | [optional] 
**secondToLastValue** | **Number** | Example: 1 | [optional] 
**sms** | **Boolean** | True if the reminders should be delivered via SMS | [optional] 
**startTrackingDate** | **String** | Earliest date on which the user should be reminded to track in YYYY-MM-DD format | [optional] 
**stopTrackingDate** | **String** | Latest date on which the user should be reminded to track in YYYY-MM-DD format | [optional] 
**svgUrl** | **String** | Example: https://app.quantimo.do/ionic/Modo/www/img/variable_categories/symptoms.svg | [optional] 
**thirdDailyReminderTime** | **String** | Example: 20:00:00 | [optional] 
**thirdToLastValue** | **Number** | Example: 3 | [optional] 
**trackingReminderId** | **Number** | Example: 11841 | [optional] 
**trackingReminderImageUrl** | **String** | Example: Not Found | [optional] 
**upc** | **String** | UPC or other barcode scan result | [optional] 
**updatedAt** | **String** | When the record in the database was last updated. Use UTC ISO 8601 YYYY-MM-DDThh:mm:ss  datetime format. Time zone should be UTC and not local. | [optional] 
**userId** | **Number** | ID of User | [optional] 
**userVariableUnitAbbreviatedName** | **String** | Example: /5 | [optional] 
**userVariableUnitCategoryId** | **Number** | Example: 5 | [optional] 
**userVariableUnitCategoryName** | **String** | Example: Rating | [optional] 
**userVariableUnitId** | **Number** | Example: 10 | [optional] 
**userVariableUnitName** | **String** | Example: 1 to 5 Rating | [optional] 
**userVariableVariableCategoryId** | **Number** | Example: 10 | [optional] 
**userVariableVariableCategoryName** | **String** | Example: Symptoms | [optional] 
**valence** | **String** | Example: negative | [optional] 
**valueAndFrequencyTextDescription** | **String** | Example: Rate daily | [optional] 
**valueAndFrequencyTextDescriptionWithTime** | **String** | Example: Rate daily at 09:45 PM | [optional] 
**variableCategoryId** | **Number** | Example: 10 | [optional] 
**variableCategoryImageUrl** | **String** | Example: https://maxcdn.icons8.com/Color/PNG/96/Messaging/sad-96.png | [optional] 
**variableCategoryName** | **String** | Name of the variable category to be used when sending measurements | 
**variableDescription** | **String** | Example: negative | [optional] 
**variableId** | **Number** | Id for the variable to be tracked | [optional] 
**variableName** | **String** | Name of the variable to be used when sending measurements | 


<a name="CombinationOperationEnum"></a>
## Enum: CombinationOperationEnum


* `MEAN` (value: `"MEAN"`)

* `SUM` (value: `"SUM"`)




