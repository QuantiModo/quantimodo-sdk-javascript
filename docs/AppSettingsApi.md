# Quantimodo.AppSettingsApi

All URIs are relative to *https://app.quantimo.do/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getAppSettings**](AppSettingsApi.md#getAppSettings) | **GET** /v3/appSettings | Get client app Settings


<a name="getAppSettings"></a>
# **getAppSettings**
> AppSettingsResponse getAppSettings(opts)

Get client app Settings

Get QuantiModo client app settings

### Example
```javascript
var Quantimodo = require('quantimodo');

var apiInstance = new Quantimodo.AppSettingsApi();

var opts = { 
  'clientId': "clientId_example", // String | Example: oauth_test_client
  'clientSecret': "clientSecret_example", // String | This is the secret for your obtained clientId. We use this to ensure that only your application uses the clientId.  Obtain this by creating a free application at [https://app.quantimo.do/api/v2/apps](https://app.quantimo.do/api/v2/apps).
  'platform': "platform_example", // String | Example: chrome, android, ios, web
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
 **clientSecret** | **String**| This is the secret for your obtained clientId. We use this to ensure that only your application uses the clientId.  Obtain this by creating a free application at [https://app.quantimo.do/api/v2/apps](https://app.quantimo.do/api/v2/apps). | [optional] 
 **platform** | **String**| Example: chrome, android, ios, web | [optional] 

### Return type

[**AppSettingsResponse**](AppSettingsResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

