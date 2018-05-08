# Quantimodo.TrackingReminderNotification

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**actionArray** | [**[TrackingReminderNotificationAction]**](TrackingReminderNotificationAction.md) |  | 
**availableUnits** | [**[Unit]**](Unit.md) |  | 
**clientId** | **String** | clientId | [optional] 
**combinationOperation** | **String** | The way multiple measurements are aggregated over time | [optional] 
**createdAt** | **String** | Example: 2017-07-29 20:49:54 UTC ISO 8601 YYYY-MM-DDThh:mm:ss | [optional] 
**displayName** | **String** | Example: Trader Joe&#39;s Bedtime Tea | [optional] 
**modifiedValue** | **Number** | Is the user specified default value or falls back to the last value in user unit. Good for initializing input fields | [optional] 
**unitAbbreviatedName** | **String** | Example: /5 | [optional] 
**unitCategoryId** | **Number** | Example: 5 | [optional] 
**unitCategoryName** | **String** | Example: Rating | [optional] 
**unitId** | **Number** | Example: 10 | [optional] 
**unitName** | **String** | Example: 1 to 5 Rating | [optional] 
**defaultValue** | **Number** | Default value to use for the measurement when tracking | [optional] 
**description** | **String** | Example: positive | [optional] 
**email** | **Boolean** | True if the reminders should be delivered via email | [optional] 
**fillingValue** | **Number** | Example: 0 | 
**iconIcon** | **String** | Example: ion-sad-outline | [optional] 
**id** | **Number** | id for the specific PENDING tracking remidner | 
**imageUrl** | **String** | Example: https://rximage.nlm.nih.gov/image/images/gallery/original/55111-0129-60_RXNAVIMAGE10_B051D81E.jpg | [optional] 
**inputType** | **String** | Example: happiestFaceIsFive | [optional] 
**ionIcon** | **String** | Example: ion-happy-outline | [optional] 
**lastValue** | **Number** | Example: 3 | [optional] 
**manualTracking** | **Boolean** | Example: 1 | [optional] 
**maximumAllowedValue** | **Number** | Example: 5 | [optional] 
**minimumAllowedValue** | **Number** | Example: 1 | [optional] 
**mostCommonValue** | **Number** | Example: 3 | [optional] 
**notificationBar** | **Boolean** | True if the reminders should appear in the notification bar | [optional] 
**notifiedAt** | **String** | Example: UTC ISO 8601 YYYY-MM-DDThh:mm:ss | [optional] 
**numberOfUniqueValues** | **Number** | Example: 5 | [optional] 
**outcome** | **Boolean** | Indicates whether or not the variable is usually an outcome of interest such as a symptom or emotion | [optional] 
**pngPath** | **String** | Example: img/variable_categories/emotions.png | [optional] 
**pngUrl** | **String** | Example: https://app.quantimo.do/ionic/Modo/www/img/variable_categories/emotions.png | [optional] 
**popUp** | **Boolean** | True if the reminders should appear as a popup notification | [optional] 
**productUrl** | **String** | Link to associated product for purchase | [optional] 
**question** | **String** | Example: How is your overall mood? | [optional] 
**reminderEndTime** | **String** | Example: 01-01-2018 | [optional] 
**reminderFrequency** | **Number** | How often user should be reminded in seconds. Example: 86400 | [optional] 
**reminderSound** | **String** | String identifier for the sound to accompany the reminder | [optional] 
**reminderStartTime** | **String** | Earliest time of day at which reminders should appear in UTC HH:MM:SS format | [optional] 
**reminderTime** | **String** | UTC ISO 8601 YYYY-MM-DDThh:mm:ss timestamp for the specific time the variable should be tracked in UTC.  This will be used for the measurement startTime if the track endpoint is used. | [optional] 
**secondMostCommonValue** | **Number** | Example: 4 | [optional] 
**secondToLastValue** | **Number** | Example: 1 | [optional] 
**sms** | **Boolean** | True if the reminders should be delivered via SMS | [optional] 
**svgUrl** | **String** | Example: https://app.quantimo.do/ionic/Modo/www/img/variable_categories/emotions.svg | [optional] 
**thirdMostCommonValue** | **Number** | Example: 2 | [optional] 
**thirdToLastValue** | **Number** | Example: 2 | [optional] 
**title** | **String** | Example: Rate Overall Mood | [optional] 
**total** | **Number** | Example: 3 | [optional] 
**trackAllActions** | [**[TrackingReminderNotificationTrackAllAction]**](TrackingReminderNotificationTrackAllAction.md) |  | 
**trackingReminderId** | **Number** | id for the repeating tracking remidner | [optional] 
**trackingReminderImageUrl** | **String** | Example: https://rximage.nlm.nih.gov/image/images/gallery/original/55111-0129-60_RXNAVIMAGE10_B051D81E.jpg | [optional] 
**trackingReminderNotificationId** | **Number** | Example: 5072482 | [optional] 
**trackingReminderNotificationTime** | **String** | UTC ISO 8601 YYYY-MM-DDThh:mm:ss timestamp for the specific time the variable should be tracked in UTC.  This will be used for the measurement startTime if the track endpoint is used. | [optional] 
**trackingReminderNotificationTimeEpoch** | **Number** | Example: 1501534124 | [optional] 
**trackingReminderNotificationTimeLocal** | **String** | Example: 15:48:44 | [optional] 
**trackingReminderNotificationTimeLocalHumanString** | **String** | Example: 8PM Sun, May 1 | [optional] 
**updatedAt** | **String** | When the record in the database was last updated. Use UTC ISO 8601 YYYY-MM-DDThh:mm:ss  datetime format. Time zone should be UTC and not local. | [optional] 
**userId** | **Number** | ID of User | [optional] 
**userVariableUnitAbbreviatedName** | **String** | Example: /5 | [optional] 
**userVariableUnitCategoryId** | **Number** | Example: 5 | [optional] 
**userVariableUnitCategoryName** | **String** | Example: Rating | [optional] 
**userVariableUnitId** | **Number** | Example: 10 | [optional] 
**userVariableUnitName** | **String** | Example: 1 to 5 Rating | [optional] 
**userVariableVariableCategoryId** | **Number** | Example: 1 | [optional] 
**userVariableVariableCategoryName** | **String** | Example: Emotions | [optional] 
**valence** | **String** | Example: positive | [optional] 
**variableCategoryId** | **Number** | Example: 1 | [optional] 
**variableCategoryImageUrl** | **String** | Example: https://maxcdn.icons8.com/Color/PNG/96/Cinema/theatre_mask-96.png | [optional] 
**variableCategoryName** | **String** | Name of the variable category to be used when sending measurements | [optional] 
**variableId** | **Number** | Id for the variable to be tracked | [optional] 
**variableImageUrl** | **String** | Example: https://image.png | [optional] 
**variableName** | **String** | Name of the variable to be used when sending measurements | [optional] 


<a name="CombinationOperationEnum"></a>
## Enum: CombinationOperationEnum


* `MEAN` (value: `"MEAN"`)

* `SUM` (value: `"SUM"`)




