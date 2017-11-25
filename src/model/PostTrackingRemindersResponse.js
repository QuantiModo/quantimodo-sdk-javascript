/**
 * quantimodo
 * We make it easy to retrieve and analyze normalized user data from a wide array of devices and applications. Check out our [docs and sdk's](https://github.com/QuantiModo/docs) or [contact us](https://help.quantimo.do).
 *
 * OpenAPI spec version: 5.8.112511
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
    define(['ApiClient', 'model/PostTrackingRemindersDataResponse'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./PostTrackingRemindersDataResponse'));
  } else {
    // Browser globals (root is window)
    if (!root.Quantimodo) {
      root.Quantimodo = {};
    }
    root.Quantimodo.PostTrackingRemindersResponse = factory(root.Quantimodo.ApiClient, root.Quantimodo.PostTrackingRemindersDataResponse);
  }
}(this, function(ApiClient, PostTrackingRemindersDataResponse) {
  'use strict';




  /**
   * The PostTrackingRemindersResponse model module.
   * @module model/PostTrackingRemindersResponse
   * @version 5.8.1125
   */

  /**
   * Constructs a new <code>PostTrackingRemindersResponse</code>.
   * @alias module:model/PostTrackingRemindersResponse
   * @class
   * @param status {Number} Status code
   * @param success {Boolean} 
   */
  var exports = function(status, success) {
    var _this = this;



    _this['status'] = status;
    _this['success'] = success;
  };

  /**
   * Constructs a <code>PostTrackingRemindersResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/PostTrackingRemindersResponse} obj Optional instance to populate.
   * @return {module:model/PostTrackingRemindersResponse} The populated <code>PostTrackingRemindersResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('data')) {
        obj['data'] = PostTrackingRemindersDataResponse.constructFromObject(data['data']);
      }
      if (data.hasOwnProperty('message')) {
        obj['message'] = ApiClient.convertToType(data['message'], 'String');
      }
      if (data.hasOwnProperty('status')) {
        obj['status'] = ApiClient.convertToType(data['status'], 'Number');
      }
      if (data.hasOwnProperty('success')) {
        obj['success'] = ApiClient.convertToType(data['success'], 'Boolean');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/PostTrackingRemindersDataResponse} data
   */
  exports.prototype['data'] = undefined;
  /**
   * Message
   * @member {String} message
   */
  exports.prototype['message'] = undefined;
  /**
   * Status code
   * @member {Number} status
   */
  exports.prototype['status'] = undefined;
  /**
   * @member {Boolean} success
   */
  exports.prototype['success'] = undefined;



  return exports;
}));


