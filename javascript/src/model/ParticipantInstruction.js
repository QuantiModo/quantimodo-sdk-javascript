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
* The ParticipantInstruction model module.
* @module model/ParticipantInstruction
* @version 2.0
*/
export default class ParticipantInstruction {
    /**
    * Constructs a new <code>ParticipantInstruction</code>.
    * @alias module:model/ParticipantInstruction
    * @class
    */

    constructor() {
        

        
        

        

        
    }

    /**
    * Constructs a <code>ParticipantInstruction</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/ParticipantInstruction} obj Optional instance to populate.
    * @return {module:model/ParticipantInstruction} The populated <code>ParticipantInstruction</code> instance.
    */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new ParticipantInstruction();

            
            
            

            if (data.hasOwnProperty('instructionsForCauseVariable')) {
                obj['instructionsForCauseVariable'] = ApiClient.convertToType(data['instructionsForCauseVariable'], 'String');
            }
            if (data.hasOwnProperty('instructionsForEffectVariable')) {
                obj['instructionsForEffectVariable'] = ApiClient.convertToType(data['instructionsForEffectVariable'], 'String');
            }
        }
        return obj;
    }

    /**
    * Ex: <a href=\"https://www.amazon.com/Fitbit-Charge-Heart-Fitness-Wristband/dp/B01K9S260E/ref=as_li_ss_tl?ie=UTF8&qid=1493518902&sr=8-3&keywords=fitbit&th=1&linkCode=ll1&tag=quant08-20&linkId=b357b0833de73b0c4e935fd7c13a079e\">Obtain Fitbit</a> and use it to record your Sleep Duration. Once you have a <a href=\"https://www.amazon.com/Fitbit-Charge-Heart-Fitness-Wristband/dp/B01K9S260E/ref=as_li_ss_tl?ie=UTF8&qid=1493518902&sr=8-3&keywords=fitbit&th=1&linkCode=ll1&tag=quant08-20&linkId=b357b0833de73b0c4e935fd7c13a079e\">Fitbit</a> account, <a href=\"https://quantimodo.quantimo.do/ionic/Modo/www/#/app/import\">connect your  Fitbit account at QuantiModo</a> to automatically import and analyze your data.
    * @member {String} instructionsForCauseVariable
    */
    instructionsForCauseVariable = undefined;
    /**
    * Ex: <a href=\"https://quantimo.do\">Obtain QuantiModo</a> and use it to record your Overall Mood. Once you have a <a href=\"https://quantimo.do\">QuantiModo</a> account, <a href=\"https://quantimodo.quantimo.do/ionic/Modo/www/#/app/import\">connect your  QuantiModo account at QuantiModo</a> to automatically import and analyze your data.
    * @member {String} instructionsForEffectVariable
    */
    instructionsForEffectVariable = undefined;








}


