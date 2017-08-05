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
    root.Quantimodo.PostCorrelation = factory(root.Quantimodo.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The PostCorrelation model module.
   * @module model/PostCorrelation
   * @version 5.8.805
   */

  /**
   * Constructs a new <code>PostCorrelation</code>.
   * @alias module:model/PostCorrelation
   * @class
   * @param causeVariableName {String} Cause variable name
   * @param effectVariableName {String} Effect variable name
   * @param correlation {Number} Correlation value
   */
  var exports = function(causeVariableName, effectVariableName, correlation) {
    var _this = this;

    _this['causeVariableName'] = causeVariableName;
    _this['effectVariableName'] = effectVariableName;
    _this['correlation'] = correlation;

  };

  /**
   * Constructs a <code>PostCorrelation</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/PostCorrelation} obj Optional instance to populate.
   * @return {module:model/PostCorrelation} The populated <code>PostCorrelation</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('causeVariableName')) {
        obj['causeVariableName'] = ApiClient.convertToType(data['causeVariableName'], 'String');
      }
      if (data.hasOwnProperty('effectVariableName')) {
        obj['effectVariableName'] = ApiClient.convertToType(data['effectVariableName'], 'String');
      }
      if (data.hasOwnProperty('correlation')) {
        obj['correlation'] = ApiClient.convertToType(data['correlation'], 'Number');
      }
      if (data.hasOwnProperty('vote')) {
        obj['vote'] = ApiClient.convertToType(data['vote'], 'Number');
      }
    }
    return obj;
  }

  /**
   * Cause variable name
   * @member {String} causeVariableName
   */
  exports.prototype['causeVariableName'] = undefined;
  /**
   * Effect variable name
   * @member {String} effectVariableName
   */
  exports.prototype['effectVariableName'] = undefined;
  /**
   * Correlation value
   * @member {Number} correlation
   */
  exports.prototype['correlation'] = undefined;
  /**
   * Vote: 0 or 1
   * @member {Number} vote
   */
  exports.prototype['vote'] = undefined;



  return exports;
}));


