# Quantimodo.StudiesApi

All URIs are relative to *https://app.quantimo.do/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getOpenStudies**](StudiesApi.md#getOpenStudies) | **GET** /v3/studies/open | Get Open Studies
[**getStudiesCreated**](StudiesApi.md#getStudiesCreated) | **GET** /v3/studies/created | Get studies you have joined
[**getStudiesJoined**](StudiesApi.md#getStudiesJoined) | **GET** /v3/studies/joined | Get studies you have joined


<a name="getOpenStudies"></a>
# **getOpenStudies**
> GetStudiesResponse getOpenStudies(opts)

Get Open Studies

These are studies that anyone can join and share their data for the predictor and outcome variables of interest.

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

var apiInstance = new Quantimodo.StudiesApi();

var opts = { 
  'causeVariableName': "causeVariableName_example", // String | Variable name of the hypothetical cause variable.  Example: Sleep Duration
  'effectVariableName': "effectVariableName_example", // String | Variable name of the hypothetical effect variable.  Example: Overall Mood
  'userId': 8.14, // Number | User's id
  'appName': "appName_example", // String | Example: MoodiModo
  'clientId': "clientId_example", // String | Example: oauth_test_client
  'includeCharts': true, // Boolean | Highcharts configs that can be used if you have highcharts.js included on the page.  This only works if the id or name query parameter is also provided.
  'platform': "platform_example", // String | Example: chrome, android, ios, web
  'recalculate': true, // Boolean | Recalculate instead of using cached analysis
  'studyClientId': "studyClientId_example" // String | Client id for the cohort study you want
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getOpenStudies(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **causeVariableName** | **String**| Variable name of the hypothetical cause variable.  Example: Sleep Duration | [optional] 
 **effectVariableName** | **String**| Variable name of the hypothetical effect variable.  Example: Overall Mood | [optional] 
 **userId** | **Number**| User&#39;s id | [optional] 
 **appName** | **String**| Example: MoodiModo | [optional] 
 **clientId** | **String**| Example: oauth_test_client | [optional] 
 **includeCharts** | **Boolean**| Highcharts configs that can be used if you have highcharts.js included on the page.  This only works if the id or name query parameter is also provided. | [optional] 
 **platform** | **String**| Example: chrome, android, ios, web | [optional] 
 **recalculate** | **Boolean**| Recalculate instead of using cached analysis | [optional] 
 **studyClientId** | **String**| Client id for the cohort study you want | [optional] 

### Return type

[**GetStudiesResponse**](GetStudiesResponse.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getStudiesCreated"></a>
# **getStudiesCreated**
> GetStudiesResponse getStudiesCreated(opts)

Get studies you have joined

These are studies that you have created.

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

var apiInstance = new Quantimodo.StudiesApi();

var opts = { 
  'causeVariableName': "causeVariableName_example", // String | Variable name of the hypothetical cause variable.  Example: Sleep Duration
  'effectVariableName': "effectVariableName_example", // String | Variable name of the hypothetical effect variable.  Example: Overall Mood
  'sort': "sort_example", // String | Sort by one of the listed field names. If the field name is prefixed with `-`, it will sort in descending order.
  'limit': 100, // Number | The LIMIT is used to limit the number of results returned. So if youhave 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. The maximum limit is 200 records.
  'offset': 56, // Number | OFFSET says to skip that many rows before beginning to return rows to the client. OFFSET 0 is the same as omitting the OFFSET clause.If both OFFSET and LIMIT appear, then OFFSET rows are skipped before starting to count the LIMIT rows that are returned.
  'userId': 8.14, // Number | User's id
  'updatedAt': "updatedAt_example", // String | When the record was last updated. Use UTC ISO 8601 YYYY-MM-DDThh:mm:ss datetime format. Time zone should be UTC and not local.
  'clientId': "clientId_example", // String | Example: oauth_test_client
  'platform': "platform_example", // String | Example: chrome, android, ios, web
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getStudiesCreated(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **causeVariableName** | **String**| Variable name of the hypothetical cause variable.  Example: Sleep Duration | [optional] 
 **effectVariableName** | **String**| Variable name of the hypothetical effect variable.  Example: Overall Mood | [optional] 
 **sort** | **String**| Sort by one of the listed field names. If the field name is prefixed with &#x60;-&#x60;, it will sort in descending order. | [optional] 
 **limit** | **Number**| The LIMIT is used to limit the number of results returned. So if youhave 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. The maximum limit is 200 records. | [optional] [default to 100]
 **offset** | **Number**| OFFSET says to skip that many rows before beginning to return rows to the client. OFFSET 0 is the same as omitting the OFFSET clause.If both OFFSET and LIMIT appear, then OFFSET rows are skipped before starting to count the LIMIT rows that are returned. | [optional] 
 **userId** | **Number**| User&#39;s id | [optional] 
 **updatedAt** | **String**| When the record was last updated. Use UTC ISO 8601 YYYY-MM-DDThh:mm:ss datetime format. Time zone should be UTC and not local. | [optional] 
 **clientId** | **String**| Example: oauth_test_client | [optional] 
 **platform** | **String**| Example: chrome, android, ios, web | [optional] 

### Return type

[**GetStudiesResponse**](GetStudiesResponse.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getStudiesJoined"></a>
# **getStudiesJoined**
> GetStudiesResponse getStudiesJoined(opts)

Get studies you have joined

These are studies that you are currently sharing your data with.

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

var apiInstance = new Quantimodo.StudiesApi();

var opts = { 
  'causeVariableName': "causeVariableName_example", // String | Variable name of the hypothetical cause variable.  Example: Sleep Duration
  'effectVariableName': "effectVariableName_example", // String | Variable name of the hypothetical effect variable.  Example: Overall Mood
  'sort': "sort_example", // String | Sort by one of the listed field names. If the field name is prefixed with `-`, it will sort in descending order.
  'limit': 100, // Number | The LIMIT is used to limit the number of results returned. So if youhave 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. The maximum limit is 200 records.
  'offset': 56, // Number | OFFSET says to skip that many rows before beginning to return rows to the client. OFFSET 0 is the same as omitting the OFFSET clause.If both OFFSET and LIMIT appear, then OFFSET rows are skipped before starting to count the LIMIT rows that are returned.
  'userId': 8.14, // Number | User's id
  'correlationCoefficient': "correlationCoefficient_example", // String | Pearson correlation coefficient between cause and effect after lagging by onset delay and grouping by duration of action
  'updatedAt': "updatedAt_example", // String | When the record was last updated. Use UTC ISO 8601 YYYY-MM-DDThh:mm:ss datetime format. Time zone should be UTC and not local.
  'outcomesOfInterest': true, // Boolean | Only include correlations for which the effect is an outcome of interest for the user
  'clientId': "clientId_example", // String | Example: oauth_test_client
  'platform': "platform_example", // String | Example: chrome, android, ios, web
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getStudiesJoined(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **causeVariableName** | **String**| Variable name of the hypothetical cause variable.  Example: Sleep Duration | [optional] 
 **effectVariableName** | **String**| Variable name of the hypothetical effect variable.  Example: Overall Mood | [optional] 
 **sort** | **String**| Sort by one of the listed field names. If the field name is prefixed with &#x60;-&#x60;, it will sort in descending order. | [optional] 
 **limit** | **Number**| The LIMIT is used to limit the number of results returned. So if youhave 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. The maximum limit is 200 records. | [optional] [default to 100]
 **offset** | **Number**| OFFSET says to skip that many rows before beginning to return rows to the client. OFFSET 0 is the same as omitting the OFFSET clause.If both OFFSET and LIMIT appear, then OFFSET rows are skipped before starting to count the LIMIT rows that are returned. | [optional] 
 **userId** | **Number**| User&#39;s id | [optional] 
 **correlationCoefficient** | **String**| Pearson correlation coefficient between cause and effect after lagging by onset delay and grouping by duration of action | [optional] 
 **updatedAt** | **String**| When the record was last updated. Use UTC ISO 8601 YYYY-MM-DDThh:mm:ss datetime format. Time zone should be UTC and not local. | [optional] 
 **outcomesOfInterest** | **Boolean**| Only include correlations for which the effect is an outcome of interest for the user | [optional] 
 **clientId** | **String**| Example: oauth_test_client | [optional] 
 **platform** | **String**| Example: chrome, android, ios, web | [optional] 

### Return type

[**GetStudiesResponse**](GetStudiesResponse.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

