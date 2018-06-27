# quantimodo-api.UserApi

All URIs are relative to *https://app.quantimo.do/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteUser**](UserApi.md#deleteUser) | **DELETE** /v3/user/delete | Delete user
[**getUser**](UserApi.md#getUser) | **GET** /v3/user | Get user info
[**postUserSettings**](UserApi.md#postUserSettings) | **POST** /v3/userSettings | Post UserSettings


<a name="deleteUser"></a>
# **deleteUser**
> CommonResponse deleteUser(reason, opts)

Delete user

Delete user account. Only the client app that created a user can delete that user.

### Example
```javascript
import quantimodo-api from 'quantimodo-api';
let defaultClient = quantimodo-api.ApiClient.instance;

// Configure API key authorization: access_token
let access_token = defaultClient.authentications['access_token'];
access_token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix = 'Token';

// Configure OAuth2 access token for authorization: quantimodo_oauth2
let quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new quantimodo-api.UserApi();

let reason = "reason_example"; // String | Ex: I hate you!

let opts = { 
  'clientId': "clientId_example", // String | Your QuantiModo client id can be obtained by creating an app at https://builder.quantimo.do
  'platform': "platform_example", // String | Ex: chrome, android, ios, web
};

apiInstance.deleteUser(reason, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **reason** | **String**| Ex: I hate you! | 
 **clientId** | **String**| Your QuantiModo client id can be obtained by creating an app at https://builder.quantimo.do | [optional] 
 **platform** | **String**| Ex: chrome, android, ios, web | [optional] 

### Return type

[**CommonResponse**](CommonResponse.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getUser"></a>
# **getUser**
> User getUser(opts)

Get user info

Returns user info.  If no userId is specified, returns info for currently authenticated user

### Example
```javascript
import quantimodo-api from 'quantimodo-api';
let defaultClient = quantimodo-api.ApiClient.instance;

// Configure API key authorization: access_token
let access_token = defaultClient.authentications['access_token'];
access_token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix = 'Token';

// Configure OAuth2 access token for authorization: quantimodo_oauth2
let quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new quantimodo-api.UserApi();

let opts = { 
  'userId': 8.14, // Number | User's id
  'createdAt': "createdAt_example", // String | When the record was first created. Use UTC ISO 8601 YYYY-MM-DDThh:mm:ss datetime format. Time zone should be UTC and not local.
  'updatedAt': "updatedAt_example", // String | When the record was last updated. Use UTC ISO 8601 YYYY-MM-DDThh:mm:ss datetime format. Time zone should be UTC and not local.
  'limit': 100, // Number | The LIMIT is used to limit the number of results returned. So if youhave 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. The maximum limit is 200 records.
  'offset': 56, // Number | OFFSET says to skip that many rows before beginning to return rows to the client. OFFSET 0 is the same as omitting the OFFSET clause.If both OFFSET and LIMIT appear, then OFFSET rows are skipped before starting to count the LIMIT rows that are returned.
  'sort': "sort_example", // String | Sort by one of the listed field names. If the field name is prefixed with `-`, it will sort in descending order.
  'clientId': "clientId_example", // String | Your QuantiModo client id can be obtained by creating an app at https://builder.quantimo.do
  'appVersion': "appVersion_example", // String | Ex: 2.1.1.0
  'clientUserId': 56, // Number | Ex: 74802
  'platform': "platform_example", // String | Ex: chrome, android, ios, web
  'log': "log_example", // String | Username or email
  'pwd': "pwd_example", // String | User password
  'includeAuthorizedClients': true // Boolean | Return list of apps, studies, and individuals with access to user data
};

apiInstance.getUser(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Number**| User&#39;s id | [optional] 
 **createdAt** | **String**| When the record was first created. Use UTC ISO 8601 YYYY-MM-DDThh:mm:ss datetime format. Time zone should be UTC and not local. | [optional] 
 **updatedAt** | **String**| When the record was last updated. Use UTC ISO 8601 YYYY-MM-DDThh:mm:ss datetime format. Time zone should be UTC and not local. | [optional] 
 **limit** | **Number**| The LIMIT is used to limit the number of results returned. So if youhave 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. The maximum limit is 200 records. | [optional] [default to 100]
 **offset** | **Number**| OFFSET says to skip that many rows before beginning to return rows to the client. OFFSET 0 is the same as omitting the OFFSET clause.If both OFFSET and LIMIT appear, then OFFSET rows are skipped before starting to count the LIMIT rows that are returned. | [optional] 
 **sort** | **String**| Sort by one of the listed field names. If the field name is prefixed with &#x60;-&#x60;, it will sort in descending order. | [optional] 
 **clientId** | **String**| Your QuantiModo client id can be obtained by creating an app at https://builder.quantimo.do | [optional] 
 **appVersion** | **String**| Ex: 2.1.1.0 | [optional] 
 **clientUserId** | **Number**| Ex: 74802 | [optional] 
 **platform** | **String**| Ex: chrome, android, ios, web | [optional] 
 **log** | **String**| Username or email | [optional] 
 **pwd** | **String**| User password | [optional] 
 **includeAuthorizedClients** | **Boolean**| Return list of apps, studies, and individuals with access to user data | [optional] 

### Return type

[**User**](User.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="postUserSettings"></a>
# **postUserSettings**
> PostUserSettingsResponse postUserSettings(body, opts)

Post UserSettings

Post UserSettings

### Example
```javascript
import quantimodo-api from 'quantimodo-api';

let apiInstance = new quantimodo-api.UserApi();

let body = new quantimodo-api.User(); // User | User settings to update

let opts = { 
  'clientId': "clientId_example", // String | Your QuantiModo client id can be obtained by creating an app at https://builder.quantimo.do
  'platform': "platform_example", // String | Ex: chrome, android, ios, web
};

apiInstance.postUserSettings(body, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**User**](User.md)| User settings to update | 
 **clientId** | **String**| Your QuantiModo client id can be obtained by creating an app at https://builder.quantimo.do | [optional] 
 **platform** | **String**| Ex: chrome, android, ios, web | [optional] 

### Return type

[**PostUserSettingsResponse**](PostUserSettingsResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

