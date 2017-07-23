/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 2.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/CommonResponse', 'model/Measurement', 'model/MeasurementDelete', 'model/MeasurementRange', 'model/MeasurementSet', 'model/MeasurementSource', 'model/MeasurementUpdate'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/CommonResponse'), require('../model/Measurement'), require('../model/MeasurementDelete'), require('../model/MeasurementRange'), require('../model/MeasurementSet'), require('../model/MeasurementSource'), require('../model/MeasurementUpdate'));
  } else {
    // Browser globals (root is window)
    if (!root.quantimodo-api) {
      root.quantimodo-api = {};
    }
    root.quantimodo-api.MeasurementsApi = factory(root.quantimodo-api.ApiClient, root.quantimodo-api.CommonResponse, root.quantimodo-api.Measurement, root.quantimodo-api.MeasurementDelete, root.quantimodo-api.MeasurementRange, root.quantimodo-api.MeasurementSet, root.quantimodo-api.MeasurementSource, root.quantimodo-api.MeasurementUpdate);
  }
}(this, function(ApiClient, CommonResponse, Measurement, MeasurementDelete, MeasurementRange, MeasurementSet, MeasurementSource, MeasurementUpdate) {
  'use strict';

  /**
   * Measurements service.
   * @module api/MeasurementsApi
   * @version 2.0
   */

  /**
   * Constructs a new MeasurementsApi. 
   * @alias module:api/MeasurementsApi
   * @class
   * @param {module:ApiClient} apiClient Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the v1MeasurementSourcesGet operation.
     * @callback module:api/MeasurementsApi~v1MeasurementSourcesGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/MeasurementSource} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get measurement sources
     * Returns a list of all the apps from which measurement data is obtained.
     * @param {module:api/MeasurementsApi~v1MeasurementSourcesGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/MeasurementSource}
     */
    this.v1MeasurementSourcesGet = function(callback) {
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
      var returnType = MeasurementSource;

      return this.apiClient.callApi(
        '/v1/measurementSources', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1MeasurementSourcesPost operation.
     * @callback module:api/MeasurementsApi~v1MeasurementSourcesPostCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Add a data source
     * Add a life-tracking app or device to the QuantiModo list of data sources.
     * @param {module:model/MeasurementSource} body An array of names of data sources you want to add.
     * @param {Object} opts Optional parameters
     * @param {String} opts.accessToken User&#39;s OAuth2 access token
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/MeasurementsApi~v1MeasurementSourcesPostCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.v1MeasurementSourcesPost = function(body, opts, callback) {
      opts = opts || {};
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body == undefined || body == null) {
        throw new Error("Missing the required parameter 'body' when calling v1MeasurementSourcesPost");
      }


      var pathParams = {
      };
      var queryParams = {
        'access_token': opts['accessToken'],
        'userId': opts['userId']
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
        '/v1/measurementSources', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1MeasurementsDailyGet operation.
     * @callback module:api/MeasurementsApi~v1MeasurementsDailyGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Measurement} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get daily measurements for this user
     * Measurements are any value that can be recorded like daily steps, a mood rating, or apples eaten. Supported filter parameters:&lt;ul&gt;&lt;li&gt;&lt;b&gt;value&lt;/b&gt; - Value of measurement&lt;/li&gt;&lt;li&gt;&lt;b&gt;updatedAt&lt;/b&gt; - The time that this measurement was created or last updated in the UTC format \&quot;YYYY-MM-DDThh:mm:ss\&quot;&lt;/li&gt;&lt;/ul&gt;
     * @param {String} variableName Name of the variable you want measurements for
     * @param {Object} opts Optional parameters
     * @param {String} opts.accessToken User&#39;s OAuth2 access token
     * @param {Number} opts.userId User&#39;s id
     * @param {String} opts.unitAbbreviatedName The unit your want the measurements in
     * @param {String} opts.startTime The lower limit of measurements returned (UTC Iso8601 \&quot;YYYY-MM-DDThh:mm:ss\&quot; format)
     * @param {String} opts.endTime The upper limit of measurements returned (UTC Iso8601 \&quot;YYYY-MM-DDThh:mm:ss\&quot; format)
     * @param {Number} opts.groupingWidth The time (in seconds) over which measurements are grouped together
     * @param {String} opts.groupingTimezone The time (in seconds) over which measurements are grouped together
     * @param {Number} opts.limit The LIMIT is used to limit the number of results returned. So if you have 1000 results, but only want to the first 10, you would set this to 10 and offset to 0.
     * @param {Number} opts.offset Since the maximum limit is 200 records, to get more than that you&#39;ll have to make multiple API calls and page through the results. To retrieve all the data, you can iterate through data by using the &#x60;limit&#x60; and &#x60;offset&#x60; query parameters.  For example, if you want to retrieve data from 61-80 then you can use a query with the following parameters, &#x60;imit&#x3D;20&amp;offset&#x3D;60&#x60;.
     * @param {Number} opts.sort Sort by given field. If the field is prefixed with &#x60;-, it will sort in descending order.
     * @param {module:api/MeasurementsApi~v1MeasurementsDailyGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Measurement}
     */
    this.v1MeasurementsDailyGet = function(variableName, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'variableName' is set
      if (variableName == undefined || variableName == null) {
        throw new Error("Missing the required parameter 'variableName' when calling v1MeasurementsDailyGet");
      }


      var pathParams = {
      };
      var queryParams = {
        'access_token': opts['accessToken'],
        'userId': opts['userId'],
        'variableName': variableName,
        'unitAbbreviatedName': opts['unitAbbreviatedName'],
        'startTime': opts['startTime'],
        'endTime': opts['endTime'],
        'groupingWidth': opts['groupingWidth'],
        'groupingTimezone': opts['groupingTimezone'],
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
      var returnType = Measurement;

      return this.apiClient.callApi(
        '/v1/measurements/daily', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1MeasurementsDeletePost operation.
     * @callback module:api/MeasurementsApi~v1MeasurementsDeletePostCallback
     * @param {String} error Error message, if any.
     * @param {module:model/CommonResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete a measurement
     * Delete a previously submitted measurement
     * @param {module:model/MeasurementDelete} body The startTime and variableId of the measurement to be deleted.
     * @param {module:api/MeasurementsApi~v1MeasurementsDeletePostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/CommonResponse}
     */
    this.v1MeasurementsDeletePost = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body == undefined || body == null) {
        throw new Error("Missing the required parameter 'body' when calling v1MeasurementsDeletePost");
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
      var returnType = CommonResponse;

      return this.apiClient.callApi(
        '/v1/measurements/delete', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1MeasurementsGet operation.
     * @callback module:api/MeasurementsApi~v1MeasurementsGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Measurement} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get measurements for this user
     * Measurements are any value that can be recorded like daily steps, a mood rating, or apples eaten. Supported filter parameters:&lt;ul&gt;&lt;li&gt;&lt;b&gt;value&lt;/b&gt; - Value of measurement&lt;/li&gt;&lt;li&gt;&lt;b&gt;updatedAt&lt;/b&gt; - The time that this measurement was created or last updated in the UTC format \&quot;YYYY-MM-DDThh:mm:ss\&quot;&lt;/li&gt;&lt;/ul&gt;
     * @param {Object} opts Optional parameters
     * @param {String} opts.accessToken User&#39;s OAuth2 access token
     * @param {Number} opts.userId User&#39;s id
     * @param {Number} opts.id Measurement id
     * @param {String} opts.variableName Name of the variable you want measurements for
     * @param {String} opts.variableCategoryName Name of the variable category you want measurements for
     * @param {String} opts.sourceName ID of the source you want measurements for (supports exact name match only)
     * @param {String} opts.value Value of measurement
     * @param {String} opts.unitAbbreviatedName The unit you want the measurements returned in
     * @param {String} opts.earliestMeasurementTime The lower limit of measurements returned in ISO 8601 format or epoch seconds (unixtime)
     * @param {String} opts.latestMeasurementTime The upper limit of measurements returned in ISO 8601 format or epoch seconds (unixtime)
     * @param {String} opts.createdAt The time the measurement record was first created in the format YYYY-MM-DDThh:mm:ss. Time zone should be UTC and not local.
     * @param {String} opts.updatedAt The time the measurement record was last changed in the format YYYY-MM-DDThh:mm:ss. Time zone should be UTC and not local.
     * @param {Number} opts.groupingWidth The time (in seconds) over which measurements are grouped together
     * @param {String} opts.groupingTimezone The time (in seconds) over which measurements are grouped together
     * @param {Number} opts.limit The LIMIT is used to limit the number of results returned. So if you have 1000 results, but only want to the first 10, you would set this to 10 and offset to 0.
     * @param {Number} opts.offset Since the maximum limit is 200 records, to get more than that you&#39;ll have to make multiple API calls and page through the results. To retrieve all the data, you can iterate through data by using the &#x60;limit&#x60; and &#x60;offset&#x60; query parameters.  For example, if you want to retrieve data from 61-80 then you can use a query with the following parameters, &#x60;imit&#x3D;20&amp;offset&#x3D;60&#x60;.
     * @param {Number} opts.sort Sort by given field. If the field is prefixed with &#x60;-, it will sort in descending order.
     * @param {module:api/MeasurementsApi~v1MeasurementsGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Measurement}
     */
    this.v1MeasurementsGet = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'access_token': opts['accessToken'],
        'userId': opts['userId'],
        'id': opts['id'],
        'variableName': opts['variableName'],
        'variableCategoryName': opts['variableCategoryName'],
        'sourceName': opts['sourceName'],
        'value': opts['value'],
        'unitAbbreviatedName': opts['unitAbbreviatedName'],
        'earliestMeasurementTime': opts['earliestMeasurementTime'],
        'latestMeasurementTime': opts['latestMeasurementTime'],
        'createdAt': opts['createdAt'],
        'updatedAt': opts['updatedAt'],
        'groupingWidth': opts['groupingWidth'],
        'groupingTimezone': opts['groupingTimezone'],
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
      var returnType = Measurement;

      return this.apiClient.callApi(
        '/v1/measurements', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1MeasurementsPost operation.
     * @callback module:api/MeasurementsApi~v1MeasurementsPostCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Post a new set or update existing measurements to the database
     * You can submit or update multiple measurements in a \&quot;measurements\&quot; sub-array.  If the variable these measurements correspond to does not already exist in the database, it will be automatically added.  The request body should look something like [{\&quot;measurements\&quot;:[{\&quot;startTime\&quot;:1439389320,\&quot;value\&quot;:\&quot;3\&quot;}, {\&quot;startTime\&quot;:1439389319,\&quot;value\&quot;:\&quot;2\&quot;}],\&quot;name\&quot;:\&quot;Acne (out of 5)\&quot;,\&quot;source\&quot;:\&quot;QuantiModo\&quot;,\&quot;category\&quot;:\&quot;Symptoms\&quot;,\&quot;combinationOperation\&quot;:\&quot;MEAN\&quot;,\&quot;unit\&quot;:\&quot;/5\&quot;}]
     * @param {module:model/MeasurementSet} body An array of measurements you want to insert.
     * @param {Object} opts Optional parameters
     * @param {String} opts.accessToken User&#39;s OAuth2 access token
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/MeasurementsApi~v1MeasurementsPostCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.v1MeasurementsPost = function(body, opts, callback) {
      opts = opts || {};
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body == undefined || body == null) {
        throw new Error("Missing the required parameter 'body' when calling v1MeasurementsPost");
      }


      var pathParams = {
      };
      var queryParams = {
        'access_token': opts['accessToken'],
        'userId': opts['userId']
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
        '/v1/measurements', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1MeasurementsRangeGet operation.
     * @callback module:api/MeasurementsApi~v1MeasurementsRangeGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/MeasurementRange} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get measurements range for this user
     * Get Unix time-stamp (epoch time) of the user&#39;s first and last measurements taken.
     * @param {Object} opts Optional parameters
     * @param {String} opts.sources Enter source name to limit to specific source (varchar)
     * @param {Number} opts.user If not specified, uses currently logged in user (bigint)
     * @param {module:api/MeasurementsApi~v1MeasurementsRangeGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/MeasurementRange}
     */
    this.v1MeasurementsRangeGet = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'sources': opts['sources'],
        'user': opts['user']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = MeasurementRange;

      return this.apiClient.callApi(
        '/v1/measurementsRange', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1MeasurementsUpdatePost operation.
     * @callback module:api/MeasurementsApi~v1MeasurementsUpdatePostCallback
     * @param {String} error Error message, if any.
     * @param {module:model/CommonResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Update a measurement
     * Delete a previously submitted measurement
     * @param {module:model/MeasurementUpdate} body The id as well as the new startTime, note, and/or value of the measurement to be updated
     * @param {module:api/MeasurementsApi~v1MeasurementsUpdatePostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/CommonResponse}
     */
    this.v1MeasurementsUpdatePost = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body == undefined || body == null) {
        throw new Error("Missing the required parameter 'body' when calling v1MeasurementsUpdatePost");
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
      var returnType = CommonResponse;

      return this.apiClient.callApi(
        '/v1/measurements/update', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v2MeasurementsCsvGet operation.
     * @callback module:api/MeasurementsApi~v2MeasurementsCsvGetCallback
     * @param {String} error Error message, if any.
     * @param {File} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get Measurements CSV
     * Download a CSV containing all user measurements
     * @param {Object} opts Optional parameters
     * @param {String} opts.accessToken User&#39;s OAuth2 access token
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/MeasurementsApi~v2MeasurementsCsvGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link File}
     */
    this.v2MeasurementsCsvGet = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'access_token': opts['accessToken'],
        'userId': opts['userId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['text/csv'];
      var returnType = File;

      return this.apiClient.callApi(
        '/v2/measurements/csv', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v2MeasurementsRequestCsvPost operation.
     * @callback module:api/MeasurementsApi~v2MeasurementsRequestCsvPostCallback
     * @param {String} error Error message, if any.
     * @param {'Number'} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Post Request for Measurements CSV
     * Use this endpoint to schedule a CSV export containing all user measurements to be emailed to the user within 24 hours.
     * @param {Object} opts Optional parameters
     * @param {String} opts.accessToken User&#39;s OAuth2 access token
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/MeasurementsApi~v2MeasurementsRequestCsvPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link 'Number'}
     */
    this.v2MeasurementsRequestCsvPost = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'access_token': opts['accessToken'],
        'userId': opts['userId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = 'Number';

      return this.apiClient.callApi(
        '/v2/measurements/request_csv', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v2MeasurementsRequestPdfPost operation.
     * @callback module:api/MeasurementsApi~v2MeasurementsRequestPdfPostCallback
     * @param {String} error Error message, if any.
     * @param {'Number'} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Post Request for Measurements PDF
     * Use this endpoint to schedule a PDF export containing all user measurements to be emailed to the user within 24 hours.
     * @param {Object} opts Optional parameters
     * @param {String} opts.accessToken User&#39;s OAuth2 access token
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/MeasurementsApi~v2MeasurementsRequestPdfPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link 'Number'}
     */
    this.v2MeasurementsRequestPdfPost = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'access_token': opts['accessToken'],
        'userId': opts['userId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = 'Number';

      return this.apiClient.callApi(
        '/v2/measurements/request_pdf', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v2MeasurementsRequestXlsPost operation.
     * @callback module:api/MeasurementsApi~v2MeasurementsRequestXlsPostCallback
     * @param {String} error Error message, if any.
     * @param {'Number'} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Post Request for Measurements XLS
     * Use this endpoint to schedule a XLS export containing all user measurements to be emailed to the user within 24 hours.
     * @param {Object} opts Optional parameters
     * @param {String} opts.accessToken User&#39;s OAuth2 access token
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/MeasurementsApi~v2MeasurementsRequestXlsPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link 'Number'}
     */
    this.v2MeasurementsRequestXlsPost = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'access_token': opts['accessToken'],
        'userId': opts['userId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = 'Number';

      return this.apiClient.callApi(
        '/v2/measurements/request_xls', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));