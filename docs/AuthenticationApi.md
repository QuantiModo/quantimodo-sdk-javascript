# Quantimodo.AuthenticationApi

All URIs are relative to *https://app.quantimo.do/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getAccessToken**](AuthenticationApi.md#getAccessToken) | **GET** /v2/oauth2/access_token | Get a user access token
[**getOauthAuthorizationCode**](AuthenticationApi.md#getOauthAuthorizationCode) | **GET** /v2/oauth/authorize | Request Authorization Code
[**getSocialAuthorizationCode**](AuthenticationApi.md#getSocialAuthorizationCode) | **GET** /v2/auth/social/authorizeCode | Second Step in Social Authentication flow with JWT Token
[**getSocialAuthorizationToken**](AuthenticationApi.md#getSocialAuthorizationToken) | **GET** /v2/auth/social/authorizeToken | Native Social Authentication
[**getSocialLoginPage**](AuthenticationApi.md#getSocialLoginPage) | **GET** /v2/auth/social/login | First Setp in Social Authentication flow with JWT Token


<a name="getAccessToken"></a>
# **getAccessToken**
> getAccessToken(clientId, clientSecret, grantType, code, opts)

Get a user access token

Client provides authorization token obtained from /api/v1/oauth2/authorize to this endpoint and receives an access token. Access token can then be used to query different API endpoints of QuantiModo. ### Request Access Token After user approves your access to the given scope form the https:/app.quantimo.do/v2/oauth2/authorize endpoint, you&#39;ll receive an authorization code to request an access token. This time make a &#x60;POST&#x60; request to &#x60;/api/v2/oauth/access_token&#x60; with parameters including: * &#x60;grant_type&#x60; Can be &#x60;authorization_code&#x60; or &#x60;refresh_token&#x60; since we are getting the &#x60;access_token&#x60; for the first time we don&#39;t have a &#x60;refresh_token&#x60; so this must be &#x60;authorization_code&#x60;. * &#x60;code&#x60; Authorization code you received with the previous request. * &#x60;redirect_uri&#x60; Your application&#39;s redirect url. ### Refreshing Access Token Access tokens expire at some point, to continue using our api you need to refresh them with &#x60;refresh_token&#x60; you received along with the &#x60;access_token&#x60;. To do this make a &#x60;POST&#x60; request to &#x60;/api/v2/oauth/access_token&#x60; with correct parameters, which are: * &#x60;grant_type&#x60; This time grant type must be &#x60;refresh_token&#x60; since we have it. * &#x60;clientId&#x60; Your application&#39;s client id. * &#x60;client_secret&#x60; Your application&#39;s client secret. * &#x60;refresh_token&#x60; The refresh token you received with the &#x60;access_token&#x60;. Every request you make to this endpoint will give you a new refresh token and make the old one expired. So you can keep getting new access tokens with new refresh tokens. ### Using Access Token Currently we support 2 ways for this, you can&#39;t use both at the same time. * Adding access token to the request header as &#x60;Authorization: Bearer {access_token}&#x60; * Adding to the url as a query parameter &#x60;?access_token&#x3D;{access_token}&#x60; You can read more about OAuth2 from [here](http://oauth.net/2/)

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

var apiInstance = new Quantimodo.AuthenticationApi();

var clientId = "clientId_example"; // String | This is the unique ID that QuantiModo uses to identify your application. Obtain a client id by emailing info@quantimo.do.

var clientSecret = "clientSecret_example"; // String | This is the secret for your obtained clientId. QuantiModo uses this to validate that only your application uses the clientId.

var grantType = "grantType_example"; // String | Grant Type can be 'authorization_code' or 'refresh_token'

var code = "code_example"; // String | Authorization code you received with the previous request.

var opts = { 
  'responseType': "responseType_example", // String | If the value is code, launches a Basic flow, requiring a POST to the token endpoint to obtain the tokens. If the value is token id_token or id_token token, launches an Implicit flow, requiring the use of Javascript at the redirect URI to retrieve tokens from the URI #fragment.
  'scope': "scope_example", // String | Scopes include basic, readmeasurements, and writemeasurements. The \"basic\" scope allows you to read user info (displayname, email, etc). The \"readmeasurements\" scope allows one to read a user's data. The \"writemeasurements\" scope allows you to write user data. Separate multiple scopes by a space.
  'redirectUri': "redirectUri_example", // String | The redirect URI is the URL within your client application that will receive the OAuth2 credentials.
  'state': "state_example" // String | An opaque string that is round-tripped in the protocol; that is to say, it is returned as a URI parameter in the Basic flow, and in the URI
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.getAccessToken(clientId, clientSecret, grantType, code, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **clientId** | **String**| This is the unique ID that QuantiModo uses to identify your application. Obtain a client id by emailing info@quantimo.do. | 
 **clientSecret** | **String**| This is the secret for your obtained clientId. QuantiModo uses this to validate that only your application uses the clientId. | 
 **grantType** | **String**| Grant Type can be &#39;authorization_code&#39; or &#39;refresh_token&#39; | 
 **code** | **String**| Authorization code you received with the previous request. | 
 **responseType** | **String**| If the value is code, launches a Basic flow, requiring a POST to the token endpoint to obtain the tokens. If the value is token id_token or id_token token, launches an Implicit flow, requiring the use of Javascript at the redirect URI to retrieve tokens from the URI #fragment. | [optional] 
 **scope** | **String**| Scopes include basic, readmeasurements, and writemeasurements. The \&quot;basic\&quot; scope allows you to read user info (displayname, email, etc). The \&quot;readmeasurements\&quot; scope allows one to read a user&#39;s data. The \&quot;writemeasurements\&quot; scope allows you to write user data. Separate multiple scopes by a space. | [optional] 
 **redirectUri** | **String**| The redirect URI is the URL within your client application that will receive the OAuth2 credentials. | [optional] 
 **state** | **String**| An opaque string that is round-tripped in the protocol; that is to say, it is returned as a URI parameter in the Basic flow, and in the URI | [optional] 

### Return type

null (empty response body)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getOauthAuthorizationCode"></a>
# **getOauthAuthorizationCode**
> getOauthAuthorizationCode(clientId, clientSecret, responseType, scope, opts)

Request Authorization Code

You can implement OAuth2 authentication to your application using our **OAuth2** endpoints.  You need to redirect users to &#x60;/api/v2/oauth/authorize&#x60; endpoint to get an authorization code and include the parameters below.   This page will ask the user if they want to allow a client&#39;s application to submit or obtain data from their QM account. It will redirect the user to the url provided by the client application with the code as a query parameter or error in case of an error. See the /api/v2/oauth/access_token endpoint for the next steps.

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

var apiInstance = new Quantimodo.AuthenticationApi();

var clientId = "clientId_example"; // String | This is the unique ID that QuantiModo uses to identify your application. Obtain a client id by creating a free application at [https://app.quantimo.do/api/v2/apps](https://app.quantimo.do/api/v2/apps).

var clientSecret = "clientSecret_example"; // String | This is the secret for your obtained clientId. QuantiModo uses this to validate that only your application uses the clientId.  Obtain this by creating a free application at [https://app.quantimo.do/api/v2/apps](https://app.quantimo.do/api/v2/apps).

var responseType = "responseType_example"; // String | If the value is code, launches a Basic flow, requiring a POST to the token endpoint to obtain the tokens. If the value is token id_token or id_token token, launches an Implicit flow, requiring the use of Javascript at the redirect URI to retrieve tokens from the URI #fragment.

var scope = "scope_example"; // String | Scopes include basic, readmeasurements, and writemeasurements. The \"basic\" scope allows you to read user info (displayname, email, etc). The \"readmeasurements\" scope allows one to read a user's data. The \"writemeasurements\" scope allows you to write user data. Separate multiple scopes by a space.

var opts = { 
  'redirectUri': "redirectUri_example", // String | The redirect URI is the URL within your client application that will receive the OAuth2 credentials.
  'state': "state_example" // String | An opaque string that is round-tripped in the protocol; that is to say, it is returned as a URI parameter in the Basic flow, and in the URI
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.getOauthAuthorizationCode(clientId, clientSecret, responseType, scope, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **clientId** | **String**| This is the unique ID that QuantiModo uses to identify your application. Obtain a client id by creating a free application at [https://app.quantimo.do/api/v2/apps](https://app.quantimo.do/api/v2/apps). | 
 **clientSecret** | **String**| This is the secret for your obtained clientId. QuantiModo uses this to validate that only your application uses the clientId.  Obtain this by creating a free application at [https://app.quantimo.do/api/v2/apps](https://app.quantimo.do/api/v2/apps). | 
 **responseType** | **String**| If the value is code, launches a Basic flow, requiring a POST to the token endpoint to obtain the tokens. If the value is token id_token or id_token token, launches an Implicit flow, requiring the use of Javascript at the redirect URI to retrieve tokens from the URI #fragment. | 
 **scope** | **String**| Scopes include basic, readmeasurements, and writemeasurements. The \&quot;basic\&quot; scope allows you to read user info (displayname, email, etc). The \&quot;readmeasurements\&quot; scope allows one to read a user&#39;s data. The \&quot;writemeasurements\&quot; scope allows you to write user data. Separate multiple scopes by a space. | 
 **redirectUri** | **String**| The redirect URI is the URL within your client application that will receive the OAuth2 credentials. | [optional] 
 **state** | **String**| An opaque string that is round-tripped in the protocol; that is to say, it is returned as a URI parameter in the Basic flow, and in the URI | [optional] 

### Return type

null (empty response body)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getSocialAuthorizationCode"></a>
# **getSocialAuthorizationCode**
> getSocialAuthorizationCode(code, provider)

Second Step in Social Authentication flow with JWT Token

 Here is the flow for how social authentication works with a JWT Token 1.**Client:** The client needs to open popup with social auth url (&#x60;https://app/quantimo.do/api/v2/auth/social/login?provider&#x3D;{provider}&amp;redirectUrl&#x3D;{url}&#x60;) of server with &#x60;provider&#x60; and &#x60;redirectUrl&#x60;. (Url should be registered with our social apps. Facebook is fine with any redirect url with the same domain base url but Google needs exact redirect url.) 2.**Server:** The QM server will redirect user to that provider to get access. 3.**Client:** After successful or failed authentication, it will be redirected to given &#x60;redirectUrl&#x60; with code or error. 4.**Client:** The client needs to get that code and needs to send an Ajax request to server at &#x60;https://app.quantimo.do/api/v2/auth/social/authorizeCode?provider&#x3D;{provider}&amp;code&#x3D;{authorizationCode}&#x60; 5.**Server:** The QM server will authorize that code from the social connection and will authenticate user and will retrieve user info. 6.**Server:** The QM server will try to find existing user by unique identity. If the user already exists then it will login. Otherwise, it will create new user and will then login. 7.**Server:** Once user is found/created, it will return a JWT token for that user in the response.

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

var apiInstance = new Quantimodo.AuthenticationApi();

var code = "code_example"; // String | Authorization code obtained from the provider.

var provider = "provider_example"; // String | The current options are `google` and `facebook`.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.getSocialAuthorizationCode(code, provider, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **code** | **String**| Authorization code obtained from the provider. | 
 **provider** | **String**| The current options are &#x60;google&#x60; and &#x60;facebook&#x60;. | 

### Return type

null (empty response body)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getSocialAuthorizationToken"></a>
# **getSocialAuthorizationToken**
> getSocialAuthorizationToken(accessToken, provider, opts)

Native Social Authentication

If you are using native authentication via Facebook or Google SDKs then you should use the following flow. 1.**Client:** Using native authentication via your native mobile app, get an access token using the instructions provided by the Facebook SDK (https://developers.facebook.com/docs/facebook-login) or Google (https://developers.google.com/identity/protocols/OAuth2) 2.**Client:** Send an Ajax request with provider name and access token on &#x60;https://app.quantimo.do/api/v2/auth/social/authorizeToken?provider&#x3D;{provider}&amp;accessToken&#x3D;{accessToken}&amp;refreshToken&#x3D;{refreshToken}&#x60; (&#x60;refreshToken&#x60; is optional) 3.**Server:** Server will try to get user info and will find existing user by unique identity. If user exist then it will do a login for that or it will create new user and will do login 4.**Server:** Once user is found/created, it will return a JWT token for that user in response 5.**Client:** After getting the JWT token to get a QM access token follow these steps and include your JWT token in them as a header (Authorization: Bearer **{yourJWThere}**) or as a url parameter (https://app.quantimo.do/api/v2/oauth/authorize?token&#x3D;{yourJWThere}).

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

var apiInstance = new Quantimodo.AuthenticationApi();

var accessToken = "accessToken_example"; // String | User's OAuth2 access token obtained from Google or FB native SDK

var provider = "provider_example"; // String | The current options are `google` and `facebook`.

var opts = { 
  'refreshToken': "refreshToken_example" // String | Optional refresh token obtained from Google or FB native SDK
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.getSocialAuthorizationToken(accessToken, provider, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **accessToken** | **String**| User&#39;s OAuth2 access token obtained from Google or FB native SDK | 
 **provider** | **String**| The current options are &#x60;google&#x60; and &#x60;facebook&#x60;. | 
 **refreshToken** | **String**| Optional refresh token obtained from Google or FB native SDK | [optional] 

### Return type

null (empty response body)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getSocialLoginPage"></a>
# **getSocialLoginPage**
> getSocialLoginPage(redirectUrl, provider)

First Setp in Social Authentication flow with JWT Token

 Here is the flow for how social authentication works with a JWT Token 1.**Client:** The client needs to open popup with social auth url (&#x60;https://app/quantimo.do/api/v2/auth/social/login?provider&#x3D;{provider}&amp;redirectUrl&#x3D;{url}&#x60;) of server with &#x60;provider&#x60; and &#x60;redirectUrl&#x60;. (Url should be registered with our social apps. Facebook and Twitter are fine with any redirect url with the same domain base url but Google needs exact redirect url.) 2.**Server:** The QM server will redirect user to that provider to get access. 3.**Client:** After successful or failed authentication, it will be redirected to given &#x60;redirectUrl&#x60; with code or error. 4.**Client:** The client needs to get that code and needs to send an Ajax request to server at &#x60;https://app.quantimo.do/api/v2/auth/social/authorizeCode?provider&#x3D;{provider}&amp;code&#x3D;{authorizationCode}&#x60; 5.**Server:** The QM server will authorize that code from the social connection and will authenticate user and will retrieve user info. 6.**Server:** The QM server will try to find existing user by unique identity. If the user already exists then it will login. Otherwise, it will create new user and will then login. 7.**Server:** Once user is found/created, it will return a JWT token for that user in the response.

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

var apiInstance = new Quantimodo.AuthenticationApi();

var redirectUrl = "redirectUrl_example"; // String | The redirect URI is the URL within your client application that will receive the OAuth2 credentials. Url should be registered with our social apps. Facebook and Twitter are fine with any redirect url with the same domain base url but Google needs exact redirect url.

var provider = "provider_example"; // String | The current options are `google` and `facebook`.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.getSocialLoginPage(redirectUrl, provider, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **redirectUrl** | **String**| The redirect URI is the URL within your client application that will receive the OAuth2 credentials. Url should be registered with our social apps. Facebook and Twitter are fine with any redirect url with the same domain base url but Google needs exact redirect url. | 
 **provider** | **String**| The current options are &#x60;google&#x60; and &#x60;facebook&#x60;. | 

### Return type

null (empty response body)

### Authorization

[access_token](../README.md#access_token), [quantimodo_oauth2](../README.md#quantimodo_oauth2)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

