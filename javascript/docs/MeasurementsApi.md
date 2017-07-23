# quantimodo-api.MeasurementsApi

All URIs are relative to *https://app.quantimo.do/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**v1MeasurementSourcesGet**](MeasurementsApi.md#v1MeasurementSourcesGet) | **GET** /v1/measurementSources | Get measurement sources
[**v1MeasurementSourcesPost**](MeasurementsApi.md#v1MeasurementSourcesPost) | **POST** /v1/measurementSources | Add a data source
[**v1MeasurementsDailyGet**](MeasurementsApi.md#v1MeasurementsDailyGet) | **GET** /v1/measurements/daily | Get daily measurements for this user
[**v1MeasurementsDeletePost**](MeasurementsApi.md#v1MeasurementsDeletePost) | **POST** /v1/measurements/delete | Delete a measurement
[**v1MeasurementsGet**](MeasurementsApi.md#v1MeasurementsGet) | **GET** /v1/measurements | Get measurements for this user
[**v1MeasurementsPost**](MeasurementsApi.md#v1MeasurementsPost) | **POST** /v1/measurements | Post a new set or update existing measurements to the database
[**v1MeasurementsRangeGet**](MeasurementsApi.md#v1MeasurementsRangeGet) | **GET** /v1/measurementsRange | Get measurements range for this user
[**v1MeasurementsUpdatePost**](MeasurementsApi.md#v1MeasurementsUpdatePost) | **POST** /v1/measurements/update | Update a measurement
[**v2MeasurementsCsvGet**](MeasurementsApi.md#v2MeasurementsCsvGet) | **GET** /v2/measurements/csv | Get Measurements CSV
[**v2MeasurementsRequestCsvPost**](MeasurementsApi.md#v2MeasurementsRequestCsvPost) | **POST** /v2/measurements/request_csv | Post Request for Measurements CSV
[**v2MeasurementsRequestPdfPost**](MeasurementsApi.md#v2MeasurementsRequestPdfPost) | **POST** /v2/measurements/request_pdf | Post Request for Measurements PDF
[**v2MeasurementsRequestXlsPost**](MeasurementsApi.md#v2MeasurementsRequestXlsPost) | **POST** /v2/measurements/request_xls | Post Request for Measurements XLS


<a name="v1MeasurementSourcesGet"></a>
# **v1MeasurementSourcesGet**
> MeasurementSource v1MeasurementSourcesGet()

Get measurement sources

Returns a list of all the apps from which measurement data is obtained.

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

var apiInstance = new quantimodo-api.MeasurementsApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.v1MeasurementSourcesGet(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**MeasurementSource**](MeasurementSource.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="v1MeasurementSourcesPost"></a>
# **v1MeasurementSourcesPost**
> v1MeasurementSourcesPost(body, opts)

Add a data source

Add a life-tracking app or device to the QuantiModo list of data sources.

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

var apiInstance = new quantimodo-api.MeasurementsApi();

var body = new quantimodo-api.MeasurementSource(); // MeasurementSource | An array of names of data sources you want to add.

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
apiInstance.v1MeasurementSourcesPost(body, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**MeasurementSource**](MeasurementSource.md)| An array of names of data sources you want to add. | 
 **accessToken** | **String**| User&#39;s OAuth2 access token | [optional] 
 **userId** | **Number**| User&#39;s id | [optional] 

### Return type

null (empty response body)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="v1MeasurementsDailyGet"></a>
# **v1MeasurementsDailyGet**
> Measurement v1MeasurementsDailyGet(variableName, opts)

Get daily measurements for this user

Measurements are any value that can be recorded like daily steps, a mood rating, or apples eaten. Supported filter parameters:&lt;ul&gt;&lt;li&gt;&lt;b&gt;value&lt;/b&gt; - Value of measurement&lt;/li&gt;&lt;li&gt;&lt;b&gt;updatedAt&lt;/b&gt; - The time that this measurement was created or last updated in the UTC format \&quot;YYYY-MM-DDThh:mm:ss\&quot;&lt;/li&gt;&lt;/ul&gt;

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

var apiInstance = new quantimodo-api.MeasurementsApi();

var variableName = "variableName_example"; // String | Name of the variable you want measurements for

var opts = { 
  'accessToken': "accessToken_example", // String | User's OAuth2 access token
  'userId': 56, // Number | User's id
  'unitAbbreviatedName': "unitAbbreviatedName_example", // String | The unit your want the measurements in
  'startTime': "startTime_example", // String | The lower limit of measurements returned (UTC Iso8601 \"YYYY-MM-DDThh:mm:ss\" format)
  'endTime': "endTime_example", // String | The upper limit of measurements returned (UTC Iso8601 \"YYYY-MM-DDThh:mm:ss\" format)
  'groupingWidth': 56, // Number | The time (in seconds) over which measurements are grouped together
  'groupingTimezone': "groupingTimezone_example", // String | The time (in seconds) over which measurements are grouped together
  'limit': 56, // Number | The LIMIT is used to limit the number of results returned. So if you have 1000 results, but only want to the first 10, you would set this to 10 and offset to 0.
  'offset': 56, // Number | Since the maximum limit is 200 records, to get more than that you'll have to make multiple API calls and page through the results. To retrieve all the data, you can iterate through data by using the `limit` and `offset` query parameters.  For example, if you want to retrieve data from 61-80 then you can use a query with the following parameters, `imit=20&offset=60`.
  'sort': 56 // Number | Sort by given field. If the field is prefixed with `-, it will sort in descending order.
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.v1MeasurementsDailyGet(variableName, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **variableName** | **String**| Name of the variable you want measurements for | 
 **accessToken** | **String**| User&#39;s OAuth2 access token | [optional] 
 **userId** | **Number**| User&#39;s id | [optional] 
 **unitAbbreviatedName** | **String**| The unit your want the measurements in | [optional] 
 **startTime** | **String**| The lower limit of measurements returned (UTC Iso8601 \&quot;YYYY-MM-DDThh:mm:ss\&quot; format) | [optional] 
 **endTime** | **String**| The upper limit of measurements returned (UTC Iso8601 \&quot;YYYY-MM-DDThh:mm:ss\&quot; format) | [optional] 
 **groupingWidth** | **Number**| The time (in seconds) over which measurements are grouped together | [optional] 
 **groupingTimezone** | **String**| The time (in seconds) over which measurements are grouped together | [optional] 
 **limit** | **Number**| The LIMIT is used to limit the number of results returned. So if you have 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. | [optional] 
 **offset** | **Number**| Since the maximum limit is 200 records, to get more than that you&#39;ll have to make multiple API calls and page through the results. To retrieve all the data, you can iterate through data by using the &#x60;limit&#x60; and &#x60;offset&#x60; query parameters.  For example, if you want to retrieve data from 61-80 then you can use a query with the following parameters, &#x60;imit&#x3D;20&amp;offset&#x3D;60&#x60;. | [optional] 
 **sort** | **Number**| Sort by given field. If the field is prefixed with &#x60;-, it will sort in descending order. | [optional] 

### Return type

[**Measurement**](Measurement.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="v1MeasurementsDeletePost"></a>
# **v1MeasurementsDeletePost**
> CommonResponse v1MeasurementsDeletePost(body)

Delete a measurement

Delete a previously submitted measurement

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

var apiInstance = new quantimodo-api.MeasurementsApi();

var body = new quantimodo-api.MeasurementDelete(); // MeasurementDelete | The startTime and variableId of the measurement to be deleted.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.v1MeasurementsDeletePost(body, callback);
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

<a name="v1MeasurementsGet"></a>
# **v1MeasurementsGet**
> Measurement v1MeasurementsGet(opts)

Get measurements for this user

Measurements are any value that can be recorded like daily steps, a mood rating, or apples eaten. Supported filter parameters:&lt;ul&gt;&lt;li&gt;&lt;b&gt;value&lt;/b&gt; - Value of measurement&lt;/li&gt;&lt;li&gt;&lt;b&gt;updatedAt&lt;/b&gt; - The time that this measurement was created or last updated in the UTC format \&quot;YYYY-MM-DDThh:mm:ss\&quot;&lt;/li&gt;&lt;/ul&gt;

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

var apiInstance = new quantimodo-api.MeasurementsApi();

var opts = { 
  'accessToken': "accessToken_example", // String | User's OAuth2 access token
  'userId': 56, // Number | User's id
  'id': 56, // Number | Measurement id
  'variableName': "variableName_example", // String | Name of the variable you want measurements for
  'variableCategoryName': "variableCategoryName_example", // String | Name of the variable category you want measurements for
  'sourceName': "sourceName_example", // String | ID of the source you want measurements for (supports exact name match only)
  'value': "value_example", // String | Value of measurement
  'unitAbbreviatedName': "unitAbbreviatedName_example", // String | The unit you want the measurements returned in
  'earliestMeasurementTime': "earliestMeasurementTime_example", // String | The lower limit of measurements returned in ISO 8601 format or epoch seconds (unixtime)
  'latestMeasurementTime': "latestMeasurementTime_example", // String | The upper limit of measurements returned in ISO 8601 format or epoch seconds (unixtime)
  'createdAt': "createdAt_example", // String | The time the measurement record was first created in the format YYYY-MM-DDThh:mm:ss. Time zone should be UTC and not local.
  'updatedAt': "updatedAt_example", // String | The time the measurement record was last changed in the format YYYY-MM-DDThh:mm:ss. Time zone should be UTC and not local.
  'groupingWidth': 56, // Number | The time (in seconds) over which measurements are grouped together
  'groupingTimezone': "groupingTimezone_example", // String | The time (in seconds) over which measurements are grouped together
  'limit': 56, // Number | The LIMIT is used to limit the number of results returned. So if you have 1000 results, but only want to the first 10, you would set this to 10 and offset to 0.
  'offset': 56, // Number | Since the maximum limit is 200 records, to get more than that you'll have to make multiple API calls and page through the results. To retrieve all the data, you can iterate through data by using the `limit` and `offset` query parameters.  For example, if you want to retrieve data from 61-80 then you can use a query with the following parameters, `imit=20&offset=60`.
  'sort': 56 // Number | Sort by given field. If the field is prefixed with `-, it will sort in descending order.
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.v1MeasurementsGet(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **accessToken** | **String**| User&#39;s OAuth2 access token | [optional] 
 **userId** | **Number**| User&#39;s id | [optional] 
 **id** | **Number**| Measurement id | [optional] 
 **variableName** | **String**| Name of the variable you want measurements for | [optional] 
 **variableCategoryName** | **String**| Name of the variable category you want measurements for | [optional] 
 **sourceName** | **String**| ID of the source you want measurements for (supports exact name match only) | [optional] 
 **value** | **String**| Value of measurement | [optional] 
 **unitAbbreviatedName** | **String**| The unit you want the measurements returned in | [optional] 
 **earliestMeasurementTime** | **String**| The lower limit of measurements returned in ISO 8601 format or epoch seconds (unixtime) | [optional] 
 **latestMeasurementTime** | **String**| The upper limit of measurements returned in ISO 8601 format or epoch seconds (unixtime) | [optional] 
 **createdAt** | **String**| The time the measurement record was first created in the format YYYY-MM-DDThh:mm:ss. Time zone should be UTC and not local. | [optional] 
 **updatedAt** | **String**| The time the measurement record was last changed in the format YYYY-MM-DDThh:mm:ss. Time zone should be UTC and not local. | [optional] 
 **groupingWidth** | **Number**| The time (in seconds) over which measurements are grouped together | [optional] 
 **groupingTimezone** | **String**| The time (in seconds) over which measurements are grouped together | [optional] 
 **limit** | **Number**| The LIMIT is used to limit the number of results returned. So if you have 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. | [optional] 
 **offset** | **Number**| Since the maximum limit is 200 records, to get more than that you&#39;ll have to make multiple API calls and page through the results. To retrieve all the data, you can iterate through data by using the &#x60;limit&#x60; and &#x60;offset&#x60; query parameters.  For example, if you want to retrieve data from 61-80 then you can use a query with the following parameters, &#x60;imit&#x3D;20&amp;offset&#x3D;60&#x60;. | [optional] 
 **sort** | **Number**| Sort by given field. If the field is prefixed with &#x60;-, it will sort in descending order. | [optional] 

### Return type

[**Measurement**](Measurement.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="v1MeasurementsPost"></a>
# **v1MeasurementsPost**
> v1MeasurementsPost(body, opts)

Post a new set or update existing measurements to the database

You can submit or update multiple measurements in a \&quot;measurements\&quot; sub-array.  If the variable these measurements correspond to does not already exist in the database, it will be automatically added.  The request body should look something like [{\&quot;measurements\&quot;:[{\&quot;startTime\&quot;:1439389320,\&quot;value\&quot;:\&quot;3\&quot;}, {\&quot;startTime\&quot;:1439389319,\&quot;value\&quot;:\&quot;2\&quot;}],\&quot;name\&quot;:\&quot;Acne (out of 5)\&quot;,\&quot;source\&quot;:\&quot;QuantiModo\&quot;,\&quot;category\&quot;:\&quot;Symptoms\&quot;,\&quot;combinationOperation\&quot;:\&quot;MEAN\&quot;,\&quot;unit\&quot;:\&quot;/5\&quot;}]

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

var apiInstance = new quantimodo-api.MeasurementsApi();

var body = new quantimodo-api.MeasurementSet(); // MeasurementSet | An array of measurements you want to insert.

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
apiInstance.v1MeasurementsPost(body, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**MeasurementSet**](MeasurementSet.md)| An array of measurements you want to insert. | 
 **accessToken** | **String**| User&#39;s OAuth2 access token | [optional] 
 **userId** | **Number**| User&#39;s id | [optional] 

### Return type

null (empty response body)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="v1MeasurementsRangeGet"></a>
# **v1MeasurementsRangeGet**
> MeasurementRange v1MeasurementsRangeGet(opts)

Get measurements range for this user

Get Unix time-stamp (epoch time) of the user&#39;s first and last measurements taken.

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

var apiInstance = new quantimodo-api.MeasurementsApi();

var opts = { 
  'sources': "sources_example", // String | Enter source name to limit to specific source (varchar)
  'user': 56 // Number | If not specified, uses currently logged in user (bigint)
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.v1MeasurementsRangeGet(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **sources** | **String**| Enter source name to limit to specific source (varchar) | [optional] 
 **user** | **Number**| If not specified, uses currently logged in user (bigint) | [optional] 

### Return type

[**MeasurementRange**](MeasurementRange.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="v1MeasurementsUpdatePost"></a>
# **v1MeasurementsUpdatePost**
> CommonResponse v1MeasurementsUpdatePost(body)

Update a measurement

Delete a previously submitted measurement

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

var apiInstance = new quantimodo-api.MeasurementsApi();

var body = new quantimodo-api.MeasurementUpdate(); // MeasurementUpdate | The id as well as the new startTime, note, and/or value of the measurement to be updated


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.v1MeasurementsUpdatePost(body, callback);
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

<a name="v2MeasurementsCsvGet"></a>
# **v2MeasurementsCsvGet**
> File v2MeasurementsCsvGet(opts)

Get Measurements CSV

Download a CSV containing all user measurements

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

var apiInstance = new quantimodo-api.MeasurementsApi();

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
apiInstance.v2MeasurementsCsvGet(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **accessToken** | **String**| User&#39;s OAuth2 access token | [optional] 
 **userId** | **Number**| User&#39;s id | [optional] 

### Return type

**File**

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: text/csv

<a name="v2MeasurementsRequestCsvPost"></a>
# **v2MeasurementsRequestCsvPost**
> &#39;Number&#39; v2MeasurementsRequestCsvPost(opts)

Post Request for Measurements CSV

Use this endpoint to schedule a CSV export containing all user measurements to be emailed to the user within 24 hours.

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

var apiInstance = new quantimodo-api.MeasurementsApi();

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
apiInstance.v2MeasurementsRequestCsvPost(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **accessToken** | **String**| User&#39;s OAuth2 access token | [optional] 
 **userId** | **Number**| User&#39;s id | [optional] 

### Return type

**&#39;Number&#39;**

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="v2MeasurementsRequestPdfPost"></a>
# **v2MeasurementsRequestPdfPost**
> &#39;Number&#39; v2MeasurementsRequestPdfPost(opts)

Post Request for Measurements PDF

Use this endpoint to schedule a PDF export containing all user measurements to be emailed to the user within 24 hours.

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

var apiInstance = new quantimodo-api.MeasurementsApi();

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
apiInstance.v2MeasurementsRequestPdfPost(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **accessToken** | **String**| User&#39;s OAuth2 access token | [optional] 
 **userId** | **Number**| User&#39;s id | [optional] 

### Return type

**&#39;Number&#39;**

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="v2MeasurementsRequestXlsPost"></a>
# **v2MeasurementsRequestXlsPost**
> &#39;Number&#39; v2MeasurementsRequestXlsPost(opts)

Post Request for Measurements XLS

Use this endpoint to schedule a XLS export containing all user measurements to be emailed to the user within 24 hours.

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

var apiInstance = new quantimodo-api.MeasurementsApi();

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
apiInstance.v2MeasurementsRequestXlsPost(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **accessToken** | **String**| User&#39;s OAuth2 access token | [optional] 
 **userId** | **Number**| User&#39;s id | [optional] 

### Return type

**&#39;Number&#39;**

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

