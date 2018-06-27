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
import PostUserSettingsDataResponse from './PostUserSettingsDataResponse';





/**
* The PostUserSettingsResponse model module.
* @module model/PostUserSettingsResponse
* @version 2.0
*/
export default class PostUserSettingsResponse {
    /**
    * Constructs a new <code>PostUserSettingsResponse</code>.
    * @alias module:model/PostUserSettingsResponse
    * @class
    * @param status {Number} Status code
    * @param success {Boolean} 
    */

    constructor(status, success) {
        

        
        

        this['status'] = status;this['success'] = success;

        
    }

    /**
    * Constructs a <code>PostUserSettingsResponse</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/PostUserSettingsResponse} obj Optional instance to populate.
    * @return {module:model/PostUserSettingsResponse} The populated <code>PostUserSettingsResponse</code> instance.
    */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new PostUserSettingsResponse();

            
            
            

            if (data.hasOwnProperty('data')) {
                obj['data'] = PostUserSettingsDataResponse.constructFromObject(data['data']);
            }
            if (data.hasOwnProperty('message')) {
                obj['message'] = ApiClient.convertToType(data['message'], 'String');
            }
            if (data.hasOwnProperty('status')) {
                obj['status'] = ApiClient.convertToType(data['status'], 'Number');
            }
            if (data.hasOwnProperty('success')) {
                obj['success'] = ApiClient.convertToType(data['success'], 'Boolean');
            }
            if (data.hasOwnProperty('description')) {
                obj['description'] = ApiClient.convertToType(data['description'], 'String');
            }
            if (data.hasOwnProperty('summary')) {
                obj['summary'] = ApiClient.convertToType(data['summary'], 'String');
            }
        }
        return obj;
    }

    /**
    * @member {module:model/PostUserSettingsDataResponse} data
    */
    data = undefined;
    /**
    * Message
    * @member {String} message
    */
    message = undefined;
    /**
    * Status code
    * @member {Number} status
    */
    status = undefined;
    /**
    * @member {Boolean} success
    */
    success = undefined;
    /**
    * Can be used as body of help info popup
    * @member {String} description
    */
    description = undefined;
    /**
    * Can be used as title in help info popup
    * @member {String} summary
    */
    summary = undefined;








}


