# Quantimodo.TrackingReminder

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **Number** | id | [optional] 
**clientId** | **String** | clientId | [optional] 
**userId** | **Number** | ID of User | [optional] 
**variableId** | **Number** | Id for the variable to be tracked | 
**defaultValue** | **Number** | Default value to use for the measurement when tracking | 
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
**variableName** | **String** | Name of the variable to be used when sending measurements | [optional] 
**variableCategoryName** | **String** | Name of the variable category to be used when sending measurements | [optional] 
**unitAbbreviatedName** | **String** | Abbreviated name of the unit to be used when sending measurements | [optional] 
**combinationOperation** | **String** | The way multiple measurements are aggregated over time | [optional] 


<a name="CombinationOperationEnum"></a>
## Enum: CombinationOperationEnum


* `MEAN` (value: `"MEAN"`)

* `SUM` (value: `"SUM"`)




