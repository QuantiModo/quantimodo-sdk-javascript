# Quantimodo.AppSettingsApi

All URIs are relative to *https://app.quantimo.do/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getAppSettings**](AppSettingsApi.md#getAppSettings) | **GET** /v3/appSettings | Get client app Settings


<a name="getAppSettings"></a>
# **getAppSettings**
> AppSettings getAppSettings(clientSecret, , opts)

Get client app Settings

Get QuantiModo client app settings

### Example
```javascript
var Quantimodo = require('quantimodo');

var apiInstance = new Quantimodo.AppSettingsApi();

var clientSecret = "clientSecret_example"; // String | This is the secret for your obtained clientId. We use this to ensure that only your application uses the clientId.  Obtain this by creating a free application at [https://app.quantimo.do/api/v2/apps](https://app.quantimo.do/api/v2/apps).

var opts = { 
  'clientId': "clientId_example", // String | Example: oauth_test_client
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getAppSettings(clientSecret, , opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **clientSecret** | **String**| This is the secret for your obtained clientId. We use this to ensure that only your application uses the clientId.  Obtain this by creating a free application at [https://app.quantimo.do/api/v2/apps](https://app.quantimo.do/api/v2/apps). | 
 **clientId** | **String**| Example: oauth_test_client | [optional] 

### Return type

[**AppSettings**](AppSettings.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

