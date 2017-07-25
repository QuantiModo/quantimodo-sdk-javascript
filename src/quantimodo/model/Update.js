/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.7
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
    define(['quantimodo/ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QMApi) {
      root.QMApi = {};
    }
    root.QMApi.Update = factory(root.QMApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The Update model module.
   * @module quantimodo/model/Update
   * @version 5.8.725
   */

  /**
   * Constructs a new <code>Update</code>.
   * @alias module:quantimodo/model/Update
   * @class
   * @param userId {Number} userId
   * @param connectorId {Number} connectorId
   * @param numberOfMeasurements {Number} numberOfMeasurements
   * @param success {Boolean} success
   * @param message {String} message
   */
  var exports = function(userId, connectorId, numberOfMeasurements, success, message) {
    var _this = this;


    _this['userId'] = userId;
    _this['connectorId'] = connectorId;
    _this['numberOfMeasurements'] = numberOfMeasurements;
    _this['success'] = success;
    _this['message'] = message;


  };

  /**
   * Constructs a <code>Update</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:quantimodo/model/Update} obj Optional instance to populate.
   * @return {module:quantimodo/model/Update} The populated <code>Update</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('id')) {
        obj['id'] = ApiClient.convertToType(data['id'], 'Number');
      }
      if (data.hasOwnProperty('userId')) {
        obj['userId'] = ApiClient.convertToType(data['userId'], 'Number');
      }
      if (data.hasOwnProperty('connectorId')) {
        obj['connectorId'] = ApiClient.convertToType(data['connectorId'], 'Number');
      }
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
        obj['createdAt'] = ApiClient.convertToType(data['createdAt'], 'Date');
      }
      if (data.hasOwnProperty('updatedAt')) {
        obj['updatedAt'] = ApiClient.convertToType(data['updatedAt'], 'Date');
      }
    }
    return obj;
  }

  /**
   * id
   * @member {Number} id
   */
  exports.prototype['id'] = undefined;
  /**
   * userId
   * @member {Number} userId
   */
  exports.prototype['userId'] = undefined;
  /**
   * connectorId
   * @member {Number} connectorId
   */
  exports.prototype['connectorId'] = undefined;
  /**
   * numberOfMeasurements
   * @member {Number} numberOfMeasurements
   */
  exports.prototype['numberOfMeasurements'] = undefined;
  /**
   * success
   * @member {Boolean} success
   */
  exports.prototype['success'] = undefined;
  /**
   * message
   * @member {String} message
   */
  exports.prototype['message'] = undefined;
  /**
   * When the record was first created. Use UTC ISO 8601 \"YYYY-MM-DDThh:mm:ss\"  datetime format
   * @member {Date} createdAt
   */
  exports.prototype['createdAt'] = undefined;
  /**
   * When the record in the database was last updated. Use UTC ISO 8601 \"YYYY-MM-DDThh:mm:ss\"  datetime format
   * @member {Date} updatedAt
   */
  exports.prototype['updatedAt'] = undefined;



  return exports;
}));


