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
    root.QMApi.VoteDelete = factory(root.QMApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The VoteDelete model module.
   * @module quantimodo/model/VoteDelete
   * @version 5.8.725
   */

  /**
   * Constructs a new <code>VoteDelete</code>.
   * @alias module:quantimodo/model/VoteDelete
   * @class
   * @param cause {String} Cause variable name for the correlation to which the vote pertains
   * @param effect {String} Effect variable name for the correlation to which the vote pertains
   */
  var exports = function(cause, effect) {
    var _this = this;

    _this['cause'] = cause;
    _this['effect'] = effect;
  };

  /**
   * Constructs a <code>VoteDelete</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:quantimodo/model/VoteDelete} obj Optional instance to populate.
   * @return {module:quantimodo/model/VoteDelete} The populated <code>VoteDelete</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('cause')) {
        obj['cause'] = ApiClient.convertToType(data['cause'], 'String');
      }
      if (data.hasOwnProperty('effect')) {
        obj['effect'] = ApiClient.convertToType(data['effect'], 'String');
      }
    }
    return obj;
  }

  /**
   * Cause variable name for the correlation to which the vote pertains
   * @member {String} cause
   */
  exports.prototype['cause'] = undefined;
  /**
   * Effect variable name for the correlation to which the vote pertains
   * @member {String} effect
   */
  exports.prototype['effect'] = undefined;



  return exports;
}));


