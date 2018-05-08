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
  'userId': 3.4, // {Number} User's id
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
*Quantimodo.AnalyticsApi* | [**getCorrelationExplanations**](docs/AnalyticsApi.md#getCorrelationExplanations) | **GET** /v3/correlations/explanations | Get correlation explanations
*Quantimodo.AnalyticsApi* | [**getCorrelations**](docs/AnalyticsApi.md#getCorrelations) | **GET** /v3/correlations | Get correlations
*Quantimodo.AnalyticsApi* | [**getStudy**](docs/AnalyticsApi.md#getStudy) | **GET** /v4/study | Get Study
*Quantimodo.AnalyticsApi* | [**postVote**](docs/AnalyticsApi.md#postVote) | **POST** /v3/votes | Post or update vote
*Quantimodo.AppSettingsApi* | [**getAppSettings**](docs/AppSettingsApi.md#getAppSettings) | **GET** /v3/appSettings | Get client app Settings
*Quantimodo.AuthenticationApi* | [**getAccessToken**](docs/AuthenticationApi.md#getAccessToken) | **GET** /v3/oauth2/token | Get a user access token
*Quantimodo.AuthenticationApi* | [**getOauthAuthorizationCode**](docs/AuthenticationApi.md#getOauthAuthorizationCode) | **GET** /v3/oauth2/authorize | Request Authorization Code
*Quantimodo.AuthenticationApi* | [**postGoogleIdToken**](docs/AuthenticationApi.md#postGoogleIdToken) | **POST** /v3/googleIdToken | Post GoogleIdToken
*Quantimodo.ConnectorsApi* | [**connectConnector**](docs/ConnectorsApi.md#connectConnector) | **GET** /v3/connectors/{connectorName}/connect | Obtain a token from 3rd party data source
*Quantimodo.ConnectorsApi* | [**disconnectConnector**](docs/ConnectorsApi.md#disconnectConnector) | **GET** /v3/connectors/{connectorName}/disconnect | Delete stored connection info
*Quantimodo.ConnectorsApi* | [**getConnectors**](docs/ConnectorsApi.md#getConnectors) | **GET** /v3/connectors/list | List of Connectors
*Quantimodo.ConnectorsApi* | [**getIntegrationJs**](docs/ConnectorsApi.md#getIntegrationJs) | **GET** /v3/integration.js | Get embeddable connect javascript
*Quantimodo.ConnectorsApi* | [**getMobileConnectPage**](docs/ConnectorsApi.md#getMobileConnectPage) | **GET** /v3/connect/mobile | Mobile connect page
*Quantimodo.ConnectorsApi* | [**updateConnector**](docs/ConnectorsApi.md#updateConnector) | **GET** /v3/connectors/{connectorName}/update | Sync with data source
*Quantimodo.MeasurementsApi* | [**deleteMeasurement**](docs/MeasurementsApi.md#deleteMeasurement) | **DELETE** /v3/measurements/delete | Delete a measurement
*Quantimodo.MeasurementsApi* | [**getMeasurements**](docs/MeasurementsApi.md#getMeasurements) | **GET** /v3/measurements | Get measurements for this user
*Quantimodo.MeasurementsApi* | [**getPairs**](docs/MeasurementsApi.md#getPairs) | **GET** /v3/pairs | Get pairs of measurements for correlational analysis
*Quantimodo.MeasurementsApi* | [**measurementExportRequest**](docs/MeasurementsApi.md#measurementExportRequest) | **POST** /v2/measurements/exportRequest | Post Request for Measurements CSV
*Quantimodo.MeasurementsApi* | [**postMeasurements**](docs/MeasurementsApi.md#postMeasurements) | **POST** /v3/measurements/post | Post a new set or update existing measurements to the database
*Quantimodo.MeasurementsApi* | [**updateMeasurement**](docs/MeasurementsApi.md#updateMeasurement) | **POST** /v3/measurements/update | Update a measurement
*Quantimodo.NotificationsApi* | [**getNotificationPreferences**](docs/NotificationsApi.md#getNotificationPreferences) | **GET** /v3/notificationPreferences | Get NotificationPreferences
*Quantimodo.NotificationsApi* | [**postDeviceToken**](docs/NotificationsApi.md#postDeviceToken) | **POST** /v3/deviceTokens | Post DeviceTokens
*Quantimodo.RemindersApi* | [**deleteTrackingReminder**](docs/RemindersApi.md#deleteTrackingReminder) | **DELETE** /v3/trackingReminders/delete | Delete tracking reminder
*Quantimodo.RemindersApi* | [**getTrackingReminderNotifications**](docs/RemindersApi.md#getTrackingReminderNotifications) | **GET** /v3/trackingReminderNotifications | Get specific tracking reminder notifications
*Quantimodo.RemindersApi* | [**getTrackingReminders**](docs/RemindersApi.md#getTrackingReminders) | **GET** /v3/trackingReminders | Get repeating tracking reminder settings
*Quantimodo.RemindersApi* | [**postTrackingReminderNotifications**](docs/RemindersApi.md#postTrackingReminderNotifications) | **POST** /v3/trackingReminderNotifications | Snooze, skip, or track a tracking reminder notification
*Quantimodo.RemindersApi* | [**postTrackingReminders**](docs/RemindersApi.md#postTrackingReminders) | **POST** /v3/trackingReminders | Store a Tracking Reminder
*Quantimodo.StudyApi* | [**postStudyPublish**](docs/StudyApi.md#postStudyPublish) | **POST** /v3/study/publish | Post Study Publish
*Quantimodo.UnitsApi* | [**getUnitCategories**](docs/UnitsApi.md#getUnitCategories) | **GET** /v3/unitCategories | Get unit categories
*Quantimodo.UnitsApi* | [**getUnits**](docs/UnitsApi.md#getUnits) | **GET** /v3/units | Get units
*Quantimodo.UserApi* | [**deleteUser**](docs/UserApi.md#deleteUser) | **DELETE** /v3/user/delete | Delete user
*Quantimodo.UserApi* | [**getUser**](docs/UserApi.md#getUser) | **GET** /v3/user | Get user info
*Quantimodo.UserApi* | [**postUserSettings**](docs/UserApi.md#postUserSettings) | **POST** /v3/userSettings | Post UserSettings
*Quantimodo.VariablesApi* | [**deleteUserTag**](docs/VariablesApi.md#deleteUserTag) | **DELETE** /v3/userTags/delete | Delete user tag or ingredient
*Quantimodo.VariablesApi* | [**deleteUserVariable**](docs/VariablesApi.md#deleteUserVariable) | **DELETE** /v3/userVariables/delete | Delete All Measurements For Variable
*Quantimodo.VariablesApi* | [**getVariableCategories**](docs/VariablesApi.md#getVariableCategories) | **GET** /v3/variableCategories | Variable categories
*Quantimodo.VariablesApi* | [**getVariables**](docs/VariablesApi.md#getVariables) | **GET** /v3/variables | Get variables along with related user-specific analysis settings and statistics
*Quantimodo.VariablesApi* | [**postUserTags**](docs/VariablesApi.md#postUserTags) | **POST** /v3/userTags | Post or update user tags or ingredients
*Quantimodo.VariablesApi* | [**postUserVariables**](docs/VariablesApi.md#postUserVariables) | **POST** /v3/variables | Update User Settings for a Variable
*Quantimodo.VariablesApi* | [**resetUserVariableSettings**](docs/VariablesApi.md#resetUserVariableSettings) | **POST** /v3/userVariables/reset | Reset user settings for a variable to defaults


## Documentation for Models

 - [Quantimodo.AppSettings](docs/AppSettings.md)
 - [Quantimodo.AppSettingsResponse](docs/AppSettingsResponse.md)
 - [Quantimodo.Button](docs/Button.md)
 - [Quantimodo.Chart](docs/Chart.md)
 - [Quantimodo.CommonResponse](docs/CommonResponse.md)
 - [Quantimodo.ConnectInstructions](docs/ConnectInstructions.md)
 - [Quantimodo.Connector](docs/Connector.md)
 - [Quantimodo.ConversionStep](docs/ConversionStep.md)
 - [Quantimodo.Correlation](docs/Correlation.md)
 - [Quantimodo.DataSource](docs/DataSource.md)
 - [Quantimodo.DeviceToken](docs/DeviceToken.md)
 - [Quantimodo.Explanation](docs/Explanation.md)
 - [Quantimodo.ExplanationStartTracking](docs/ExplanationStartTracking.md)
 - [Quantimodo.GetConnectorsResponse](docs/GetConnectorsResponse.md)
 - [Quantimodo.GetCorrelationsDataResponse](docs/GetCorrelationsDataResponse.md)
 - [Quantimodo.GetCorrelationsResponse](docs/GetCorrelationsResponse.md)
 - [Quantimodo.GetTrackingReminderNotificationsResponse](docs/GetTrackingReminderNotificationsResponse.md)
 - [Quantimodo.Image](docs/Image.md)
 - [Quantimodo.JsonErrorResponse](docs/JsonErrorResponse.md)
 - [Quantimodo.Measurement](docs/Measurement.md)
 - [Quantimodo.MeasurementDelete](docs/MeasurementDelete.md)
 - [Quantimodo.MeasurementItem](docs/MeasurementItem.md)
 - [Quantimodo.MeasurementSet](docs/MeasurementSet.md)
 - [Quantimodo.MeasurementUpdate](docs/MeasurementUpdate.md)
 - [Quantimodo.Pair](docs/Pair.md)
 - [Quantimodo.ParticipantInstruction](docs/ParticipantInstruction.md)
 - [Quantimodo.PostCorrelation](docs/PostCorrelation.md)
 - [Quantimodo.PostMeasurementsDataResponse](docs/PostMeasurementsDataResponse.md)
 - [Quantimodo.PostMeasurementsResponse](docs/PostMeasurementsResponse.md)
 - [Quantimodo.PostStudyPublishResponse](docs/PostStudyPublishResponse.md)
 - [Quantimodo.PostTrackingRemindersDataResponse](docs/PostTrackingRemindersDataResponse.md)
 - [Quantimodo.PostTrackingRemindersResponse](docs/PostTrackingRemindersResponse.md)
 - [Quantimodo.PostUserSettingsDataResponse](docs/PostUserSettingsDataResponse.md)
 - [Quantimodo.PostUserSettingsResponse](docs/PostUserSettingsResponse.md)
 - [Quantimodo.Scope](docs/Scope.md)
 - [Quantimodo.Study](docs/Study.md)
 - [Quantimodo.StudyHtml](docs/StudyHtml.md)
 - [Quantimodo.StudyImages](docs/StudyImages.md)
 - [Quantimodo.StudyLinks](docs/StudyLinks.md)
 - [Quantimodo.StudyText](docs/StudyText.md)
 - [Quantimodo.TrackingReminder](docs/TrackingReminder.md)
 - [Quantimodo.TrackingReminderDelete](docs/TrackingReminderDelete.md)
 - [Quantimodo.TrackingReminderNotification](docs/TrackingReminderNotification.md)
 - [Quantimodo.TrackingReminderNotificationAction](docs/TrackingReminderNotificationAction.md)
 - [Quantimodo.TrackingReminderNotificationPost](docs/TrackingReminderNotificationPost.md)
 - [Quantimodo.TrackingReminderNotificationTrackAllAction](docs/TrackingReminderNotificationTrackAllAction.md)
 - [Quantimodo.Unit](docs/Unit.md)
 - [Quantimodo.UnitCategory](docs/UnitCategory.md)
 - [Quantimodo.User](docs/User.md)
 - [Quantimodo.UserTag](docs/UserTag.md)
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
  - basic: Allows you to read user info (display name, email, etc).
  - readmeasurements: Allows one to read a user&#39;s data
  - writemeasurements: Allows you to write user data

