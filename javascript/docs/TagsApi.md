# QuantimodoApi.TagsApi

All URIs are relative to *https://app.quantimo.do/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**v1UserTagsDeletePost**](TagsApi.md#v1UserTagsDeletePost) | **POST** /v1/userTags/delete | Delete user tag or ingredient
[**v1UserTagsPost**](TagsApi.md#v1UserTagsPost) | **POST** /v1/userTags | Post or update user tags or ingredients


<a name="v1UserTagsDeletePost"></a>
# **v1UserTagsDeletePost**
> CommonResponse v1UserTagsDeletePost(taggedVariableId, tagVariableId)

Delete user tag or ingredient

Delete previously created user tags or ingredients.

### Example
```javascript
var QuantimodoApi = require('quantimodo-api');
var defaultClient = QuantimodoApi.ApiClient.default;

// Configure API key authorization: access_token
var access_token = defaultClient.authentications['access_token'];
access_token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix = 'Token';

// Configure OAuth2 access token for authorization: quantimodo_oauth2
var quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new QuantimodoApi.TagsApi();

var taggedVariableId = 56; // Number | This is the id of the variable being tagged with an ingredient or something.

var tagVariableId = 56; // Number | This is the id of the ingredient variable whose value is determined based on the value of the tagged variable.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.v1UserTagsDeletePost(taggedVariableId, tagVariableId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taggedVariableId** | **Number**| This is the id of the variable being tagged with an ingredient or something. | 
 **tagVariableId** | **Number**| This is the id of the ingredient variable whose value is determined based on the value of the tagged variable. | 

### Return type

[**CommonResponse**](CommonResponse.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="v1UserTagsPost"></a>
# **v1UserTagsPost**
> CommonResponse v1UserTagsPost(body, opts)

Post or update user tags or ingredients

This endpoint allows users to tag foods with their ingredients.  This information will then be used to infer the user intake of the different ingredients by just entering the foods. The inferred intake levels will then be used to determine the effects of different nutrients on the user during analysis.

### Example
```javascript
var QuantimodoApi = require('quantimodo-api');
var defaultClient = QuantimodoApi.ApiClient.default;

// Configure API key authorization: access_token
var access_token = defaultClient.authentications['access_token'];
access_token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix = 'Token';

// Configure OAuth2 access token for authorization: quantimodo_oauth2
var quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new QuantimodoApi.TagsApi();

var body = new QuantimodoApi.UserTag(); // UserTag | Contains the new user tag data

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
apiInstance.v1UserTagsPost(body, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**UserTag**](UserTag.md)| Contains the new user tag data | 
 **accessToken** | **String**| User&#39;s OAuth2 access token | [optional] 
 **userId** | **Number**| User&#39;s id | [optional] 

### Return type

[**CommonResponse**](CommonResponse.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

