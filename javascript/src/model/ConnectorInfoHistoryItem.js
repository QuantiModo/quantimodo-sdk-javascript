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
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.quantimodo-api) {
      root.quantimodo-api = {};
    }
    root.quantimodo-api.ConnectorInfoHistoryItem = factory(root.quantimodo-api.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The ConnectorInfoHistoryItem model module.
   * @module model/ConnectorInfoHistoryItem
   * @version 2.0
   */

  /**
   * Constructs a new <code>ConnectorInfoHistoryItem</code>.
   * @alias module:model/ConnectorInfoHistoryItem
   * @class
   * @param numberOfMeasurements {Number} Number of measurements
   * @param success {Boolean} True if the update was successfull
   * @param message {String} Error message.
   * @param createdAt {String} Date and time of the update in UTC time zone
   */
  var exports = function(numberOfMeasurements, success, message, createdAt) {
    var _this = this;

    _this['numberOfMeasurements'] = numberOfMeasurements;
    _this['success'] = success;
    _this['message'] = message;
    _this['createdAt'] = createdAt;
  };

  /**
   * Constructs a <code>ConnectorInfoHistoryItem</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ConnectorInfoHistoryItem} obj Optional instance to populate.
   * @return {module:model/ConnectorInfoHistoryItem} The populated <code>ConnectorInfoHistoryItem</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('numberOfMeasurements')) {
        obj['numberOfMeasurements'] = ApiClient.convertToType(data['numberOfMeasurements'], 'Number');
      }
      if (data.hasOwnProperty('success')) {
        obj['success'] = ApiClient.convertToType(data['success'], 'Boolean');
      }
      if (data.hasOwnProperty('message')) {
        obj['message'] = ApiClient.convertToType(data['message'], 'String');
      }
      if (data.hasOwnProperty('createdAt')) {
        obj['createdAt'] = ApiClient.convertToType(data['createdAt'], 'String');
      }
    }
    return obj;
  }

  /**
   * Number of measurements
   * @member {Number} numberOfMeasurements
   */
  exports.prototype['numberOfMeasurements'] = undefined;
  /**
   * True if the update was successfull
   * @member {Boolean} success
   */
  exports.prototype['success'] = undefined;
  /**
   * Error message.
   * @member {String} message
   */
  exports.prototype['message'] = undefined;
  /**
   * Date and time of the update in UTC time zone
   * @member {String} createdAt
   */
  exports.prototype['createdAt'] = undefined;



  return exports;
}));


