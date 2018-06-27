# Quantimodo.Connector

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**affiliate** | **Boolean** | Ex: false | [optional] 
**backgroundColor** | **String** | Background color HEX code that matches the icon | [optional] 
**buttons** | [**[Button]**](Button.md) |  | [optional] 
**clientId** | **String** | Your QuantiModo client id can be obtained by creating an app at https://builder.quantimo.do | [optional] 
**connected** | **Boolean** | True if the authenticated user has this connector enabled | 
**connectError** | **String** | Ex: Your token is expired. Please re-connect | [optional] 
**connectInstructions** | [**ConnectInstructions**](ConnectInstructions.md) | URL and parameters used when connecting to a service | 
**connectorClientId** | **String** | Ex: 225078261031461 | [optional] 
**connectorId** | **Number** | Ex: 8 | [optional] 
**connectStatus** | **String** | Ex: CONNECTED | [optional] 
**createdAt** | **String** | Ex: 2000-01-01 00:00:00 UTC ISO 8601 YYYY-MM-DDThh:mm:ss | [optional] 
**defaultVariableCategoryName** | **String** | Ex: Social Interactions | [optional] 
**displayName** | **String** | Connector pretty display name | 
**enabled** | **Number** | Ex: 1 | [optional] 
**getItUrl** | **String** | URL to a site where one can get this device or application | 
**id** | **Number** | Connector ID number | 
**image** | **String** | URL to the image of the connector logo | 
**imageHtml** | **String** | Ex: &lt;a href&#x3D;\&quot;http://www.facebook.com\&quot;&gt;&lt;img id&#x3D;\&quot;facebook_image\&quot; title&#x3D;\&quot;Facebook\&quot; src&#x3D;\&quot;https://i.imgur.com/GhwqK4f.png\&quot; alt&#x3D;\&quot;Facebook\&quot;&gt;&lt;/a&gt; | [optional] 
**lastSuccessfulUpdatedAt** | **String** | Ex: 2017-07-31 10:10:34 UTC ISO 8601 YYYY-MM-DDThh:mm:ss | [optional] 
**lastUpdate** | **Number** | Epoch timestamp of last sync | 
**linkedDisplayNameHtml** | **String** | Ex: &lt;a href&#x3D;\&quot;http://www.facebook.com\&quot;&gt;Facebook&lt;/a&gt; | [optional] 
**longDescription** | **String** | Ex: Facebook is a social networking website where users may create a personal profile, add other users as friends, and exchange messages. | [optional] 
**message** | **String** | Ex: Got 412 new measurements on 2017-07-31 10:10:34 | [optional] 
**mobileConnectMethod** | **String** | Mobile connect method: webview, cordova, google, spreadsheet, or ip | [optional] 
**name** | **String** | Connector lowercase system name | 
**platforms** | **[String]** | Platforms (chrome, android, ios, web) that you can connect on. | [optional] 
**premium** | **Boolean** | True if connection requires upgrade | [optional] 
**scopes** | **[String]** | Required connector scopes | [optional] 
**shortDescription** | **String** | Ex: Tracks social interaction. QuantiModo requires permission to access your Facebook \&quot;user likes\&quot; and \&quot;user posts\&quot;. | [optional] 
**spreadsheetUpload** | **Boolean** | True if the user must upload a spreadsheet.  Post the uploaded spreadsheet with your clientId and user accessToken to https://app.quantimo.do/api/v2/spreadsheetUpload | [optional] 
**totalMeasurementsInLastUpdate** | **Number** | Number of measurements obtained during latest update | 
**updatedAt** | **String** | Ex: 2017-07-31 10:10:34 UTC ISO 8601 YYYY-MM-DDThh:mm:ss | [optional] 
**updateRequestedAt** | **String** | Ex: 2017-07-18 05:16:31 UTC ISO 8601 YYYY-MM-DDThh:mm:ss | [optional] 
**updateStatus** | **String** | Ex: UPDATED | [optional] 
**userId** | **Number** | Ex: 230 | [optional] 


