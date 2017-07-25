# quantimodoApi.Permission

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**target** | **Number** | Grant permission to target user or public so they may access measurements within the given parameters. TODO: Rename target to something more intuitive. | 
**variableName** | **String** | ORIGINAL Variable name | 
**minTimestamp** | **Number** | Earliest time when measurements will be accessible in epoch seconds | 
**maxTimestamp** | **Number** | Latest time when measurements will be accessible in epoch seconds | 
**minTimeOfDay** | **Number** | Earliest time of day when measurements will be accessible in epoch seconds | 
**maxTimeOfDay** | **Number** | Latest time of day when measurements will be accessible in epoch seconds | 
**week** | **String** | Maybe specifies if only weekday measurements should be accessible | 


