# Quantimodo.AnalyticsApi

All URIs are relative to *https://app.quantimo.do/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteVote**](AnalyticsApi.md#deleteVote) | **DELETE** /v3/votes/delete | Delete vote
[**getAggregatedCorrelations**](AnalyticsApi.md#getAggregatedCorrelations) | **GET** /v3/aggregatedCorrelations | Get aggregated correlations
[**getUserCorrelationExplantions**](AnalyticsApi.md#getUserCorrelationExplantions) | **GET** /v3/correlations/explanations | Get correlation explanations
[**getUserCorrelations**](AnalyticsApi.md#getUserCorrelations) | **GET** /v4/correlations | Get correlations
[**postAggregatedCorrelations**](AnalyticsApi.md#postAggregatedCorrelations) | **POST** /v3/aggregatedCorrelations | Store or Update a Correlation
[**postVote**](AnalyticsApi.md#postVote) | **POST** /v3/votes | Post or update vote


<a name="deleteVote"></a>
# **deleteVote**
> CommonResponse deleteVote(body, opts)

Delete vote

Delete previously posted vote

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

var apiInstance = new Quantimodo.AnalyticsApi();

var body = new Quantimodo.VoteDelete(); // VoteDelete | The cause and effect variable names for the predictor vote to be deleted.

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
apiInstance.deleteVote(body, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**VoteDelete**](VoteDelete.md)| The cause and effect variable names for the predictor vote to be deleted. | 
 **userId** | **Number**| User&#39;s id | [optional] 

### Return type

[**CommonResponse**](CommonResponse.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getAggregatedCorrelations"></a>
# **getAggregatedCorrelations**
> [AggregatedCorrelation] getAggregatedCorrelations(opts)

Get aggregated correlations

Get correlations based on the anonymized aggregate data from all QuantiModo users.

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

var apiInstance = new Quantimodo.AnalyticsApi();

var opts = { 
  'userId': 3.4 // Number | User's id
  'effectVariableName': "effectVariableName_example", // String | Variable name of the hypothetical effect variable.  Example: Overall Mood
  'causeVariableName': "causeVariableName_example", // String | Variable name of the hypothetical cause variable.  Example: Sleep Duration
  'correlationCoefficient': "correlationCoefficient_example", // String | Pearson correlation coefficient between cause and effect after lagging by onset delay and grouping by duration of action
  'onsetDelay': "onsetDelay_example", // String | The amount of time in seconds that elapses after the predictor/stimulus event before the outcome as perceived by a self-tracker is known as the onset delay. For example, the onset delay between the time a person takes an aspirin (predictor/stimulus event) and the time a person perceives a change in their headache severity (outcome) is approximately 30 minutes.
  'durationOfAction': "durationOfAction_example", // String | The amount of time over which a predictor/stimulus event can exert an observable influence on an outcome variable value. For instance, aspirin (stimulus/predictor) typically decreases headache severity for approximately four hours (duration of action) following the onset delay.
  'updatedAt': "updatedAt_example", // String | When the record was last updated. Use UTC ISO 8601 `YYYY-MM-DDThh:mm:ss` datetime format. Time zone should be UTC and not local.
  'limit': 100, // Number | The LIMIT is used to limit the number of results returned. So if youhave 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. The maximum limit is 200 records.
  'offset': 56, // Number | OFFSET says to skip that many rows before beginning to return rows to the client. OFFSET 0 is the same as omitting the OFFSET clause.If both OFFSET and LIMIT appear, then OFFSET rows are skipped before starting to count the LIMIT rows that are returned.
  'sort': "sort_example", // String | Sort by one of the listed field names. If the field name is prefixed with `-`, it will sort in descending order.
  'outcomesOfInterest': true // Boolean | Only include correlations for which the effect is an outcome of interest for the user
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getAggregatedCorrelations(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Number**| User&#39;s id | [optional] 
 **effectVariableName** | **String**| Variable name of the hypothetical effect variable.  Example: Overall Mood | [optional] 
 **causeVariableName** | **String**| Variable name of the hypothetical cause variable.  Example: Sleep Duration | [optional] 
 **correlationCoefficient** | **String**| Pearson correlation coefficient between cause and effect after lagging by onset delay and grouping by duration of action | [optional] 
 **onsetDelay** | **String**| The amount of time in seconds that elapses after the predictor/stimulus event before the outcome as perceived by a self-tracker is known as the onset delay. For example, the onset delay between the time a person takes an aspirin (predictor/stimulus event) and the time a person perceives a change in their headache severity (outcome) is approximately 30 minutes. | [optional] 
 **durationOfAction** | **String**| The amount of time over which a predictor/stimulus event can exert an observable influence on an outcome variable value. For instance, aspirin (stimulus/predictor) typically decreases headache severity for approximately four hours (duration of action) following the onset delay. | [optional] 
 **updatedAt** | **String**| When the record was last updated. Use UTC ISO 8601 &#x60;YYYY-MM-DDThh:mm:ss&#x60; datetime format. Time zone should be UTC and not local. | [optional] 
 **limit** | **Number**| The LIMIT is used to limit the number of results returned. So if youhave 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. The maximum limit is 200 records. | [optional] [default to 100]
 **offset** | **Number**| OFFSET says to skip that many rows before beginning to return rows to the client. OFFSET 0 is the same as omitting the OFFSET clause.If both OFFSET and LIMIT appear, then OFFSET rows are skipped before starting to count the LIMIT rows that are returned. | [optional] 
 **sort** | **String**| Sort by one of the listed field names. If the field name is prefixed with &#x60;-&#x60;, it will sort in descending order. | [optional] 
 **outcomesOfInterest** | **Boolean**| Only include correlations for which the effect is an outcome of interest for the user | [optional] 

### Return type

[**[AggregatedCorrelation]**](AggregatedCorrelation.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getUserCorrelationExplantions"></a>
# **getUserCorrelationExplantions**
> [UserCorrelation] getUserCorrelationExplantions(opts)

Get correlation explanations

Get explanations of  correlations based on data from a single user.

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

var apiInstance = new Quantimodo.AnalyticsApi();

var opts = { 
  'effectVariableName': "effectVariableName_example", // String | Variable name of the hypothetical effect variable.  Example: Overall Mood
  'causeVariableName': "causeVariableName_example", // String | Variable name of the hypothetical cause variable.  Example: Sleep Duration
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getUserCorrelationExplantions(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **effectVariableName** | **String**| Variable name of the hypothetical effect variable.  Example: Overall Mood | [optional] 
 **causeVariableName** | **String**| Variable name of the hypothetical cause variable.  Example: Sleep Duration | [optional] 

### Return type

[**[UserCorrelation]**](UserCorrelation.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getUserCorrelations"></a>
# **getUserCorrelations**
> [UserCorrelation] getUserCorrelations(opts)

Get correlations

Get correlations based on data from a single user.

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

var apiInstance = new Quantimodo.AnalyticsApi();

var opts = { 
  'userId': 3.4 // Number | User's id
  'effectVariableName': "effectVariableName_example", // String | Variable name of the hypothetical effect variable.  Example: Overall Mood
  'causeVariableName': "causeVariableName_example", // String | Variable name of the hypothetical cause variable.  Example: Sleep Duration
  'correlationCoefficient': "correlationCoefficient_example", // String | Pearson correlation coefficient between cause and effect after lagging by onset delay and grouping by duration of action
  'onsetDelay': "onsetDelay_example", // String | The amount of time in seconds that elapses after the predictor/stimulus event before the outcome as perceived by a self-tracker is known as the onset delay. For example, the onset delay between the time a person takes an aspirin (predictor/stimulus event) and the time a person perceives a change in their headache severity (outcome) is approximately 30 minutes.
  'durationOfAction': "durationOfAction_example", // String | The amount of time over which a predictor/stimulus event can exert an observable influence on an outcome variable value. For instance, aspirin (stimulus/predictor) typically decreases headache severity for approximately four hours (duration of action) following the onset delay.
  'updatedAt': "updatedAt_example", // String | When the record was last updated. Use UTC ISO 8601 `YYYY-MM-DDThh:mm:ss` datetime format. Time zone should be UTC and not local.
  'limit': 100, // Number | The LIMIT is used to limit the number of results returned. So if youhave 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. The maximum limit is 200 records.
  'offset': 56, // Number | OFFSET says to skip that many rows before beginning to return rows to the client. OFFSET 0 is the same as omitting the OFFSET clause.If both OFFSET and LIMIT appear, then OFFSET rows are skipped before starting to count the LIMIT rows that are returned.
  'sort': "sort_example", // String | Sort by one of the listed field names. If the field name is prefixed with `-`, it will sort in descending order.
  'outcomesOfInterest': true // Boolean | Only include correlations for which the effect is an outcome of interest for the user
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getUserCorrelations(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Number**| User&#39;s id | [optional] 
 **effectVariableName** | **String**| Variable name of the hypothetical effect variable.  Example: Overall Mood | [optional] 
 **causeVariableName** | **String**| Variable name of the hypothetical cause variable.  Example: Sleep Duration | [optional] 
 **correlationCoefficient** | **String**| Pearson correlation coefficient between cause and effect after lagging by onset delay and grouping by duration of action | [optional] 
 **onsetDelay** | **String**| The amount of time in seconds that elapses after the predictor/stimulus event before the outcome as perceived by a self-tracker is known as the onset delay. For example, the onset delay between the time a person takes an aspirin (predictor/stimulus event) and the time a person perceives a change in their headache severity (outcome) is approximately 30 minutes. | [optional] 
 **durationOfAction** | **String**| The amount of time over which a predictor/stimulus event can exert an observable influence on an outcome variable value. For instance, aspirin (stimulus/predictor) typically decreases headache severity for approximately four hours (duration of action) following the onset delay. | [optional] 
 **updatedAt** | **String**| When the record was last updated. Use UTC ISO 8601 &#x60;YYYY-MM-DDThh:mm:ss&#x60; datetime format. Time zone should be UTC and not local. | [optional] 
 **limit** | **Number**| The LIMIT is used to limit the number of results returned. So if youhave 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. The maximum limit is 200 records. | [optional] [default to 100]
 **offset** | **Number**| OFFSET says to skip that many rows before beginning to return rows to the client. OFFSET 0 is the same as omitting the OFFSET clause.If both OFFSET and LIMIT appear, then OFFSET rows are skipped before starting to count the LIMIT rows that are returned. | [optional] 
 **sort** | **String**| Sort by one of the listed field names. If the field name is prefixed with &#x60;-&#x60;, it will sort in descending order. | [optional] 
 **outcomesOfInterest** | **Boolean**| Only include correlations for which the effect is an outcome of interest for the user | [optional] 

### Return type

[**[UserCorrelation]**](UserCorrelation.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="postAggregatedCorrelations"></a>
# **postAggregatedCorrelations**
> postAggregatedCorrelations(body, opts)

Store or Update a Correlation

Add correlation

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

var apiInstance = new Quantimodo.AnalyticsApi();

var body = new Quantimodo.PostCorrelation(); // PostCorrelation | Provides correlation data

var opts = { 
  'userId': 3.4 // Number | User's id
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.postAggregatedCorrelations(body, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**PostCorrelation**](PostCorrelation.md)| Provides correlation data | 
 **userId** | **Number**| User&#39;s id | [optional] 

### Return type

null (empty response body)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="postVote"></a>
# **postVote**
> CommonResponse postVote(body, opts)

Post or update vote

This is to enable users to indicate their opinion on the plausibility of a causal relationship between a treatment and outcome. QuantiModo incorporates crowd-sourced plausibility estimations into their algorithm. This is done allowing user to indicate their view of the plausibility of each relationship with thumbs up/down buttons placed next to each prediction.

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

var apiInstance = new Quantimodo.AnalyticsApi();

var body = new Quantimodo.Vote(); // Vote | Contains the cause variable, effect variable, and vote value.

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
apiInstance.postVote(body, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**Vote**](Vote.md)| Contains the cause variable, effect variable, and vote value. | 
 **userId** | **Number**| User&#39;s id | [optional] 

### Return type

[**CommonResponse**](CommonResponse.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

