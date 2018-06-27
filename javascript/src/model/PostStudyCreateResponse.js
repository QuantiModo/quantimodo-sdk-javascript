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
import Study from './Study';





/**
* The PostStudyCreateResponse model module.
* @module model/PostStudyCreateResponse
* @version 2.0
*/
export default class PostStudyCreateResponse {
    /**
    * Constructs a new <code>PostStudyCreateResponse</code>.
    * @alias module:model/PostStudyCreateResponse
    * @class
    */

    constructor() {
        

        
        

        

        
    }

    /**
    * Constructs a <code>PostStudyCreateResponse</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/PostStudyCreateResponse} obj Optional instance to populate.
    * @return {module:model/PostStudyCreateResponse} The populated <code>PostStudyCreateResponse</code> instance.
    */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new PostStudyCreateResponse();

            
            
            

            if (data.hasOwnProperty('study')) {
                obj['study'] = Study.constructFromObject(data['study']);
            }
            if (data.hasOwnProperty('status')) {
                obj['status'] = ApiClient.convertToType(data['status'], 'String');
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
    * @member {module:model/Study} study
    */
    study = undefined;
    /**
    * Ex: ok
    * @member {String} status
    */
    status = undefined;
    /**
    * Ex: true
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


