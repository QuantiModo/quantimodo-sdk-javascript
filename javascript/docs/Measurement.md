# QuantiModo.Measurement

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**variableName** | **String** | Name of the variable for which we are creating the measurement records | 
**sourceName** | **String** | Application or device used to record the measurement values | 
**startTimeString** | **String** | Start Time for the measurement event in UTC ISO 8601 \&quot;YYYY-MM-DDThh:mm:ss\&quot; | 
**startTimeEpoch** | **Number** | Seconds between the start of the event measured and 1970 (Unix timestamp) | [optional] 
**humanTime** | [**HumanTime**](HumanTime.md) |  | [optional] 
**value** | **Number** | Converted measurement value in requested unit | 
**originalValue** | **Number** | Original value as originally submitted | [optional] 
**originalunitAbbreviatedName** | **String** | Original Unit of measurement as originally submitted | [optional] 
**unitAbbreviatedName** | **String** | Abbreviated name for the unit of measurement | 
**note** | **String** | Note of measurement | [optional] 


