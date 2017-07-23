# QuantiModo.Connection

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **Number** | id | [optional] 
**userId** | **Number** | ID of user that owns this correlation | [optional] 
**connectorId** | **Number** | The id for the connector data source for which the connection is connected | 
**connectStatus** | **String** | Indicates whether a connector is currently connected to a service for a user. | [optional] 
**connectError** | **String** | Error message if there is a problem with authorizing this connection. | [optional] 
**updateRequestedAt** | **Date** | Time at which an update was requested by a user. | [optional] 
**updateStatus** | **String** | Indicates whether a connector is currently updated. | [optional] 
**updateError** | **String** | Indicates if there was an error during the update. | [optional] 
**lastSuccessfulUpdatedAt** | **Date** | The time at which the connector was last successfully updated. | [optional] 
**createdAt** | **Date** | When the record was first created. Use UTC ISO 8601 \&quot;YYYY-MM-DDThh:mm:ss\&quot;  datetime format | [optional] 
**updatedAt** | **Date** | When the record in the database was last updated. Use UTC ISO 8601 \&quot;YYYY-MM-DDThh:mm:ss\&quot;  datetime format | [optional] 


