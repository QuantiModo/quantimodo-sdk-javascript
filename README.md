# quantimodo

Quantimodo - JavaScript client for quantimodo
QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do).

## Installation

### For [Node.js](https://nodejs.org/)

#### npm

Then install it via:

```shell
npm install quantimodo --save
```

You should now be able to `require('quantimodo')` in javascript files from the directory you ran the last 
command above from.

### For browser

```shell
bower install quantimodo --save
```

Then include *lib/quantimodo/quantimodo-web.js* in the HTML pages.

## Getting Started

Please follow the [installation](#installation) instruction and execute the following JS code:

```javascript
var Quantimodo = require('quantimodo');
var defaultClient = Quantimodo.ApiClient.instance;

// Configure OAuth2 access token for authorization: quantimodo_oauth2
var quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];

quantimodo_oauth2.accessToken = 'demo';

var apiInstance = new Quantimodo.UnitsApi();
var qmApiResponseCallback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
}
apiInstance.getUnits(qmApiResponseCallback);

```

## Documentation for API Endpoints

All URIs are relative to *https://app.quantimo.do/api*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*Quantimodo.AnalyticsApi* | [**deleteVote**](docs/AnalyticsApi.md#deleteVote) | **DELETE** /v3/votes/delete | Delete vote
*Quantimodo.AnalyticsApi* | [**getAggregatedCorrelations**](docs/AnalyticsApi.md#getAggregatedCorrelations) | **GET** /v3/aggregatedCorrelations | Get aggregated correlations
*Quantimodo.AnalyticsApi* | [**getStudy**](docs/AnalyticsApi.md#getStudy) | **GET** /v4/study | Get Study
*Quantimodo.AnalyticsApi* | [**getUserCorrelationExplantions**](docs/AnalyticsApi.md#getUserCorrelationExplantions) | **GET** /v3/correlations/explanations | Get correlation explanations
*Quantimodo.AnalyticsApi* | [**getUserCorrelations**](docs/AnalyticsApi.md#getUserCorrelations) | **GET** /v4/correlations | Get correlations
*Quantimodo.AnalyticsApi* | [**postAggregatedCorrelations**](docs/AnalyticsApi.md#postAggregatedCorrelations) | **POST** /v3/aggregatedCorrelations | Store or Update a Correlation
*Quantimodo.AnalyticsApi* | [**postVote**](docs/AnalyticsApi.md#postVote) | **POST** /v3/votes | Post or update vote
*Quantimodo.AuthenticationApi* | [**getAccessToken**](docs/AuthenticationApi.md#getAccessToken) | **GET** /v3/oauth2/token | Get a user access token
*Quantimodo.AuthenticationApi* | [**getOauthAuthorizationCode**](docs/AuthenticationApi.md#getOauthAuthorizationCode) | **GET** /v3/oauth2/authorize | Request Authorization Code
*Quantimodo.ConnectorsApi* | [**connectConnector**](docs/ConnectorsApi.md#connectConnector) | **GET** /v3/connectors/{connectorName}/connect | Obtain a token from 3rd party data source
*Quantimodo.ConnectorsApi* | [**disconnectConnector**](docs/ConnectorsApi.md#disconnectConnector) | **GET** /v3/connectors/{connectorName}/disconnect | Delete stored connection info
*Quantimodo.ConnectorsApi* | [**getConnectors**](docs/ConnectorsApi.md#getConnectors) | **GET** /v4/connectors/list | List of Connectors
*Quantimodo.ConnectorsApi* | [**getIntegrationJs**](docs/ConnectorsApi.md#getIntegrationJs) | **GET** /v3/integration.js | Get embeddable connect javascript
*Quantimodo.ConnectorsApi* | [**getMobileConnectPage**](docs/ConnectorsApi.md#getMobileConnectPage) | **GET** /v3/connect/mobile | Mobile connect page
*Quantimodo.ConnectorsApi* | [**updateConnector**](docs/ConnectorsApi.md#updateConnector) | **GET** /v3/connectors/{connectorName}/update | Sync with data source
*Quantimodo.MeasurementsApi* | [**deleteMeasurement**](docs/MeasurementsApi.md#deleteMeasurement) | **DELETE** /v3/measurements/delete | Delete a measurement
*Quantimodo.MeasurementsApi* | [**getMeasurements**](docs/MeasurementsApi.md#getMeasurements) | **GET** /v3/measurements | Get measurements for this user
*Quantimodo.MeasurementsApi* | [**getPairs**](docs/MeasurementsApi.md#getPairs) | **GET** /v3/pairs | Get pairs of measurements for correlational analysis
*Quantimodo.MeasurementsApi* | [**measurementExportRequest**](docs/MeasurementsApi.md#measurementExportRequest) | **POST** /v2/measurements/exportRequest | Post Request for Measurements CSV
*Quantimodo.MeasurementsApi* | [**postMeasurements**](docs/MeasurementsApi.md#postMeasurements) | **POST** /v3/measurements | Post a new set or update existing measurements to the database
*Quantimodo.MeasurementsApi* | [**v3MeasurementsUpdatePost**](docs/MeasurementsApi.md#v3MeasurementsUpdatePost) | **POST** /v3/measurements/update | Update a measurement
*Quantimodo.RemindersApi* | [**deleteTrackingReminder**](docs/RemindersApi.md#deleteTrackingReminder) | **DELETE** /v3/trackingReminders/delete | Delete tracking reminder
*Quantimodo.RemindersApi* | [**getTrackingReminderNotifications**](docs/RemindersApi.md#getTrackingReminderNotifications) | **GET** /v4/trackingReminderNotifications | Get specific pending tracking reminders
*Quantimodo.RemindersApi* | [**getTrackingReminders**](docs/RemindersApi.md#getTrackingReminders) | **GET** /v3/trackingReminders | Get repeating tracking reminder settings
*Quantimodo.RemindersApi* | [**postTrackingReminderNotifications**](docs/RemindersApi.md#postTrackingReminderNotifications) | **POST** /v4/trackingReminderNotifications | Snooze, skip, or track a pending tracking reminder notification
*Quantimodo.RemindersApi* | [**postTrackingReminders**](docs/RemindersApi.md#postTrackingReminders) | **POST** /v3/trackingReminders | Store a Tracking Reminder
*Quantimodo.UnitsApi* | [**getUnitCategories**](docs/UnitsApi.md#getUnitCategories) | **GET** /v3/unitCategories | Get unit categories
*Quantimodo.UnitsApi* | [**getUnits**](docs/UnitsApi.md#getUnits) | **GET** /v3/units | Get units
*Quantimodo.UserApi* | [**getUser**](docs/UserApi.md#getUser) | **GET** /v3/user | Get user info
*Quantimodo.UserApi* | [**postUserSettings**](docs/UserApi.md#postUserSettings) | **POST** /v3/userSettings | Post UserSettings
*Quantimodo.VariablesApi* | [**deleteUserTag**](docs/VariablesApi.md#deleteUserTag) | **DELETE** /v3/userTags/delete | Delete user tag or ingredient
*Quantimodo.VariablesApi* | [**deleteUserVariable**](docs/VariablesApi.md#deleteUserVariable) | **DELETE** /v3/userVariables/delete | Delete All Measurements For Variable
*Quantimodo.VariablesApi* | [**getPublicVariables**](docs/VariablesApi.md#getPublicVariables) | **GET** /v3/public/variables | Get public variables
*Quantimodo.VariablesApi* | [**getUserVariables**](docs/VariablesApi.md#getUserVariables) | **GET** /v3/userVariables | Get variables with user&#39;s settings
*Quantimodo.VariablesApi* | [**getVariableCategories**](docs/VariablesApi.md#getVariableCategories) | **GET** /v3/variableCategories | Variable categories
*Quantimodo.VariablesApi* | [**postUserTags**](docs/VariablesApi.md#postUserTags) | **POST** /v3/userTags | Post or update user tags or ingredients
*Quantimodo.VariablesApi* | [**postUserVariables**](docs/VariablesApi.md#postUserVariables) | **POST** /v3/userVariables | Update User Settings for a Variable
*Quantimodo.VariablesApi* | [**resetUserVariableSettings**](docs/VariablesApi.md#resetUserVariableSettings) | **POST** /v3/userVariables/reset | Reset user settings for a variable to defaults


## Documentation for Models

 - [Quantimodo.AggregatedCorrelation](docs/AggregatedCorrelation.md)
 - [Quantimodo.CommonResponse](docs/CommonResponse.md)
 - [Quantimodo.Connector](docs/Connector.md)
 - [Quantimodo.ConnectorInstruction](docs/ConnectorInstruction.md)
 - [Quantimodo.ConversionStep](docs/ConversionStep.md)
 - [Quantimodo.InlineResponse201](docs/InlineResponse201.md)
 - [Quantimodo.JsonErrorResponse](docs/JsonErrorResponse.md)
 - [Quantimodo.Measurement](docs/Measurement.md)
 - [Quantimodo.MeasurementDelete](docs/MeasurementDelete.md)
 - [Quantimodo.MeasurementItem](docs/MeasurementItem.md)
 - [Quantimodo.MeasurementSet](docs/MeasurementSet.md)
 - [Quantimodo.MeasurementUpdate](docs/MeasurementUpdate.md)
 - [Quantimodo.Pairs](docs/Pairs.md)
 - [Quantimodo.PostCorrelation](docs/PostCorrelation.md)
 - [Quantimodo.Study](docs/Study.md)
 - [Quantimodo.TrackingReminder](docs/TrackingReminder.md)
 - [Quantimodo.TrackingReminderDelete](docs/TrackingReminderDelete.md)
 - [Quantimodo.TrackingReminderNotification](docs/TrackingReminderNotification.md)
 - [Quantimodo.TrackingReminderNotificationPost](docs/TrackingReminderNotificationPost.md)
 - [Quantimodo.Unit](docs/Unit.md)
 - [Quantimodo.UnitCategory](docs/UnitCategory.md)
 - [Quantimodo.Update](docs/Update.md)
 - [Quantimodo.User](docs/User.md)
 - [Quantimodo.UserCorrelation](docs/UserCorrelation.md)
 - [Quantimodo.UserTag](docs/UserTag.md)
 - [Quantimodo.UserTokenFailedResponse](docs/UserTokenFailedResponse.md)
 - [Quantimodo.UserTokenRequest](docs/UserTokenRequest.md)
 - [Quantimodo.UserTokenRequestInnerUserField](docs/UserTokenRequestInnerUserField.md)
 - [Quantimodo.UserTokenSuccessfulResponse](docs/UserTokenSuccessfulResponse.md)
 - [Quantimodo.UserTokenSuccessfulResponseInnerUserField](docs/UserTokenSuccessfulResponseInnerUserField.md)
 - [Quantimodo.UserVariable](docs/UserVariable.md)
 - [Quantimodo.UserVariableDelete](docs/UserVariableDelete.md)
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

