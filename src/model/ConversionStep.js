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
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.Quantimodo) {
      root.Quantimodo = {};
    }
    root.Quantimodo.ConversionStep = factory(root.Quantimodo.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The ConversionStep model module.
   * @module model/ConversionStep
   * @version 5.8.1126
   */

  /**
   * Constructs a new <code>ConversionStep</code>.
   * @alias module:model/ConversionStep
   * @class
   * @param operation {module:model/ConversionStep.OperationEnum} ADD or MULTIPLY
   * @param value {Number} This specifies the order of conversion steps starting with 0
   */
  var exports = function(operation, value) {
    var _this = this;

    _this['operation'] = operation;
    _this['value'] = value;
  };

  /**
   * Constructs a <code>ConversionStep</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ConversionStep} obj Optional instance to populate.
   * @return {module:model/ConversionStep} The populated <code>ConversionStep</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('operation')) {
        obj['operation'] = ApiClient.convertToType(data['operation'], 'String');
      }
      if (data.hasOwnProperty('value')) {
        obj['value'] = ApiClient.convertToType(data['value'], 'Number');
      }
    }
    return obj;
  }

  /**
   * ADD or MULTIPLY
   * @member {module:model/ConversionStep.OperationEnum} operation
   */
  exports.prototype['operation'] = undefined;
  /**
   * This specifies the order of conversion steps starting with 0
   * @member {Number} value
   */
  exports.prototype['value'] = undefined;


  /**
   * Allowed values for the <code>operation</code> property.
   * @enum {String}
   * @readonly
   */
  exports.OperationEnum = {
    /**
     * value: "ADD"
     * @const
     */
    "ADD": "ADD",
    /**
     * value: "MULTIPLY"
     * @const
     */
    "MULTIPLY": "MULTIPLY"  };


  return exports;
}));


