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
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.Quantimodo) {
      root.Quantimodo = {};
    }
    root.Quantimodo.UserTokenSuccessfulResponseInnerUserField = factory(root.Quantimodo.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The UserTokenSuccessfulResponseInnerUserField model module.
   * @module model/UserTokenSuccessfulResponseInnerUserField
   * @version 5.8.728
   */

  /**
   * Constructs a new <code>UserTokenSuccessfulResponseInnerUserField</code>.
   * @alias module:model/UserTokenSuccessfulResponseInnerUserField
   * @class
   * @param id {Number} WordPress user ID
   * @param accessToken {String} User token
   */
  var exports = function(id, accessToken) {
    var _this = this;

    _this['id'] = id;
    _this['access_token'] = accessToken;
  };

  /**
   * Constructs a <code>UserTokenSuccessfulResponseInnerUserField</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/UserTokenSuccessfulResponseInnerUserField} obj Optional instance to populate.
   * @return {module:model/UserTokenSuccessfulResponseInnerUserField} The populated <code>UserTokenSuccessfulResponseInnerUserField</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('id')) {
        obj['id'] = ApiClient.convertToType(data['id'], 'Number');
      }
      if (data.hasOwnProperty('access_token')) {
        obj['access_token'] = ApiClient.convertToType(data['access_token'], 'String');
      }
    }
    return obj;
  }

  /**
   * WordPress user ID
   * @member {Number} id
   */
  exports.prototype['id'] = undefined;
  /**
   * User token
   * @member {String} access_token
   */
  exports.prototype['access_token'] = undefined;



  return exports;
}));


