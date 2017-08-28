# Quantimodo.StudyApi

All URIs are relative to *https://app.quantimo.do/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**postStudyPublish**](StudyApi.md#postStudyPublish) | **POST** /v3/study/publish | Post Study Publish


<a name="postStudyPublish"></a>
# **postStudyPublish**
> PostStudyPublishResponse postStudyPublish()

Post Study Publish

Post Study Publish

### Example
```javascript
var Quantimodo = require('quantimodo');

var apiInstance = new Quantimodo.StudyApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.postStudyPublish(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**PostStudyPublishResponse**](PostStudyPublishResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

