# QMApi.RemindersApi

All URIs are relative to *https://app.quantimo.do/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteTrackingReminder**](RemindersApi.md#deleteTrackingReminder) | **DELETE** /v1/trackingReminders/delete | Delete tracking reminder
[**getTrackingReminderNotifications**](RemindersApi.md#getTrackingReminderNotifications) | **GET** /v1/trackingReminderNotifications | Get specific pending tracking reminders
[**getTrackingReminders**](RemindersApi.md#getTrackingReminders) | **GET** /v1/trackingReminders | Get repeating tracking reminder settings
[**postTrackingReminderNotifications**](RemindersApi.md#postTrackingReminderNotifications) | **POST** /v1/trackingReminderNotifications | Snooze, skip, or track a pending tracking reminder notification
[**postTrackingReminders**](RemindersApi.md#postTrackingReminders) | **POST** /v1/trackingReminders | Store a Tracking Reminder


<a name="deleteTrackingReminder"></a>
# **deleteTrackingReminder**
> CommonResponse deleteTrackingReminder(body, opts)

Delete tracking reminder

Delete previously created tracking reminder

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

var apiInstance = new QMApi.RemindersApi();

var body = new QMApi.TrackingReminderDelete(); // TrackingReminderDelete | Id of reminder to be deleted

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
apiInstance.deleteTrackingReminder(body, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**TrackingReminderDelete**](TrackingReminderDelete.md)| Id of reminder to be deleted | 
 **userId** | **Number**| User&#39;s id | [optional] 

### Return type

[**CommonResponse**](CommonResponse.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getTrackingReminderNotifications"></a>
# **getTrackingReminderNotifications**
> InlineResponse2002 getTrackingReminderNotifications(opts)

Get specific pending tracking reminders

Specfic pending reminder instances that still need to be tracked.  

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

var apiInstance = new QMApi.RemindersApi();

var opts = { 
  'userId': 3.4 // Number | User's id
  'variableCategoryName': "variableCategoryName_example", // String | Limit results to a specific variable category
  'createdAt': "createdAt_example", // String | When the record was first created. Use UTC ISO 8601 \"YYYY-MM-DDThh:mm:ss\"  datetime format. Time zone should be UTC and not local.
  'updatedAt': "updatedAt_example", // String | When the record was last updated. Use UTC ISO 8601 \"YYYY-MM-DDThh:mm:ss\"  datetime format. Time zone should be UTC and not local.
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
apiInstance.getTrackingReminderNotifications(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Number**| User&#39;s id | [optional] 
 **variableCategoryName** | **String**| Limit results to a specific variable category | [optional] 
 **createdAt** | **String**| When the record was first created. Use UTC ISO 8601 \&quot;YYYY-MM-DDThh:mm:ss\&quot;  datetime format. Time zone should be UTC and not local. | [optional] 
 **updatedAt** | **String**| When the record was last updated. Use UTC ISO 8601 \&quot;YYYY-MM-DDThh:mm:ss\&quot;  datetime format. Time zone should be UTC and not local. | [optional] 
 **limit** | **Number**| The LIMIT is used to limit the number of results returned. So if youhave 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. The maximum limit is 200 records. | [optional] [default to 100]
 **offset** | **Number**| OFFSET says to skip that many rows before beginning to return rows to the client. OFFSET 0 is the same as omitting the OFFSET clause.If both OFFSET and LIMIT appear, then OFFSET rows are skipped before starting to count the LIMIT rows that are returned. | [optional] 
 **sort** | **String**| Sort by one of the listed field names. If the field name is prefixed with &#x60;-&#x60;, it will sort in descending order. | [optional] 

### Return type

[**InlineResponse2002**](InlineResponse2002.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getTrackingReminders"></a>
# **getTrackingReminders**
> InlineResponse200 getTrackingReminders(opts)

Get repeating tracking reminder settings

Users can be reminded to track certain variables at a specified frequency with a default value.

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

var apiInstance = new QMApi.RemindersApi();

var opts = { 
  'userId': 3.4 // Number | User's id
  'variableCategoryName': "variableCategoryName_example", // String | Limit results to a specific variable category
  'createdAt': "createdAt_example", // String | When the record was first created. Use UTC ISO 8601 \"YYYY-MM-DDThh:mm:ss\"  datetime format. Time zone should be UTC and not local.
  'updatedAt': "updatedAt_example", // String | When the record was last updated. Use UTC ISO 8601 \"YYYY-MM-DDThh:mm:ss\"  datetime format. Time zone should be UTC and not local.
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
apiInstance.getTrackingReminders(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Number**| User&#39;s id | [optional] 
 **variableCategoryName** | **String**| Limit results to a specific variable category | [optional] 
 **createdAt** | **String**| When the record was first created. Use UTC ISO 8601 \&quot;YYYY-MM-DDThh:mm:ss\&quot;  datetime format. Time zone should be UTC and not local. | [optional] 
 **updatedAt** | **String**| When the record was last updated. Use UTC ISO 8601 \&quot;YYYY-MM-DDThh:mm:ss\&quot;  datetime format. Time zone should be UTC and not local. | [optional] 
 **limit** | **Number**| The LIMIT is used to limit the number of results returned. So if youhave 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. The maximum limit is 200 records. | [optional] [default to 100]
 **offset** | **Number**| OFFSET says to skip that many rows before beginning to return rows to the client. OFFSET 0 is the same as omitting the OFFSET clause.If both OFFSET and LIMIT appear, then OFFSET rows are skipped before starting to count the LIMIT rows that are returned. | [optional] 
 **sort** | **String**| Sort by one of the listed field names. If the field name is prefixed with &#x60;-&#x60;, it will sort in descending order. | [optional] 

### Return type

[**InlineResponse200**](InlineResponse200.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="postTrackingReminderNotifications"></a>
# **postTrackingReminderNotifications**
> CommonResponse postTrackingReminderNotifications(body, opts)

Snooze, skip, or track a pending tracking reminder notification

Snooze, skip, or track a pending tracking reminder notification

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

var apiInstance = new QMApi.RemindersApi();

var body = [new QMApi.TrackingReminderNotificationPost()]; // [TrackingReminderNotificationPost] | Id of the pending reminder to be snoozed

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
apiInstance.postTrackingReminderNotifications(body, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**[TrackingReminderNotificationPost]**](TrackingReminderNotificationPost.md)| Id of the pending reminder to be snoozed | 
 **userId** | **Number**| User&#39;s id | [optional] 

### Return type

[**CommonResponse**](CommonResponse.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="postTrackingReminders"></a>
# **postTrackingReminders**
> InlineResponse2001 postTrackingReminders(opts)

Store a Tracking Reminder

This is to enable users to create reminders to track a variable with a default value at a specified frequency

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

var apiInstance = new QMApi.RemindersApi();

var opts = { 
  'userId': 3.4 // Number | User's id
  'body': new QMApi.TrackingReminder() // TrackingReminder | TrackingReminder that should be stored
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.postTrackingReminders(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Number**| User&#39;s id | [optional] 
 **body** | [**TrackingReminder**](TrackingReminder.md)| TrackingReminder that should be stored | [optional] 

### Return type

[**InlineResponse2001**](InlineResponse2001.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

