/**
 * quantimodo
 * We make it easy to retrieve and analyze normalized user data from a wide array of devices and applications. Check out our [docs and sdk's](https://github.com/QuantiModo/docs) or [contact us](https://help.quantimo.do).
 *
 * OpenAPI spec version: 2.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 */


import ApiClient from "../ApiClient";
import CommonResponse from '../model/CommonResponse';
import PostUserSettingsResponse from '../model/PostUserSettingsResponse';
import User from '../model/User';

/**
* User service.
* @module api/UserApi
* @version 2.0
*/
export default class UserApi {

    /**
    * Constructs a new UserApi. 
    * @alias module:api/UserApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instance} if unspecified.
    */
    constructor(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    }


    /**
     * Callback function to receive the result of the deleteUser operation.
     * @callback module:api/UserApi~deleteUserCallback
     * @param {String} error Error message, if any.
     * @param {module:model/CommonResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete user
     * Delete user account. Only the client app that created a user can delete that user.
     * @param {String} reason Ex: I hate you!
     * @param {Object} opts Optional parameters
     * @param {String} opts.clientId Your QuantiModo client id can be obtained by creating an app at https://builder.quantimo.do
     * @param {module:model/String} opts.platform Ex: chrome, android, ios, web
     * @param {module:api/UserApi~deleteUserCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/CommonResponse}
     */
    deleteUser(reason, opts, callback) {
      opts = opts || {};
      let postBody = null;

      // verify the required parameter 'reason' is set
      if (reason === undefined || reason === null) {
        throw new Error("Missing the required parameter 'reason' when calling deleteUser");
      }


      let pathParams = {
      };
      let queryParams = {
        'clientId': opts['clientId'],
        'reason': reason,
        'platform': opts['platform']
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = ['access_token', 'quantimodo_oauth2'];
      let contentTypes = ['application/json'];
      let accepts = ['application/json'];
      let returnType = CommonResponse;

      return this.apiClient.callApi(
        '/v3/user/delete', 'DELETE',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getUser operation.
     * @callback module:api/UserApi~getUserCallback
     * @param {String} error Error message, if any.
     * @param {module:model/User} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get user info
     * Returns user info.  If no userId is specified, returns info for currently authenticated user
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {String} opts.createdAt When the record was first created. Use UTC ISO 8601 YYYY-MM-DDThh:mm:ss datetime format. Time zone should be UTC and not local.
     * @param {String} opts.updatedAt When the record was last updated. Use UTC ISO 8601 YYYY-MM-DDThh:mm:ss datetime format. Time zone should be UTC and not local.
     * @param {Number} opts.limit The LIMIT is used to limit the number of results returned. So if youhave 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. The maximum limit is 200 records. (default to 100)
     * @param {Number} opts.offset OFFSET says to skip that many rows before beginning to return rows to the client. OFFSET 0 is the same as omitting the OFFSET clause.If both OFFSET and LIMIT appear, then OFFSET rows are skipped before starting to count the LIMIT rows that are returned.
     * @param {String} opts.sort Sort by one of the listed field names. If the field name is prefixed with &#x60;-&#x60;, it will sort in descending order.
     * @param {String} opts.clientId Your QuantiModo client id can be obtained by creating an app at https://builder.quantimo.do
     * @param {String} opts.appVersion Ex: 2.1.1.0
     * @param {Number} opts.clientUserId Ex: 74802
     * @param {module:model/String} opts.platform Ex: chrome, android, ios, web
     * @param {String} opts.log Username or email
     * @param {String} opts.pwd User password
     * @param {Boolean} opts.includeAuthorizedClients Return list of apps, studies, and individuals with access to user data
     * @param {module:api/UserApi~getUserCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/User}
     */
    getUser(opts, callback) {
      opts = opts || {};
      let postBody = null;


      let pathParams = {
      };
      let queryParams = {
        'userId': opts['userId'],
        'createdAt': opts['createdAt'],
        'updatedAt': opts['updatedAt'],
        'limit': opts['limit'],
        'offset': opts['offset'],
        'sort': opts['sort'],
        'clientId': opts['clientId'],
        'appVersion': opts['appVersion'],
        'clientUserId': opts['clientUserId'],
        'platform': opts['platform'],
        'log': opts['log'],
        'pwd': opts['pwd'],
        'includeAuthorizedClients': opts['includeAuthorizedClients']
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = ['access_token', 'quantimodo_oauth2'];
      let contentTypes = ['application/json'];
      let accepts = ['application/json'];
      let returnType = User;

      return this.apiClient.callApi(
        '/v3/user', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the postUserSettings operation.
     * @callback module:api/UserApi~postUserSettingsCallback
     * @param {String} error Error message, if any.
     * @param {module:model/PostUserSettingsResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Post UserSettings
     * Post UserSettings
     * @param {module:model/User} body User settings to update
     * @param {Object} opts Optional parameters
     * @param {String} opts.clientId Your QuantiModo client id can be obtained by creating an app at https://builder.quantimo.do
     * @param {module:model/String} opts.platform Ex: chrome, android, ios, web
     * @param {module:api/UserApi~postUserSettingsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/PostUserSettingsResponse}
     */
    postUserSettings(body, opts, callback) {
      opts = opts || {};
      let postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling postUserSettings");
      }


      let pathParams = {
      };
      let queryParams = {
        'clientId': opts['clientId'],
        'platform': opts['platform']
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = ['application/json'];
      let accepts = ['application/json'];
      let returnType = PostUserSettingsResponse;

      return this.apiClient.callApi(
        '/v3/userSettings', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }


}
