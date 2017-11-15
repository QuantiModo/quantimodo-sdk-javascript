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
    define(['ApiClient', 'model/Button'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./Button'));
  } else {
    // Browser globals (root is window)
    if (!root.Quantimodo) {
      root.Quantimodo = {};
    }
    root.Quantimodo.ExplanationStartTracking = factory(root.Quantimodo.ApiClient, root.Quantimodo.Button);
  }
}(this, function(ApiClient, Button) {
  'use strict';




  /**
   * The ExplanationStartTracking model module.
   * @module model/ExplanationStartTracking
   * @version 5.8.1114
   */

  /**
   * Constructs a new <code>ExplanationStartTracking</code>.
   * @alias module:model/ExplanationStartTracking
   * @class
   * @param button {module:model/Button} 
   * @param description {String} Example: The more data I have the more accurate your results will be so track regularly!
   * @param title {String} Example: Improve Accuracy
   */
  var exports = function(button, description, title) {
    var _this = this;

    _this['button'] = button;
    _this['description'] = description;
    _this['title'] = title;
  };

  /**
   * Constructs a <code>ExplanationStartTracking</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ExplanationStartTracking} obj Optional instance to populate.
   * @return {module:model/ExplanationStartTracking} The populated <code>ExplanationStartTracking</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('button')) {
        obj['button'] = Button.constructFromObject(data['button']);
      }
      if (data.hasOwnProperty('description')) {
        obj['description'] = ApiClient.convertToType(data['description'], 'String');
      }
      if (data.hasOwnProperty('title')) {
        obj['title'] = ApiClient.convertToType(data['title'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/Button} button
   */
  exports.prototype['button'] = undefined;
  /**
   * Example: The more data I have the more accurate your results will be so track regularly!
   * @member {String} description
   */
  exports.prototype['description'] = undefined;
  /**
   * Example: Improve Accuracy
   * @member {String} title
   */
  exports.prototype['title'] = undefined;



  return exports;
}));


