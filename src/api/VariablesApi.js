/**
 * quantimodo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do).
 *
 * OpenAPI spec version: 5.8.728
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.2.3
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/CommonResponse', 'model/UserTag', 'model/UserVariable', 'model/UserVariableDelete', 'model/Variable', 'model/VariableCategory'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/CommonResponse'), require('../model/UserTag'), require('../model/UserVariable'), require('../model/UserVariableDelete'), require('../model/Variable'), require('../model/VariableCategory'));
  } else {
    // Browser globals (root is window)
    if (!root.Quantimodo) {
      root.Quantimodo = {};
    }
    root.Quantimodo.VariablesApi = factory(root.Quantimodo.ApiClient, root.Quantimodo.CommonResponse, root.Quantimodo.UserTag, root.Quantimodo.UserVariable, root.Quantimodo.UserVariableDelete, root.Quantimodo.Variable, root.Quantimodo.VariableCategory);
  }
}(this, function(ApiClient, CommonResponse, UserTag, UserVariable, UserVariableDelete, Variable, VariableCategory) {
  'use strict';

  /**
   * Variables service.
   * @module api/VariablesApi
   * @version 5.8.805
   */

  /**
   * Constructs a new VariablesApi. 
   * @alias module:api/VariablesApi
   * @class
   * @param {module:ApiClient} apiClient Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the deleteUserTag operation.
     * @callback module:api/VariablesApi~deleteUserTagCallback
     * @param {String} error Error message, if any.
     * @param {module:model/CommonResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete user tag or ingredient
     * Delete previously created user tags or ingredients.
     * @param {Number} taggedVariableId This is the id of the variable being tagged with an ingredient or something.
     * @param {Number} tagVariableId This is the id of the ingredient variable whose value is determined based on the value of the tagged variable.
     * @param {module:api/VariablesApi~deleteUserTagCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/CommonResponse}
     */
    this.deleteUserTag = function(taggedVariableId, tagVariableId, callback) {
      var postBody = null;

      // verify the required parameter 'taggedVariableId' is set
      if (taggedVariableId === undefined || taggedVariableId === null) {
        throw new Error("Missing the required parameter 'taggedVariableId' when calling deleteUserTag");
      }

      // verify the required parameter 'tagVariableId' is set
      if (tagVariableId === undefined || tagVariableId === null) {
        throw new Error("Missing the required parameter 'tagVariableId' when calling deleteUserTag");
      }


      var pathParams = {
      };
      var queryParams = {
        'taggedVariableId': taggedVariableId,
        'tagVariableId': tagVariableId
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = CommonResponse;

      return this.apiClient.callApi(
        '/v3/userTags/delete', 'DELETE',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the deleteUserVariable operation.
     * @callback module:api/VariablesApi~deleteUserVariableCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete All Measurements For Variable
     * Users can delete all of their measurements for a variable
     * @param {module:model/UserVariableDelete} variableId Id of the variable whose measurements should be deleted
     * @param {module:api/VariablesApi~deleteUserVariableCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.deleteUserVariable = function(variableId, callback) {
      var postBody = variableId;

      // verify the required parameter 'variableId' is set
      if (variableId === undefined || variableId === null) {
        throw new Error("Missing the required parameter 'variableId' when calling deleteUserVariable");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/v3/userVariables/delete', 'DELETE',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getPublicVariables operation.
     * @callback module:api/VariablesApi~getPublicVariablesCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/Variable>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get public variables
     * This endpoint retrieves an array of all public variables. Public variables are things like foods, medications, symptoms, conditions, and anything not unique to a particular user. For instance, a telephone number or name would not be a public variable.
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {Number} opts.id Common variable id
     * @param {module:model/String} opts.variableCategoryName Limit results to a specific variable category
     * @param {String} opts.name Original name of the variable (supports exact name match only)
     * @param {String} opts.updatedAt When the record was last updated. Use UTC ISO 8601 &#x60;YYYY-MM-DDThh:mm:ss&#x60; datetime format. Time zone should be UTC and not local.
     * @param {String} opts.sourceName ID of the source you want measurements for (supports exact name match only)
     * @param {String} opts.earliestMeasurementTime Excluded records with measurement times earlier than this value. Use UTC ISO 8601 &#x60;YYYY-MM-DDThh:mm:ss&#x60;  datetime format. Time zone should be UTC and not local.
     * @param {String} opts.latestMeasurementTime Excluded records with measurement times later than this value. Use UTC ISO 8601 &#x60;YYYY-MM-DDThh:mm:ss&#x60;  datetime format. Time zone should be UTC and not local.
     * @param {String} opts.numberOfRawMeasurements Filter variables by the total number of measurements that they have. This could be used of you want to filter or sort by popularity.
     * @param {String} opts.lastSource Limit variables to those which measurements were last submitted by a specific source. So if you have a client application and you only want variables that were last updated by your app, you can include the name of your app here. (supports exact name match only)
     * @param {Number} opts.limit The LIMIT is used to limit the number of results returned. So if youhave 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. The maximum limit is 200 records. (default to 100)
     * @param {Number} opts.offset OFFSET says to skip that many rows before beginning to return rows to the client. OFFSET 0 is the same as omitting the OFFSET clause.If both OFFSET and LIMIT appear, then OFFSET rows are skipped before starting to count the LIMIT rows that are returned.
     * @param {String} opts.sort Sort by one of the listed field names. If the field name is prefixed with &#x60;-&#x60;, it will sort in descending order.
     * @param {module:api/VariablesApi~getPublicVariablesCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/Variable>}
     */
    this.getPublicVariables = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'userId': opts['userId'],
        'id': opts['id'],
        'variableCategoryName': opts['variableCategoryName'],
        'name': opts['name'],
        'updatedAt': opts['updatedAt'],
        'sourceName': opts['sourceName'],
        'earliestMeasurementTime': opts['earliestMeasurementTime'],
        'latestMeasurementTime': opts['latestMeasurementTime'],
        'numberOfRawMeasurements': opts['numberOfRawMeasurements'],
        'lastSource': opts['lastSource'],
        'limit': opts['limit'],
        'offset': opts['offset'],
        'sort': opts['sort']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = [Variable];

      return this.apiClient.callApi(
        '/v3/public/variables', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getUserVariables operation.
     * @callback module:api/VariablesApi~getUserVariablesCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/UserVariable>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get variables with user&#39;s settings
     * Get variables for which the user has measurements. If the user has specified variable settings, these are provided instead of the common variable defaults.
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {Number} opts.id Common variable id
     * @param {module:model/String} opts.variableCategoryName Limit results to a specific variable category
     * @param {String} opts.name Original name of the variable (supports exact name match only)
     * @param {String} opts.updatedAt When the record was last updated. Use UTC ISO 8601 &#x60;YYYY-MM-DDThh:mm:ss&#x60; datetime format. Time zone should be UTC and not local.
     * @param {String} opts.sourceName ID of the source you want measurements for (supports exact name match only)
     * @param {String} opts.earliestMeasurementTime Excluded records with measurement times earlier than this value. Use UTC ISO 8601 &#x60;YYYY-MM-DDThh:mm:ss&#x60;  datetime format. Time zone should be UTC and not local.
     * @param {String} opts.latestMeasurementTime Excluded records with measurement times later than this value. Use UTC ISO 8601 &#x60;YYYY-MM-DDThh:mm:ss&#x60;  datetime format. Time zone should be UTC and not local.
     * @param {String} opts.numberOfRawMeasurements Filter variables by the total number of measurements that they have. This could be used of you want to filter or sort by popularity.
     * @param {String} opts.lastSource Limit variables to those which measurements were last submitted by a specific source. So if you have a client application and you only want variables that were last updated by your app, you can include the name of your app here. (supports exact name match only)
     * @param {Number} opts.limit The LIMIT is used to limit the number of results returned. So if youhave 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. The maximum limit is 200 records. (default to 100)
     * @param {Number} opts.offset OFFSET says to skip that many rows before beginning to return rows to the client. OFFSET 0 is the same as omitting the OFFSET clause.If both OFFSET and LIMIT appear, then OFFSET rows are skipped before starting to count the LIMIT rows that are returned.
     * @param {String} opts.sort Sort by one of the listed field names. If the field name is prefixed with &#x60;-&#x60;, it will sort in descending order.
     * @param {module:api/VariablesApi~getUserVariablesCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/UserVariable>}
     */
    this.getUserVariables = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'userId': opts['userId'],
        'id': opts['id'],
        'variableCategoryName': opts['variableCategoryName'],
        'name': opts['name'],
        'updatedAt': opts['updatedAt'],
        'sourceName': opts['sourceName'],
        'earliestMeasurementTime': opts['earliestMeasurementTime'],
        'latestMeasurementTime': opts['latestMeasurementTime'],
        'numberOfRawMeasurements': opts['numberOfRawMeasurements'],
        'lastSource': opts['lastSource'],
        'limit': opts['limit'],
        'offset': opts['offset'],
        'sort': opts['sort']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = [UserVariable];

      return this.apiClient.callApi(
        '/v3/userVariables', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getVariableCategories operation.
     * @callback module:api/VariablesApi~getVariableCategoriesCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/VariableCategory>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Variable categories
     * The variable categories include Activity, Causes of Illness, Cognitive Performance, Conditions, Environment, Foods, Location, Miscellaneous, Mood, Nutrition, Physical Activity, Physique, Sleep, Social Interactions, Symptoms, Treatments, Vital Signs, and Work.
     * @param {module:api/VariablesApi~getVariableCategoriesCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/VariableCategory>}
     */
    this.getVariableCategories = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = [VariableCategory];

      return this.apiClient.callApi(
        '/v3/variableCategories', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the postUserTags operation.
     * @callback module:api/VariablesApi~postUserTagsCallback
     * @param {String} error Error message, if any.
     * @param {module:model/CommonResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Post or update user tags or ingredients
     * This endpoint allows users to tag foods with their ingredients.  This information will then be used to infer the user intake of the different ingredients by just entering the foods. The inferred intake levels will then be used to determine the effects of different nutrients on the user during analysis.
     * @param {module:model/UserTag} body Contains the new user tag data
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/VariablesApi~postUserTagsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/CommonResponse}
     */
    this.postUserTags = function(body, opts, callback) {
      opts = opts || {};
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling postUserTags");
      }


      var pathParams = {
      };
      var queryParams = {
        'userId': opts['userId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = CommonResponse;

      return this.apiClient.callApi(
        '/v3/userTags', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the postUserVariables operation.
     * @callback module:api/VariablesApi~postUserVariablesCallback
     * @param {String} error Error message, if any.
     * @param {module:model/CommonResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Update User Settings for a Variable
     * Users can change the parameters used in analysis of that variable such as the expected duration of action for a variable to have an effect, the estimated delay before the onset of action. In order to filter out erroneous data, they are able to set the maximum and minimum reasonable daily values for a variable.
     * @param {Array.<module:model/UserVariable>} userVariables Variable user settings data
     * @param {Object} opts Optional parameters
     * @param {String} opts.appName Example: MoodiModo
     * @param {String} opts.clientId Example: oauth_test_client
     * @param {module:api/VariablesApi~postUserVariablesCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/CommonResponse}
     */
    this.postUserVariables = function(userVariables, opts, callback) {
      opts = opts || {};
      var postBody = userVariables;

      // verify the required parameter 'userVariables' is set
      if (userVariables === undefined || userVariables === null) {
        throw new Error("Missing the required parameter 'userVariables' when calling postUserVariables");
      }


      var pathParams = {
      };
      var queryParams = {
        'appName': opts['appName'],
        'clientId': opts['clientId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = CommonResponse;

      return this.apiClient.callApi(
        '/v3/userVariables', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the resetUserVariableSettings operation.
     * @callback module:api/VariablesApi~resetUserVariableSettingsCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Reset user settings for a variable to defaults
     * Reset user settings for a variable to defaults
     * @param {module:model/UserVariableDelete} variableId Id of the variable whose measurements should be deleted
     * @param {module:api/VariablesApi~resetUserVariableSettingsCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.resetUserVariableSettings = function(variableId, callback) {
      var postBody = variableId;

      // verify the required parameter 'variableId' is set
      if (variableId === undefined || variableId === null) {
        throw new Error("Missing the required parameter 'variableId' when calling resetUserVariableSettings");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/v3/userVariables/reset', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));
