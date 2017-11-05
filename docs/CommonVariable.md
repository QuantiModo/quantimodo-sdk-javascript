# Quantimodo.CommonVariable

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**alias** | **String** | Example:  | 
**availableUnits** | [**[Unit]**](Unit.md) |  | 
**category** | **String** | Example: Sleep | [optional] 
**causeOnly** | **Number** | A value of 1 indicates that this variable is generally a cause in a causal relationship.  An example of a causeOnly variable would be a variable such as Cloud Cover which would generally not be influenced by the behaviour of the user. | 
**chartsLinkDynamic** | **String** | Example: https://local.quantimo.do/ionic/Modo/www/#/app/charts/Barometric%20Pressure?variableName&#x3D;Barometric%20Pressure&amp;userId&#x3D;230&amp;pngUrl&#x3D;https%3A%2F%2Fapp.quantimo.do%2Fionic%2FModo%2Fwww%2Fimg%2Fvariable_categories%2Fenvironment.png | 
**chartsLinkEmail** | **String** | Example: mailto:?subject&#x3D;Check%20out%20my%20Barometric%20Pressure%20data%21&amp;body&#x3D;See%20my%20Barometric%20Pressure%20history%20at%20https%3A%2F%2Flocal.quantimo.do%2Fapi%2Fv2%2Fcharts%3FvariableName%3DBarometric%2520Pressure%26userId%3D230%26pngUrl%3Dhttps%253A%252F%252Fapp.quantimo.do%252Fionic%252FModo%252Fwww%252Fimg%252Fvariable_categories%252Fenvironment.png%0A%0AHave%20a%20great%20day! | 
**chartsLinkFacebook** | **String** | Example: https://www.facebook.com/sharer/sharer.php?u&#x3D;https%3A%2F%2Flocal.quantimo.do%2Fapi%2Fv2%2Fcharts%3FvariableName%3DBarometric%2520Pressure%26userId%3D230%26pngUrl%3Dhttps%253A%252F%252Fapp.quantimo.do%252Fionic%252FModo%252Fwww%252Fimg%252Fvariable_categories%252Fenvironment.png | 
**chartsLinkGoogle** | **String** | Example: https://plus.google.com/share?url&#x3D;https%3A%2F%2Flocal.quantimo.do%2Fapi%2Fv2%2Fcharts%3FvariableName%3DBarometric%2520Pressure%26userId%3D230%26pngUrl%3Dhttps%253A%252F%252Fapp.quantimo.do%252Fionic%252FModo%252Fwww%252Fimg%252Fvariable_categories%252Fenvironment.png | 
**chartsLinkStatic** | **String** | Example: https://local.quantimo.do/api/v2/charts?variableName&#x3D;Barometric%20Pressure&amp;userId&#x3D;230&amp;pngUrl&#x3D;https%3A%2F%2Fapp.quantimo.do%2Fionic%2FModo%2Fwww%2Fimg%2Fvariable_categories%2Fenvironment.png | 
**chartsLinkTwitter** | **String** | Example: https://twitter.com/home?status&#x3D;Check%20out%20my%20Barometric%20Pressure%20data%21%20https%3A%2F%2Flocal.quantimo.do%2Fapi%2Fv2%2Fcharts%3FvariableName%3DBarometric%2520Pressure%26userId%3D230%26pngUrl%3Dhttps%253A%252F%252Fapp.quantimo.do%252Fionic%252FModo%252Fwww%252Fimg%252Fvariable_categories%252Fenvironment.png%20%40quantimodo | 
**childUserTagVariables** | [**UserVariableArray**](UserVariableArray.md) |  | 
**clientId** | **String** | Example: local | 
**combinationOperation** | **String** | Way to aggregate measurements over time. Options are \&quot;MEAN\&quot; or \&quot;SUM\&quot;. SUM should be used for things like minutes of exercise.  If you use MEAN for exercise, then a person might exercise more minutes in one day but add separate measurements that were smaller.  So when we are doing correlational analysis, we would think that the person exercised less that day even though they exercised more.  Conversely, we must use MEAN for things such as ratings which cannot be SUMMED. | 
**commonAlias** | **String** | Example: Mood_(psychology) | [optional] 
**commonTaggedVariables** | [**CommonVariableArray**](CommonVariableArray.md) |  | 
**commonTagVariables** | [**CommonVariableArray**](CommonVariableArray.md) |  | 
**commonVariableMostCommonConnectorId** | **Number** | Example: 13 | 
**commonVariableUpdatedAt** | **Date** | Example: 2017-07-30 20:47:38 | 
**createdAt** | **Date** | Example: 2014-10-23 03:41:06 | [optional] 
**dataSource** | [**DataSource**](DataSource.md) |  | 
**highcharts** | [**HighchartArray**](HighchartArray.md) |  | [optional] 
**unitAbbreviatedName** | **String** | Abbreviated name of the default unit for the variable | 
**unitCategoryId** | **Number** | Example: 1 | [optional] 
**unitCategoryName** | **String** | Example: Duration | [optional] 
**unitId** | **Number** | Id of the default unit for the variable | 
**unitName** | **String** | Example: Hours | [optional] 
**description** | **String** | Example: positive | [optional] 
**durationOfAction** | **Number** | The amount of time over which a predictor/stimulus event can exert an observable influence on an outcome variable value. For instance, aspirin (stimulus/predictor) typically decreases headache severity for approximately four hours (duration of action) following the onset delay. | 
**durationOfActionInHours** | **Number** | Example: 168 | [optional] 
**earliestFillingTime** | **Number** | Example: 1362099600 | 
**earliestMeasurementTime** | **Number** | Earliest measurement time | 
**earliestSourceTime** | **Number** | Example: 1334473200 | 
**experimentEndTime** | **Date** | Example:  | 
**experimentEndTimeSeconds** | **Date** | Example:  | 
**experimentEndTimeString** | **Date** | Example:  | 
**experimentStartTime** | **Date** | Example:  | 
**experimentStartTimeSeconds** | **Date** | Example:  | 
**experimentStartTimeString** | **Date** | Example:  | 
**fillingType** | **String** | Example:  | 
**fillingValue** | **Number** | When it comes to analysis to determine the effects of this variable, knowing when it did not occur is as important as knowing when it did occur. For example, if you are tracking a medication, it is important to know when you did not take it, but you do not have to log zero values for all the days when you haven&#39;t taken it. Hence, you can specify a filling value (typically 0) to insert whenever data is missing. | 
**id** | **Number** | Variable ID | [optional] 
**imageUrl** | **String** |  | [optional] 
**informationalUrl** | **String** | Example:  | 
**ingredientOfUserTagVariables** | [**UserVariableArray**](UserVariableArray.md) |  | 
**ingredientUserTagVariables** | [**UserVariableArray**](UserVariableArray.md) |  | 
**inputType** | **String** | Example: slider | [optional] 
**ionIcon** | **String** |  | [optional] 
**joinedUserTagVariables** | [**UserVariableArray**](UserVariableArray.md) |  | 
**joinedVariables** | [**[CommonVariable]**](CommonVariable.md) | Array of Variables that are joined with this Variable | 
**joinWith** | **String** | The Variable this Variable should be joined with. If the variable is joined with some other variable then it is not shown to user in the list of variables. | 
**kurtosis** | **Number** | Example: 10.764488721491 | [optional] 
**lastOriginalUnitId** | **Number** | Example: 47 | 
**lastOriginalValue** | **Number** | Example: 100900 | 
**lastProcessedDailyValue** | **Number** | Example: 100900 | 
**lastSource** | **Number** | Last source | 
**lastSuccessfulUpdateTime** | **Date** | Example: 2017-02-08 17:43:01 | 
**lastUnit** | **String** | Last unit | 
**lastUnitId** | **Number** | Example: 47 | 
**lastValue** | **Number** | Last value | 
**latestFillingTime** | **Number** | Example: 1501722000 | 
**latestMeasurementTime** | **Number** | Latest measurement time | 
**latestSourceTime** | **Number** | Example: 1501722000 | 
**latestUserMeasurementTime** | **Number** | Example: 1501722000 | 
**manualTracking** | **Boolean** | Example: 1 | [optional] 
**maximumAllowedValue** | **Number** | The maximum allowed value for measurements. While you can record a value above this maximum, it will be excluded from the correlation analysis. | 
**maximumRecordedValue** | **Number** | Example: 104700 | 
**mean** | **Number** | Example: 2202.3886251393 | [optional] 
**measurementsAtLastAnalysis** | **Number** | Example: 9795 | 
**median** | **Number** | Example: 2255.9284755781 | [optional] 
**minimumAllowedValue** | **Number** | The minimum allowed value for measurements. While you can record a value below this minimum, it will be excluded from the correlation analysis. | 
**minimumRecordedValue** | **Number** | Example: 1008.74 | 
**mostCommonConnectorId** | **Number** | Example: 7 | [optional] 
**mostCommonOriginalUnitId** | **Number** | Example: 2 | [optional] 
**mostCommonUnit** | **String** | Most common unit | 
**mostCommonValue** | **Number** | Most common value | 
**name** | **String** | User-defined variable display name. | 
**numberOfAggregateCorrelationsAsCause** | **Number** | Example: 386 | [optional] 
**numberOfAggregateCorrelationsAsEffect** | **Number** | Example: 2074 | [optional] 
**numberOfChanges** | **Number** | Example: 1317 | 
**numberOfCorrelations** | **Number** | Number of correlations | 
**numberOfMeasurements** | **Number** | Example: 308554 | [optional] 
**numberOfProcessedDailyMeasurements** | **Number** | Example: 1364 | 
**numberOfRawMeasurements** | **Number** | Number of measurements | 
**numberOfTrackingReminders** | **Number** | Example: 6 | [optional] 
**numberOfUniqueDailyValues** | **Number** | Example: 283 | 
**numberOfUniqueValues** | **Number** | Example: 74 | [optional] 
**numberOfUserCorrelationsAsCause** | **Number** | Example: 155 | 
**numberOfUserCorrelationsAsEffect** | **Number** | Example: 0 | 
**numberOfUserVariables** | **Number** | Example: 307 | [optional] 
**onsetDelay** | **Number** | The amount of time in seconds that elapses after the predictor/stimulus event before the outcome as perceived by a self-tracker is known as the onset delay. For example, the onset delay between the time a person takes an aspirin (predictor/stimulus event) and the time a person perceives a change in their headache severity (outcome) is approximately 30 minutes. | 
**onsetDelayInHours** | **Number** | Example: 0 | 
**outcome** | **Number** | Outcome variables (those with &#x60;outcome&#x60; &#x3D;&#x3D; 1) are variables for which a human would generally want to identify the influencing factors. These include symptoms of illness, physique, mood, cognitive performance, etc.  Generally correlation calculations are only performed on outcome variables. | 
**outcomeOfInterest** | **Number** | Example: 0 | 
**parent** | **Number** | Id of the parent variable if this variable has any parent | 
**parentId** | **String** | Example:  | 
**parentUserTagVariables** | [**UserVariableArray**](UserVariableArray.md) |  | 
**pngPath** | **String** | Example: img/variable_categories/sleep.png | [optional] 
**pngUrl** | **String** | Example: https://app.quantimo.do/ionic/Modo/www/img/variable_categories/sleep.png | [optional] 
**predictorOfInterest** | **Number** | Example: 0 | 
**price** | **String** | Example:  | 
**productUrl** | **String** | Example:  | 
**_public** | **Boolean** | Example: 1 | [optional] 
**rawMeasurementsAtLastAnalysis** | **Number** | The number of measurements that a given user had for this variable the last time a correlation calculation was performed. Generally correlation values are only updated once the current number of measurements for a variable is more than 10% greater than the rawMeasurementsAtLastAnalysis.  This avoids a computationally-demanding recalculation when there&#39;s not enough new data to make a significant difference in the correlation. | 
**secondMostCommonValue** | **Number** | Example: 8 | [optional] 
**secondToLastValue** | **Number** | Example: 101800 | 
**shareUserMeasurements** | **Boolean** | Example: false | 
**skewness** | **Number** | Example: 0.2461351905455 | [optional] 
**sources** | **String** | Comma-separated list of source names to limit variables to those sources | 
**standardDeviation** | **Number** | Example: 1840.535129803 | [optional] 
**status** | **String** | Example: UPDATED | 
**subtitle** | **String** | Based on sort filter and can be shown beneath variable name on search list | [optional] 
**subVariables** | [**[CommonVariable]**](CommonVariable.md) | Array of Variables that are sub variables to this Variable | 
**svgUrl** | **String** | Example: https://app.quantimo.do/ionic/Modo/www/img/variable_categories/sleep.svg | [optional] 
**thirdMostCommonValue** | **Number** | Example: 7 | [optional] 
**thirdToLastValue** | **Number** | Example: 102000 | 
**updated** | **Number** | When this variable or its settings were last updated | 
**updatedAt** | **Date** | Example: 2017-07-31 03:57:06 | [optional] 
**userId** | **Number** | Example: 230 | 
**valence** | **String** | Example: positive | [optional] 
**variableCategoryId** | **Number** | Example: 6 | [optional] 
**variableCategoryImageUrl** | **String** | Example: https://maxcdn.icons8.com/Color/PNG/96/Household/sleeping_in_bed-96.png | [optional] 
**variableCategoryName** | **String** | Variable category like Mood, Sleep, Physical Activity, Treatment, Symptom, etc. | 
**variableFillingValue** | **Number** | Example: -1 | 
**variableId** | **Number** | Example: 96380 | 
**variableName** | **String** | Example: Sleep Duration | [optional] 
**variance** | **Number** | Example: 115947037.40816 | [optional] 
**wikipediaTitle** | **String** | Example:  | 


<a name="CombinationOperationEnum"></a>
## Enum: CombinationOperationEnum


* `MEAN` (value: `"MEAN"`)

* `SUM` (value: `"SUM"`)




