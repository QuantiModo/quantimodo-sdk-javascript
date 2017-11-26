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
    define(['ApiClient', 'model/Button', 'model/Scope'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./Button'), require('./Scope'));
  } else {
    // Browser globals (root is window)
    if (!root.Quantimodo) {
      root.Quantimodo = {};
    }
    root.Quantimodo.Connector = factory(root.Quantimodo.ApiClient, root.Quantimodo.Button, root.Quantimodo.Scope);
  }
}(this, function(ApiClient, Button, Scope) {
  'use strict';




  /**
   * The Connector model module.
   * @module model/Connector
   * @version 5.8.1126
   */

  /**
   * Constructs a new <code>Connector</code>.
   * @alias module:model/Connector
   * @class
   * @param connected {String} True if the authenticated user has this connector enabled
   * @param connectInstructions {String} URL and parameters used when connecting to a service
   * @param displayName {String} Connector pretty display name
   * @param getItUrl {String} URL to a site where one can get this device or application
   * @param id {Number} Connector ID number
   * @param image {String} URL to the image of the connector logo
   * @param lastUpdate {Number} Epoch timestamp of last sync
   * @param name {String} Connector lowercase system name
   * @param totalMeasurementsInLastUpdate {Number} Number of measurements obtained during latest update
   */
  var exports = function(connected, connectInstructions, displayName, getItUrl, id, image, lastUpdate, name, totalMeasurementsInLastUpdate) {
    var _this = this;




    _this['connected'] = connected;

    _this['connectInstructions'] = connectInstructions;





    _this['displayName'] = displayName;

    _this['getItUrl'] = getItUrl;
    _this['id'] = id;
    _this['image'] = image;


    _this['lastUpdate'] = lastUpdate;



    _this['name'] = name;



    _this['totalMeasurementsInLastUpdate'] = totalMeasurementsInLastUpdate;




  };

  /**
   * Constructs a <code>Connector</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Connector} obj Optional instance to populate.
   * @return {module:model/Connector} The populated <code>Connector</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('affiliate')) {
        obj['affiliate'] = ApiClient.convertToType(data['affiliate'], 'Boolean');
      }
      if (data.hasOwnProperty('buttons')) {
        obj['buttons'] = ApiClient.convertToType(data['buttons'], [Button]);
      }
      if (data.hasOwnProperty('clientId')) {
        obj['clientId'] = ApiClient.convertToType(data['clientId'], 'String');
      }
      if (data.hasOwnProperty('connected')) {
        obj['connected'] = ApiClient.convertToType(data['connected'], 'String');
      }
      if (data.hasOwnProperty('connectError')) {
        obj['connectError'] = ApiClient.convertToType(data['connectError'], 'String');
      }
      if (data.hasOwnProperty('connectInstructions')) {
        obj['connectInstructions'] = ApiClient.convertToType(data['connectInstructions'], 'String');
      }
      if (data.hasOwnProperty('connectorClientId')) {
        obj['connectorClientId'] = ApiClient.convertToType(data['connectorClientId'], 'String');
      }
      if (data.hasOwnProperty('connectorId')) {
        obj['connectorId'] = ApiClient.convertToType(data['connectorId'], 'Number');
      }
      if (data.hasOwnProperty('connectStatus')) {
        obj['connectStatus'] = ApiClient.convertToType(data['connectStatus'], 'String');
      }
      if (data.hasOwnProperty('createdAt')) {
        obj['createdAt'] = ApiClient.convertToType(data['createdAt'], 'Date');
      }
      if (data.hasOwnProperty('defaultVariableCategoryName')) {
        obj['defaultVariableCategoryName'] = ApiClient.convertToType(data['defaultVariableCategoryName'], 'String');
      }
      if (data.hasOwnProperty('displayName')) {
        obj['displayName'] = ApiClient.convertToType(data['displayName'], 'String');
      }
      if (data.hasOwnProperty('enabled')) {
        obj['enabled'] = ApiClient.convertToType(data['enabled'], 'Number');
      }
      if (data.hasOwnProperty('getItUrl')) {
        obj['getItUrl'] = ApiClient.convertToType(data['getItUrl'], 'String');
      }
      if (data.hasOwnProperty('id')) {
        obj['id'] = ApiClient.convertToType(data['id'], 'Number');
      }
      if (data.hasOwnProperty('image')) {
        obj['image'] = ApiClient.convertToType(data['image'], 'String');
      }
      if (data.hasOwnProperty('imageHtml')) {
        obj['imageHtml'] = ApiClient.convertToType(data['imageHtml'], 'String');
      }
      if (data.hasOwnProperty('lastSuccessfulUpdatedAt')) {
        obj['lastSuccessfulUpdatedAt'] = ApiClient.convertToType(data['lastSuccessfulUpdatedAt'], 'Date');
      }
      if (data.hasOwnProperty('lastUpdate')) {
        obj['lastUpdate'] = ApiClient.convertToType(data['lastUpdate'], 'Number');
      }
      if (data.hasOwnProperty('linkedDisplayNameHtml')) {
        obj['linkedDisplayNameHtml'] = ApiClient.convertToType(data['linkedDisplayNameHtml'], 'String');
      }
      if (data.hasOwnProperty('longDescription')) {
        obj['longDescription'] = ApiClient.convertToType(data['longDescription'], 'String');
      }
      if (data.hasOwnProperty('message')) {
        obj['message'] = ApiClient.convertToType(data['message'], 'String');
      }
      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('oauth')) {
        obj['oauth'] = ApiClient.convertToType(data['oauth'], Object);
      }
      if (data.hasOwnProperty('scopes')) {
        obj['scopes'] = ApiClient.convertToType(data['scopes'], [Scope]);
      }
      if (data.hasOwnProperty('shortDescription')) {
        obj['shortDescription'] = ApiClient.convertToType(data['shortDescription'], 'String');
      }
      if (data.hasOwnProperty('totalMeasurementsInLastUpdate')) {
        obj['totalMeasurementsInLastUpdate'] = ApiClient.convertToType(data['totalMeasurementsInLastUpdate'], 'Number');
      }
      if (data.hasOwnProperty('updatedAt')) {
        obj['updatedAt'] = ApiClient.convertToType(data['updatedAt'], 'Date');
      }
      if (data.hasOwnProperty('updateRequestedAt')) {
        obj['updateRequestedAt'] = ApiClient.convertToType(data['updateRequestedAt'], 'Date');
      }
      if (data.hasOwnProperty('updateStatus')) {
        obj['updateStatus'] = ApiClient.convertToType(data['updateStatus'], 'String');
      }
      if (data.hasOwnProperty('userId')) {
        obj['userId'] = ApiClient.convertToType(data['userId'], 'Number');
      }
    }
    return obj;
  }

  /**
   * Example: false
   * @member {Boolean} affiliate
   */
  exports.prototype['affiliate'] = undefined;
  /**
   * @member {Array.<module:model/Button>} buttons
   */
  exports.prototype['buttons'] = undefined;
  /**
   * Example: ghostInspector
   * @member {String} clientId
   */
  exports.prototype['clientId'] = undefined;
  /**
   * True if the authenticated user has this connector enabled
   * @member {String} connected
   */
  exports.prototype['connected'] = undefined;
  /**
   * Example: Your token is expired. Please re-connect
   * @member {String} connectError
   */
  exports.prototype['connectError'] = undefined;
  /**
   * URL and parameters used when connecting to a service
   * @member {String} connectInstructions
   */
  exports.prototype['connectInstructions'] = undefined;
  /**
   * Example: 225078261031461
   * @member {String} connectorClientId
   */
  exports.prototype['connectorClientId'] = undefined;
  /**
   * Example: 8
   * @member {Number} connectorId
   */
  exports.prototype['connectorId'] = undefined;
  /**
   * Example: CONNECTED
   * @member {String} connectStatus
   */
  exports.prototype['connectStatus'] = undefined;
  /**
   * Example: 2000-01-01 00:00:00
   * @member {Date} createdAt
   */
  exports.prototype['createdAt'] = undefined;
  /**
   * Example: Social Interactions
   * @member {String} defaultVariableCategoryName
   */
  exports.prototype['defaultVariableCategoryName'] = undefined;
  /**
   * Connector pretty display name
   * @member {String} displayName
   */
  exports.prototype['displayName'] = undefined;
  /**
   * Example: 1
   * @member {Number} enabled
   */
  exports.prototype['enabled'] = undefined;
  /**
   * URL to a site where one can get this device or application
   * @member {String} getItUrl
   */
  exports.prototype['getItUrl'] = undefined;
  /**
   * Connector ID number
   * @member {Number} id
   */
  exports.prototype['id'] = undefined;
  /**
   * URL to the image of the connector logo
   * @member {String} image
   */
  exports.prototype['image'] = undefined;
  /**
   * Example: <a href=\"http://www.facebook.com\"><img id=\"facebook_image\" title=\"Facebook\" src=\"https://i.imgur.com/GhwqK4f.png\" alt=\"Facebook\"></a>
   * @member {String} imageHtml
   */
  exports.prototype['imageHtml'] = undefined;
  /**
   * Example: 2017-07-31 10:10:34
   * @member {Date} lastSuccessfulUpdatedAt
   */
  exports.prototype['lastSuccessfulUpdatedAt'] = undefined;
  /**
   * Epoch timestamp of last sync
   * @member {Number} lastUpdate
   */
  exports.prototype['lastUpdate'] = undefined;
  /**
   * Example: <a href=\"http://www.facebook.com\">Facebook</a>
   * @member {String} linkedDisplayNameHtml
   */
  exports.prototype['linkedDisplayNameHtml'] = undefined;
  /**
   * Example: Facebook is a social networking website where users may create a personal profile, add other users as friends, and exchange messages.
   * @member {String} longDescription
   */
  exports.prototype['longDescription'] = undefined;
  /**
   * Example: Got 412 new measurements on 2017-07-31 10:10:34
   * @member {String} message
   */
  exports.prototype['message'] = undefined;
  /**
   * Connector lowercase system name
   * @member {String} name
   */
  exports.prototype['name'] = undefined;
  /**
   * Example: {}
   * @member {Object} oauth
   */
  exports.prototype['oauth'] = undefined;
  /**
   * @member {Array.<module:model/Scope>} scopes
   */
  exports.prototype['scopes'] = undefined;
  /**
   * Example: Tracks social interaction. QuantiModo requires permission to access your Facebook \"user likes\" and \"user posts\".
   * @member {String} shortDescription
   */
  exports.prototype['shortDescription'] = undefined;
  /**
   * Number of measurements obtained during latest update
   * @member {Number} totalMeasurementsInLastUpdate
   */
  exports.prototype['totalMeasurementsInLastUpdate'] = undefined;
  /**
   * Example: 2017-07-31 10:10:34
   * @member {Date} updatedAt
   */
  exports.prototype['updatedAt'] = undefined;
  /**
   * Example: 2017-07-18 05:16:31
   * @member {Date} updateRequestedAt
   */
  exports.prototype['updateRequestedAt'] = undefined;
  /**
   * Example: UPDATED
   * @member {String} updateStatus
   */
  exports.prototype['updateStatus'] = undefined;
  /**
   * Example: 230
   * @member {Number} userId
   */
  exports.prototype['userId'] = undefined;



  return exports;
}));


