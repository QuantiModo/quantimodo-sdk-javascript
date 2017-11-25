# Quantimodo.MeasurementSet

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**combinationOperation** | **String** | Way to aggregate measurements over time. Options are \&quot;MEAN\&quot; or \&quot;SUM\&quot;. SUM should be used for things like minutes of exercise.  If you use MEAN for exercise, then a person might exercise more minutes in one day but add separate measurements that were smaller.  So when we are doing correlational analysis, we would think that the person exercised less that day even though they exercised more.  Conversely, we must use MEAN for things such as ratings which cannot be SUMMED. | [optional] 
**measurementItems** | [**[MeasurementItem]**](MeasurementItem.md) | Array of timestamps, values, and optional notes | 
**sourceName** | **String** | Name of the application or device used to record the measurement values | 
**unitAbbreviatedName** | **String** | Unit of measurement | 
**variableCategoryName** | **String** | Variable category name | [optional] 
**variableName** | **String** | ORIGINAL name of the variable for which we are creating the measurement records | 
**upc** | **String** | UPC or other barcode scan result | [optional] 


<a name="CombinationOperationEnum"></a>
## Enum: CombinationOperationEnum


* `MEAN` (value: `"MEAN"`)

* `SUM` (value: `"SUM"`)




