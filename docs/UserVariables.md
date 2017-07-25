# quantimodoApi.UserVariables

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**user** | **Number** | User ID | 
**variableId** | **Number** | Common variable id | 
**durationOfAction** | **Number** | The amount of time over which a predictor/stimulus event can exert an observable influence on an outcome variable’s value. For instance, aspirin (stimulus/predictor) typically decreases headache severity for approximately four hours (duration of action) following the onset delay. | [optional] 
**fillingValue** | **Number** | When it comes to analysis to determine the effects of this variable, knowing when it did not occur is as important as knowing when it did occur. For example, if you are tracking a medication, it is important to know when you did not take it, but you do not have to log zero values for all the days when you haven&#39;t taken it. Hence, you can specify a filling value (typically 0) to insert whenever data is missing. | [optional] 
**joinWith** | **String** | joinWith | [optional] 
**maximumAllowedValue** | **Number** | The maximum allowed value for measurements. While you can record a value above this maximum, it will be excluded from the correlation analysis. | [optional] 
**minimumAllowedValue** | **Number** | The minimum allowed value for measurements. While you can record a value below this minimum, it will be excluded from the correlation analysis. | [optional] 
**onsetDelay** | **Number** | onsetDelay | [optional] 
**experimentStartTime** | **String** | Earliest measurement startTime that should be used in analysis. For instance, the date when you started tracking something.  Helpful in determining when to start 0 filling since we can assume the absence of a treatment measurement, for instance, indicates that the treatment was not applied rathter than simply not recorded.  Uses ISO string format | [optional] 
**experimentEndTime** | **String** | Latest measurement startTime that should be used in analysis. For instance, the date when you stopped tracking something.  Helpful in determining when to stop 0 filling since we can assume the absence of a treatment measurement, for instance, indicates that the treatment was not applied rathter than simply not recorded.   Uses ISO string format | [optional] 
**alias** | **String** | User-defined display alias for variable name | [optional] 


