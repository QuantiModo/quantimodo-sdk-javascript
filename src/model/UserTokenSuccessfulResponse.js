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
    define(['ApiClient', 'model/UserTokenSuccessfulResponseInnerUserField'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./UserTokenSuccessfulResponseInnerUserField'));
  } else {
    // Browser globals (root is window)
    if (!root.Quantimodo) {
      root.Quantimodo = {};
    }
    root.Quantimodo.UserTokenSuccessfulResponse = factory(root.Quantimodo.ApiClient, root.Quantimodo.UserTokenSuccessfulResponseInnerUserField);
  }
}(this, function(ApiClient, UserTokenSuccessfulResponseInnerUserField) {
  'use strict';




  /**
   * The UserTokenSuccessfulResponse model module.
   * @module model/UserTokenSuccessfulResponse
   * @version 5.8.806
   */

  /**
   * Constructs a new <code>UserTokenSuccessfulResponse</code>.
   * @alias module:model/UserTokenSuccessfulResponse
   * @class
   * @param code {Number} Status code
   * @param message {String} Message
   * @param user {module:model/UserTokenSuccessfulResponseInnerUserField} 
   */
  var exports = function(code, message, user) {
    var _this = this;

    _this['code'] = code;
    _this['message'] = message;
    _this['user'] = user;
  };

  /**
   * Constructs a <code>UserTokenSuccessfulResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/UserTokenSuccessfulResponse} obj Optional instance to populate.
   * @return {module:model/UserTokenSuccessfulResponse} The populated <code>UserTokenSuccessfulResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('code')) {
        obj['code'] = ApiClient.convertToType(data['code'], 'Number');
      }
      if (data.hasOwnProperty('message')) {
        obj['message'] = ApiClient.convertToType(data['message'], 'String');
      }
      if (data.hasOwnProperty('user')) {
        obj['user'] = UserTokenSuccessfulResponseInnerUserField.constructFromObject(data['user']);
      }
    }
    return obj;
  }

  /**
   * Status code
   * @member {Number} code
   */
  exports.prototype['code'] = undefined;
  /**
   * Message
   * @member {String} message
   */
  exports.prototype['message'] = undefined;
  /**
   * @member {module:model/UserTokenSuccessfulResponseInnerUserField} user
   */
  exports.prototype['user'] = undefined;



  return exports;
}));


