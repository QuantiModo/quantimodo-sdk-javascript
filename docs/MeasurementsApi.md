# QMApi.MeasurementsApi

All URIs are relative to *https://app.quantimo.do/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteMeasurement**](MeasurementsApi.md#deleteMeasurement) | **DELETE** /v1/measurements/delete | Delete a measurement
[**getMeasurements**](MeasurementsApi.md#getMeasurements) | **GET** /v1/measurements | Get measurements for this user
[**getPairs**](MeasurementsApi.md#getPairs) | **GET** /v1/pairs | Get pairs of measurements for correlational analysis
[**measurementExportRequest**](MeasurementsApi.md#measurementExportRequest) | **POST** /v2/measurements/exportRequest | Post Request for Measurements CSV
[**postMeasurements**](MeasurementsApi.md#postMeasurements) | **POST** /v1/measurements | Post a new set or update existing measurements to the database
[**v1MeasurementsUpdatePut**](MeasurementsApi.md#v1MeasurementsUpdatePut) | **PUT** /v1/measurements/update | Update a measurement


<a name="deleteMeasurement"></a>
# **deleteMeasurement**
> CommonResponse deleteMeasurement(body)

Delete a measurement

Delete a previously submitted measurement

### Example
```javascript
var QMApi = require('quantimodo-sdk-javascript');
var defaultClient = QMApi.ApiClient.instance;

// Configure API key authorization: access_token
var access_token = defaultClient.authentications['access_token'];
access_token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix = 'Token';

// Configure OAuth2 access token for authorization: quantimodo_oauth2
var quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new QMApi.MeasurementsApi();

var body = new QMApi.MeasurementDelete(); // MeasurementDelete | The startTime and variableId of the measurement to be deleted.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.deleteMeasurement(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**MeasurementDelete**](MeasurementDelete.md)| The startTime and variableId of the measurement to be deleted. | 

### Return type

[**CommonResponse**](CommonResponse.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getMeasurements"></a>
# **getMeasurements**
> Measurement getMeasurements(opts)

Get measurements for this user

Measurements are any value that can be recorded like daily steps, a mood rating, or apples eaten. Supported filter parameters:&lt;ul&gt;&lt;li&gt;&lt;b&gt;value&lt;/b&gt; - Value of measurement&lt;/li&gt;&lt;li&gt;&lt;b&gt;updatedAt&lt;/b&gt; - The time that this measurement was created or last updated in the UTC format \&quot;YYYY-MM-DDThh:mm:ss\&quot;&lt;/li&gt;&lt;/ul&gt;

### Example
```javascript
var QMApi = require('quantimodo-sdk-javascript');
var defaultClient = QMApi.ApiClient.instance;

// Configure API key authorization: access_token
var access_token = defaultClient.authentications['access_token'];
access_token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix = 'Token';

// Configure OAuth2 access token for authorization: quantimodo_oauth2
var quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new QMApi.MeasurementsApi();

var opts = { 
  'userId': 3.4 // Number | User's id
  'id': 56, // Number | Measurement id
  'variableName': "variableName_example", // String | Name of the variable you want measurements for
  'variableCategoryName': "variableCategoryName_example", // String | Limit results to a specific variable category
  'sourceName': "sourceName_example", // String | ID of the source you want measurements for (supports exact name match only)
  'value': "value_example", // String | Value of measurement
  'unitAbbreviatedName': "unitAbbreviatedName_example", // String | The unit you want the measurements returned in
  'earliestMeasurementTime': "earliestMeasurementTime_example", // String | The lower limit of measurements returned in ISO 8601 format or epoch seconds (unixtime)
  'latestMeasurementTime': "latestMeasurementTime_example", // String | The upper limit of measurements returned in ISO 8601 format or epoch seconds (unixtime)
  'createdAt': "createdAt_example", // String | When the record was first created. Use UTC ISO 8601 \"YYYY-MM-DDThh:mm:ss\"  datetime format. Time zone should be UTC and not local.
  'updatedAt': "updatedAt_example", // String | When the record was last updated. Use UTC ISO 8601 \"YYYY-MM-DDThh:mm:ss\"  datetime format. Time zone should be UTC and not local.
  'groupingWidth': 56, // Number | The time (in seconds) over which measurements are grouped together
  'groupingTimezone': "groupingTimezone_example", // String | The time (in seconds) over which measurements are grouped together
  'limit': 100, // Number | The LIMIT is used to limit the number of results returned. So if youhave 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. The maximum limit is 200 records.
  'offset': 56, // Number | OFFSET says to skip that many rows before beginning to return rows to the client. OFFSET 0 is the same as omitting the OFFSET clause.If both OFFSET and LIMIT appear, then OFFSET rows are skipped before starting to count the LIMIT rows that are returned.
  'sort': "sort_example" // String | Sort by one of the listed field names. If the field name is prefixed with `-`, it will sort in descending order.
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getMeasurements(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Number**| User&#39;s id | [optional] 
 **id** | **Number**| Measurement id | [optional] 
 **variableName** | **String**| Name of the variable you want measurements for | [optional] 
 **variableCategoryName** | **String**| Limit results to a specific variable category | [optional] 
 **sourceName** | **String**| ID of the source you want measurements for (supports exact name match only) | [optional] 
 **value** | **String**| Value of measurement | [optional] 
 **unitAbbreviatedName** | **String**| The unit you want the measurements returned in | [optional] 
 **earliestMeasurementTime** | **String**| The lower limit of measurements returned in ISO 8601 format or epoch seconds (unixtime) | [optional] 
 **latestMeasurementTime** | **String**| The upper limit of measurements returned in ISO 8601 format or epoch seconds (unixtime) | [optional] 
 **createdAt** | **String**| When the record was first created. Use UTC ISO 8601 \&quot;YYYY-MM-DDThh:mm:ss\&quot;  datetime format. Time zone should be UTC and not local. | [optional] 
 **updatedAt** | **String**| When the record was last updated. Use UTC ISO 8601 \&quot;YYYY-MM-DDThh:mm:ss\&quot;  datetime format. Time zone should be UTC and not local. | [optional] 
 **groupingWidth** | **Number**| The time (in seconds) over which measurements are grouped together | [optional] 
 **groupingTimezone** | **String**| The time (in seconds) over which measurements are grouped together | [optional] 
 **limit** | **Number**| The LIMIT is used to limit the number of results returned. So if youhave 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. The maximum limit is 200 records. | [optional] [default to 100]
 **offset** | **Number**| OFFSET says to skip that many rows before beginning to return rows to the client. OFFSET 0 is the same as omitting the OFFSET clause.If both OFFSET and LIMIT appear, then OFFSET rows are skipped before starting to count the LIMIT rows that are returned. | [optional] 
 **sort** | **String**| Sort by one of the listed field names. If the field name is prefixed with &#x60;-&#x60;, it will sort in descending order. | [optional] 

### Return type

[**Measurement**](Measurement.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getPairs"></a>
# **getPairs**
> [Pairs] getPairs(causeVariableName, effectVariableName, opts)

Get pairs of measurements for correlational analysis

Pairs cause measurements with effect measurements grouped over the duration of action after the onset delay.

### Example
```javascript
var QMApi = require('quantimodo-sdk-javascript');
var defaultClient = QMApi.ApiClient.instance;

// Configure API key authorization: access_token
var access_token = defaultClient.authentications['access_token'];
access_token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix = 'Token';

// Configure OAuth2 access token for authorization: quantimodo_oauth2
var quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new QMApi.MeasurementsApi();

var causeVariableName = "causeVariableName_example"; // String | Original variable name for the explanatory or independent variable

var effectVariableName = "effectVariableName_example"; // String | Original variable name for the outcome or dependent variable

var opts = { 
  'userId': 3.4 // Number | User's id
  'causeSource': "causeSource_example", // String | Name of data source that the cause measurements should come from
  'causeUnit': "causeUnit_example", // String | Abbreviated name for the unit cause measurements to be returned in
  'delay': "delay_example", // String | The amount of time in seconds that elapses after the predictor/stimulus event before the outcome as perceived by a self-tracker is known as the “onset delay”. For example, the “onset delay” between the time a person takes an aspirin (predictor/stimulus event) and the time a person perceives a change in their headache severity (outcome) is approximately 30 minutes.
  'duration': "duration_example", // String | The amount of time over which a predictor/stimulus event can exert an observable influence on an outcome variable’s value. For instance, aspirin (stimulus/predictor) typically decreases headache severity for approximately four hours (duration of action) following the onset delay.
  'effectSource': "effectSource_example", // String | Name of data source that the effectmeasurements should come from
  'effectUnit': "effectUnit_example", // String | Abbreviated name for the unit effect measurements to be returned in
  'endTime': "endTime_example", // String | The most recent date (in epoch time) for which we should return measurements
  'startTime': "startTime_example", // String | The earliest date (in epoch time) for which we should return measurements
  'limit': 100, // Number | The LIMIT is used to limit the number of results returned. So if youhave 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. The maximum limit is 200 records.
  'offset': 56, // Number | OFFSET says to skip that many rows before beginning to return rows to the client. OFFSET 0 is the same as omitting the OFFSET clause.If both OFFSET and LIMIT appear, then OFFSET rows are skipped before starting to count the LIMIT rows that are returned.
  'sort': "sort_example" // String | Sort by one of the listed field names. If the field name is prefixed with `-`, it will sort in descending order.
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getPairs(causeVariableName, effectVariableName, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **causeVariableName** | **String**| Original variable name for the explanatory or independent variable | 
 **effectVariableName** | **String**| Original variable name for the outcome or dependent variable | 
 **userId** | **Number**| User&#39;s id | [optional] 
 **causeSource** | **String**| Name of data source that the cause measurements should come from | [optional] 
 **causeUnit** | **String**| Abbreviated name for the unit cause measurements to be returned in | [optional] 
 **delay** | **String**| The amount of time in seconds that elapses after the predictor/stimulus event before the outcome as perceived by a self-tracker is known as the “onset delay”. For example, the “onset delay” between the time a person takes an aspirin (predictor/stimulus event) and the time a person perceives a change in their headache severity (outcome) is approximately 30 minutes. | [optional] 
 **duration** | **String**| The amount of time over which a predictor/stimulus event can exert an observable influence on an outcome variable’s value. For instance, aspirin (stimulus/predictor) typically decreases headache severity for approximately four hours (duration of action) following the onset delay. | [optional] 
 **effectSource** | **String**| Name of data source that the effectmeasurements should come from | [optional] 
 **effectUnit** | **String**| Abbreviated name for the unit effect measurements to be returned in | [optional] 
 **endTime** | **String**| The most recent date (in epoch time) for which we should return measurements | [optional] 
 **startTime** | **String**| The earliest date (in epoch time) for which we should return measurements | [optional] 
 **limit** | **Number**| The LIMIT is used to limit the number of results returned. So if youhave 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. The maximum limit is 200 records. | [optional] [default to 100]
 **offset** | **Number**| OFFSET says to skip that many rows before beginning to return rows to the client. OFFSET 0 is the same as omitting the OFFSET clause.If both OFFSET and LIMIT appear, then OFFSET rows are skipped before starting to count the LIMIT rows that are returned. | [optional] 
 **sort** | **String**| Sort by one of the listed field names. If the field name is prefixed with &#x60;-&#x60;, it will sort in descending order. | [optional] 

### Return type

[**[Pairs]**](Pairs.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="measurementExportRequest"></a>
# **measurementExportRequest**
> &#39;Number&#39; measurementExportRequest(opts)

Post Request for Measurements CSV

Use this endpoint to schedule a CSV export containing all user measurements to be emailed to the user within 24 hours.

### Example
```javascript
var QMApi = require('quantimodo-sdk-javascript');
var defaultClient = QMApi.ApiClient.instance;

// Configure API key authorization: access_token
var access_token = defaultClient.authentications['access_token'];
access_token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix = 'Token';

// Configure OAuth2 access token for authorization: quantimodo_oauth2
var quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new QMApi.MeasurementsApi();

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
apiInstance.measurementExportRequest(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Number**| User&#39;s id | [optional] 

### Return type

**&#39;Number&#39;**

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="postMeasurements"></a>
# **postMeasurements**
> postMeasurements(body, opts)

Post a new set or update existing measurements to the database

You can submit or update multiple measurements in a \&quot;measurements\&quot; sub-array.  If the variable these measurements correspond to does not already exist in the database, it will be automatically added.  The request body should look something like [{\&quot;measurements\&quot;:[{\&quot;startTime\&quot;:1439389320,\&quot;value\&quot;:\&quot;3\&quot;}, {\&quot;startTime\&quot;:1439389319,\&quot;value\&quot;:\&quot;2\&quot;}],\&quot;name\&quot;:\&quot;Acne (out of 5)\&quot;,\&quot;source\&quot;:\&quot;QuantiModo\&quot;,\&quot;category\&quot;:\&quot;Symptoms\&quot;,\&quot;combinationOperation\&quot;:\&quot;MEAN\&quot;,\&quot;unit\&quot;:\&quot;/5\&quot;}]

### Example
```javascript
var QMApi = require('quantimodo-sdk-javascript');
var defaultClient = QMApi.ApiClient.instance;

// Configure API key authorization: access_token
var access_token = defaultClient.authentications['access_token'];
access_token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix = 'Token';

// Configure OAuth2 access token for authorization: quantimodo_oauth2
var quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new QMApi.MeasurementsApi();

var body = [new QMApi.MeasurementSet()]; // [MeasurementSet] | An array of measurement sets containing measurement items you want to insert.

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
apiInstance.postMeasurements(body, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**[MeasurementSet]**](MeasurementSet.md)| An array of measurement sets containing measurement items you want to insert. | 
 **userId** | **Number**| User&#39;s id | [optional] 

### Return type

null (empty response body)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="v1MeasurementsUpdatePut"></a>
# **v1MeasurementsUpdatePut**
> CommonResponse v1MeasurementsUpdatePut(body)

Update a measurement

Delete a previously submitted measurement

### Example
```javascript
var QMApi = require('quantimodo-sdk-javascript');
var defaultClient = QMApi.ApiClient.instance;

// Configure API key authorization: access_token
var access_token = defaultClient.authentications['access_token'];
access_token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix = 'Token';

// Configure OAuth2 access token for authorization: quantimodo_oauth2
var quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new QMApi.MeasurementsApi();

var body = new QMApi.MeasurementUpdate(); // MeasurementUpdate | The id as well as the new startTime, note, and/or value of the measurement to be updated


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.v1MeasurementsUpdatePut(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**MeasurementUpdate**](MeasurementUpdate.md)| The id as well as the new startTime, note, and/or value of the measurement to be updated | 

### Return type

[**CommonResponse**](CommonResponse.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

