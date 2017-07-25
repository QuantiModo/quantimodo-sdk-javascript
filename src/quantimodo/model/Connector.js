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
    root.QMApi.Connector = factory(root.QMApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The Connector model module.
   * @module quantimodo/model/Connector
   * @version 5.8.725
   */

  /**
   * Constructs a new <code>Connector</code>.
   * @alias module:quantimodo/model/Connector
   * @class
   * @param id {Number} Connector ID number
   * @param name {String} Connector lowercase system name
   * @param displayName {String} Connector pretty display name
   * @param image {String} URL to the image of the connector logo
   * @param getItUrl {String} URL to a site where one can get this device or application
   * @param connected {String} True if the authenticated user has this connector enabled
   * @param connectInstructions {String} URL and parameters used when connecting to a service
   * @param lastUpdate {Number} Epoch timestamp of last sync
   * @param totalMeasurementsInLastUpdate {Number} Number of measurements obtained during latest update
   */
  var exports = function(id, name, displayName, image, getItUrl, connected, connectInstructions, lastUpdate, totalMeasurementsInLastUpdate) {
    var _this = this;

    _this['id'] = id;
    _this['name'] = name;
    _this['displayName'] = displayName;
    _this['image'] = image;
    _this['getItUrl'] = getItUrl;
    _this['connected'] = connected;
    _this['connectInstructions'] = connectInstructions;
    _this['lastUpdate'] = lastUpdate;
    _this['totalMeasurementsInLastUpdate'] = totalMeasurementsInLastUpdate;
  };

  /**
   * Constructs a <code>Connector</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:quantimodo/model/Connector} obj Optional instance to populate.
   * @return {module:quantimodo/model/Connector} The populated <code>Connector</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('id')) {
        obj['id'] = ApiClient.convertToType(data['id'], 'Number');
      }
      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('displayName')) {
        obj['displayName'] = ApiClient.convertToType(data['displayName'], 'String');
      }
      if (data.hasOwnProperty('image')) {
        obj['image'] = ApiClient.convertToType(data['image'], 'String');
      }
      if (data.hasOwnProperty('getItUrl')) {
        obj['getItUrl'] = ApiClient.convertToType(data['getItUrl'], 'String');
      }
      if (data.hasOwnProperty('connected')) {
        obj['connected'] = ApiClient.convertToType(data['connected'], 'String');
      }
      if (data.hasOwnProperty('connectInstructions')) {
        obj['connectInstructions'] = ApiClient.convertToType(data['connectInstructions'], 'String');
      }
      if (data.hasOwnProperty('lastUpdate')) {
        obj['lastUpdate'] = ApiClient.convertToType(data['lastUpdate'], 'Number');
      }
      if (data.hasOwnProperty('totalMeasurementsInLastUpdate')) {
        obj['totalMeasurementsInLastUpdate'] = ApiClient.convertToType(data['totalMeasurementsInLastUpdate'], 'Number');
      }
    }
    return obj;
  }

  /**
   * Connector ID number
   * @member {Number} id
   */
  exports.prototype['id'] = undefined;
  /**
   * Connector lowercase system name
   * @member {String} name
   */
  exports.prototype['name'] = undefined;
  /**
   * Connector pretty display name
   * @member {String} displayName
   */
  exports.prototype['displayName'] = undefined;
  /**
   * URL to the image of the connector logo
   * @member {String} image
   */
  exports.prototype['image'] = undefined;
  /**
   * URL to a site where one can get this device or application
   * @member {String} getItUrl
   */
  exports.prototype['getItUrl'] = undefined;
  /**
   * True if the authenticated user has this connector enabled
   * @member {String} connected
   */
  exports.prototype['connected'] = undefined;
  /**
   * URL and parameters used when connecting to a service
   * @member {String} connectInstructions
   */
  exports.prototype['connectInstructions'] = undefined;
  /**
   * Epoch timestamp of last sync
   * @member {Number} lastUpdate
   */
  exports.prototype['lastUpdate'] = undefined;
  /**
   * Number of measurements obtained during latest update
   * @member {Number} totalMeasurementsInLastUpdate
   */
  exports.prototype['totalMeasurementsInLastUpdate'] = undefined;



  return exports;
}));


