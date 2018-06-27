# quantimodo-api.RemindersApi

All URIs are relative to *https://app.quantimo.do/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteTrackingReminder**](RemindersApi.md#deleteTrackingReminder) | **DELETE** /v3/trackingReminders/delete | Delete Tracking Reminder
[**getTrackingReminderNotifications**](RemindersApi.md#getTrackingReminderNotifications) | **GET** /v3/trackingReminderNotifications | Get specific tracking reminder notifications
[**getTrackingReminders**](RemindersApi.md#getTrackingReminders) | **GET** /v3/trackingReminders | Get repeating tracking reminder settings
[**postTrackingReminderNotifications**](RemindersApi.md#postTrackingReminderNotifications) | **POST** /v3/trackingReminderNotifications | Snooze, skip, or track a tracking reminder notification
[**postTrackingReminders**](RemindersApi.md#postTrackingReminders) | **POST** /v3/trackingReminders | Store a Tracking Reminder


<a name="deleteTrackingReminder"></a>
# **deleteTrackingReminder**
> CommonResponse deleteTrackingReminder(body, opts)

Delete Tracking Reminder

Stop getting notifications to record data for a variable.  Previously recorded measurements will be preserved.

### Example
```javascript
import quantimodo-api from 'quantimodo-api';
let defaultClient = quantimodo-api.ApiClient.instance;

// Configure API key authorization: access_token
let access_token = defaultClient.authentications['access_token'];
access_token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix = 'Token';

// Configure OAuth2 access token for authorization: quantimodo_oauth2
let quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new quantimodo-api.RemindersApi();

let body = new quantimodo-api.TrackingReminderDelete(); // TrackingReminderDelete | Id of reminder to be deleted

let opts = { 
  'userId': 8.14, // Number | User's id
};

apiInstance.deleteTrackingReminder(body, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
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
> GetTrackingReminderNotificationsResponse getTrackingReminderNotifications(opts)

Get specific tracking reminder notifications

Specific tracking reminder notification instances that still need to be tracked.

### Example
```javascript
import quantimodo-api from 'quantimodo-api';
let defaultClient = quantimodo-api.ApiClient.instance;

// Configure API key authorization: access_token
let access_token = defaultClient.authentications['access_token'];
access_token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix = 'Token';

// Configure OAuth2 access token for authorization: quantimodo_oauth2
let quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new quantimodo-api.RemindersApi();

let opts = { 
  'sort': "sort_example", // String | Sort by one of the listed field names. If the field name is prefixed with `-`, it will sort in descending order.
  'userId': 8.14, // Number | User's id
  'createdAt': "createdAt_example", // String | When the record was first created. Use UTC ISO 8601 YYYY-MM-DDThh:mm:ss datetime format. Time zone should be UTC and not local.
  'updatedAt': "updatedAt_example", // String | When the record was last updated. Use UTC ISO 8601 YYYY-MM-DDThh:mm:ss datetime format. Time zone should be UTC and not local.
  'limit': 100, // Number | The LIMIT is used to limit the number of results returned. So if youhave 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. The maximum limit is 200 records.
  'offset': 56, // Number | OFFSET says to skip that many rows before beginning to return rows to the client. OFFSET 0 is the same as omitting the OFFSET clause.If both OFFSET and LIMIT appear, then OFFSET rows are skipped before starting to count the LIMIT rows that are returned.
  'variableCategoryName': "variableCategoryName_example", // String | Limit results to a specific variable category
  'reminderTime': "reminderTime_example", // String | Ex: (lt)2017-07-31 21:43:26
  'clientId': "clientId_example", // String | Your QuantiModo client id can be obtained by creating an app at https://builder.quantimo.do
  'onlyPast': true, // Boolean | Ex: 1
  'includeDeleted': true, // Boolean | Include deleted variables
  'platform': "platform_example", // String | Ex: chrome, android, ios, web
};

apiInstance.getTrackingReminderNotifications(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **sort** | **String**| Sort by one of the listed field names. If the field name is prefixed with &#x60;-&#x60;, it will sort in descending order. | [optional] 
 **userId** | **Number**| User&#39;s id | [optional] 
 **createdAt** | **String**| When the record was first created. Use UTC ISO 8601 YYYY-MM-DDThh:mm:ss datetime format. Time zone should be UTC and not local. | [optional] 
 **updatedAt** | **String**| When the record was last updated. Use UTC ISO 8601 YYYY-MM-DDThh:mm:ss datetime format. Time zone should be UTC and not local. | [optional] 
 **limit** | **Number**| The LIMIT is used to limit the number of results returned. So if youhave 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. The maximum limit is 200 records. | [optional] [default to 100]
 **offset** | **Number**| OFFSET says to skip that many rows before beginning to return rows to the client. OFFSET 0 is the same as omitting the OFFSET clause.If both OFFSET and LIMIT appear, then OFFSET rows are skipped before starting to count the LIMIT rows that are returned. | [optional] 
 **variableCategoryName** | **String**| Limit results to a specific variable category | [optional] 
 **reminderTime** | **String**| Ex: (lt)2017-07-31 21:43:26 | [optional] 
 **clientId** | **String**| Your QuantiModo client id can be obtained by creating an app at https://builder.quantimo.do | [optional] 
 **onlyPast** | **Boolean**| Ex: 1 | [optional] 
 **includeDeleted** | **Boolean**| Include deleted variables | [optional] 
 **platform** | **String**| Ex: chrome, android, ios, web | [optional] 

### Return type

[**GetTrackingReminderNotificationsResponse**](GetTrackingReminderNotificationsResponse.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getTrackingReminders"></a>
# **getTrackingReminders**
> [TrackingReminder] getTrackingReminders(opts)

Get repeating tracking reminder settings

Users can be reminded to track certain variables at a specified frequency with a default value.

### Example
```javascript
import quantimodo-api from 'quantimodo-api';
let defaultClient = quantimodo-api.ApiClient.instance;

// Configure API key authorization: access_token
let access_token = defaultClient.authentications['access_token'];
access_token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix = 'Token';

// Configure OAuth2 access token for authorization: quantimodo_oauth2
let quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new quantimodo-api.RemindersApi();

let opts = { 
  'userId': 8.14, // Number | User's id
  'variableCategoryName': "variableCategoryName_example", // String | Limit results to a specific variable category
  'createdAt': "createdAt_example", // String | When the record was first created. Use UTC ISO 8601 YYYY-MM-DDThh:mm:ss datetime format. Time zone should be UTC and not local.
  'updatedAt': "updatedAt_example", // String | When the record was last updated. Use UTC ISO 8601 YYYY-MM-DDThh:mm:ss datetime format. Time zone should be UTC and not local.
  'limit': 100, // Number | The LIMIT is used to limit the number of results returned. So if youhave 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. The maximum limit is 200 records.
  'offset': 56, // Number | OFFSET says to skip that many rows before beginning to return rows to the client. OFFSET 0 is the same as omitting the OFFSET clause.If both OFFSET and LIMIT appear, then OFFSET rows are skipped before starting to count the LIMIT rows that are returned.
  'sort': "sort_example", // String | Sort by one of the listed field names. If the field name is prefixed with `-`, it will sort in descending order.
  'clientId': "clientId_example", // String | Your QuantiModo client id can be obtained by creating an app at https://builder.quantimo.do
  'appVersion': "appVersion_example", // String | Ex: 2.1.1.0
  'platform': "platform_example", // String | Ex: chrome, android, ios, web
};

apiInstance.getTrackingReminders(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Number**| User&#39;s id | [optional] 
 **variableCategoryName** | **String**| Limit results to a specific variable category | [optional] 
 **createdAt** | **String**| When the record was first created. Use UTC ISO 8601 YYYY-MM-DDThh:mm:ss datetime format. Time zone should be UTC and not local. | [optional] 
 **updatedAt** | **String**| When the record was last updated. Use UTC ISO 8601 YYYY-MM-DDThh:mm:ss datetime format. Time zone should be UTC and not local. | [optional] 
 **limit** | **Number**| The LIMIT is used to limit the number of results returned. So if youhave 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. The maximum limit is 200 records. | [optional] [default to 100]
 **offset** | **Number**| OFFSET says to skip that many rows before beginning to return rows to the client. OFFSET 0 is the same as omitting the OFFSET clause.If both OFFSET and LIMIT appear, then OFFSET rows are skipped before starting to count the LIMIT rows that are returned. | [optional] 
 **sort** | **String**| Sort by one of the listed field names. If the field name is prefixed with &#x60;-&#x60;, it will sort in descending order. | [optional] 
 **clientId** | **String**| Your QuantiModo client id can be obtained by creating an app at https://builder.quantimo.do | [optional] 
 **appVersion** | **String**| Ex: 2.1.1.0 | [optional] 
 **platform** | **String**| Ex: chrome, android, ios, web | [optional] 

### Return type

[**[TrackingReminder]**](TrackingReminder.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="postTrackingReminderNotifications"></a>
# **postTrackingReminderNotifications**
> CommonResponse postTrackingReminderNotifications(body, opts)

Snooze, skip, or track a tracking reminder notification

Snooze, skip, or track a tracking reminder notification

### Example
```javascript
import quantimodo-api from 'quantimodo-api';
let defaultClient = quantimodo-api.ApiClient.instance;

// Configure API key authorization: access_token
let access_token = defaultClient.authentications['access_token'];
access_token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix = 'Token';

// Configure OAuth2 access token for authorization: quantimodo_oauth2
let quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new quantimodo-api.RemindersApi();

let body = [new quantimodo-api.TrackingReminderNotificationPost()]; // [TrackingReminderNotificationPost] | Id of the tracking reminder notification to be snoozed

let opts = { 
  'userId': 8.14, // Number | User's id
  'clientId': "clientId_example", // String | Your QuantiModo client id can be obtained by creating an app at https://builder.quantimo.do
  'platform': "platform_example", // String | Ex: chrome, android, ios, web
};

apiInstance.postTrackingReminderNotifications(body, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**[TrackingReminderNotificationPost]**](TrackingReminderNotificationPost.md)| Id of the tracking reminder notification to be snoozed | 
 **userId** | **Number**| User&#39;s id | [optional] 
 **clientId** | **String**| Your QuantiModo client id can be obtained by creating an app at https://builder.quantimo.do | [optional] 
 **platform** | **String**| Ex: chrome, android, ios, web | [optional] 

### Return type

[**CommonResponse**](CommonResponse.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="postTrackingReminders"></a>
# **postTrackingReminders**
> PostTrackingRemindersResponse postTrackingReminders(body)

Store a Tracking Reminder

This is to enable users to create reminders to track a variable with a default value at a specified frequency

### Example
```javascript
import quantimodo-api from 'quantimodo-api';
let defaultClient = quantimodo-api.ApiClient.instance;

// Configure API key authorization: access_token
let access_token = defaultClient.authentications['access_token'];
access_token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix = 'Token';

// Configure OAuth2 access token for authorization: quantimodo_oauth2
let quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new quantimodo-api.RemindersApi();

let body = [new quantimodo-api.TrackingReminder()]; // [TrackingReminder] | TrackingReminder that should be stored


apiInstance.postTrackingReminders(body, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**[TrackingReminder]**](TrackingReminder.md)| TrackingReminder that should be stored | 

### Return type

[**PostTrackingRemindersResponse**](PostTrackingRemindersResponse.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

