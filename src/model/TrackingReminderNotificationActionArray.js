/**
 * quantimodo
 * We make it easy to retrieve and analyze normalized user data from a wide array of devices and applications. Check out our [docs and sdk's](https://github.com/QuantiModo/docs) or [contact us](https://help.quantimo.do).
 *
 * OpenAPI spec version: 5.8.100414
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
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.Quantimodo) {
      root.Quantimodo = {};
    }
    root.Quantimodo.TrackingReminderNotificationActionArray = factory(root.Quantimodo.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The TrackingReminderNotificationActionArray model module.
   * @module model/TrackingReminderNotificationActionArray
   * @version 5.8.1114
   */

  /**
   * Constructs a new <code>TrackingReminderNotificationActionArray</code>.
   * @alias module:model/TrackingReminderNotificationActionArray
   * @class
   * @param action {String} Example: track
   * @param callback {String} Example: trackThreeRatingAction
   * @param modifiedValue {Number} Example: 3
   * @param title {String} Example: Rate 3/5
   */
  var exports = function(action, callback, modifiedValue, title) {
    var _this = this;

    _this['action'] = action;
    _this['callback'] = callback;
    _this['modifiedValue'] = modifiedValue;
    _this['title'] = title;
  };

  /**
   * Constructs a <code>TrackingReminderNotificationActionArray</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/TrackingReminderNotificationActionArray} obj Optional instance to populate.
   * @return {module:model/TrackingReminderNotificationActionArray} The populated <code>TrackingReminderNotificationActionArray</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('action')) {
        obj['action'] = ApiClient.convertToType(data['action'], 'String');
      }
      if (data.hasOwnProperty('callback')) {
        obj['callback'] = ApiClient.convertToType(data['callback'], 'String');
      }
      if (data.hasOwnProperty('modifiedValue')) {
        obj['modifiedValue'] = ApiClient.convertToType(data['modifiedValue'], 'Number');
      }
      if (data.hasOwnProperty('title')) {
        obj['title'] = ApiClient.convertToType(data['title'], 'String');
      }
    }
    return obj;
  }

  /**
   * Example: track
   * @member {String} action
   */
  exports.prototype['action'] = undefined;
  /**
   * Example: trackThreeRatingAction
   * @member {String} callback
   */
  exports.prototype['callback'] = undefined;
  /**
   * Example: 3
   * @member {Number} modifiedValue
   */
  exports.prototype['modifiedValue'] = undefined;
  /**
   * Example: Rate 3/5
   * @member {String} title
   */
  exports.prototype['title'] = undefined;



  return exports;
}));


