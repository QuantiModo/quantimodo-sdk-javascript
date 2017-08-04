# Quantimodo.StudyApi

All URIs are relative to *https://app.quantimo.do/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getStudy**](StudyApi.md#getStudy) | **GET** /v3/study | Get Study


<a name="getStudy"></a>
# **getStudy**
> getStudy(opts)

Get Study

Get Study

### Example
```javascript
var Quantimodo = require('quantimodo');

var apiInstance = new Quantimodo.StudyApi();

var opts = { 
  'causeVariableName': "causeVariableName_example", // String | Variable name of the hypothetical cause variable.  Example: Sleep Duration
  'effectVariableName': "effectVariableName_example", // String | Variable name of the hypothetical effect variable.  Example: Overall Mood
  'appName': "appName_example", // String | Example: MoodiModo
  'clientId': "clientId_example" // String | Example: oauth_test_client
  'includeCharts': true // Boolean | Example: true
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.getStudy(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **causeVariableName** | **String**| Variable name of the hypothetical cause variable.  Example: Sleep Duration | [optional] 
 **effectVariableName** | **String**| Variable name of the hypothetical effect variable.  Example: Overall Mood | [optional] 
 **appName** | **String**| Example: MoodiModo | [optional] 
 **clientId** | **String**| Example: oauth_test_client | [optional] 
 **includeCharts** | **Boolean**| Example: true | [optional] 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

