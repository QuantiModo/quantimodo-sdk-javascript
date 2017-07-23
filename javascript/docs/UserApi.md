# quantimodo-api.UserApi

All URIs are relative to *https://app.quantimo.do/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**v1OrganizationsOrganizationIdUsersPost**](UserApi.md#v1OrganizationsOrganizationIdUsersPost) | **POST** /v1/organizations/{organizationId}/users | Get user tokens for existing users, create new users
[**v1UserMeGet**](UserApi.md#v1UserMeGet) | **GET** /v1/user/me | Get all available units for variableGet authenticated user


<a name="v1OrganizationsOrganizationIdUsersPost"></a>
# **v1OrganizationsOrganizationIdUsersPost**
> UserTokenSuccessfulResponse v1OrganizationsOrganizationIdUsersPost(organizationId, body, opts)

Get user tokens for existing users, create new users

Get user tokens for existing users, create new users

### Example
```javascript
var quantimodo-api = require('quanti_modo');

var apiInstance = new quantimodo-api.UserApi();

var organizationId = 56; // Number | Organization ID

var body = new quantimodo-api.UserTokenRequest(); // UserTokenRequest | Provides organization token and user ID

var opts = { 
  'accessToken': "accessToken_example", // String | User's OAuth2 access token
  'userId': 56 // Number | User's id
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.v1OrganizationsOrganizationIdUsersPost(organizationId, body, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **organizationId** | **Number**| Organization ID | 
 **body** | [**UserTokenRequest**](UserTokenRequest.md)| Provides organization token and user ID | 
 **accessToken** | **String**| User&#39;s OAuth2 access token | [optional] 
 **userId** | **Number**| User&#39;s id | [optional] 

### Return type

[**UserTokenSuccessfulResponse**](UserTokenSuccessfulResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="v1UserMeGet"></a>
# **v1UserMeGet**
> User v1UserMeGet()

Get all available units for variableGet authenticated user

Returns user info for the currently authenticated user.

### Example
```javascript
var quantimodo-api = require('quanti_modo');
var defaultClient = quantimodo-api.ApiClient.default;

// Configure API key authorization: access_token
var access_token = defaultClient.authentications['access_token'];
access_token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix = 'Token';

// Configure OAuth2 access token for authorization: quantimodo_oauth2
var quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new quantimodo-api.UserApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.v1UserMeGet(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**User**](User.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

