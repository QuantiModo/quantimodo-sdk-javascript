/**
 * quantimodo
 * We make it easy to retrieve and analyze normalized user data from a wide array of devices and applications. Check out our [docs and sdk's](https://github.com/QuantiModo/docs) or [contact us](https://help.quantimo.do).
 *
 * OpenAPI spec version: 5.8.112511
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.4.4
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/Error'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./Error'));
  } else {
    // Browser globals (root is window)
    if (!root.Quantimodo) {
      root.Quantimodo = {};
    }
    root.Quantimodo.CommonResponse = factory(root.Quantimodo.ApiClient, root.Quantimodo.Error);
  }
}(this, function(ApiClient, Error) {
  'use strict';




  /**
   * The CommonResponse model module.
   * @module model/CommonResponse
   * @version 5.8.112511
   */

  /**
   * Constructs a new <code>CommonResponse</code>.
   * @alias module:model/CommonResponse
   * @class
   * @param description {String} Can be used as body of help info popup
   * @param summary {String} Can be used as title in help info popup
   */
  var exports = function(description, summary) {
    var _this = this;

    _this['description'] = description;
    _this['summary'] = summary;




  };

  /**
   * Constructs a <code>CommonResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CommonResponse} obj Optional instance to populate.
   * @return {module:model/CommonResponse} The populated <code>CommonResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('description')) {
        obj['description'] = ApiClient.convertToType(data['description'], 'String');
      }
      if (data.hasOwnProperty('summary')) {
        obj['summary'] = ApiClient.convertToType(data['summary'], 'String');
      }
      if (data.hasOwnProperty('errors')) {
        obj['errors'] = ApiClient.convertToType(data['errors'], [Error]);
      }
      if (data.hasOwnProperty('status')) {
        obj['status'] = ApiClient.convertToType(data['status'], 'String');
      }
      if (data.hasOwnProperty('success')) {
        obj['success'] = ApiClient.convertToType(data['success'], 'Boolean');
      }
      if (data.hasOwnProperty('code')) {
        obj['code'] = ApiClient.convertToType(data['code'], 'Number');
      }
    }
    return obj;
  }

  /**
   * Can be used as body of help info popup
   * @member {String} description
   */
  exports.prototype['description'] = undefined;
  /**
   * Can be used as title in help info popup
   * @member {String} summary
   */
  exports.prototype['summary'] = undefined;
  /**
   * Array of error objects with message property
   * @member {Array.<module:model/Error>} errors
   */
  exports.prototype['errors'] = undefined;
  /**
   * ex. OK or ERROR
   * @member {String} status
   */
  exports.prototype['status'] = undefined;
  /**
   * true or false
   * @member {Boolean} success
   */
  exports.prototype['success'] = undefined;
  /**
   * Response code such as 200
   * @member {Number} code
   */
  exports.prototype['code'] = undefined;



  return exports;
}));


