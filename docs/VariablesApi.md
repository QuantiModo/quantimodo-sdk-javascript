# Quantimodo.VariablesApi

All URIs are relative to *https://app.quantimo.do/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteUserTag**](VariablesApi.md#deleteUserTag) | **DELETE** /v3/userTags/delete | Delete user tag or ingredient
[**deleteUserVariable**](VariablesApi.md#deleteUserVariable) | **DELETE** /v3/userVariables/delete | Delete All Measurements For Variable
[**getPublicVariables**](VariablesApi.md#getPublicVariables) | **GET** /v3/public/variables | Get public variables
[**getUserVariables**](VariablesApi.md#getUserVariables) | **GET** /v3/userVariables | Get variables with user&#39;s settings
[**getVariableCategories**](VariablesApi.md#getVariableCategories) | **GET** /v3/variableCategories | Variable categories
[**postUserTags**](VariablesApi.md#postUserTags) | **POST** /v3/userTags | Post or update user tags or ingredients
[**postUserVariables**](VariablesApi.md#postUserVariables) | **POST** /v3/userVariables | Update User Settings for a Variable
[**resetUserVariableSettings**](VariablesApi.md#resetUserVariableSettings) | **POST** /v3/userVariables/reset | Reset user settings for a variable to defaults


<a name="deleteUserTag"></a>
# **deleteUserTag**
> CommonResponse deleteUserTag(taggedVariableId, tagVariableId)

Delete user tag or ingredient

Delete previously created user tags or ingredients.

### Example
```javascript
var Quantimodo = require('quantimodo');
var defaultClient = Quantimodo.ApiClient.instance;

// Configure API key authorization: access_token
var access_token = defaultClient.authentications['access_token'];
access_token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix = 'Token';

// Configure OAuth2 access token for authorization: quantimodo_oauth2
var quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new Quantimodo.VariablesApi();

var taggedVariableId = 56; // Number | This is the id of the variable being tagged with an ingredient or something.

var tagVariableId = 56; // Number | This is the id of the ingredient variable whose value is determined based on the value of the tagged variable.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.deleteUserTag(taggedVariableId, tagVariableId, callback);
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

<a name="deleteUserVariable"></a>
# **deleteUserVariable**
> deleteUserVariable(variableId)

Delete All Measurements For Variable

Users can delete all of their measurements for a variable

### Example
```javascript
var Quantimodo = require('quantimodo');
var defaultClient = Quantimodo.ApiClient.instance;

// Configure API key authorization: access_token
var access_token = defaultClient.authentications['access_token'];
access_token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix = 'Token';

// Configure OAuth2 access token for authorization: quantimodo_oauth2
var quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new Quantimodo.VariablesApi();

var variableId = new Quantimodo.UserVariableDelete(); // UserVariableDelete | Id of the variable whose measurements should be deleted


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.deleteUserVariable(variableId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **variableId** | [**UserVariableDelete**](UserVariableDelete.md)| Id of the variable whose measurements should be deleted | 

### Return type

null (empty response body)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getPublicVariables"></a>
# **getPublicVariables**
> [Variable] getPublicVariables(opts)

Get public variables

This endpoint retrieves an array of all public variables. Public variables are things like foods, medications, symptoms, conditions, and anything not unique to a particular user. For instance, a telephone number or name would not be a public variable.

### Example
```javascript
var Quantimodo = require('quantimodo');
var defaultClient = Quantimodo.ApiClient.instance;

// Configure API key authorization: access_token
var access_token = defaultClient.authentications['access_token'];
access_token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix = 'Token';

// Configure OAuth2 access token for authorization: quantimodo_oauth2
var quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new Quantimodo.VariablesApi();

var opts = { 
  'userId': 3.4 // Number | User's id
  'id': 56, // Number | Common variable id
  'variableCategoryName': "variableCategoryName_example", // String | Limit results to a specific variable category
  'name': "name_example", // String | Original name of the variable (supports exact name match only)
  'updatedAt': "updatedAt_example", // String | When the record was last updated. Use UTC ISO 8601 `YYYY-MM-DDThh:mm:ss` datetime format. Time zone should be UTC and not local.
  'sourceName': "sourceName_example", // String | ID of the source you want measurements for (supports exact name match only)
  'earliestMeasurementTime': "earliestMeasurementTime_example", // String | Excluded records with measurement times earlier than this value. Use UTC ISO 8601 `YYYY-MM-DDThh:mm:ss`  datetime format. Time zone should be UTC and not local.
  'latestMeasurementTime': "latestMeasurementTime_example", // String | Excluded records with measurement times later than this value. Use UTC ISO 8601 `YYYY-MM-DDThh:mm:ss`  datetime format. Time zone should be UTC and not local.
  'numberOfRawMeasurements': "numberOfRawMeasurements_example", // String | Filter variables by the total number of measurements that they have. This could be used of you want to filter or sort by popularity.
  'lastSource': "lastSource_example", // String | Limit variables to those which measurements were last submitted by a specific source. So if you have a client application and you only want variables that were last updated by your app, you can include the name of your app here. (supports exact name match only)
  'limit': 100, // Number | The LIMIT is used to limit the number of results returned. So if youhave 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. The maximum limit is 200 records.
  'offset': 56, // Number | OFFSET says to skip that many rows before beginning to return rows to the client. OFFSET 0 is the same as omitting the OFFSET clause.If both OFFSET and LIMIT appear, then OFFSET rows are skipped before starting to count the LIMIT rows that are returned.
  'sort': "sort_example", // String | Sort by one of the listed field names. If the field name is prefixed with `-`, it will sort in descending order.
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getPublicVariables(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Number**| User&#39;s id | [optional] 
 **id** | **Number**| Common variable id | [optional] 
 **variableCategoryName** | **String**| Limit results to a specific variable category | [optional] 
 **name** | **String**| Original name of the variable (supports exact name match only) | [optional] 
 **updatedAt** | **String**| When the record was last updated. Use UTC ISO 8601 &#x60;YYYY-MM-DDThh:mm:ss&#x60; datetime format. Time zone should be UTC and not local. | [optional] 
 **sourceName** | **String**| ID of the source you want measurements for (supports exact name match only) | [optional] 
 **earliestMeasurementTime** | **String**| Excluded records with measurement times earlier than this value. Use UTC ISO 8601 &#x60;YYYY-MM-DDThh:mm:ss&#x60;  datetime format. Time zone should be UTC and not local. | [optional] 
 **latestMeasurementTime** | **String**| Excluded records with measurement times later than this value. Use UTC ISO 8601 &#x60;YYYY-MM-DDThh:mm:ss&#x60;  datetime format. Time zone should be UTC and not local. | [optional] 
 **numberOfRawMeasurements** | **String**| Filter variables by the total number of measurements that they have. This could be used of you want to filter or sort by popularity. | [optional] 
 **lastSource** | **String**| Limit variables to those which measurements were last submitted by a specific source. So if you have a client application and you only want variables that were last updated by your app, you can include the name of your app here. (supports exact name match only) | [optional] 
 **limit** | **Number**| The LIMIT is used to limit the number of results returned. So if youhave 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. The maximum limit is 200 records. | [optional] [default to 100]
 **offset** | **Number**| OFFSET says to skip that many rows before beginning to return rows to the client. OFFSET 0 is the same as omitting the OFFSET clause.If both OFFSET and LIMIT appear, then OFFSET rows are skipped before starting to count the LIMIT rows that are returned. | [optional] 
 **sort** | **String**| Sort by one of the listed field names. If the field name is prefixed with &#x60;-&#x60;, it will sort in descending order. | [optional] 

### Return type

[**[Variable]**](Variable.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getUserVariables"></a>
# **getUserVariables**
> [UserVariable] getUserVariables(opts)

Get variables with user&#39;s settings

Get variables for which the user has measurements. If the user has specified variable settings, these are provided instead of the common variable defaults.

### Example
```javascript
var Quantimodo = require('quantimodo');
var defaultClient = Quantimodo.ApiClient.instance;

// Configure API key authorization: access_token
var access_token = defaultClient.authentications['access_token'];
access_token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix = 'Token';

// Configure OAuth2 access token for authorization: quantimodo_oauth2
var quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new Quantimodo.VariablesApi();

var opts = { 
  'userId': 3.4 // Number | User's id
  'id': 56, // Number | Common variable id
  'variableCategoryName': "variableCategoryName_example", // String | Limit results to a specific variable category
  'name': "name_example", // String | Original name of the variable (supports exact name match only)
  'updatedAt': "updatedAt_example", // String | When the record was last updated. Use UTC ISO 8601 `YYYY-MM-DDThh:mm:ss` datetime format. Time zone should be UTC and not local.
  'sourceName': "sourceName_example", // String | ID of the source you want measurements for (supports exact name match only)
  'earliestMeasurementTime': "earliestMeasurementTime_example", // String | Excluded records with measurement times earlier than this value. Use UTC ISO 8601 `YYYY-MM-DDThh:mm:ss`  datetime format. Time zone should be UTC and not local.
  'latestMeasurementTime': "latestMeasurementTime_example", // String | Excluded records with measurement times later than this value. Use UTC ISO 8601 `YYYY-MM-DDThh:mm:ss`  datetime format. Time zone should be UTC and not local.
  'numberOfRawMeasurements': "numberOfRawMeasurements_example", // String | Filter variables by the total number of measurements that they have. This could be used of you want to filter or sort by popularity.
  'lastSource': "lastSource_example", // String | Limit variables to those which measurements were last submitted by a specific source. So if you have a client application and you only want variables that were last updated by your app, you can include the name of your app here. (supports exact name match only)
  'limit': 100, // Number | The LIMIT is used to limit the number of results returned. So if youhave 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. The maximum limit is 200 records.
  'offset': 56, // Number | OFFSET says to skip that many rows before beginning to return rows to the client. OFFSET 0 is the same as omitting the OFFSET clause.If both OFFSET and LIMIT appear, then OFFSET rows are skipped before starting to count the LIMIT rows that are returned.
  'sort': "sort_example", // String | Sort by one of the listed field names. If the field name is prefixed with `-`, it will sort in descending order.
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getUserVariables(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Number**| User&#39;s id | [optional] 
 **id** | **Number**| Common variable id | [optional] 
 **variableCategoryName** | **String**| Limit results to a specific variable category | [optional] 
 **name** | **String**| Original name of the variable (supports exact name match only) | [optional] 
 **updatedAt** | **String**| When the record was last updated. Use UTC ISO 8601 &#x60;YYYY-MM-DDThh:mm:ss&#x60; datetime format. Time zone should be UTC and not local. | [optional] 
 **sourceName** | **String**| ID of the source you want measurements for (supports exact name match only) | [optional] 
 **earliestMeasurementTime** | **String**| Excluded records with measurement times earlier than this value. Use UTC ISO 8601 &#x60;YYYY-MM-DDThh:mm:ss&#x60;  datetime format. Time zone should be UTC and not local. | [optional] 
 **latestMeasurementTime** | **String**| Excluded records with measurement times later than this value. Use UTC ISO 8601 &#x60;YYYY-MM-DDThh:mm:ss&#x60;  datetime format. Time zone should be UTC and not local. | [optional] 
 **numberOfRawMeasurements** | **String**| Filter variables by the total number of measurements that they have. This could be used of you want to filter or sort by popularity. | [optional] 
 **lastSource** | **String**| Limit variables to those which measurements were last submitted by a specific source. So if you have a client application and you only want variables that were last updated by your app, you can include the name of your app here. (supports exact name match only) | [optional] 
 **limit** | **Number**| The LIMIT is used to limit the number of results returned. So if youhave 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. The maximum limit is 200 records. | [optional] [default to 100]
 **offset** | **Number**| OFFSET says to skip that many rows before beginning to return rows to the client. OFFSET 0 is the same as omitting the OFFSET clause.If both OFFSET and LIMIT appear, then OFFSET rows are skipped before starting to count the LIMIT rows that are returned. | [optional] 
 **sort** | **String**| Sort by one of the listed field names. If the field name is prefixed with &#x60;-&#x60;, it will sort in descending order. | [optional] 

### Return type

[**[UserVariable]**](UserVariable.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getVariableCategories"></a>
# **getVariableCategories**
> [VariableCategory] getVariableCategories()

Variable categories

The variable categories include Activity, Causes of Illness, Cognitive Performance, Conditions, Environment, Foods, Location, Miscellaneous, Mood, Nutrition, Physical Activity, Physique, Sleep, Social Interactions, Symptoms, Treatments, Vital Signs, and Work.

### Example
```javascript
var Quantimodo = require('quantimodo');
var defaultClient = Quantimodo.ApiClient.instance;

// Configure API key authorization: access_token
var access_token = defaultClient.authentications['access_token'];
access_token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix = 'Token';

// Configure OAuth2 access token for authorization: quantimodo_oauth2
var quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new Quantimodo.VariablesApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getVariableCategories(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[VariableCategory]**](VariableCategory.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="postUserTags"></a>
# **postUserTags**
> CommonResponse postUserTags(body, opts)

Post or update user tags or ingredients

This endpoint allows users to tag foods with their ingredients.  This information will then be used to infer the user intake of the different ingredients by just entering the foods. The inferred intake levels will then be used to determine the effects of different nutrients on the user during analysis.

### Example
```javascript
var Quantimodo = require('quantimodo');
var defaultClient = Quantimodo.ApiClient.instance;

// Configure API key authorization: access_token
var access_token = defaultClient.authentications['access_token'];
access_token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix = 'Token';

// Configure OAuth2 access token for authorization: quantimodo_oauth2
var quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new Quantimodo.VariablesApi();

var body = new Quantimodo.UserTag(); // UserTag | Contains the new user tag data

var opts = { 
  'userId': 3.4 // Number | User's id
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.postUserTags(body, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**UserTag**](UserTag.md)| Contains the new user tag data | 
 **userId** | **Number**| User&#39;s id | [optional] 

### Return type

[**CommonResponse**](CommonResponse.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="postUserVariables"></a>
# **postUserVariables**
> CommonResponse postUserVariables(userVariables, opts)

Update User Settings for a Variable

Users can change the parameters used in analysis of that variable such as the expected duration of action for a variable to have an effect, the estimated delay before the onset of action. In order to filter out erroneous data, they are able to set the maximum and minimum reasonable daily values for a variable.

### Example
```javascript
var Quantimodo = require('quantimodo');
var defaultClient = Quantimodo.ApiClient.instance;

// Configure API key authorization: access_token
var access_token = defaultClient.authentications['access_token'];
access_token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix = 'Token';

// Configure OAuth2 access token for authorization: quantimodo_oauth2
var quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new Quantimodo.VariablesApi();

var userVariables = [new Quantimodo.UserVariable()]; // [UserVariable] | Variable user settings data

var opts = { 
  'appName': "appName_example", // String | Example: MoodiModo
  'clientId': "clientId_example" // String | Example: oauth_test_client
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.postUserVariables(userVariables, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userVariables** | [**[UserVariable]**](UserVariable.md)| Variable user settings data | 
 **appName** | **String**| Example: MoodiModo | [optional] 
 **clientId** | **String**| Example: oauth_test_client | [optional] 

### Return type

[**CommonResponse**](CommonResponse.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="resetUserVariableSettings"></a>
# **resetUserVariableSettings**
> resetUserVariableSettings(variableId)

Reset user settings for a variable to defaults

Reset user settings for a variable to defaults

### Example
```javascript
var Quantimodo = require('quantimodo');
var defaultClient = Quantimodo.ApiClient.instance;

// Configure API key authorization: access_token
var access_token = defaultClient.authentications['access_token'];
access_token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix = 'Token';

// Configure OAuth2 access token for authorization: quantimodo_oauth2
var quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new Quantimodo.VariablesApi();

var variableId = new Quantimodo.UserVariableDelete(); // UserVariableDelete | Id of the variable whose measurements should be deleted


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.resetUserVariableSettings(variableId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **variableId** | [**UserVariableDelete**](UserVariableDelete.md)| Id of the variable whose measurements should be deleted | 

### Return type

null (empty response body)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

