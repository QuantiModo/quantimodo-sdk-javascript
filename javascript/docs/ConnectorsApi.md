# quantimodo-api.ConnectorsApi

All URIs are relative to *https://app.quantimo.do/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**v1ConnectMobileGet**](ConnectorsApi.md#v1ConnectMobileGet) | **GET** /v1/connect/mobile | Mobile connect page
[**v1ConnectorsConnectorNameConnectGet**](ConnectorsApi.md#v1ConnectorsConnectorNameConnectGet) | **GET** /v1/connectors/{connectorName}/connect | Obtain a token from 3rd party data source
[**v1ConnectorsConnectorNameConnectInstructionsGet**](ConnectorsApi.md#v1ConnectorsConnectorNameConnectInstructionsGet) | **GET** /v1/connectors/{connectorName}/connectInstructions | Connection Instructions
[**v1ConnectorsConnectorNameConnectParameterGet**](ConnectorsApi.md#v1ConnectorsConnectorNameConnectParameterGet) | **GET** /v1/connectors/{connectorName}/connectParameter | Connect Parameter
[**v1ConnectorsConnectorNameDisconnectGet**](ConnectorsApi.md#v1ConnectorsConnectorNameDisconnectGet) | **GET** /v1/connectors/{connectorName}/disconnect | Delete stored connection info
[**v1ConnectorsConnectorNameInfoGet**](ConnectorsApi.md#v1ConnectorsConnectorNameInfoGet) | **GET** /v1/connectors/{connectorName}/info | Get connector info for user
[**v1ConnectorsConnectorNameUpdateGet**](ConnectorsApi.md#v1ConnectorsConnectorNameUpdateGet) | **GET** /v1/connectors/{connectorName}/update | Sync with data source
[**v1ConnectorsListGet**](ConnectorsApi.md#v1ConnectorsListGet) | **GET** /v1/connectors/list | List of Connectors
[**v1IntegrationJsGet**](ConnectorsApi.md#v1IntegrationJsGet) | **GET** /v1/integration.js | Get embeddable connect javascript


<a name="v1ConnectMobileGet"></a>
# **v1ConnectMobileGet**
> v1ConnectMobileGet(accessToken, opts)

Mobile connect page

This page is designed to be opened in a webview.  Instead of using popup authentication boxes, it uses redirection. You can include the user&#39;s access_token as a URL parameter like https://app.quantimo.do/api/v1/connect/mobile?access_token&#x3D;123

### Example
```javascript
var quantimodo-api = require('quantimodo-api');

var apiInstance = new quantimodo-api.ConnectorsApi();

var accessToken = "accessToken_example"; // String | User OAuth access token

var opts = { 
  'userId': 56 // Number | User's id
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.v1ConnectMobileGet(accessToken, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **accessToken** | **String**| User OAuth access token | 
 **userId** | **Number**| User&#39;s id | [optional] 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: text/html

<a name="v1ConnectorsConnectorNameConnectGet"></a>
# **v1ConnectorsConnectorNameConnectGet**
> v1ConnectorsConnectorNameConnectGet(connectorName, opts)

Obtain a token from 3rd party data source

Attempt to obtain a token from the data provider, store it in the database. With this, the connector to continue to obtain new user data until the token is revoked.

### Example
```javascript
var quantimodo-api = require('quantimodo-api');
var defaultClient = quantimodo-api.ApiClient.default;

// Configure API key authorization: access_token
var access_token = defaultClient.authentications['access_token'];
access_token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix = 'Token';

// Configure OAuth2 access token for authorization: quantimodo_oauth2
var quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new quantimodo-api.ConnectorsApi();

var connectorName = "connectorName_example"; // String | Lowercase system name of the source application or device. Get a list of available connectors from the /v1/connectors/list endpoint.

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
apiInstance.v1ConnectorsConnectorNameConnectGet(connectorName, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **connectorName** | **String**| Lowercase system name of the source application or device. Get a list of available connectors from the /v1/connectors/list endpoint. | 
 **accessToken** | **String**| User&#39;s OAuth2 access token | [optional] 
 **userId** | **Number**| User&#39;s id | [optional] 

### Return type

null (empty response body)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="v1ConnectorsConnectorNameConnectInstructionsGet"></a>
# **v1ConnectorsConnectorNameConnectInstructionsGet**
> v1ConnectorsConnectorNameConnectInstructionsGet(connectorName, parameters, url, usePopup, opts)

Connection Instructions

Returns instructions that describe what parameters and endpoint to use to connect to the given data provider.

### Example
```javascript
var quantimodo-api = require('quantimodo-api');
var defaultClient = quantimodo-api.ApiClient.default;

// Configure API key authorization: access_token
var access_token = defaultClient.authentications['access_token'];
access_token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix = 'Token';

// Configure OAuth2 access token for authorization: quantimodo_oauth2
var quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new quantimodo-api.ConnectorsApi();

var connectorName = "connectorName_example"; // String | Lowercase system name of the source application or device. Get a list of available connectors from the /v1/connectors/list endpoint.

var parameters = "parameters_example"; // String | JSON Array of Parameters for the request to enable connector.

var url = "url_example"; // String | URL which should be used to enable the connector.

var usePopup = true; // Boolean | Should use popup when enabling connector

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
apiInstance.v1ConnectorsConnectorNameConnectInstructionsGet(connectorName, parameters, url, usePopup, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **connectorName** | **String**| Lowercase system name of the source application or device. Get a list of available connectors from the /v1/connectors/list endpoint. | 
 **parameters** | **String**| JSON Array of Parameters for the request to enable connector. | 
 **url** | **String**| URL which should be used to enable the connector. | 
 **usePopup** | **Boolean**| Should use popup when enabling connector | 
 **accessToken** | **String**| User&#39;s OAuth2 access token | [optional] 
 **userId** | **Number**| User&#39;s id | [optional] 

### Return type

null (empty response body)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="v1ConnectorsConnectorNameConnectParameterGet"></a>
# **v1ConnectorsConnectorNameConnectParameterGet**
> ConnectorInstruction v1ConnectorsConnectorNameConnectParameterGet(connectorName, displayName, key, placeholder, type, usePopup, opts)

Connect Parameter

Returns instructions that describe what parameters and endpoint to use to connect to the given data provider.

### Example
```javascript
var quantimodo-api = require('quantimodo-api');
var defaultClient = quantimodo-api.ApiClient.default;

// Configure API key authorization: access_token
var access_token = defaultClient.authentications['access_token'];
access_token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix = 'Token';

// Configure OAuth2 access token for authorization: quantimodo_oauth2
var quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new quantimodo-api.ConnectorsApi();

var connectorName = "connectorName_example"; // String | Lowercase system name of the source application or device. Get a list of available connectors from the /v1/connectors/list endpoint.

var displayName = "displayName_example"; // String | Name of the parameter that is user visible in the form

var key = "key_example"; // String | Name of the property that the user has to enter such as username or password Connector (used in HTTP request)

var placeholder = "placeholder_example"; // String | Placeholder hint value for the parameter input tag.

var type = "type_example"; // String | Type of input field such as those found here http://www.w3schools.com/tags/tag_input.asp

var usePopup = true; // Boolean | Should use popup when enabling connector

var opts = { 
  'accessToken': "accessToken_example", // String | User's OAuth2 access token
  'userId': 56, // Number | User's id
  'defaultValue': "defaultValue_example" // String | Default parameter value
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.v1ConnectorsConnectorNameConnectParameterGet(connectorName, displayName, key, placeholder, type, usePopup, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **connectorName** | **String**| Lowercase system name of the source application or device. Get a list of available connectors from the /v1/connectors/list endpoint. | 
 **displayName** | **String**| Name of the parameter that is user visible in the form | 
 **key** | **String**| Name of the property that the user has to enter such as username or password Connector (used in HTTP request) | 
 **placeholder** | **String**| Placeholder hint value for the parameter input tag. | 
 **type** | **String**| Type of input field such as those found here http://www.w3schools.com/tags/tag_input.asp | 
 **usePopup** | **Boolean**| Should use popup when enabling connector | 
 **accessToken** | **String**| User&#39;s OAuth2 access token | [optional] 
 **userId** | **Number**| User&#39;s id | [optional] 
 **defaultValue** | **String**| Default parameter value | [optional] 

### Return type

[**ConnectorInstruction**](ConnectorInstruction.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="v1ConnectorsConnectorNameDisconnectGet"></a>
# **v1ConnectorsConnectorNameDisconnectGet**
> v1ConnectorsConnectorNameDisconnectGet(connectorName)

Delete stored connection info

The disconnect method deletes any stored tokens or connection information from the connectors database.

### Example
```javascript
var quantimodo-api = require('quantimodo-api');
var defaultClient = quantimodo-api.ApiClient.default;

// Configure API key authorization: access_token
var access_token = defaultClient.authentications['access_token'];
access_token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix = 'Token';

// Configure OAuth2 access token for authorization: quantimodo_oauth2
var quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new quantimodo-api.ConnectorsApi();

var connectorName = "connectorName_example"; // String | Lowercase system name of the source application or device. Get a list of available connectors from the /v1/connectors/list endpoint.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.v1ConnectorsConnectorNameDisconnectGet(connectorName, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **connectorName** | **String**| Lowercase system name of the source application or device. Get a list of available connectors from the /v1/connectors/list endpoint. | 

### Return type

null (empty response body)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="v1ConnectorsConnectorNameInfoGet"></a>
# **v1ConnectorsConnectorNameInfoGet**
> ConnectorInfo v1ConnectorsConnectorNameInfoGet(connectorName, opts)

Get connector info for user

Returns information about the connector such as the connector id, whether or not is connected for this user (i.e. we have a token or credentials), and its update history for the user.

### Example
```javascript
var quantimodo-api = require('quantimodo-api');
var defaultClient = quantimodo-api.ApiClient.default;

// Configure API key authorization: access_token
var access_token = defaultClient.authentications['access_token'];
access_token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix = 'Token';

// Configure OAuth2 access token for authorization: quantimodo_oauth2
var quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new quantimodo-api.ConnectorsApi();

var connectorName = "connectorName_example"; // String | Lowercase system name of the source application or device. Get a list of available connectors from the /v1/connectors/list endpoint.

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
apiInstance.v1ConnectorsConnectorNameInfoGet(connectorName, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **connectorName** | **String**| Lowercase system name of the source application or device. Get a list of available connectors from the /v1/connectors/list endpoint. | 
 **accessToken** | **String**| User&#39;s OAuth2 access token | [optional] 
 **userId** | **Number**| User&#39;s id | [optional] 

### Return type

[**ConnectorInfo**](ConnectorInfo.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="v1ConnectorsConnectorNameUpdateGet"></a>
# **v1ConnectorsConnectorNameUpdateGet**
> v1ConnectorsConnectorNameUpdateGet(connectorName, opts)

Sync with data source

The update method tells the QM Connector Framework to check with the data provider (such as Fitbit or MyFitnessPal) and retrieve any new measurements available.

### Example
```javascript
var quantimodo-api = require('quantimodo-api');
var defaultClient = quantimodo-api.ApiClient.default;

// Configure API key authorization: access_token
var access_token = defaultClient.authentications['access_token'];
access_token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix = 'Token';

// Configure OAuth2 access token for authorization: quantimodo_oauth2
var quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new quantimodo-api.ConnectorsApi();

var connectorName = "connectorName_example"; // String | Lowercase system name of the source application or device

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
apiInstance.v1ConnectorsConnectorNameUpdateGet(connectorName, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **connectorName** | **String**| Lowercase system name of the source application or device | 
 **accessToken** | **String**| User&#39;s OAuth2 access token | [optional] 
 **userId** | **Number**| User&#39;s id | [optional] 

### Return type

null (empty response body)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="v1ConnectorsListGet"></a>
# **v1ConnectorsListGet**
> [Connector] v1ConnectorsListGet()

List of Connectors

A connector pulls data from other data providers using their API or a screenscraper. Returns a list of all available connectors and information about them such as their id, name, whether the user has provided access, logo url, connection instructions, and the update history.

### Example
```javascript
var quantimodo-api = require('quantimodo-api');
var defaultClient = quantimodo-api.ApiClient.default;

// Configure API key authorization: access_token
var access_token = defaultClient.authentications['access_token'];
access_token.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix = 'Token';

// Configure OAuth2 access token for authorization: quantimodo_oauth2
var quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new quantimodo-api.ConnectorsApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.v1ConnectorsListGet(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[Connector]**](Connector.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="v1IntegrationJsGet"></a>
# **v1IntegrationJsGet**
> v1IntegrationJsGet(opts)

Get embeddable connect javascript

Get embeddable connect javascript. Usage:   - Embedding in applications with popups for 3rd-party authentication windows.     Use &#x60;qmSetupInPopup&#x60; function after connecting &#x60;connect.js&#x60;.   - Embedding in applications with popups for 3rd-party authentication windows.     Requires a selector to block. It will be embedded in this block.     Use &#x60;qmSetupOnPage&#x60; function after connecting &#x60;connect.js&#x60;.   - Embedding in mobile applications without popups for 3rd-party authentication.     Use &#x60;qmSetupOnMobile&#x60; function after connecting &#x60;connect.js&#x60;.     If using in a Cordova application call  &#x60;qmSetupOnIonic&#x60; function after connecting &#x60;connect.js&#x60;.

### Example
```javascript
var quantimodo-api = require('quantimodo-api');

var apiInstance = new quantimodo-api.ConnectorsApi();

var opts = { 
  'accessToken': "accessToken_example" // String | User's OAuth2 access token
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.v1IntegrationJsGet(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **accessToken** | **String**| User&#39;s OAuth2 access token | [optional] 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/x-javascript

