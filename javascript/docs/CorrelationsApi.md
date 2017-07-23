# QuantimodoApi.CorrelationsApi

All URIs are relative to *https://app.quantimo.do/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**v1AggregatedCorrelationsGet**](CorrelationsApi.md#v1AggregatedCorrelationsGet) | **GET** /v1/aggregatedCorrelations | Get aggregated correlations
[**v1AggregatedCorrelationsPost**](CorrelationsApi.md#v1AggregatedCorrelationsPost) | **POST** /v1/aggregatedCorrelations | Store or Update a Correlation
[**v1CorrelationsGet**](CorrelationsApi.md#v1CorrelationsGet) | **GET** /v1/correlations | Get correlations
[**v1OrganizationsOrganizationIdUsersUserIdVariablesVariableNameCausesGet**](CorrelationsApi.md#v1OrganizationsOrganizationIdUsersUserIdVariablesVariableNameCausesGet) | **GET** /v1/organizations/{organizationId}/users/{userId}/variables/{variableName}/causes | Search user correlations for a given cause
[**v1OrganizationsOrganizationIdUsersUserIdVariablesVariableNameEffectsGet**](CorrelationsApi.md#v1OrganizationsOrganizationIdUsersUserIdVariablesVariableNameEffectsGet) | **GET** /v1/organizations/{organizationId}/users/{userId}/variables/{variableName}/effects | Search user correlations for a given cause
[**v1PublicCorrelationsSearchSearchGet**](CorrelationsApi.md#v1PublicCorrelationsSearchSearchGet) | **GET** /v1/public/correlations/search/{search} | Get average correlations for variables containing search term
[**v1VariablesVariableNameCausesGet**](CorrelationsApi.md#v1VariablesVariableNameCausesGet) | **GET** /v1/variables/{variableName}/causes | Search user correlations for a given effect
[**v1VariablesVariableNameEffectsGet**](CorrelationsApi.md#v1VariablesVariableNameEffectsGet) | **GET** /v1/variables/{variableName}/effects | Search user correlations for a given cause
[**v1VariablesVariableNamePublicCausesGet**](CorrelationsApi.md#v1VariablesVariableNamePublicCausesGet) | **GET** /v1/variables/{variableName}/public/causes | Search public correlations for a given effect
[**v1VariablesVariableNamePublicEffectsGet**](CorrelationsApi.md#v1VariablesVariableNamePublicEffectsGet) | **GET** /v1/variables/{variableName}/public/effects | Search public correlations for a given cause
[**v1VotesDeletePost**](CorrelationsApi.md#v1VotesDeletePost) | **POST** /v1/votes/delete | Delete vote
[**v1VotesPost**](CorrelationsApi.md#v1VotesPost) | **POST** /v1/votes | Post or update vote


<a name="v1AggregatedCorrelationsGet"></a>
# **v1AggregatedCorrelationsGet**
> [Correlation] v1AggregatedCorrelationsGet(opts)

Get aggregated correlations

Get correlations based on the anonymized aggregate data from all QuantiModo users.

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

var apiInstance = new QuantimodoApi.CorrelationsApi();

var opts = { 
  'accessToken': "accessToken_example", // String | User's OAuth2 access token
  'userId': 56, // Number | User's id
  'effect': "effect_example", // String | Variable name of the effect variable for which the user desires correlations
  'cause': "cause_example", // String | Variable name of the cause variable for which the user desires correlations
  'correlationCoefficient': "correlationCoefficient_example", // String | Pearson correlation coefficient between cause and effect after lagging by onset delay and grouping by duration of action
  'onsetDelay': "onsetDelay_example", // String | The amount of time in seconds that elapses after the predictor/stimulus event before the outcome as perceived by a self-tracker is known as the “onset delay”. For example, the “onset delay” between the time a person takes an aspirin (predictor/stimulus event) and the time a person perceives a change in their headache severity (outcome) is approximately 30 minutes.
  'durationOfAction': "durationOfAction_example", // String | The amount of time over which a predictor/stimulus event can exert an observable influence on an outcome variable’s value. For instance, aspirin (stimulus/predictor) typically decreases headache severity for approximately four hours (duration of action) following the onset delay.
  'updatedAt': "updatedAt_example", // String | The time that this measurement was last updated in the UTC format \"YYYY-MM-DDThh:mm:ss\".  Generally, you'll be retrieving new or updated user data. To avoid unnecessary API calls, you'll want to store your last refresh time locally. Then whenever you make a request to get new data, you should limit the returned results to those updated since your last refresh by appending append `?updatedAt=(ge)2013-01-D01T01:01:01 to your request.
  'limit': 56, // Number | The LIMIT is used to limit the number of results returned. So if you have 1000 results, but only want to the first 10, you would set this to 10 and offset to 0.
  'offset': 56, // Number | Since the maximum limit is 200 records, to get more than that you'll have to make multiple API calls and page through the results. To retrieve all the data, you can iterate through data by using the `limit` and `offset` query parameters.  For example, if you want to retrieve data from 61-80 then you can use a query with the following parameters, `imit=20&offset=60`.
  'sort': 56, // Number | Sort by given field. If the field is prefixed with `-, it will sort in descending order.
  'outcomesOfInterest': true // Boolean | Only include correlations for which the effect is an outcome of interest for the user
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.v1AggregatedCorrelationsGet(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **accessToken** | **String**| User&#39;s OAuth2 access token | [optional] 
 **userId** | **Number**| User&#39;s id | [optional] 
 **effect** | **String**| Variable name of the effect variable for which the user desires correlations | [optional] 
 **cause** | **String**| Variable name of the cause variable for which the user desires correlations | [optional] 
 **correlationCoefficient** | **String**| Pearson correlation coefficient between cause and effect after lagging by onset delay and grouping by duration of action | [optional] 
 **onsetDelay** | **String**| The amount of time in seconds that elapses after the predictor/stimulus event before the outcome as perceived by a self-tracker is known as the “onset delay”. For example, the “onset delay” between the time a person takes an aspirin (predictor/stimulus event) and the time a person perceives a change in their headache severity (outcome) is approximately 30 minutes. | [optional] 
 **durationOfAction** | **String**| The amount of time over which a predictor/stimulus event can exert an observable influence on an outcome variable’s value. For instance, aspirin (stimulus/predictor) typically decreases headache severity for approximately four hours (duration of action) following the onset delay. | [optional] 
 **updatedAt** | **String**| The time that this measurement was last updated in the UTC format \&quot;YYYY-MM-DDThh:mm:ss\&quot;.  Generally, you&#39;ll be retrieving new or updated user data. To avoid unnecessary API calls, you&#39;ll want to store your last refresh time locally. Then whenever you make a request to get new data, you should limit the returned results to those updated since your last refresh by appending append &#x60;?updatedAt&#x3D;(ge)2013-01-D01T01:01:01 to your request. | [optional] 
 **limit** | **Number**| The LIMIT is used to limit the number of results returned. So if you have 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. | [optional] 
 **offset** | **Number**| Since the maximum limit is 200 records, to get more than that you&#39;ll have to make multiple API calls and page through the results. To retrieve all the data, you can iterate through data by using the &#x60;limit&#x60; and &#x60;offset&#x60; query parameters.  For example, if you want to retrieve data from 61-80 then you can use a query with the following parameters, &#x60;imit&#x3D;20&amp;offset&#x3D;60&#x60;. | [optional] 
 **sort** | **Number**| Sort by given field. If the field is prefixed with &#x60;-, it will sort in descending order. | [optional] 
 **outcomesOfInterest** | **Boolean**| Only include correlations for which the effect is an outcome of interest for the user | [optional] 

### Return type

[**[Correlation]**](Correlation.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="v1AggregatedCorrelationsPost"></a>
# **v1AggregatedCorrelationsPost**
> v1AggregatedCorrelationsPost(body, opts)

Store or Update a Correlation

Add correlation

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

var apiInstance = new QuantimodoApi.CorrelationsApi();

var body = new QuantimodoApi.PostCorrelation(); // PostCorrelation | Provides correlation data

var opts = { 
  'accessToken': "accessToken_example", // String | User's OAuth2 access token
  'userId': 56 // Number | User's id
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.v1AggregatedCorrelationsPost(body, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**PostCorrelation**](PostCorrelation.md)| Provides correlation data | 
 **accessToken** | **String**| User&#39;s OAuth2 access token | [optional] 
 **userId** | **Number**| User&#39;s id | [optional] 

### Return type

null (empty response body)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="v1CorrelationsGet"></a>
# **v1CorrelationsGet**
> [Correlation] v1CorrelationsGet(opts)

Get correlations

Get correlations based on data from a single user.

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

var apiInstance = new QuantimodoApi.CorrelationsApi();

var opts = { 
  'accessToken': "accessToken_example", // String | User's OAuth2 access token
  'userId': 56, // Number | User's id
  'effect': "effect_example", // String | Variable name of the effect variable for which the user desires correlations
  'cause': "cause_example", // String | Variable name of the cause variable for which the user desires correlations
  'correlationCoefficient': "correlationCoefficient_example", // String | Pearson correlation coefficient between cause and effect after lagging by onset delay and grouping by duration of action
  'onsetDelay': "onsetDelay_example", // String | The amount of time in seconds that elapses after the predictor/stimulus event before the outcome as perceived by a self-tracker is known as the “onset delay”. For example, the “onset delay” between the time a person takes an aspirin (predictor/stimulus event) and the time a person perceives a change in their headache severity (outcome) is approximately 30 minutes.
  'durationOfAction': "durationOfAction_example", // String | The amount of time over which a predictor/stimulus event can exert an observable influence on an outcome variable’s value. For instance, aspirin (stimulus/predictor) typically decreases headache severity for approximately four hours (duration of action) following the onset delay.
  'updatedAt': "updatedAt_example", // String | The time that this measurement was last updated in the UTC format \"YYYY-MM-DDThh:mm:ss\".  Generally, you'll be retrieving new or updated user data. To avoid unnecessary API calls, you'll want to store your last refresh time locally. Then whenever you make a request to get new data, you should limit the returned results to those updated since your last refresh by appending append `?updatedAt=(ge)2013-01-D01T01:01:01 to your request.
  'limit': 56, // Number | The LIMIT is used to limit the number of results returned. So if you have 1000 results, but only want to the first 10, you would set this to 10 and offset to 0.
  'offset': 56, // Number | Since the maximum limit is 200 records, to get more than that you'll have to make multiple API calls and page through the results. To retrieve all the data, you can iterate through data by using the `limit` and `offset` query parameters.  For example, if you want to retrieve data from 61-80 then you can use a query with the following parameters, `imit=20&offset=60`.
  'sort': 56, // Number | Sort by given field. If the field is prefixed with `-, it will sort in descending order.
  'outcomesOfInterest': true // Boolean | Only include correlations for which the effect is an outcome of interest for the user
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.v1CorrelationsGet(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **accessToken** | **String**| User&#39;s OAuth2 access token | [optional] 
 **userId** | **Number**| User&#39;s id | [optional] 
 **effect** | **String**| Variable name of the effect variable for which the user desires correlations | [optional] 
 **cause** | **String**| Variable name of the cause variable for which the user desires correlations | [optional] 
 **correlationCoefficient** | **String**| Pearson correlation coefficient between cause and effect after lagging by onset delay and grouping by duration of action | [optional] 
 **onsetDelay** | **String**| The amount of time in seconds that elapses after the predictor/stimulus event before the outcome as perceived by a self-tracker is known as the “onset delay”. For example, the “onset delay” between the time a person takes an aspirin (predictor/stimulus event) and the time a person perceives a change in their headache severity (outcome) is approximately 30 minutes. | [optional] 
 **durationOfAction** | **String**| The amount of time over which a predictor/stimulus event can exert an observable influence on an outcome variable’s value. For instance, aspirin (stimulus/predictor) typically decreases headache severity for approximately four hours (duration of action) following the onset delay. | [optional] 
 **updatedAt** | **String**| The time that this measurement was last updated in the UTC format \&quot;YYYY-MM-DDThh:mm:ss\&quot;.  Generally, you&#39;ll be retrieving new or updated user data. To avoid unnecessary API calls, you&#39;ll want to store your last refresh time locally. Then whenever you make a request to get new data, you should limit the returned results to those updated since your last refresh by appending append &#x60;?updatedAt&#x3D;(ge)2013-01-D01T01:01:01 to your request. | [optional] 
 **limit** | **Number**| The LIMIT is used to limit the number of results returned. So if you have 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. | [optional] 
 **offset** | **Number**| Since the maximum limit is 200 records, to get more than that you&#39;ll have to make multiple API calls and page through the results. To retrieve all the data, you can iterate through data by using the &#x60;limit&#x60; and &#x60;offset&#x60; query parameters.  For example, if you want to retrieve data from 61-80 then you can use a query with the following parameters, &#x60;imit&#x3D;20&amp;offset&#x3D;60&#x60;. | [optional] 
 **sort** | **Number**| Sort by given field. If the field is prefixed with &#x60;-, it will sort in descending order. | [optional] 
 **outcomesOfInterest** | **Boolean**| Only include correlations for which the effect is an outcome of interest for the user | [optional] 

### Return type

[**[Correlation]**](Correlation.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="v1OrganizationsOrganizationIdUsersUserIdVariablesVariableNameCausesGet"></a>
# **v1OrganizationsOrganizationIdUsersUserIdVariablesVariableNameCausesGet**
> [Correlation] v1OrganizationsOrganizationIdUsersUserIdVariablesVariableNameCausesGet(organizationId, userId2, variableName, organizationToken, opts)

Search user correlations for a given cause

Returns average of all correlations and votes for all user cause variables for a given cause. If parameter \&quot;include_public\&quot; is used, it also returns public correlations. User correlation overwrites or supersedes public correlation.

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

var apiInstance = new QuantimodoApi.CorrelationsApi();

var organizationId = 56; // Number | Organization ID

var userId2 = 56; // Number | User id

var variableName = "variableName_example"; // String | Effect variable name

var organizationToken = "organizationToken_example"; // String | Organization access token

var opts = { 
  'accessToken': "accessToken_example", // String | User's OAuth2 access token
  'userId': 56, // Number | User's id
  'includePublic': "includePublic_example" // String | Include public correlations, Can be \"1\" or empty.
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.v1OrganizationsOrganizationIdUsersUserIdVariablesVariableNameCausesGet(organizationId, userId2, variableName, organizationToken, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **organizationId** | **Number**| Organization ID | 
 **userId2** | **Number**| User id | 
 **variableName** | **String**| Effect variable name | 
 **organizationToken** | **String**| Organization access token | 
 **accessToken** | **String**| User&#39;s OAuth2 access token | [optional] 
 **userId** | **Number**| User&#39;s id | [optional] 
 **includePublic** | **String**| Include public correlations, Can be \&quot;1\&quot; or empty. | [optional] 

### Return type

[**[Correlation]**](Correlation.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="v1OrganizationsOrganizationIdUsersUserIdVariablesVariableNameEffectsGet"></a>
# **v1OrganizationsOrganizationIdUsersUserIdVariablesVariableNameEffectsGet**
> [CommonResponse] v1OrganizationsOrganizationIdUsersUserIdVariablesVariableNameEffectsGet(organizationId, userId2, variableName, organizationToken, opts)

Search user correlations for a given cause

Returns average of all correlations and votes for all user cause variables for a given effect. If parameter \&quot;include_public\&quot; is used, it also returns public correlations. User correlation overwrites or supersedes public correlation.

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

var apiInstance = new QuantimodoApi.CorrelationsApi();

var organizationId = 56; // Number | Organization ID

var userId2 = 56; // Number | User id

var variableName = "variableName_example"; // String | Cause variable name

var organizationToken = "organizationToken_example"; // String | Organization access token

var opts = { 
  'accessToken': "accessToken_example", // String | User's OAuth2 access token
  'userId': 56, // Number | User's id
  'includePublic': "includePublic_example" // String | Include public correlations, Can be \"1\" or empty.
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.v1OrganizationsOrganizationIdUsersUserIdVariablesVariableNameEffectsGet(organizationId, userId2, variableName, organizationToken, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **organizationId** | **Number**| Organization ID | 
 **userId2** | **Number**| User id | 
 **variableName** | **String**| Cause variable name | 
 **organizationToken** | **String**| Organization access token | 
 **accessToken** | **String**| User&#39;s OAuth2 access token | [optional] 
 **userId** | **Number**| User&#39;s id | [optional] 
 **includePublic** | **String**| Include public correlations, Can be \&quot;1\&quot; or empty. | [optional] 

### Return type

[**[CommonResponse]**](CommonResponse.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="v1PublicCorrelationsSearchSearchGet"></a>
# **v1PublicCorrelationsSearchSearchGet**
> [Correlation] v1PublicCorrelationsSearchSearchGet(search, effectOrCause, opts)

Get average correlations for variables containing search term

Returns the average correlations from all users for all public variables that contain the characters in the search query. Returns average of all users public variable correlations with a specified cause or effect.

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

var apiInstance = new QuantimodoApi.CorrelationsApi();

var search = "search_example"; // String | Name of the variable that you want to know the causes or effects of.

var effectOrCause = "effectOrCause_example"; // String | Setting this to effect indicates that the searched variable is the effect and that the causes of this variable should be returned. cause indicates that the searched variable is the cause and the effects should be returned.

var opts = { 
  'accessToken': "accessToken_example", // String | User's OAuth2 access token
  'userId': 56, // Number | User's id
  'outcomesOfInterest': true // Boolean | Only include correlations for which the effect is an outcome of interest for the user
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.v1PublicCorrelationsSearchSearchGet(search, effectOrCause, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **search** | **String**| Name of the variable that you want to know the causes or effects of. | 
 **effectOrCause** | **String**| Setting this to effect indicates that the searched variable is the effect and that the causes of this variable should be returned. cause indicates that the searched variable is the cause and the effects should be returned. | 
 **accessToken** | **String**| User&#39;s OAuth2 access token | [optional] 
 **userId** | **Number**| User&#39;s id | [optional] 
 **outcomesOfInterest** | **Boolean**| Only include correlations for which the effect is an outcome of interest for the user | [optional] 

### Return type

[**[Correlation]**](Correlation.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="v1VariablesVariableNameCausesGet"></a>
# **v1VariablesVariableNameCausesGet**
> [Correlation] v1VariablesVariableNameCausesGet(variableName)

Search user correlations for a given effect

Returns average of all correlations and votes for all user cause variables for a given effect

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

var apiInstance = new QuantimodoApi.CorrelationsApi();

var variableName = "variableName_example"; // String | Effect variable name


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.v1VariablesVariableNameCausesGet(variableName, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **variableName** | **String**| Effect variable name | 

### Return type

[**[Correlation]**](Correlation.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="v1VariablesVariableNameEffectsGet"></a>
# **v1VariablesVariableNameEffectsGet**
> [Correlation] v1VariablesVariableNameEffectsGet(variableName, opts)

Search user correlations for a given cause

Returns average of all correlations and votes for all user effect variables for a given cause

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

var apiInstance = new QuantimodoApi.CorrelationsApi();

var variableName = "variableName_example"; // String | Cause variable name

var opts = { 
  'accessToken': "accessToken_example", // String | User's OAuth2 access token
  'userId': 56, // Number | User's id
  'correlationCoefficient': "correlationCoefficient_example" // String | You can use this to get effects with correlations greater than or less than 0
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.v1VariablesVariableNameEffectsGet(variableName, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **variableName** | **String**| Cause variable name | 
 **accessToken** | **String**| User&#39;s OAuth2 access token | [optional] 
 **userId** | **Number**| User&#39;s id | [optional] 
 **correlationCoefficient** | **String**| You can use this to get effects with correlations greater than or less than 0 | [optional] 

### Return type

[**[Correlation]**](Correlation.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="v1VariablesVariableNamePublicCausesGet"></a>
# **v1VariablesVariableNamePublicCausesGet**
> [Correlation] v1VariablesVariableNamePublicCausesGet(variableName, opts)

Search public correlations for a given effect

Returns average of all correlations and votes for all public cause variables for a given effect

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

var apiInstance = new QuantimodoApi.CorrelationsApi();

var variableName = "variableName_example"; // String | Effect variable name

var opts = { 
  'accessToken': "accessToken_example", // String | User's OAuth2 access token
  'userId': 56, // Number | User's id
  'correlationCoefficient': "correlationCoefficient_example" // String | You can use this to get causes with correlations greater than or less than 0
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.v1VariablesVariableNamePublicCausesGet(variableName, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **variableName** | **String**| Effect variable name | 
 **accessToken** | **String**| User&#39;s OAuth2 access token | [optional] 
 **userId** | **Number**| User&#39;s id | [optional] 
 **correlationCoefficient** | **String**| You can use this to get causes with correlations greater than or less than 0 | [optional] 

### Return type

[**[Correlation]**](Correlation.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="v1VariablesVariableNamePublicEffectsGet"></a>
# **v1VariablesVariableNamePublicEffectsGet**
> [Correlation] v1VariablesVariableNamePublicEffectsGet(variableName, opts)

Search public correlations for a given cause

Returns average of all correlations and votes for all public cause variables for a given cause

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

var apiInstance = new QuantimodoApi.CorrelationsApi();

var variableName = "variableName_example"; // String | Cause variable name

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
apiInstance.v1VariablesVariableNamePublicEffectsGet(variableName, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **variableName** | **String**| Cause variable name | 
 **accessToken** | **String**| User&#39;s OAuth2 access token | [optional] 
 **userId** | **Number**| User&#39;s id | [optional] 

### Return type

[**[Correlation]**](Correlation.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="v1VotesDeletePost"></a>
# **v1VotesDeletePost**
> CommonResponse v1VotesDeletePost(body, opts)

Delete vote

Delete previously posted vote

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

var apiInstance = new QuantimodoApi.CorrelationsApi();

var body = new QuantimodoApi.VoteDelete(); // VoteDelete | The cause and effect variable names for the predictor vote to be deleted.

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
apiInstance.v1VotesDeletePost(body, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**VoteDelete**](VoteDelete.md)| The cause and effect variable names for the predictor vote to be deleted. | 
 **accessToken** | **String**| User&#39;s OAuth2 access token | [optional] 
 **userId** | **Number**| User&#39;s id | [optional] 

### Return type

[**CommonResponse**](CommonResponse.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="v1VotesPost"></a>
# **v1VotesPost**
> CommonResponse v1VotesPost(body, opts)

Post or update vote

This is to enable users to indicate their opinion on the plausibility of a causal relationship between a treatment and outcome. QuantiModo incorporates crowd-sourced plausibility estimations into their algorithm. This is done allowing user to indicate their view of the plausibility of each relationship with thumbs up/down buttons placed next to each prediction.

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

var apiInstance = new QuantimodoApi.CorrelationsApi();

var body = new QuantimodoApi.PostVote(); // PostVote | Contains the cause variable, effect variable, and vote value.

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
apiInstance.v1VotesPost(body, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**PostVote**](PostVote.md)| Contains the cause variable, effect variable, and vote value. | 
 **accessToken** | **String**| User&#39;s OAuth2 access token | [optional] 
 **userId** | **Number**| User&#39;s id | [optional] 

### Return type

[**CommonResponse**](CommonResponse.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

