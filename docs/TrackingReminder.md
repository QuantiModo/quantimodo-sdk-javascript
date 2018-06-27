# Quantimodo.TrackingReminder

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**actionArray** | [**[TrackingReminderNotificationAction]**](TrackingReminderNotificationAction.md) |  | [optional] 
**availableUnits** | [**[Unit]**](Unit.md) |  | [optional] 
**clientId** | **String** | Your QuantiModo client id can be obtained by creating an app at https://builder.quantimo.do | [optional] 
**combinationOperation** | **String** | The way multiple measurements are aggregated over time | [optional] 
**createdAt** | **String** | Ex: 2016-05-18 02:24:08 UTC ISO 8601 YYYY-MM-DDThh:mm:ss | [optional] 
**displayName** | **String** | Ex: Trader Joe&#39;s Bedtime Tea | [optional] 
**unitAbbreviatedName** | **String** | Ex: /5 | 
**unitCategoryId** | **Number** | Ex: 5 | [optional] 
**unitCategoryName** | **String** | Ex: Rating | [optional] 
**unitId** | **Number** | Ex: 10 | [optional] 
**unitName** | **String** | Ex: 1 to 5 Rating | [optional] 
**defaultValue** | **Number** | Default value to use for the measurement when tracking | [optional] 
**email** | **Boolean** | True if the reminders should be delivered via email | [optional] 
**errorMessage** | **String** | Ex: reminderStartTimeLocal is less than $user-&gt;earliestReminderTime or greater than  $user-&gt;latestReminderTime | [optional] 
**fillingValue** | **Number** | Ex: 0 | [optional] 
**firstDailyReminderTime** | **String** | Ex: 02:45:20 in UTC timezone | [optional] 
**frequencyTextDescription** | **String** | Ex: Daily | [optional] 
**frequencyTextDescriptionWithTime** | **String** | Ex: Daily at 09:45 PM | [optional] 
**id** | **Number** | id | [optional] 
**inputType** | **String** | Ex: saddestFaceIsFive | [optional] 
**instructions** | **String** | Ex: I am an instruction! | [optional] 
**ionIcon** | **String** | Ex: ion-sad-outline | [optional] 
**lastTracked** | **String** | UTC ISO 8601 YYYY-MM-DDThh:mm:ss timestamp for the last time a measurement was received for this user and variable | [optional] 
**lastValue** | **Number** | Ex: 2 | [optional] 
**latestTrackingReminderNotificationReminderTime** | **String** | UTC ISO 8601 YYYY-MM-DDThh:mm:ss  timestamp for the reminder time of the latest tracking reminder notification that has been pre-emptively generated in the database | [optional] 
**localDailyReminderNotificationTimes** | **[String]** |  | [optional] 
**localDailyReminderNotificationTimesForAllReminders** | **[String]** |  | [optional] 
**manualTracking** | **Boolean** | Ex: 1 | [optional] 
**maximumAllowedValue** | **Number** | Ex: 5 | [optional] 
**minimumAllowedValue** | **Number** | Ex: 1 | [optional] 
**nextReminderTimeEpochSeconds** | **Number** | Ex: 1501555520 | [optional] 
**notificationBar** | **Boolean** | True if the reminders should appear in the notification bar | [optional] 
**numberOfRawMeasurements** | **Number** | Ex: 445 | [optional] 
**numberOfUniqueValues** | **Number** | Ex: 1 | [optional] 
**outcome** | **Boolean** | Indicates whether or not the variable is usually an outcome of interest such as a symptom or emotion | [optional] 
**pngPath** | **String** | Ex: img/variable_categories/symptoms.png | [optional] 
**pngUrl** | **String** | Ex: https://quantimodo.quantimo.do/ionic/Modo/www/img/variable_categories/symptoms.png | [optional] 
**productUrl** | **String** | Link to associated product for purchase | [optional] 
**popUp** | **Boolean** | True if the reminders should appear as a popup notification | [optional] 
**question** | **String** | Ex: How is your overall mood? | [optional] 
**reminderEndTime** | **String** | Latest time of day at which reminders should appear in UTC HH:MM:SS format | [optional] 
**reminderFrequency** | **Number** | Number of seconds between one reminder and the next | 
**reminderSound** | **String** | String identifier for the sound to accompany the reminder | [optional] 
**reminderStartEpochSeconds** | **Number** | Ex: 1469760320 | [optional] 
**reminderStartTime** | **String** | Earliest time of day at which reminders should appear in UTC HH:MM:SS format | [optional] 
**reminderStartTimeLocal** | **String** | Ex: 21:45:20 | [optional] 
**reminderStartTimeLocalHumanFormatted** | **String** | Ex: 09:45 PM | [optional] 
**repeating** | **Boolean** | Ex: true | [optional] 
**secondDailyReminderTime** | **String** | Ex: 01:00:00 | [optional] 
**secondToLastValue** | **Number** | Ex: 1 | [optional] 
**sms** | **Boolean** | True if the reminders should be delivered via SMS | [optional] 
**startTrackingDate** | **String** | Earliest date on which the user should be reminded to track in YYYY-MM-DD format | [optional] 
**stopTrackingDate** | **String** | Latest date on which the user should be reminded to track in YYYY-MM-DD format | [optional] 
**svgUrl** | **String** | Ex: https://quantimodo.quantimo.do/ionic/Modo/www/img/variable_categories/symptoms.svg | [optional] 
**thirdDailyReminderTime** | **String** | Ex: 20:00:00 | [optional] 
**thirdToLastValue** | **Number** | Ex: 3 | [optional] 
**trackingReminderId** | **Number** | Ex: 11841 | [optional] 
**trackingReminderImageUrl** | **String** | Ex: Not Found | [optional] 
**upc** | **String** | UPC or other barcode scan result | [optional] 
**updatedAt** | **String** | When the record in the database was last updated. Use UTC ISO 8601 YYYY-MM-DDThh:mm:ss  datetime format. Time zone should be UTC and not local. | [optional] 
**userId** | **Number** | ID of User | [optional] 
**userVariableUnitAbbreviatedName** | **String** | Ex: /5 | [optional] 
**userVariableUnitCategoryId** | **Number** | Ex: 5 | [optional] 
**userVariableUnitCategoryName** | **String** | Ex: Rating | [optional] 
**userVariableUnitId** | **Number** | Ex: 10 | [optional] 
**userVariableUnitName** | **String** | Ex: 1 to 5 Rating | [optional] 
**userVariableVariableCategoryId** | **Number** | Ex: 10 | [optional] 
**userVariableVariableCategoryName** | **String** | Ex: Symptoms | [optional] 
**valence** | **String** | Ex: negative | [optional] 
**valueAndFrequencyTextDescription** | **String** | Ex: Rate daily | [optional] 
**valueAndFrequencyTextDescriptionWithTime** | **String** | Ex: Rate daily at 09:45 PM | [optional] 
**variableCategoryId** | **Number** | Ex: 10 | [optional] 
**variableCategoryImageUrl** | **String** | Ex: https://maxcdn.icons8.com/Color/PNG/96/Messaging/sad-96.png | [optional] 
**variableCategoryName** | **String** | Name of the variable category to be used when sending measurements | 
**variableDescription** | **String** | Ex: negative | [optional] 
**variableId** | **Number** | Id for the variable to be tracked | [optional] 
**variableName** | **String** | Name of the variable to be used when sending measurements | 


<a name="CombinationOperationEnum"></a>
## Enum: CombinationOperationEnum


* `MEAN` (value: `"MEAN"`)

* `SUM` (value: `"SUM"`)




