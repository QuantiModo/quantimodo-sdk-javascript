# Quantimodo.Variable

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **Number** | Variable ID | [optional] 
**name** | **String** | User-defined variable display name. | 
**variableCategoryName** | **String** | Variable category like Mood, Sleep, Physical Activity, Treatment, Symptom, etc. | 
**defaultUnitAbbreviatedName** | **String** | Abbreviated name of the default unit for the variable | 
**defaultUnitId** | **Number** | Id of the default unit for the variable | 
**sources** | **String** | Comma-separated list of source names to limit variables to those sources | 
**minimumAllowedValue** | **Number** | The minimum allowed value for measurements. While you can record a value below this minimum, it will be excluded from the correlation analysis. | 
**maximumAllowedValue** | **Number** | The maximum allowed value for measurements. While you can record a value above this maximum, it will be excluded from the correlation analysis. | 
**combinationOperation** | **String** | Way to aggregate measurements over time. Options are \&quot;MEAN\&quot; or \&quot;SUM\&quot;. SUM should be used for things like minutes of exercise.  If you use MEAN for exercise, then a person might exercise more minutes in one day but add separate measurements that were smaller.  So when we are doing correlational analysis, we would think that the person exercised less that day even though they exercised more.  Conversely, we must use MEAN for things such as ratings which cannot be SUMMED. | 
**fillingValue** | **Number** | When it comes to analysis to determine the effects of this variable, knowing when it did not occur is as important as knowing when it did occur. For example, if you are tracking a medication, it is important to know when you did not take it, but you do not have to log zero values for all the days when you haven&#39;t taken it. Hence, you can specify a filling value (typically 0) to insert whenever data is missing. | 
**joinWith** | **String** | The Variable this Variable should be joined with. If the variable is joined with some other variable then it is not shown to user in the list of variables. | 
**joinedVariables** | [**[Variable]**](Variable.md) | Array of Variables that are joined with this Variable | 
**parent** | **Number** | Id of the parent variable if this variable has any parent | 
**subVariables** | [**[Variable]**](Variable.md) | Array of Variables that are sub variables to this Variable | 
**onsetDelay** | **Number** | The amount of time in seconds that elapses after the predictor/stimulus event before the outcome as perceived by a self-tracker is known as the onset delay. For example, the onset delay between the time a person takes an aspirin (predictor/stimulus event) and the time a person perceives a change in their headache severity (outcome) is approximately 30 minutes. | 
**durationOfAction** | **Number** | The amount of time over which a predictor/stimulus event can exert an observable influence on an outcome variable value. For instance, aspirin (stimulus/predictor) typically decreases headache severity for approximately four hours (duration of action) following the onset delay. | 
**earliestMeasurementTime** | **Number** | Earliest measurement time | 
**latestMeasurementTime** | **Number** | Latest measurement time | 
**updated** | **Number** | When this variable or its settings were last updated | 
**causeOnly** | **Number** | A value of 1 indicates that this variable is generally a cause in a causal relationship.  An example of a causeOnly variable would be a variable such as Cloud Cover which would generally not be influenced by the behaviour of the user. | 
**numberOfCorrelations** | **Number** | Number of correlations | 
**outcome** | **Number** | Outcome variables (those with &#x60;outcome&#x60; &#x3D;&#x3D; 1) are variables for which a human would generally want to identify the influencing factors. These include symptoms of illness, physique, mood, cognitive performance, etc.  Generally correlation calculations are only performed on outcome variables. | 
**rawMeasurementsAtLastAnalysis** | **Number** | The number of measurements that a given user had for this variable the last time a correlation calculation was performed. Generally correlation values are only updated once the current number of measurements for a variable is more than 10% greater than the rawMeasurementsAtLastAnalysis.  This avoids a computationally-demanding recalculation when there&#39;s not enough new data to make a significant difference in the correlation. | 
**numberOfRawMeasurements** | **Number** | Number of measurements | 
**lastUnit** | **String** | Last unit | 
**lastValue** | **Number** | Last value | 
**mostCommonValue** | **Number** | Most common value | 
**mostCommonUnit** | **String** | Most common unit | 
**lastSource** | **Number** | Last source | 
**imageUrl** | **String** |  | [optional] 
**ionIcon** | **String** |  | [optional] 
**createdAt** | **Date** | Example: 2014-10-23 03:41:06 | [optional] 
**unitId** | **Number** | Example: 34 | [optional] 
**kurtosis** | **Number** | Example: 10.764488721491 | [optional] 
**mean** | **Number** | Example: 2202.3886251393 | [optional] 
**median** | **Number** | Example: 2255.9284755781 | [optional] 
**mostCommonConnectorId** | **Number** | Example: 7 | [optional] 
**mostCommonOriginalUnitId** | **Number** | Example: 2 | [optional] 
**numberOfAggregateCorrelationsAsCause** | **Number** | Example: 386 | [optional] 
**numberOfAggregateCorrelationsAsEffect** | **Number** | Example: 2074 | [optional] 
**numberOfTrackingReminders** | **Number** | Example: 6 | [optional] 
**numberOfUniqueValues** | **Number** | Example: 74 | [optional] 
**numberOfUserVariables** | **Number** | Example: 307 | [optional] 
**secondMostCommonValue** | **Number** | Example: 8 | [optional] 
**skewness** | **Number** | Example: 0.2461351905455 | [optional] 
**standardDeviation** | **Number** | Example: 1840.535129803 | [optional] 
**thirdMostCommonValue** | **Number** | Example: 7 | [optional] 
**updatedAt** | **Date** | Example: 2017-07-31 03:57:06 | [optional] 
**variableCategoryId** | **Number** | Example: 6 | [optional] 
**variance** | **Number** | Example: 115947037.40816 | [optional] 
**_public** | **Boolean** | Example: 1 | [optional] 
**userVariableVariableCategoryId** | **Number** | Example: 6 | [optional] 
**svgUrl** | **String** | Example: https://app.quantimo.do/ionic/Modo/www/img/variable_categories/sleep.svg | [optional] 
**pngUrl** | **String** | Example: https://app.quantimo.do/ionic/Modo/www/img/variable_categories/sleep.png | [optional] 
**pngPath** | **String** | Example: img/variable_categories/sleep.png | [optional] 
**variableCategoryImageUrl** | **String** | Example: https://maxcdn.icons8.com/Color/PNG/96/Household/sleeping_in_bed-96.png | [optional] 
**manualTracking** | **Boolean** | Example: 1 | [optional] 
**userVariableVariableCategoryName** | **String** | Example: Sleep | [optional] 
**category** | **String** | Example: Sleep | [optional] 
**durationOfActionInHours** | **Number** | Example: 168 | [optional] 
**variableName** | **String** | Example: Sleep Duration | [optional] 
**numberOfMeasurements** | **Number** | Example: 308554 | [optional] 
**unitName** | **String** | Example: Hours | [optional] 
**unitAbbreviatedName** | **String** | Example: h | [optional] 
**unitCategoryId** | **Number** | Example: 1 | [optional] 
**unitCategoryName** | **String** | Example: Duration | [optional] 
**defaultUnitName** | **String** | Example: Hours | [optional] 
**defaultUnitCategoryId** | **Number** | Example: 1 | [optional] 
**defaultUnitCategoryName** | **String** | Example: Duration | [optional] 
**userVariableDefaultUnitId** | **Number** | Example: 34 | [optional] 
**userVariableDefaultUnitName** | **String** | Example: Hours | [optional] 
**userVariableDefaultUnitAbbreviatedName** | **String** | Example: h | [optional] 
**userVariableDefaultUnitCategoryId** | **Number** | Example: 1 | [optional] 
**userVariableDefaultUnitCategoryName** | **String** | Example: Duration | [optional] 
**inputType** | **String** | Example: slider | [optional] 
**commonAlias** | **String** | Example: Mood_(psychology) | [optional] 
**description** | **String** | Example: positive | [optional] 
**valence** | **String** | Example: positive | [optional] 


<a name="CombinationOperationEnum"></a>
## Enum: CombinationOperationEnum


* `MEAN` (value: `"MEAN"`)

* `SUM` (value: `"SUM"`)




