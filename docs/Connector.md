# Quantimodo.Connector

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **Number** | Connector ID number | 
**name** | **String** | Connector lowercase system name | 
**displayName** | **String** | Connector pretty display name | 
**image** | **String** | URL to the image of the connector logo | 
**getItUrl** | **String** | URL to a site where one can get this device or application | 
**connected** | **String** | True if the authenticated user has this connector enabled | 
**connectInstructions** | **String** | URL and parameters used when connecting to a service | 
**lastUpdate** | **Number** | Epoch timestamp of last sync | 
**totalMeasurementsInLastUpdate** | **Number** | Number of measurements obtained during latest update | 
**connectStatus** | **String** | Example: CONNECTED | [optional] 
**updateRequestedAt** | **Date** | Example: 2017-07-18 05:16:31 | [optional] 
**shortDescription** | **String** | Example: Tracks social interaction. QuantiModo requires permission to access your Facebook \&quot;user likes\&quot; and \&quot;user posts\&quot;. | [optional] 
**message** | **String** | Example: Got 412 new measurements on 2017-07-31 10:10:34 | [optional] 
**lastSuccessfulUpdatedAt** | **Date** | Example: 2017-07-31 10:10:34 | [optional] 
**imageHtml** | **String** | Example: &lt;a href&#x3D;\&quot;http://www.facebook.com\&quot;&gt;&lt;img id&#x3D;\&quot;facebook_image\&quot; title&#x3D;\&quot;Facebook\&quot; src&#x3D;\&quot;https://i.imgur.com/GhwqK4f.png\&quot; alt&#x3D;\&quot;Facebook\&quot;&gt;&lt;/a&gt; | [optional] 
**updateStatus** | **String** | Example: UPDATED | [optional] 
**oauth** | **Object** | Example: {} | [optional] 
**defaultVariableCategoryName** | **String** | Example: Social Interactions | [optional] 
**connectorClientId** | **String** | Example: 225078261031461 | [optional] 
**longDescription** | **String** | Example: Facebook is a social networking website where users may create a personal profile, add other users as friends, and exchange messages. | [optional] 
**enabled** | **Number** | Example: 1 | [optional] 
**linkedDisplayNameHtml** | **String** | Example: &lt;a href&#x3D;\&quot;http://www.facebook.com\&quot;&gt;Facebook&lt;/a&gt; | [optional] 
**clientId** | **String** | Example: ghostInspector | [optional] 
**userId** | **Number** | Example: 230 | [optional] 
**connectorId** | **Number** | Example: 8 | [optional] 
**createdAt** | **Date** | Example: 2000-01-01 00:00:00 | [optional] 
**updatedAt** | **Date** | Example: 2017-07-31 10:10:34 | [optional] 
**buttons** | [**[Button]**](Button.md) |  | [optional] 
**affiliate** | **Boolean** | Example: false | [optional] 
**scopes** | [**[Scope]**](Scope.md) |  | [optional] 
**connectError** | **String** | Example: Your token is expired. Please re-connect | [optional] 


