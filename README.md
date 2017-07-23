# quantimodo-api

QuantimodoApi - JavaScript client for QuantiModo
QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 


## Installation

### For [Node.js](https://nodejs.org/)

#### npm

To publish the library as a [npm](https://www.npmjs.com/),
please follow the procedure in ["Publishing npm packages"](https://docs.npmjs.com/getting-started/publishing-npm-packages).

Then install it via:

```shell
npm install quantimodo-api --save
```

### For browser

The library also works in the browser environment via npm and [browserify](http://browserify.org/). After following
the above steps with Node.js and installing browserify with `npm install -g browserify`,
perform the following (assuming *main.js* is your entry file):

```shell
browserify main.js > bundle.js
```

Then include *bundle.js* in the HTML pages.

## Getting Started

Please follow the [installation](#installation) instruction and execute the following JS code:

```javascript
var QuantimodoApi = require('quantimodo-api');

var defaultClient = QuantimodoApi.ApiClient.instance;

// Configure API key authorization: access_token
var access_token = defaultClient.authentications['access_token'];
access_token.apiKey = "YOUR API KEY"
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access_token.apiKeyPrefix['access_token'] = "Token"

// Configure OAuth2 access token for authorization: quantimodo_oauth2
var quantimodo_oauth2 = defaultClient.authentications['quantimodo_oauth2'];
quantimodo_oauth2.accessToken = "YOUR ACCESS TOKEN"

var api = new QuantimodoApi.AuthenticationApi()

var code = "code_example"; // {String} Authorization code obtained from the provider.

var provider = "provider_example"; // {String} The current options are `google` and `facebook`.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
api.v2AuthSocialAuthorizeCodeGet(code, provider, callback);

```

## Documentation for API Endpoints

All URIs are relative to *https://app.quantimo.do/api*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*QuantimodoApi.AuthenticationApi* | [**v2AuthSocialAuthorizeCodeGet**](docs/AuthenticationApi.md#v2AuthSocialAuthorizeCodeGet) | **GET** /v2/auth/social/authorizeCode | Second Step in Social Authentication flow with JWT Token
*QuantimodoApi.AuthenticationApi* | [**v2AuthSocialAuthorizeTokenGet**](docs/AuthenticationApi.md#v2AuthSocialAuthorizeTokenGet) | **GET** /v2/auth/social/authorizeToken | Native Social Authentication
*QuantimodoApi.AuthenticationApi* | [**v2AuthSocialLoginGet**](docs/AuthenticationApi.md#v2AuthSocialLoginGet) | **GET** /v2/auth/social/login | First Setp in Social Authentication flow with JWT Token
*QuantimodoApi.AuthenticationApi* | [**v2Oauth2AccessTokenGet**](docs/AuthenticationApi.md#v2Oauth2AccessTokenGet) | **GET** /v2/oauth2/access_token | Get a user access token
*QuantimodoApi.AuthenticationApi* | [**v2OauthAuthorizeGet**](docs/AuthenticationApi.md#v2OauthAuthorizeGet) | **GET** /v2/oauth/authorize | Request Authorization Code
*QuantimodoApi.ConnectorsApi* | [**v1ConnectMobileGet**](docs/ConnectorsApi.md#v1ConnectMobileGet) | **GET** /v1/connect/mobile | Mobile connect page
*QuantimodoApi.ConnectorsApi* | [**v1ConnectorsConnectorNameConnectGet**](docs/ConnectorsApi.md#v1ConnectorsConnectorNameConnectGet) | **GET** /v1/connectors/{connectorName}/connect | Obtain a token from 3rd party data source
*QuantimodoApi.ConnectorsApi* | [**v1ConnectorsConnectorNameConnectInstructionsGet**](docs/ConnectorsApi.md#v1ConnectorsConnectorNameConnectInstructionsGet) | **GET** /v1/connectors/{connectorName}/connectInstructions | Connection Instructions
*QuantimodoApi.ConnectorsApi* | [**v1ConnectorsConnectorNameConnectParameterGet**](docs/ConnectorsApi.md#v1ConnectorsConnectorNameConnectParameterGet) | **GET** /v1/connectors/{connectorName}/connectParameter | Connect Parameter
*QuantimodoApi.ConnectorsApi* | [**v1ConnectorsConnectorNameDisconnectGet**](docs/ConnectorsApi.md#v1ConnectorsConnectorNameDisconnectGet) | **GET** /v1/connectors/{connectorName}/disconnect | Delete stored connection info
*QuantimodoApi.ConnectorsApi* | [**v1ConnectorsConnectorNameInfoGet**](docs/ConnectorsApi.md#v1ConnectorsConnectorNameInfoGet) | **GET** /v1/connectors/{connectorName}/info | Get connector info for user
*QuantimodoApi.ConnectorsApi* | [**v1ConnectorsConnectorNameUpdateGet**](docs/ConnectorsApi.md#v1ConnectorsConnectorNameUpdateGet) | **GET** /v1/connectors/{connectorName}/update | Sync with data source
*QuantimodoApi.ConnectorsApi* | [**v1ConnectorsListGet**](docs/ConnectorsApi.md#v1ConnectorsListGet) | **GET** /v1/connectors/list | List of Connectors
*QuantimodoApi.ConnectorsApi* | [**v1IntegrationJsGet**](docs/ConnectorsApi.md#v1IntegrationJsGet) | **GET** /v1/integration.js | Get embeddable connect javascript
*QuantimodoApi.CorrelationsApi* | [**v1AggregatedCorrelationsGet**](docs/CorrelationsApi.md#v1AggregatedCorrelationsGet) | **GET** /v1/aggregatedCorrelations | Get aggregated correlations
*QuantimodoApi.CorrelationsApi* | [**v1AggregatedCorrelationsPost**](docs/CorrelationsApi.md#v1AggregatedCorrelationsPost) | **POST** /v1/aggregatedCorrelations | Store or Update a Correlation
*QuantimodoApi.CorrelationsApi* | [**v1CorrelationsGet**](docs/CorrelationsApi.md#v1CorrelationsGet) | **GET** /v1/correlations | Get correlations
*QuantimodoApi.CorrelationsApi* | [**v1OrganizationsOrganizationIdUsersUserIdVariablesVariableNameCausesGet**](docs/CorrelationsApi.md#v1OrganizationsOrganizationIdUsersUserIdVariablesVariableNameCausesGet) | **GET** /v1/organizations/{organizationId}/users/{userId}/variables/{variableName}/causes | Search user correlations for a given cause
*QuantimodoApi.CorrelationsApi* | [**v1OrganizationsOrganizationIdUsersUserIdVariablesVariableNameEffectsGet**](docs/CorrelationsApi.md#v1OrganizationsOrganizationIdUsersUserIdVariablesVariableNameEffectsGet) | **GET** /v1/organizations/{organizationId}/users/{userId}/variables/{variableName}/effects | Search user correlations for a given cause
*QuantimodoApi.CorrelationsApi* | [**v1PublicCorrelationsSearchSearchGet**](docs/CorrelationsApi.md#v1PublicCorrelationsSearchSearchGet) | **GET** /v1/public/correlations/search/{search} | Get average correlations for variables containing search term
*QuantimodoApi.CorrelationsApi* | [**v1VariablesVariableNameCausesGet**](docs/CorrelationsApi.md#v1VariablesVariableNameCausesGet) | **GET** /v1/variables/{variableName}/causes | Search user correlations for a given effect
*QuantimodoApi.CorrelationsApi* | [**v1VariablesVariableNameEffectsGet**](docs/CorrelationsApi.md#v1VariablesVariableNameEffectsGet) | **GET** /v1/variables/{variableName}/effects | Search user correlations for a given cause
*QuantimodoApi.CorrelationsApi* | [**v1VariablesVariableNamePublicCausesGet**](docs/CorrelationsApi.md#v1VariablesVariableNamePublicCausesGet) | **GET** /v1/variables/{variableName}/public/causes | Search public correlations for a given effect
*QuantimodoApi.CorrelationsApi* | [**v1VariablesVariableNamePublicEffectsGet**](docs/CorrelationsApi.md#v1VariablesVariableNamePublicEffectsGet) | **GET** /v1/variables/{variableName}/public/effects | Search public correlations for a given cause
*QuantimodoApi.CorrelationsApi* | [**v1VotesDeletePost**](docs/CorrelationsApi.md#v1VotesDeletePost) | **POST** /v1/votes/delete | Delete vote
*QuantimodoApi.CorrelationsApi* | [**v1VotesPost**](docs/CorrelationsApi.md#v1VotesPost) | **POST** /v1/votes | Post or update vote
*QuantimodoApi.MeasurementsApi* | [**v1MeasurementSourcesGet**](docs/MeasurementsApi.md#v1MeasurementSourcesGet) | **GET** /v1/measurementSources | Get measurement sources
*QuantimodoApi.MeasurementsApi* | [**v1MeasurementSourcesPost**](docs/MeasurementsApi.md#v1MeasurementSourcesPost) | **POST** /v1/measurementSources | Add a data source
*QuantimodoApi.MeasurementsApi* | [**v1MeasurementsDailyGet**](docs/MeasurementsApi.md#v1MeasurementsDailyGet) | **GET** /v1/measurements/daily | Get daily measurements for this user
*QuantimodoApi.MeasurementsApi* | [**v1MeasurementsDeletePost**](docs/MeasurementsApi.md#v1MeasurementsDeletePost) | **POST** /v1/measurements/delete | Delete a measurement
*QuantimodoApi.MeasurementsApi* | [**v1MeasurementsGet**](docs/MeasurementsApi.md#v1MeasurementsGet) | **GET** /v1/measurements | Get measurements for this user
*QuantimodoApi.MeasurementsApi* | [**v1MeasurementsPost**](docs/MeasurementsApi.md#v1MeasurementsPost) | **POST** /v1/measurements | Post a new set or update existing measurements to the database
*QuantimodoApi.MeasurementsApi* | [**v1MeasurementsRangeGet**](docs/MeasurementsApi.md#v1MeasurementsRangeGet) | **GET** /v1/measurementsRange | Get measurements range for this user
*QuantimodoApi.MeasurementsApi* | [**v1MeasurementsUpdatePost**](docs/MeasurementsApi.md#v1MeasurementsUpdatePost) | **POST** /v1/measurements/update | Update a measurement
*QuantimodoApi.MeasurementsApi* | [**v2MeasurementsCsvGet**](docs/MeasurementsApi.md#v2MeasurementsCsvGet) | **GET** /v2/measurements/csv | Get Measurements CSV
*QuantimodoApi.MeasurementsApi* | [**v2MeasurementsRequestCsvPost**](docs/MeasurementsApi.md#v2MeasurementsRequestCsvPost) | **POST** /v2/measurements/request_csv | Post Request for Measurements CSV
*QuantimodoApi.MeasurementsApi* | [**v2MeasurementsRequestPdfPost**](docs/MeasurementsApi.md#v2MeasurementsRequestPdfPost) | **POST** /v2/measurements/request_pdf | Post Request for Measurements PDF
*QuantimodoApi.MeasurementsApi* | [**v2MeasurementsRequestXlsPost**](docs/MeasurementsApi.md#v2MeasurementsRequestXlsPost) | **POST** /v2/measurements/request_xls | Post Request for Measurements XLS
*QuantimodoApi.OrganizationsApi* | [**v1OrganizationsOrganizationIdUsersPost**](docs/OrganizationsApi.md#v1OrganizationsOrganizationIdUsersPost) | **POST** /v1/organizations/{organizationId}/users | Get user tokens for existing users, create new users
*QuantimodoApi.PairsApi* | [**v1PairsCsvGet**](docs/PairsApi.md#v1PairsCsvGet) | **GET** /v1/pairsCsv | Get pairs
*QuantimodoApi.PairsApi* | [**v1PairsGet**](docs/PairsApi.md#v1PairsGet) | **GET** /v1/pairs | Get pairs
*QuantimodoApi.RemindersApi* | [**v1TrackingReminderNotificationsGet**](docs/RemindersApi.md#v1TrackingReminderNotificationsGet) | **GET** /v1/trackingReminderNotifications | Get specific pending tracking reminders
*QuantimodoApi.RemindersApi* | [**v1TrackingReminderNotificationsSkipPost**](docs/RemindersApi.md#v1TrackingReminderNotificationsSkipPost) | **POST** /v1/trackingReminderNotifications/skip | Skip a pending tracking reminder
*QuantimodoApi.RemindersApi* | [**v1TrackingReminderNotificationsSnoozePost**](docs/RemindersApi.md#v1TrackingReminderNotificationsSnoozePost) | **POST** /v1/trackingReminderNotifications/snooze | Snooze a pending tracking reminder
*QuantimodoApi.RemindersApi* | [**v1TrackingReminderNotificationsTrackPost**](docs/RemindersApi.md#v1TrackingReminderNotificationsTrackPost) | **POST** /v1/trackingReminderNotifications/track | Track a pending tracking reminder
*QuantimodoApi.RemindersApi* | [**v1TrackingRemindersDeletePost**](docs/RemindersApi.md#v1TrackingRemindersDeletePost) | **POST** /v1/trackingReminders/delete | Delete tracking reminder
*QuantimodoApi.RemindersApi* | [**v1TrackingRemindersGet**](docs/RemindersApi.md#v1TrackingRemindersGet) | **GET** /v1/trackingReminders | Get repeating tracking reminder settings
*QuantimodoApi.RemindersApi* | [**v1TrackingRemindersPost**](docs/RemindersApi.md#v1TrackingRemindersPost) | **POST** /v1/trackingReminders | Store a Tracking Reminder
*QuantimodoApi.TagsApi* | [**v1UserTagsDeletePost**](docs/TagsApi.md#v1UserTagsDeletePost) | **POST** /v1/userTags/delete | Delete user tag or ingredient
*QuantimodoApi.TagsApi* | [**v1UserTagsPost**](docs/TagsApi.md#v1UserTagsPost) | **POST** /v1/userTags | Post or update user tags or ingredients
*QuantimodoApi.UnitsApi* | [**v1UnitCategoriesGet**](docs/UnitsApi.md#v1UnitCategoriesGet) | **GET** /v1/unitCategories | Get unit categories
*QuantimodoApi.UnitsApi* | [**v1UnitsGet**](docs/UnitsApi.md#v1UnitsGet) | **GET** /v1/units | Get all available units
*QuantimodoApi.UnitsApi* | [**v1UnitsVariableGet**](docs/UnitsApi.md#v1UnitsVariableGet) | **GET** /v1/unitsVariable | Units for Variable
*QuantimodoApi.UserApi* | [**v1OrganizationsOrganizationIdUsersPost**](docs/UserApi.md#v1OrganizationsOrganizationIdUsersPost) | **POST** /v1/organizations/{organizationId}/users | Get user tokens for existing users, create new users
*QuantimodoApi.UserApi* | [**v1UserMeGet**](docs/UserApi.md#v1UserMeGet) | **GET** /v1/user/me | Get all available units for variableGet authenticated user
*QuantimodoApi.VariablesApi* | [**v1PublicVariablesGet**](docs/VariablesApi.md#v1PublicVariablesGet) | **GET** /v1/public/variables | Get public variables
*QuantimodoApi.VariablesApi* | [**v1PublicVariablesSearchSearchGet**](docs/VariablesApi.md#v1PublicVariablesSearchSearchGet) | **GET** /v1/public/variables/search/{search} | Get top 5 PUBLIC variables with the most correlations
*QuantimodoApi.VariablesApi* | [**v1UserVariablesDeletePost**](docs/VariablesApi.md#v1UserVariablesDeletePost) | **POST** /v1/userVariables/delete | Delete All Measurements For Variable
*QuantimodoApi.VariablesApi* | [**v1UserVariablesPost**](docs/VariablesApi.md#v1UserVariablesPost) | **POST** /v1/userVariables | Update User Settings for a Variable
*QuantimodoApi.VariablesApi* | [**v1UserVariablesResetPost**](docs/VariablesApi.md#v1UserVariablesResetPost) | **POST** /v1/userVariables/reset | Reset user settings for a variable to defaults
*QuantimodoApi.VariablesApi* | [**v1VariableCategoriesGet**](docs/VariablesApi.md#v1VariableCategoriesGet) | **GET** /v1/variableCategories | Variable categories
*QuantimodoApi.VariablesApi* | [**v1VariablesGet**](docs/VariablesApi.md#v1VariablesGet) | **GET** /v1/variables | Get variables with user&#39;s settings
*QuantimodoApi.VariablesApi* | [**v1VariablesPost**](docs/VariablesApi.md#v1VariablesPost) | **POST** /v1/variables | Create Variables
*QuantimodoApi.VariablesApi* | [**v1VariablesSearchSearchGet**](docs/VariablesApi.md#v1VariablesSearchSearchGet) | **GET** /v1/variables/search/{search} | Get variables by search query
*QuantimodoApi.VariablesApi* | [**v1VariablesVariableNameGet**](docs/VariablesApi.md#v1VariablesVariableNameGet) | **GET** /v1/variables/{variableName} | Get info about a variable
*QuantimodoApi.VotesApi* | [**v1VotesDeletePost**](docs/VotesApi.md#v1VotesDeletePost) | **POST** /v1/votes/delete | Delete vote
*QuantimodoApi.VotesApi* | [**v1VotesPost**](docs/VotesApi.md#v1VotesPost) | **POST** /v1/votes | Post or update vote


## Documentation for Models

 - [QuantimodoApi.CommonResponse](docs/CommonResponse.md)
 - [QuantimodoApi.Connection](docs/Connection.md)
 - [QuantimodoApi.Connector](docs/Connector.md)
 - [QuantimodoApi.ConnectorInfo](docs/ConnectorInfo.md)
 - [QuantimodoApi.ConnectorInfoHistoryItem](docs/ConnectorInfoHistoryItem.md)
 - [QuantimodoApi.ConnectorInstruction](docs/ConnectorInstruction.md)
 - [QuantimodoApi.ConversionStep](docs/ConversionStep.md)
 - [QuantimodoApi.Correlation](docs/Correlation.md)
 - [QuantimodoApi.HumanTime](docs/HumanTime.md)
 - [QuantimodoApi.InlineResponse200](docs/InlineResponse200.md)
 - [QuantimodoApi.InlineResponse2001](docs/InlineResponse2001.md)
 - [QuantimodoApi.InlineResponse2002](docs/InlineResponse2002.md)
 - [QuantimodoApi.JsonErrorResponse](docs/JsonErrorResponse.md)
 - [QuantimodoApi.Measurement](docs/Measurement.md)
 - [QuantimodoApi.MeasurementDelete](docs/MeasurementDelete.md)
 - [QuantimodoApi.MeasurementRange](docs/MeasurementRange.md)
 - [QuantimodoApi.MeasurementSet](docs/MeasurementSet.md)
 - [QuantimodoApi.MeasurementSource](docs/MeasurementSource.md)
 - [QuantimodoApi.MeasurementUpdate](docs/MeasurementUpdate.md)
 - [QuantimodoApi.Pairs](docs/Pairs.md)
 - [QuantimodoApi.Permission](docs/Permission.md)
 - [QuantimodoApi.PostCorrelation](docs/PostCorrelation.md)
 - [QuantimodoApi.PostVote](docs/PostVote.md)
 - [QuantimodoApi.TrackingReminder](docs/TrackingReminder.md)
 - [QuantimodoApi.TrackingReminderDelete](docs/TrackingReminderDelete.md)
 - [QuantimodoApi.TrackingReminderNotification](docs/TrackingReminderNotification.md)
 - [QuantimodoApi.TrackingReminderNotificationSkip](docs/TrackingReminderNotificationSkip.md)
 - [QuantimodoApi.TrackingReminderNotificationSnooze](docs/TrackingReminderNotificationSnooze.md)
 - [QuantimodoApi.TrackingReminderNotificationTrack](docs/TrackingReminderNotificationTrack.md)
 - [QuantimodoApi.Unit](docs/Unit.md)
 - [QuantimodoApi.UnitCategory](docs/UnitCategory.md)
 - [QuantimodoApi.Update](docs/Update.md)
 - [QuantimodoApi.User](docs/User.md)
 - [QuantimodoApi.UserTag](docs/UserTag.md)
 - [QuantimodoApi.UserTokenFailedResponse](docs/UserTokenFailedResponse.md)
 - [QuantimodoApi.UserTokenRequest](docs/UserTokenRequest.md)
 - [QuantimodoApi.UserTokenRequestInnerUserField](docs/UserTokenRequestInnerUserField.md)
 - [QuantimodoApi.UserTokenSuccessfulResponse](docs/UserTokenSuccessfulResponse.md)
 - [QuantimodoApi.UserTokenSuccessfulResponseInnerUserField](docs/UserTokenSuccessfulResponseInnerUserField.md)
 - [QuantimodoApi.UserVariable](docs/UserVariable.md)
 - [QuantimodoApi.UserVariableDelete](docs/UserVariableDelete.md)
 - [QuantimodoApi.UserVariableRelationship](docs/UserVariableRelationship.md)
 - [QuantimodoApi.UserVariables](docs/UserVariables.md)
 - [QuantimodoApi.ValueObject](docs/ValueObject.md)
 - [QuantimodoApi.Variable](docs/Variable.md)
 - [QuantimodoApi.VariableCategory](docs/VariableCategory.md)
 - [QuantimodoApi.VariableNew](docs/VariableNew.md)
 - [QuantimodoApi.VariablesNew](docs/VariablesNew.md)
 - [QuantimodoApi.Vote](docs/Vote.md)
 - [QuantimodoApi.VoteDelete](docs/VoteDelete.md)


## Documentation for Authorization


### access_token

- **Type**: API key
- **API key parameter name**: access_token
- **Location**: URL query string

### quantimodo_oauth2

- **Type**: OAuth
- **Flow**: accessCode
- **Authorization URL**: https://app.quantimo.do/api/v2/oauth/authorize
- **Scopes**: 
  - basic: Allows you to read user info (displayname, email, etc).
  - readmeasurements: Allows one to read a user&#39;s data
  - writemeasurements: Allows you to write user data

