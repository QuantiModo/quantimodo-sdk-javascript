# Quantimodo.Connector

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**affiliate** | **Boolean** | Example: false | [optional] 
**backgroundColor** | **String** | Background color HEX code that matches the icon | [optional] 
**buttons** | [**[Button]**](Button.md) |  | [optional] 
**clientId** | **String** | Example: ghostInspector | [optional] 
**connected** | **Boolean** | True if the authenticated user has this connector enabled | 
**connectError** | **String** | Example: Your token is expired. Please re-connect | [optional] 
**connectInstructions** | [**ConnectInstructions**](ConnectInstructions.md) | URL and parameters used when connecting to a service | 
**connectorClientId** | **String** | Example: 225078261031461 | [optional] 
**connectorId** | **Number** | Example: 8 | [optional] 
**connectStatus** | **String** | Example: CONNECTED | [optional] 
**createdAt** | **String** | Example: 2000-01-01 00:00:00 UTC ISO 8601 YYYY-MM-DDThh:mm:ss | [optional] 
**defaultVariableCategoryName** | **String** | Example: Social Interactions | [optional] 
**displayName** | **String** | Connector pretty display name | 
**enabled** | **Number** | Example: 1 | [optional] 
**getItUrl** | **String** | URL to a site where one can get this device or application | 
**id** | **Number** | Connector ID number | 
**image** | **String** | URL to the image of the connector logo | 
**imageHtml** | **String** | Example: &lt;a href&#x3D;\&quot;http://www.facebook.com\&quot;&gt;&lt;img id&#x3D;\&quot;facebook_image\&quot; title&#x3D;\&quot;Facebook\&quot; src&#x3D;\&quot;https://i.imgur.com/GhwqK4f.png\&quot; alt&#x3D;\&quot;Facebook\&quot;&gt;&lt;/a&gt; | [optional] 
**lastSuccessfulUpdatedAt** | **String** | Example: 2017-07-31 10:10:34 UTC ISO 8601 YYYY-MM-DDThh:mm:ss | [optional] 
**lastUpdate** | **Number** | Epoch timestamp of last sync | 
**linkedDisplayNameHtml** | **String** | Example: &lt;a href&#x3D;\&quot;http://www.facebook.com\&quot;&gt;Facebook&lt;/a&gt; | [optional] 
**longDescription** | **String** | Example: Facebook is a social networking website where users may create a personal profile, add other users as friends, and exchange messages. | [optional] 
**message** | **String** | Example: Got 412 new measurements on 2017-07-31 10:10:34 | [optional] 
**name** | **String** | Connector lowercase system name | 
**platforms** | **[String]** | Platforms (chrome, android, ios, web) that you can connect on. | [optional] 
**scopes** | **[String]** | Required connector scopes | [optional] 
**shortDescription** | **String** | Example: Tracks social interaction. QuantiModo requires permission to access your Facebook \&quot;user likes\&quot; and \&quot;user posts\&quot;. | [optional] 
**spreadsheetUpload** | **Boolean** | True if the user must upload a spreadsheet.  Post the uploaded spreadsheet with your clientId and user accessToken to https://app.quantimo.do/api/v2/spreadsheetUpload | [optional] 
**totalMeasurementsInLastUpdate** | **Number** | Number of measurements obtained during latest update | 
**updatedAt** | **String** | Example: 2017-07-31 10:10:34 UTC ISO 8601 YYYY-MM-DDThh:mm:ss | [optional] 
**updateRequestedAt** | **String** | Example: 2017-07-18 05:16:31 UTC ISO 8601 YYYY-MM-DDThh:mm:ss | [optional] 
**updateStatus** | **String** | Example: UPDATED | [optional] 
**userId** | **Number** | Example: 230 | [optional] 


