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
    root.Quantimodo.Column = factory(root.Quantimodo.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The Column model module.
   * @module model/Column
   * @version 5.8.810
   */

  /**
   * Constructs a new <code>Column</code>.
   * @alias module:model/Column
   * @class
   * @param pointPadding {Number} Example: 0.2
   * @param borderWidth {Number} Example: 0
   * @param pointWidth {Number} Example: 33.333333333333
   * @param enableMouseTracking {Boolean} Example: true
   * @param colorByPoint {Boolean} Example: true
   */
  var exports = function(pointPadding, borderWidth, pointWidth, enableMouseTracking, colorByPoint) {
    var _this = this;

    _this['pointPadding'] = pointPadding;
    _this['borderWidth'] = borderWidth;
    _this['pointWidth'] = pointWidth;
    _this['enableMouseTracking'] = enableMouseTracking;
    _this['colorByPoint'] = colorByPoint;
  };

  /**
   * Constructs a <code>Column</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Column} obj Optional instance to populate.
   * @return {module:model/Column} The populated <code>Column</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('pointPadding')) {
        obj['pointPadding'] = ApiClient.convertToType(data['pointPadding'], 'Number');
      }
      if (data.hasOwnProperty('borderWidth')) {
        obj['borderWidth'] = ApiClient.convertToType(data['borderWidth'], 'Number');
      }
      if (data.hasOwnProperty('pointWidth')) {
        obj['pointWidth'] = ApiClient.convertToType(data['pointWidth'], 'Number');
      }
      if (data.hasOwnProperty('enableMouseTracking')) {
        obj['enableMouseTracking'] = ApiClient.convertToType(data['enableMouseTracking'], 'Boolean');
      }
      if (data.hasOwnProperty('colorByPoint')) {
        obj['colorByPoint'] = ApiClient.convertToType(data['colorByPoint'], 'Boolean');
      }
    }
    return obj;
  }

  /**
   * Example: 0.2
   * @member {Number} pointPadding
   */
  exports.prototype['pointPadding'] = undefined;
  /**
   * Example: 0
   * @member {Number} borderWidth
   */
  exports.prototype['borderWidth'] = undefined;
  /**
   * Example: 33.333333333333
   * @member {Number} pointWidth
   */
  exports.prototype['pointWidth'] = undefined;
  /**
   * Example: true
   * @member {Boolean} enableMouseTracking
   */
  exports.prototype['enableMouseTracking'] = undefined;
  /**
   * Example: true
   * @member {Boolean} colorByPoint
   */
  exports.prototype['colorByPoint'] = undefined;



  return exports;
}));


