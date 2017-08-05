# Quantimodo.Unit

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **String** | Unit name | 
**abbreviatedName** | **String** | Unit abbreviation | 
**category** | **String** | Unit category | 
**minimumAllowedValue** | **Number** | The minimum allowed value for measurements. While you can record a value below this minimum, it will be excluded from the correlation analysis. | [optional] 
**maximumAllowedValue** | **Number** | The maximum allowed value for measurements. While you can record a value above this maximum, it will be excluded from the correlation analysis. | [optional] 
**conversionSteps** | [**[ConversionStep]**](ConversionStep.md) | Conversion steps list | 
**id** | **Number** | Example: 29 | [optional] 
**categoryName** | **String** | Example: Miscellany | [optional] 
**categoryId** | **Number** | Example: 6 | [optional] 
**advanced** | **Number** | Example: 1 | [optional] 
**minimumValue** | **Number** | Example: 0 | [optional] 
**manualTracking** | **Number** | Example: 0 | [optional] 


<a name="CategoryEnum"></a>
## Enum: CategoryEnum


* `Distance` (value: `"Distance"`)

* `Duration` (value: `"Duration"`)

* `Energy` (value: `"Energy"`)

* `Frequency` (value: `"Frequency"`)

* `Miscellany` (value: `"Miscellany"`)

* `Pressure` (value: `"Pressure"`)

* `Proportion` (value: `"Proportion"`)

* `Rating` (value: `"Rating"`)

* `Temperature` (value: `"Temperature"`)

* `Volume` (value: `"Volume"`)

* `Weight` (value: `"Weight"`)




