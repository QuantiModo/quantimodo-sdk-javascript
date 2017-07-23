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
    define(['ApiClient', 'model/UserTokenRequestInnerUserField'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./UserTokenRequestInnerUserField'));
  } else {
    // Browser globals (root is window)
    if (!root.quantimodo-api) {
      root.quantimodo-api = {};
    }
    root.quantimodo-api.UserTokenRequest = factory(root.quantimodo-api.ApiClient, root.quantimodo-api.UserTokenRequestInnerUserField);
  }
}(this, function(ApiClient, UserTokenRequestInnerUserField) {
  'use strict';




  /**
   * The UserTokenRequest model module.
   * @module model/UserTokenRequest
   * @version 2.0
   */

  /**
   * Constructs a new <code>UserTokenRequest</code>.
   * @alias module:model/UserTokenRequest
   * @class
   * @param organizationAccessToken {String} Organization Access token
   */
  var exports = function(organizationAccessToken) {
    var _this = this;


    _this['organizationAccessToken'] = organizationAccessToken;
  };

  /**
   * Constructs a <code>UserTokenRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/UserTokenRequest} obj Optional instance to populate.
   * @return {module:model/UserTokenRequest} The populated <code>UserTokenRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('user')) {
        obj['user'] = UserTokenRequestInnerUserField.constructFromObject(data['user']);
      }
      if (data.hasOwnProperty('organizationAccessToken')) {
        obj['organizationAccessToken'] = ApiClient.convertToType(data['organizationAccessToken'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/UserTokenRequestInnerUserField} user
   */
  exports.prototype['user'] = undefined;
  /**
   * Organization Access token
   * @member {String} organizationAccessToken
   */
  exports.prototype['organizationAccessToken'] = undefined;



  return exports;
}));


