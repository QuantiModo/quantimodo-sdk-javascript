# quantimodoApi.OrganizationsApi

All URIs are relative to *https://app.quantimo.do/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**v1OrganizationsOrganizationIdUsersPost**](OrganizationsApi.md#v1OrganizationsOrganizationIdUsersPost) | **POST** /v1/organizations/{organizationId}/users | Get user tokens for existing users, create new users


<a name="v1OrganizationsOrganizationIdUsersPost"></a>
# **v1OrganizationsOrganizationIdUsersPost**
> UserTokenSuccessfulResponse v1OrganizationsOrganizationIdUsersPost(organizationId, body, opts)

Get user tokens for existing users, create new users

Get user tokens for existing users, create new users

### Example
```javascript
var quantimodoApi = require('quantimodo-sdk-javascript');

var apiInstance = new quantimodoApi.OrganizationsApi();

var organizationId = 56; // Number | Organization ID

var body = new quantimodoApi.UserTokenRequest(); // UserTokenRequest | Provides organization token and user ID

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

