# QuantimodoApi.UnitsApi

All URIs are relative to *https://app.quantimo.do/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**v1UnitCategoriesGet**](UnitsApi.md#v1UnitCategoriesGet) | **GET** /v1/unitCategories | Get unit categories
[**v1UnitsGet**](UnitsApi.md#v1UnitsGet) | **GET** /v1/units | Get all available units
[**v1UnitsVariableGet**](UnitsApi.md#v1UnitsVariableGet) | **GET** /v1/unitsVariable | Units for Variable


<a name="v1UnitCategoriesGet"></a>
# **v1UnitCategoriesGet**
> UnitCategory v1UnitCategoriesGet()

Get unit categories

Get a list of the categories of measurement units such as &#39;Distance&#39;, &#39;Duration&#39;, &#39;Energy&#39;, &#39;Frequency&#39;, &#39;Miscellany&#39;, &#39;Pressure&#39;, &#39;Proportion&#39;, &#39;Rating&#39;, &#39;Temperature&#39;, &#39;Volume&#39;, and &#39;Weight&#39;.

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

var apiInstance = new QuantimodoApi.UnitsApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.v1UnitCategoriesGet(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**UnitCategory**](UnitCategory.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="v1UnitsGet"></a>
# **v1UnitsGet**
> [Unit] v1UnitsGet(opts)

Get all available units

Get all available units

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

var apiInstance = new QuantimodoApi.UnitsApi();

var opts = { 
  'userId': 56, // Number | User's id
  'id': 56, // Number | Unit id
  'unitName': "unitName_example", // String | Unit name
  'unitAbbreviatedName': "unitAbbreviatedName_example", // String | Restrict the results to a specific unit by providing the unit abbreviation.
  'unitCategoryName': "unitCategoryName_example" // String | Restrict the results to a specific unit category by providing the unit category name.
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.v1UnitsGet(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Number**| User&#39;s id | [optional] 
 **id** | **Number**| Unit id | [optional] 
 **unitName** | **String**| Unit name | [optional] 
 **unitAbbreviatedName** | **String**| Restrict the results to a specific unit by providing the unit abbreviation. | [optional] 
 **unitCategoryName** | **String**| Restrict the results to a specific unit category by providing the unit category name. | [optional] 

### Return type

[**[Unit]**](Unit.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="v1UnitsVariableGet"></a>
# **v1UnitsVariableGet**
> [Unit] v1UnitsVariableGet(opts)

Units for Variable

Get a list of all possible units to use for a given variable

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

var apiInstance = new QuantimodoApi.UnitsApi();

var opts = { 
  'userId': 56, // Number | User's id
  'unitName': "unitName_example", // String | Name of Unit you want to retrieve
  'unitAbbreviatedName': "unitAbbreviatedName_example", // String | Abbreviated Unit Name of the unit you want
  'unitCategoryName': "unitCategoryName_example", // String | Name of the category you want units for
  'variable': "variable_example" // String | Name of the variable you want units for
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.v1UnitsVariableGet(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Number**| User&#39;s id | [optional] 
 **unitName** | **String**| Name of Unit you want to retrieve | [optional] 
 **unitAbbreviatedName** | **String**| Abbreviated Unit Name of the unit you want | [optional] 
 **unitCategoryName** | **String**| Name of the category you want units for | [optional] 
 **variable** | **String**| Name of the variable you want units for | [optional] 

### Return type

[**[Unit]**](Unit.md)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

