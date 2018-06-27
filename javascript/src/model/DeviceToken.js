/**
 * quantimodo
 * We make it easy to retrieve and analyze normalized user data from a wide array of devices and applications. Check out our [docs and sdk's](https://github.com/QuantiModo/docs) or [contact us](https://help.quantimo.do).
 *
 * OpenAPI spec version: 2.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 */


import ApiClient from '../ApiClient';





/**
* The DeviceToken model module.
* @module model/DeviceToken
* @version 2.0
*/
export default class DeviceToken {
    /**
    * Constructs a new <code>DeviceToken</code>.
    * @alias module:model/DeviceToken
    * @class
    * @param platform {String} ios, android, or web
    * @param deviceToken {String} The device token
    */

    constructor(platform, deviceToken) {
        

        
        

        this['platform'] = platform;this['deviceToken'] = deviceToken;

        
    }

    /**
    * Constructs a <code>DeviceToken</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/DeviceToken} obj Optional instance to populate.
    * @return {module:model/DeviceToken} The populated <code>DeviceToken</code> instance.
    */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new DeviceToken();

            
            
            

            if (data.hasOwnProperty('clientId')) {
                obj['clientId'] = ApiClient.convertToType(data['clientId'], 'String');
            }
            if (data.hasOwnProperty('platform')) {
                obj['platform'] = ApiClient.convertToType(data['platform'], 'String');
            }
            if (data.hasOwnProperty('deviceToken')) {
                obj['deviceToken'] = ApiClient.convertToType(data['deviceToken'], 'String');
            }
        }
        return obj;
    }

    /**
    * Client id
    * @member {String} clientId
    */
    clientId = undefined;
    /**
    * ios, android, or web
    * @member {String} platform
    */
    platform = undefined;
    /**
    * The device token
    * @member {String} deviceToken
    */
    deviceToken = undefined;








}


