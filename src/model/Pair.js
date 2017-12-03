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
    root.Quantimodo.Pair = factory(root.Quantimodo.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The Pair model module.
   * @module model/Pair
   * @version 5.8.112511
   */

  /**
   * Constructs a new <code>Pair</code>.
   * @alias module:model/Pair
   * @class
   * @param causeMeasurement {Number} Example: 101341.66666667
   * @param causeMeasurementValue {Number} Example: 101341.66666667
   * @param causeVariableUnitAbbreviatedName {String} Example: mg
   * @param effectMeasurement {Number} Example: 7.98
   * @param effectMeasurementValue {Number} Example: 7.98
   * @param effectVariableUnitAbbreviatedName {String} Example: %
   * @param startTimeSting {Date} Example: 2016-06-03 07:00:00
   * @param timestamp {Number} Example: 1464937200
   */
  var exports = function(causeMeasurement, causeMeasurementValue, causeVariableUnitAbbreviatedName, effectMeasurement, effectMeasurementValue, effectVariableUnitAbbreviatedName, startTimeSting, timestamp) {
    var _this = this;

    _this['causeMeasurement'] = causeMeasurement;
    _this['causeMeasurementValue'] = causeMeasurementValue;
    _this['causeVariableUnitAbbreviatedName'] = causeVariableUnitAbbreviatedName;
    _this['effectMeasurement'] = effectMeasurement;
    _this['effectMeasurementValue'] = effectMeasurementValue;
    _this['effectVariableUnitAbbreviatedName'] = effectVariableUnitAbbreviatedName;


    _this['startTimeSting'] = startTimeSting;

    _this['timestamp'] = timestamp;
  };

  /**
   * Constructs a <code>Pair</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Pair} obj Optional instance to populate.
   * @return {module:model/Pair} The populated <code>Pair</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('causeMeasurement')) {
        obj['causeMeasurement'] = ApiClient.convertToType(data['causeMeasurement'], 'Number');
      }
      if (data.hasOwnProperty('causeMeasurementValue')) {
        obj['causeMeasurementValue'] = ApiClient.convertToType(data['causeMeasurementValue'], 'Number');
      }
      if (data.hasOwnProperty('causeVariableUnitAbbreviatedName')) {
        obj['causeVariableUnitAbbreviatedName'] = ApiClient.convertToType(data['causeVariableUnitAbbreviatedName'], 'String');
      }
      if (data.hasOwnProperty('effectMeasurement')) {
        obj['effectMeasurement'] = ApiClient.convertToType(data['effectMeasurement'], 'Number');
      }
      if (data.hasOwnProperty('effectMeasurementValue')) {
        obj['effectMeasurementValue'] = ApiClient.convertToType(data['effectMeasurementValue'], 'Number');
      }
      if (data.hasOwnProperty('effectVariableUnitAbbreviatedName')) {
        obj['effectVariableUnitAbbreviatedName'] = ApiClient.convertToType(data['effectVariableUnitAbbreviatedName'], 'String');
      }
      if (data.hasOwnProperty('eventAt')) {
        obj['eventAt'] = ApiClient.convertToType(data['eventAt'], 'Date');
      }
      if (data.hasOwnProperty('eventAtUnixTime')) {
        obj['eventAtUnixTime'] = ApiClient.convertToType(data['eventAtUnixTime'], 'Number');
      }
      if (data.hasOwnProperty('startTimeSting')) {
        obj['startTimeSting'] = ApiClient.convertToType(data['startTimeSting'], 'Date');
      }
      if (data.hasOwnProperty('startTimeString')) {
        obj['startTimeString'] = ApiClient.convertToType(data['startTimeString'], 'Date');
      }
      if (data.hasOwnProperty('timestamp')) {
        obj['timestamp'] = ApiClient.convertToType(data['timestamp'], 'Number');
      }
    }
    return obj;
  }

  /**
   * Example: 101341.66666667
   * @member {Number} causeMeasurement
   */
  exports.prototype['causeMeasurement'] = undefined;
  /**
   * Example: 101341.66666667
   * @member {Number} causeMeasurementValue
   */
  exports.prototype['causeMeasurementValue'] = undefined;
  /**
   * Example: mg
   * @member {String} causeVariableUnitAbbreviatedName
   */
  exports.prototype['causeVariableUnitAbbreviatedName'] = undefined;
  /**
   * Example: 7.98
   * @member {Number} effectMeasurement
   */
  exports.prototype['effectMeasurement'] = undefined;
  /**
   * Example: 7.98
   * @member {Number} effectMeasurementValue
   */
  exports.prototype['effectMeasurementValue'] = undefined;
  /**
   * Example: %
   * @member {String} effectVariableUnitAbbreviatedName
   */
  exports.prototype['effectVariableUnitAbbreviatedName'] = undefined;
  /**
   * Example: 2015-08-06 15:49:02
   * @member {Date} eventAt
   */
  exports.prototype['eventAt'] = undefined;
  /**
   * Example: 1438876142
   * @member {Number} eventAtUnixTime
   */
  exports.prototype['eventAtUnixTime'] = undefined;
  /**
   * Example: 2016-06-03 07:00:00
   * @member {Date} startTimeSting
   */
  exports.prototype['startTimeSting'] = undefined;
  /**
   * Example: 2015-08-06 15:49:02
   * @member {Date} startTimeString
   */
  exports.prototype['startTimeString'] = undefined;
  /**
   * Example: 1464937200
   * @member {Number} timestamp
   */
  exports.prototype['timestamp'] = undefined;



  return exports;
}));


