/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
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
    define(['ApiClient', 'model/Unit', 'model/UnitCategory'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/Unit'), require('../model/UnitCategory'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.UnitsApi = factory(root.QuantimodoApi.ApiClient, root.QuantimodoApi.Unit, root.QuantimodoApi.UnitCategory);
  }
}(this, function(ApiClient, Unit, UnitCategory) {
  'use strict';

  /**
   * Units service.
   * @module api/UnitsApi
   * @version 5.8.5
   */

  /**
   * Constructs a new UnitsApi. 
   * @alias module:api/UnitsApi
   * @class
   * @param {module:ApiClient} apiClient Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the v1UnitCategoriesGet operation.
     * @callback module:api/UnitsApi~v1UnitCategoriesGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/UnitCategory} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get unit categories
     * Get a list of the categories of measurement units such as &#39;Distance&#39;, &#39;Duration&#39;, &#39;Energy&#39;, &#39;Frequency&#39;, &#39;Miscellany&#39;, &#39;Pressure&#39;, &#39;Proportion&#39;, &#39;Rating&#39;, &#39;Temperature&#39;, &#39;Volume&#39;, and &#39;Weight&#39;.
     * @param {module:api/UnitsApi~v1UnitCategoriesGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/UnitCategory}
     */
    this.v1UnitCategoriesGet = function(callback) {
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
      var returnType = UnitCategory;

      return this.apiClient.callApi(
        '/v1/unitCategories', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1UnitsGet operation.
     * @callback module:api/UnitsApi~v1UnitsGetCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/Unit>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get all available units
     * Get all available units
     * @param {Object} opts Optional parameters
     * @param {String} opts.accessToken User&#39;s OAuth2 access token
     * @param {Number} opts.userId User&#39;s id
     * @param {Number} opts.id Unit id
     * @param {String} opts.unitName Unit name
     * @param {String} opts.unitAbbreviatedName Restrict the results to a specific unit by providing the unit abbreviation.
     * @param {String} opts.unitCategoryName Restrict the results to a specific unit category by providing the unit category name.
     * @param {module:api/UnitsApi~v1UnitsGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/Unit>}
     */
    this.v1UnitsGet = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'access_token': opts['accessToken'],
        'userId': opts['userId'],
        'id': opts['id'],
        'unitName': opts['unitName'],
        'unitAbbreviatedName': opts['unitAbbreviatedName'],
        'unitCategoryName': opts['unitCategoryName']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = [Unit];

      return this.apiClient.callApi(
        '/v1/units', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1UnitsVariableGet operation.
     * @callback module:api/UnitsApi~v1UnitsVariableGetCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/Unit>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Units for Variable
     * Get a list of all possible units to use for a given variable
     * @param {Object} opts Optional parameters
     * @param {String} opts.accessToken User&#39;s OAuth2 access token
     * @param {Number} opts.userId User&#39;s id
     * @param {String} opts.unitName Name of Unit you want to retrieve
     * @param {String} opts.unitAbbreviatedName Abbreviated Unit Name of the unit you want
     * @param {String} opts.unitCategoryName Name of the category you want units for
     * @param {String} opts.variable Name of the variable you want units for
     * @param {module:api/UnitsApi~v1UnitsVariableGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/Unit>}
     */
    this.v1UnitsVariableGet = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'access_token': opts['accessToken'],
        'userId': opts['userId'],
        'unitName': opts['unitName'],
        'unitAbbreviatedName': opts['unitAbbreviatedName'],
        'unitCategoryName': opts['unitCategoryName'],
        'variable': opts['variable']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = [Unit];

      return this.apiClient.callApi(
        '/v1/unitsVariable', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));
