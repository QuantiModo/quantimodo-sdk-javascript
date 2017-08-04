# Quantimodo.UserSettingsApi

All URIs are relative to *https://app.quantimo.do/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**postUserSettings**](UserSettingsApi.md#postUserSettings) | **POST** /v3/userSettings | Post UserSettings


<a name="postUserSettings"></a>
# **postUserSettings**
> postUserSettings(opts)

Post UserSettings

Post UserSettings

### Example
```javascript
var Quantimodo = require('quantimodo');

var apiInstance = new Quantimodo.UserSettingsApi();

var opts = { 
  'appName': "appName_example", // String | Example: MoodiModo
  'clientId': "clientId_example" // String | Example: oauth_test_client
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.postUserSettings(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **appName** | **String**| Example: MoodiModo | [optional] 
 **clientId** | **String**| Example: oauth_test_client | [optional] 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

