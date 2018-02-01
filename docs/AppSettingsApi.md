# Quantimodo.AppSettingsApi

All URIs are relative to *https://app.quantimo.do/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getAppSettings**](AppSettingsApi.md#getAppSettings) | **GET** /v3/appSettings | Get client app Settings


<a name="getAppSettings"></a>
# **getAppSettings**
> AppSettings getAppSettings(opts)

Get client app Settings

Get QuantiModo client app settings

### Example
```javascript
var Quantimodo = require('quantimodo');

var apiInstance = new Quantimodo.AppSettingsApi();

var opts = { 
  'clientId': "clientId_example", // String | Example: oauth_test_client
  'clientSecret': "clientSecret_example" // String | Optional, but required to include any user data with response
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getAppSettings(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **clientId** | **String**| Example: oauth_test_client | [optional] 
 **clientSecret** | **String**| Optional, but required to include any user data with response | [optional] 

### Return type

[**AppSettings**](AppSettings.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

