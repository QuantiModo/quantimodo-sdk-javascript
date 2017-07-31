# Quantimodo.TrackingReminderNotification

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **Number** | id for the specific PENDING tracking remidner | 
**trackingReminderId** | **Number** | id for the repeating tracking remidner | [optional] 
**clientId** | **String** | clientId | [optional] 
**userId** | **Number** | ID of User | [optional] 
**variableId** | **Number** | Id for the variable to be tracked | [optional] 
**defaultValue** | **Number** | Default value to use for the measurement when tracking | [optional] 
**reminderSound** | **String** | String identifier for the sound to accompany the reminder | [optional] 
**popUp** | **Boolean** | True if the reminders should appear as a popup notification | [optional] 
**sms** | **Boolean** | True if the reminders should be delivered via SMS | [optional] 
**email** | **Boolean** | True if the reminders should be delivered via email | [optional] 
**notificationBar** | **Boolean** | True if the reminders should appear in the notification bar | [optional] 
**updatedAt** | **Date** | When the record in the database was last updated. Use UTC ISO 8601 &#x60;YYYY-MM-DDThh:mm:ss&#x60;  datetime format. Time zone should be UTC and not local. | [optional] 
**variableName** | **String** | Name of the variable to be used when sending measurements | [optional] 
**variableCategoryName** | **String** | Name of the variable category to be used when sending measurements | [optional] 
**unitAbbreviatedName** | **String** | Abbreviated name of the unit to be used when sending measurements | [optional] 
**combinationOperation** | **String** | The way multiple measurements are aggregated over time | [optional] 
**reminderFrequency** | **Number** | How often user should be reminded in seconds. Example: 86400 | [optional] 
**reminderStartTime** | **String** | Earliest time of day at which reminders should appear in UTC HH:MM:SS format | [optional] 
**createdAt** | **Date** | Example: 2017-07-29 20:49:54 | [optional] 
**trackingReminderNotificationId** | **Number** | Example: 5072482 | [optional] 
**reminderTime** | **Date** | UTC ISO 8601 &#x60;YYYY-MM-DDThh:mm:ss&#x60; timestamp for the specific time the variable should be tracked in UTC.  This will be used for the measurement startTime if the track endpoint is used. | [optional] 
**trackingReminderNotificationTime** | **Date** | UTC ISO 8601 &#x60;YYYY-MM-DDThh:mm:ss&#x60; timestamp for the specific time the variable should be tracked in UTC.  This will be used for the measurement startTime if the track endpoint is used. | [optional] 
**defaultUnitId** | **Number** | Example: 10 | [optional] 
**description** | **String** | Example: positive | [optional] 
**variableCategoryId** | **Number** | Example: 1 | [optional] 
**valence** | **String** | Example: positive | [optional] 
**mostCommonValue** | **Number** | Example: 3 | [optional] 
**secondMostCommonValue** | **Number** | Example: 4 | [optional] 
**thirdMostCommonValue** | **Number** | Example: 2 | [optional] 
**lastValue** | **Number** | Example: 3 | [optional] 
**secondToLastValue** | **Number** | Example: 1 | [optional] 
**thirdToLastValue** | **Number** | Example: 2 | [optional] 
**userVariableDefaultUnitId** | **Number** | Example: 10 | [optional] 
**userVariableVariableCategoryId** | **Number** | Example: 1 | [optional] 
**numberOfUniqueValues** | **Number** | Example: 5 | [optional] 
**ionIcon** | **String** | Example: ion-happy-outline | [optional] 
**svgUrl** | **String** | Example: https://app.quantimo.do/ionic/Modo/www/img/variable_categories/emotions.svg | [optional] 
**pngUrl** | **String** | Example: https://app.quantimo.do/ionic/Modo/www/img/variable_categories/emotions.png | [optional] 
**pngPath** | **String** | Example: img/variable_categories/emotions.png | [optional] 
**variableCategoryImageUrl** | **String** | Example: https://maxcdn.icons8.com/Color/PNG/96/Cinema/theatre_mask-96.png | [optional] 
**manualTracking** | **Boolean** | Example: 1 | [optional] 
**userVariableVariableCategoryName** | **String** | Example: Emotions | [optional] 
**trackingReminderNotificationTimeEpoch** | **Number** | Example: 1501534124 | [optional] 
**trackingReminderNotificationTimeLocal** | **String** | Example: 15:48:44 | [optional] 
**lastValueInUserVariableDefaultUnit** | **Number** | Example: 3 | [optional] 
**secondToLastValueInUserVariableDefaultUnit** | **Number** | Example: 1 | [optional] 
**thirdToLastValueInUserVariableDefaultUnit** | **Number** | Example: 2 | [optional] 
**mostCommonValueInUserVariableDefaultUnit** | **Number** | Example: 3 | [optional] 
**secondMostCommonValueInUserVariableDefaultUnit** | **Number** | Example: 4 | [optional] 
**thirdMostCommonValueInUserVariableDefaultUnit** | **Number** | Example: 2 | [optional] 
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
**inputType** | **String** | Example: happiestFaceIsFive | [optional] 
**total** | **Number** | Example: 3 | [optional] 
**title** | **String** | Example: Rate Overall Mood | [optional] 


<a name="CombinationOperationEnum"></a>
## Enum: CombinationOperationEnum


* `MEAN` (value: `"MEAN"`)

* `SUM` (value: `"SUM"`)




