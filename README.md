# quantimodo

Quantimodo - JavaScript client for quantimodo
QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do).
This SDK is automatically generated by the [Swagger Codegen](https://github.com/swagger-api/swagger-codegen) project:

- API version: 5.8.726
- Package version: 5.8.726
- Build package: io.swagger.codegen.languages.JavascriptClientCodegen

## Installation

### For [Node.js](https://nodejs.org/)

#### npm

To publish the library as a [npm](https://www.npmjs.com/),
please follow the procedure in ["Publishing npm packages"](https://docs.npmjs.com/getting-started/publishing-npm-packages).

Then install it via:

```shell
npm install quantimodo --save
```

##### Local development

To use the library locally without publishing to a remote npm registry, first install the dependencies by changing 
into the directory containing `package.json` (and this README). Let's call this `JAVASCRIPT_CLIENT_DIR`. Then run:

```shell
npm install
```

Next, [link](https://docs.npmjs.com/cli/link) it globally in npm with the following, also from `JAVASCRIPT_CLIENT_DIR`:

```shell
npm link
```

Finally, switch to the directory you want to use your quantimodo from, and run:

```shell
npm link /path/to/<JAVASCRIPT_CLIENT_DIR>
```

You should now be able to `require('quantimodo')` in javascript files from the directory you ran the last 
command above from.

#### git
#
If the library is hosted at a git repository, e.g.
https://github.com/YOUR_USERNAME/quantimodo
then install it via:

```shell
    npm install YOUR_USERNAME/quantimodo --save
```

### For browser

The library also works in the browser environment via npm and [browserify](http://browserify.org/). After following
the above steps with Node.js and installing browserify with `npm install -g browserify`,
perform the following (assuming *main.js* is your entry file, that's to say your javascript file where you actually 
use this library):

```shell
browserify main.js > bundle.js
```

Then include *bundle.js* in the HTML pages.

### Webpack Configuration

Using Webpack you may encounter the following error: "Module not found: Error:
Cannot resolve module", most certainly you should disable AMD loader. Add/merge
the following section to your webpack config:

```javascript
module: {
  rules: [
    {
      parser: {
        amd: false
      }
    }
  ]
}
```

## Getting Started

Please follow the [installation](#installation) instruction and execute the following JS code:

```javascript
var Quantimodo = require('quantimodo');

var defaultClient = Quantimodo.ApiClient.instance;

// Configure API key authorization: access_token
var access_token = defaultClient.authentications['access_token'];
access_token.apiKey = "YOUR API KEY"
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix['access_token'] = "Token"

// Configure OAuth2 access token for authorization: quantimodo_oauth2
var quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = "YOUR ACCESS TOKEN"

var api = new Quantimodo.AnalyticsApi()

var body = new Quantimodo.VoteDelete(); // {VoteDelete} The cause and effect variable names for the predictor vote to be deleted.

var opts = { 
  'userId': 3.4 // {Number} User's id
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
api.deleteVote(body, opts, callback);

```

## Documentation for API Endpoints

All URIs are relative to *https://app.quantimo.do/api*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*Quantimodo.AnalyticsApi* | [**deleteVote**](docs/AnalyticsApi.md#deleteVote) | **DELETE** /v3/votes/delete | Delete vote
*Quantimodo.AnalyticsApi* | [**getAggregatedCorrelations**](docs/AnalyticsApi.md#getAggregatedCorrelations) | **GET** /v3/aggregatedCorrelations | Get aggregated correlations
*Quantimodo.AnalyticsApi* | [**getCorrelations**](docs/AnalyticsApi.md#getCorrelations) | **GET** /v3/correlations | Get correlations
*Quantimodo.AnalyticsApi* | [**postAggregatedCorrelations**](docs/AnalyticsApi.md#postAggregatedCorrelations) | **POST** /v3/aggregatedCorrelations | Store or Update a Correlation
*Quantimodo.AnalyticsApi* | [**postVote**](docs/AnalyticsApi.md#postVote) | **POST** /v3/votes | Post or update vote
*Quantimodo.AuthenticationApi* | [**getAccessToken**](docs/AuthenticationApi.md#getAccessToken) | **GET** /v2/oauth2/access_token | Get a user access token
*Quantimodo.AuthenticationApi* | [**getOauthAuthorizationCode**](docs/AuthenticationApi.md#getOauthAuthorizationCode) | **GET** /v2/oauth/authorize | Request Authorization Code
*Quantimodo.AuthenticationApi* | [**getSocialAuthorizationCode**](docs/AuthenticationApi.md#getSocialAuthorizationCode) | **GET** /v2/auth/social/authorizeCode | Second Step in Social Authentication flow with JWT Token
*Quantimodo.AuthenticationApi* | [**getSocialAuthorizationToken**](docs/AuthenticationApi.md#getSocialAuthorizationToken) | **GET** /v2/auth/social/authorizeToken | Native Social Authentication
*Quantimodo.AuthenticationApi* | [**getSocialLoginPage**](docs/AuthenticationApi.md#getSocialLoginPage) | **GET** /v2/auth/social/login | First Setp in Social Authentication flow with JWT Token
*Quantimodo.ConnectorsApi* | [**connectConnector**](docs/ConnectorsApi.md#connectConnector) | **GET** /v3/connectors/{connectorName}/connect | Obtain a token from 3rd party data source
*Quantimodo.ConnectorsApi* | [**connectConnectorWithParameters**](docs/ConnectorsApi.md#connectConnectorWithParameters) | **GET** /v3/connectors/{connectorName}/connectParameter | Connect Parameter
*Quantimodo.ConnectorsApi* | [**disconnectConnector**](docs/ConnectorsApi.md#disconnectConnector) | **GET** /v3/connectors/{connectorName}/disconnect | Delete stored connection info
*Quantimodo.ConnectorsApi* | [**getConnectorsList**](docs/ConnectorsApi.md#getConnectorsList) | **GET** /v3/connectors/list | List of Connectors
*Quantimodo.ConnectorsApi* | [**getIntegrationJs**](docs/ConnectorsApi.md#getIntegrationJs) | **GET** /v3/integration.js | Get embeddable connect javascript
*Quantimodo.ConnectorsApi* | [**getMobileConnectPage**](docs/ConnectorsApi.md#getMobileConnectPage) | **GET** /v3/connect/mobile | Mobile connect page
*Quantimodo.ConnectorsApi* | [**updateConnector**](docs/ConnectorsApi.md#updateConnector) | **GET** /v3/connectors/{connectorName}/update | Sync with data source
*Quantimodo.MeasurementsApi* | [**deleteMeasurement**](docs/MeasurementsApi.md#deleteMeasurement) | **DELETE** /v3/measurements/delete | Delete a measurement
*Quantimodo.MeasurementsApi* | [**getMeasurements**](docs/MeasurementsApi.md#getMeasurements) | **GET** /v3/measurements | Get measurements for this user
*Quantimodo.MeasurementsApi* | [**getPairs**](docs/MeasurementsApi.md#getPairs) | **GET** /v3/pairs | Get pairs of measurements for correlational analysis
*Quantimodo.MeasurementsApi* | [**measurementExportRequest**](docs/MeasurementsApi.md#measurementExportRequest) | **POST** /v2/measurements/exportRequest | Post Request for Measurements CSV
*Quantimodo.MeasurementsApi* | [**postMeasurements**](docs/MeasurementsApi.md#postMeasurements) | **POST** /v3/measurements | Post a new set or update existing measurements to the database
*Quantimodo.MeasurementsApi* | [**v3MeasurementsUpdatePut**](docs/MeasurementsApi.md#v3MeasurementsUpdatePut) | **PUT** /v3/measurements/update | Update a measurement
*Quantimodo.RemindersApi* | [**deleteTrackingReminder**](docs/RemindersApi.md#deleteTrackingReminder) | **DELETE** /v3/trackingReminders/delete | Delete tracking reminder
*Quantimodo.RemindersApi* | [**getTrackingReminderNotifications**](docs/RemindersApi.md#getTrackingReminderNotifications) | **GET** /v3/trackingReminderNotifications | Get specific pending tracking reminders
*Quantimodo.RemindersApi* | [**getTrackingReminders**](docs/RemindersApi.md#getTrackingReminders) | **GET** /v3/trackingReminders | Get repeating tracking reminder settings
*Quantimodo.RemindersApi* | [**postTrackingReminderNotifications**](docs/RemindersApi.md#postTrackingReminderNotifications) | **POST** /v3/trackingReminderNotifications | Snooze, skip, or track a pending tracking reminder notification
*Quantimodo.RemindersApi* | [**postTrackingReminders**](docs/RemindersApi.md#postTrackingReminders) | **POST** /v3/trackingReminders | Store a Tracking Reminder
*Quantimodo.UnitsApi* | [**getUnitCategories**](docs/UnitsApi.md#getUnitCategories) | **GET** /v3/unitCategories | Get unit categories
*Quantimodo.UnitsApi* | [**getUnits**](docs/UnitsApi.md#getUnits) | **GET** /v3/units | Get units
*Quantimodo.UserApi* | [**getUser**](docs/UserApi.md#getUser) | **GET** /v3/user | Get user info
*Quantimodo.VariablesApi* | [**deleteUserTag**](docs/VariablesApi.md#deleteUserTag) | **DELETE** /v3/userTags/delete | Delete user tag or ingredient
*Quantimodo.VariablesApi* | [**deleteUserVariable**](docs/VariablesApi.md#deleteUserVariable) | **DELETE** /v3/userVariables/delete | Delete All Measurements For Variable
*Quantimodo.VariablesApi* | [**getPublicVariables**](docs/VariablesApi.md#getPublicVariables) | **GET** /v3/public/variables | Get public variables
*Quantimodo.VariablesApi* | [**getUserVariables**](docs/VariablesApi.md#getUserVariables) | **GET** /v3/userVariables | Get variables with user&#39;s settings
*Quantimodo.VariablesApi* | [**getVariableCategories**](docs/VariablesApi.md#getVariableCategories) | **GET** /v3/variableCategories | Variable categories
*Quantimodo.VariablesApi* | [**postUserTags**](docs/VariablesApi.md#postUserTags) | **POST** /v3/userTags | Post or update user tags or ingredients
*Quantimodo.VariablesApi* | [**postUserVariables**](docs/VariablesApi.md#postUserVariables) | **POST** /v3/userVariables | Update User Settings for a Variable
*Quantimodo.VariablesApi* | [**resetUserVariableSettings**](docs/VariablesApi.md#resetUserVariableSettings) | **POST** /v3/userVariables/reset | Reset user settings for a variable to defaults


## Documentation for Models

 - [Quantimodo.CommonResponse](docs/CommonResponse.md)
 - [Quantimodo.Connector](docs/Connector.md)
 - [Quantimodo.ConnectorInstruction](docs/ConnectorInstruction.md)
 - [Quantimodo.ConversionStep](docs/ConversionStep.md)
 - [Quantimodo.Correlation](docs/Correlation.md)
 - [Quantimodo.InlineResponse200](docs/InlineResponse200.md)
 - [Quantimodo.InlineResponse2001](docs/InlineResponse2001.md)
 - [Quantimodo.InlineResponse2002](docs/InlineResponse2002.md)
 - [Quantimodo.JsonErrorResponse](docs/JsonErrorResponse.md)
 - [Quantimodo.Measurement](docs/Measurement.md)
 - [Quantimodo.MeasurementDelete](docs/MeasurementDelete.md)
 - [Quantimodo.MeasurementItem](docs/MeasurementItem.md)
 - [Quantimodo.MeasurementSet](docs/MeasurementSet.md)
 - [Quantimodo.MeasurementUpdate](docs/MeasurementUpdate.md)
 - [Quantimodo.Pairs](docs/Pairs.md)
 - [Quantimodo.PostCorrelation](docs/PostCorrelation.md)
 - [Quantimodo.TrackingReminder](docs/TrackingReminder.md)
 - [Quantimodo.TrackingReminderDelete](docs/TrackingReminderDelete.md)
 - [Quantimodo.TrackingReminderNotification](docs/TrackingReminderNotification.md)
 - [Quantimodo.TrackingReminderNotificationPost](docs/TrackingReminderNotificationPost.md)
 - [Quantimodo.Unit](docs/Unit.md)
 - [Quantimodo.UnitCategory](docs/UnitCategory.md)
 - [Quantimodo.Update](docs/Update.md)
 - [Quantimodo.User](docs/User.md)
 - [Quantimodo.UserTag](docs/UserTag.md)
 - [Quantimodo.UserTokenFailedResponse](docs/UserTokenFailedResponse.md)
 - [Quantimodo.UserTokenRequest](docs/UserTokenRequest.md)
 - [Quantimodo.UserTokenRequestInnerUserField](docs/UserTokenRequestInnerUserField.md)
 - [Quantimodo.UserTokenSuccessfulResponse](docs/UserTokenSuccessfulResponse.md)
 - [Quantimodo.UserTokenSuccessfulResponseInnerUserField](docs/UserTokenSuccessfulResponseInnerUserField.md)
 - [Quantimodo.UserVariable](docs/UserVariable.md)
 - [Quantimodo.UserVariableDelete](docs/UserVariableDelete.md)
 - [Quantimodo.UserVariables](docs/UserVariables.md)
 - [Quantimodo.Variable](docs/Variable.md)
 - [Quantimodo.VariableCategory](docs/VariableCategory.md)
 - [Quantimodo.Vote](docs/Vote.md)
 - [Quantimodo.VoteDelete](docs/VoteDelete.md)


## Documentation for Authorization


### access_token

- **Type**: API key
- **API key parameter name**: access_token
- **Location**: URL query string

### client_id

- **Type**: API key
- **API key parameter name**: clientId
- **Location**: URL query string

### quantimodo_oauth2

- **Type**: OAuth
- **Flow**: accessCode
- **Authorization URL**: https://app.quantimo.do/api/v2/oauth/authorize
- **Scopes**: 
  - basic: Allows you to read user info (displayname, email, etc).
  - readmeasurements: Allows one to read a user&#39;s data
  - writemeasurements: Allows you to write user data

