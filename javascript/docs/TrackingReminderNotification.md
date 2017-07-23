# quantimodo-api.TrackingReminderNotification

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **Number** | id for the specific PENDING tracking remidner | 
**trackingReminderId** | **Number** | id for the repeating tracking remidner | 
**clientId** | **String** | clientId | [optional] 
**userId** | **Number** | ID of User | [optional] 
**variableId** | **Number** | Id for the variable to be tracked | [optional] 
**pendingReminderTime** | **Date** | UTC ISO 8601 \&quot;YYYY-MM-DDThh:mm:ss\&quot;  timestamp for the specific time the variable should be tracked in UTC.  This will be used for the measurement startTime if the track endpoint is used. | [optional] 
**defaultValue** | **Number** | Default value to use for the measurement when tracking | [optional] 
**reminderSound** | **String** | String identifier for the sound to accompany the reminder | [optional] 
**popUp** | **Boolean** | True if the reminders should appear as a popup notification | [optional] 
**sms** | **Boolean** | True if the reminders should be delivered via SMS | [optional] 
**email** | **Boolean** | True if the reminders should be delivered via email | [optional] 
**notificationBar** | **Boolean** | True if the reminders should appear in the notification bar | [optional] 
**updatedAt** | **Date** | When the record in the database was last updated. Use UTC ISO 8601 \&quot;YYYY-MM-DDThh:mm:ss\&quot;  datetime format. Time zone should be UTC and not local. | [optional] 
**variableName** | **String** | Name of the variable to be used when sending measurements | [optional] 
**variableCategoryName** | **String** | Name of the variable category to be used when sending measurements | [optional] 
**unitAbbreviatedName** | **String** | Abbreviated name of the unit to be used when sending measurements | [optional] 
**combinationOperation** | **String** | The way multiple measurements are aggregated over time | [optional] 


<a name="CombinationOperationEnum"></a>
## Enum: CombinationOperationEnum


* `MEAN` (value: `"MEAN"`)

* `SUM` (value: `"SUM"`)




