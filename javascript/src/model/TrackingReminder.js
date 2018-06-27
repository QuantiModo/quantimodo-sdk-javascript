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
import TrackingReminderNotificationAction from './TrackingReminderNotificationAction';
import Unit from './Unit';





/**
* The TrackingReminder model module.
* @module model/TrackingReminder
* @version 2.0
*/
export default class TrackingReminder {
    /**
    * Constructs a new <code>TrackingReminder</code>.
    * @alias module:model/TrackingReminder
    * @class
    * @param unitAbbreviatedName {String} Ex: /5
    * @param reminderFrequency {Number} Number of seconds between one reminder and the next
    * @param variableCategoryName {String} Name of the variable category to be used when sending measurements
    * @param variableName {String} Name of the variable to be used when sending measurements
    */

    constructor(unitAbbreviatedName, reminderFrequency, variableCategoryName, variableName) {
        

        
        

        this['unitAbbreviatedName'] = unitAbbreviatedName;this['reminderFrequency'] = reminderFrequency;this['variableCategoryName'] = variableCategoryName;this['variableName'] = variableName;

        
    }

    /**
    * Constructs a <code>TrackingReminder</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/TrackingReminder} obj Optional instance to populate.
    * @return {module:model/TrackingReminder} The populated <code>TrackingReminder</code> instance.
    */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new TrackingReminder();

            
            
            

            if (data.hasOwnProperty('actionArray')) {
                obj['actionArray'] = ApiClient.convertToType(data['actionArray'], [TrackingReminderNotificationAction]);
            }
            if (data.hasOwnProperty('availableUnits')) {
                obj['availableUnits'] = ApiClient.convertToType(data['availableUnits'], [Unit]);
            }
            if (data.hasOwnProperty('clientId')) {
                obj['clientId'] = ApiClient.convertToType(data['clientId'], 'String');
            }
            if (data.hasOwnProperty('combinationOperation')) {
                obj['combinationOperation'] = ApiClient.convertToType(data['combinationOperation'], 'String');
            }
            if (data.hasOwnProperty('createdAt')) {
                obj['createdAt'] = ApiClient.convertToType(data['createdAt'], 'String');
            }
            if (data.hasOwnProperty('displayName')) {
                obj['displayName'] = ApiClient.convertToType(data['displayName'], 'String');
            }
            if (data.hasOwnProperty('unitAbbreviatedName')) {
                obj['unitAbbreviatedName'] = ApiClient.convertToType(data['unitAbbreviatedName'], 'String');
            }
            if (data.hasOwnProperty('unitCategoryId')) {
                obj['unitCategoryId'] = ApiClient.convertToType(data['unitCategoryId'], 'Number');
            }
            if (data.hasOwnProperty('unitCategoryName')) {
                obj['unitCategoryName'] = ApiClient.convertToType(data['unitCategoryName'], 'String');
            }
            if (data.hasOwnProperty('unitId')) {
                obj['unitId'] = ApiClient.convertToType(data['unitId'], 'Number');
            }
            if (data.hasOwnProperty('unitName')) {
                obj['unitName'] = ApiClient.convertToType(data['unitName'], 'String');
            }
            if (data.hasOwnProperty('defaultValue')) {
                obj['defaultValue'] = ApiClient.convertToType(data['defaultValue'], 'Number');
            }
            if (data.hasOwnProperty('email')) {
                obj['email'] = ApiClient.convertToType(data['email'], 'Boolean');
            }
            if (data.hasOwnProperty('errorMessage')) {
                obj['errorMessage'] = ApiClient.convertToType(data['errorMessage'], 'String');
            }
            if (data.hasOwnProperty('fillingValue')) {
                obj['fillingValue'] = ApiClient.convertToType(data['fillingValue'], 'Number');
            }
            if (data.hasOwnProperty('firstDailyReminderTime')) {
                obj['firstDailyReminderTime'] = ApiClient.convertToType(data['firstDailyReminderTime'], 'String');
            }
            if (data.hasOwnProperty('frequencyTextDescription')) {
                obj['frequencyTextDescription'] = ApiClient.convertToType(data['frequencyTextDescription'], 'String');
            }
            if (data.hasOwnProperty('frequencyTextDescriptionWithTime')) {
                obj['frequencyTextDescriptionWithTime'] = ApiClient.convertToType(data['frequencyTextDescriptionWithTime'], 'String');
            }
            if (data.hasOwnProperty('id')) {
                obj['id'] = ApiClient.convertToType(data['id'], 'Number');
            }
            if (data.hasOwnProperty('inputType')) {
                obj['inputType'] = ApiClient.convertToType(data['inputType'], 'String');
            }
            if (data.hasOwnProperty('instructions')) {
                obj['instructions'] = ApiClient.convertToType(data['instructions'], 'String');
            }
            if (data.hasOwnProperty('ionIcon')) {
                obj['ionIcon'] = ApiClient.convertToType(data['ionIcon'], 'String');
            }
            if (data.hasOwnProperty('lastTracked')) {
                obj['lastTracked'] = ApiClient.convertToType(data['lastTracked'], 'String');
            }
            if (data.hasOwnProperty('lastValue')) {
                obj['lastValue'] = ApiClient.convertToType(data['lastValue'], 'Number');
            }
            if (data.hasOwnProperty('latestTrackingReminderNotificationReminderTime')) {
                obj['latestTrackingReminderNotificationReminderTime'] = ApiClient.convertToType(data['latestTrackingReminderNotificationReminderTime'], 'String');
            }
            if (data.hasOwnProperty('localDailyReminderNotificationTimes')) {
                obj['localDailyReminderNotificationTimes'] = ApiClient.convertToType(data['localDailyReminderNotificationTimes'], ['String']);
            }
            if (data.hasOwnProperty('localDailyReminderNotificationTimesForAllReminders')) {
                obj['localDailyReminderNotificationTimesForAllReminders'] = ApiClient.convertToType(data['localDailyReminderNotificationTimesForAllReminders'], ['String']);
            }
            if (data.hasOwnProperty('manualTracking')) {
                obj['manualTracking'] = ApiClient.convertToType(data['manualTracking'], 'Boolean');
            }
            if (data.hasOwnProperty('maximumAllowedValue')) {
                obj['maximumAllowedValue'] = ApiClient.convertToType(data['maximumAllowedValue'], 'Number');
            }
            if (data.hasOwnProperty('minimumAllowedValue')) {
                obj['minimumAllowedValue'] = ApiClient.convertToType(data['minimumAllowedValue'], 'Number');
            }
            if (data.hasOwnProperty('nextReminderTimeEpochSeconds')) {
                obj['nextReminderTimeEpochSeconds'] = ApiClient.convertToType(data['nextReminderTimeEpochSeconds'], 'Number');
            }
            if (data.hasOwnProperty('notificationBar')) {
                obj['notificationBar'] = ApiClient.convertToType(data['notificationBar'], 'Boolean');
            }
            if (data.hasOwnProperty('numberOfRawMeasurements')) {
                obj['numberOfRawMeasurements'] = ApiClient.convertToType(data['numberOfRawMeasurements'], 'Number');
            }
            if (data.hasOwnProperty('numberOfUniqueValues')) {
                obj['numberOfUniqueValues'] = ApiClient.convertToType(data['numberOfUniqueValues'], 'Number');
            }
            if (data.hasOwnProperty('outcome')) {
                obj['outcome'] = ApiClient.convertToType(data['outcome'], 'Boolean');
            }
            if (data.hasOwnProperty('pngPath')) {
                obj['pngPath'] = ApiClient.convertToType(data['pngPath'], 'String');
            }
            if (data.hasOwnProperty('pngUrl')) {
                obj['pngUrl'] = ApiClient.convertToType(data['pngUrl'], 'String');
            }
            if (data.hasOwnProperty('productUrl')) {
                obj['productUrl'] = ApiClient.convertToType(data['productUrl'], 'String');
            }
            if (data.hasOwnProperty('popUp')) {
                obj['popUp'] = ApiClient.convertToType(data['popUp'], 'Boolean');
            }
            if (data.hasOwnProperty('question')) {
                obj['question'] = ApiClient.convertToType(data['question'], 'String');
            }
            if (data.hasOwnProperty('reminderEndTime')) {
                obj['reminderEndTime'] = ApiClient.convertToType(data['reminderEndTime'], 'String');
            }
            if (data.hasOwnProperty('reminderFrequency')) {
                obj['reminderFrequency'] = ApiClient.convertToType(data['reminderFrequency'], 'Number');
            }
            if (data.hasOwnProperty('reminderSound')) {
                obj['reminderSound'] = ApiClient.convertToType(data['reminderSound'], 'String');
            }
            if (data.hasOwnProperty('reminderStartEpochSeconds')) {
                obj['reminderStartEpochSeconds'] = ApiClient.convertToType(data['reminderStartEpochSeconds'], 'Number');
            }
            if (data.hasOwnProperty('reminderStartTime')) {
                obj['reminderStartTime'] = ApiClient.convertToType(data['reminderStartTime'], 'String');
            }
            if (data.hasOwnProperty('reminderStartTimeLocal')) {
                obj['reminderStartTimeLocal'] = ApiClient.convertToType(data['reminderStartTimeLocal'], 'String');
            }
            if (data.hasOwnProperty('reminderStartTimeLocalHumanFormatted')) {
                obj['reminderStartTimeLocalHumanFormatted'] = ApiClient.convertToType(data['reminderStartTimeLocalHumanFormatted'], 'String');
            }
            if (data.hasOwnProperty('repeating')) {
                obj['repeating'] = ApiClient.convertToType(data['repeating'], 'Boolean');
            }
            if (data.hasOwnProperty('secondDailyReminderTime')) {
                obj['secondDailyReminderTime'] = ApiClient.convertToType(data['secondDailyReminderTime'], 'String');
            }
            if (data.hasOwnProperty('secondToLastValue')) {
                obj['secondToLastValue'] = ApiClient.convertToType(data['secondToLastValue'], 'Number');
            }
            if (data.hasOwnProperty('sms')) {
                obj['sms'] = ApiClient.convertToType(data['sms'], 'Boolean');
            }
            if (data.hasOwnProperty('startTrackingDate')) {
                obj['startTrackingDate'] = ApiClient.convertToType(data['startTrackingDate'], 'String');
            }
            if (data.hasOwnProperty('stopTrackingDate')) {
                obj['stopTrackingDate'] = ApiClient.convertToType(data['stopTrackingDate'], 'String');
            }
            if (data.hasOwnProperty('svgUrl')) {
                obj['svgUrl'] = ApiClient.convertToType(data['svgUrl'], 'String');
            }
            if (data.hasOwnProperty('thirdDailyReminderTime')) {
                obj['thirdDailyReminderTime'] = ApiClient.convertToType(data['thirdDailyReminderTime'], 'String');
            }
            if (data.hasOwnProperty('thirdToLastValue')) {
                obj['thirdToLastValue'] = ApiClient.convertToType(data['thirdToLastValue'], 'Number');
            }
            if (data.hasOwnProperty('trackingReminderId')) {
                obj['trackingReminderId'] = ApiClient.convertToType(data['trackingReminderId'], 'Number');
            }
            if (data.hasOwnProperty('trackingReminderImageUrl')) {
                obj['trackingReminderImageUrl'] = ApiClient.convertToType(data['trackingReminderImageUrl'], 'String');
            }
            if (data.hasOwnProperty('upc')) {
                obj['upc'] = ApiClient.convertToType(data['upc'], 'String');
            }
            if (data.hasOwnProperty('updatedAt')) {
                obj['updatedAt'] = ApiClient.convertToType(data['updatedAt'], 'String');
            }
            if (data.hasOwnProperty('userId')) {
                obj['userId'] = ApiClient.convertToType(data['userId'], 'Number');
            }
            if (data.hasOwnProperty('userVariableUnitAbbreviatedName')) {
                obj['userVariableUnitAbbreviatedName'] = ApiClient.convertToType(data['userVariableUnitAbbreviatedName'], 'String');
            }
            if (data.hasOwnProperty('userVariableUnitCategoryId')) {
                obj['userVariableUnitCategoryId'] = ApiClient.convertToType(data['userVariableUnitCategoryId'], 'Number');
            }
            if (data.hasOwnProperty('userVariableUnitCategoryName')) {
                obj['userVariableUnitCategoryName'] = ApiClient.convertToType(data['userVariableUnitCategoryName'], 'String');
            }
            if (data.hasOwnProperty('userVariableUnitId')) {
                obj['userVariableUnitId'] = ApiClient.convertToType(data['userVariableUnitId'], 'Number');
            }
            if (data.hasOwnProperty('userVariableUnitName')) {
                obj['userVariableUnitName'] = ApiClient.convertToType(data['userVariableUnitName'], 'String');
            }
            if (data.hasOwnProperty('userVariableVariableCategoryId')) {
                obj['userVariableVariableCategoryId'] = ApiClient.convertToType(data['userVariableVariableCategoryId'], 'Number');
            }
            if (data.hasOwnProperty('userVariableVariableCategoryName')) {
                obj['userVariableVariableCategoryName'] = ApiClient.convertToType(data['userVariableVariableCategoryName'], 'String');
            }
            if (data.hasOwnProperty('valence')) {
                obj['valence'] = ApiClient.convertToType(data['valence'], 'String');
            }
            if (data.hasOwnProperty('valueAndFrequencyTextDescription')) {
                obj['valueAndFrequencyTextDescription'] = ApiClient.convertToType(data['valueAndFrequencyTextDescription'], 'String');
            }
            if (data.hasOwnProperty('valueAndFrequencyTextDescriptionWithTime')) {
                obj['valueAndFrequencyTextDescriptionWithTime'] = ApiClient.convertToType(data['valueAndFrequencyTextDescriptionWithTime'], 'String');
            }
            if (data.hasOwnProperty('variableCategoryId')) {
                obj['variableCategoryId'] = ApiClient.convertToType(data['variableCategoryId'], 'Number');
            }
            if (data.hasOwnProperty('variableCategoryImageUrl')) {
                obj['variableCategoryImageUrl'] = ApiClient.convertToType(data['variableCategoryImageUrl'], 'String');
            }
            if (data.hasOwnProperty('variableCategoryName')) {
                obj['variableCategoryName'] = ApiClient.convertToType(data['variableCategoryName'], 'String');
            }
            if (data.hasOwnProperty('variableDescription')) {
                obj['variableDescription'] = ApiClient.convertToType(data['variableDescription'], 'String');
            }
            if (data.hasOwnProperty('variableId')) {
                obj['variableId'] = ApiClient.convertToType(data['variableId'], 'Number');
            }
            if (data.hasOwnProperty('variableName')) {
                obj['variableName'] = ApiClient.convertToType(data['variableName'], 'String');
            }
        }
        return obj;
    }

    /**
    * @member {Array.<module:model/TrackingReminderNotificationAction>} actionArray
    */
    actionArray = undefined;
    /**
    * @member {Array.<module:model/Unit>} availableUnits
    */
    availableUnits = undefined;
    /**
    * Your QuantiModo client id can be obtained by creating an app at https://builder.quantimo.do
    * @member {String} clientId
    */
    clientId = undefined;
    /**
    * The way multiple measurements are aggregated over time
    * @member {module:model/TrackingReminder.CombinationOperationEnum} combinationOperation
    */
    combinationOperation = undefined;
    /**
    * Ex: 2016-05-18 02:24:08 UTC ISO 8601 YYYY-MM-DDThh:mm:ss
    * @member {String} createdAt
    */
    createdAt = undefined;
    /**
    * Ex: Trader Joe's Bedtime Tea
    * @member {String} displayName
    */
    displayName = undefined;
    /**
    * Ex: /5
    * @member {String} unitAbbreviatedName
    */
    unitAbbreviatedName = undefined;
    /**
    * Ex: 5
    * @member {Number} unitCategoryId
    */
    unitCategoryId = undefined;
    /**
    * Ex: Rating
    * @member {String} unitCategoryName
    */
    unitCategoryName = undefined;
    /**
    * Ex: 10
    * @member {Number} unitId
    */
    unitId = undefined;
    /**
    * Ex: 1 to 5 Rating
    * @member {String} unitName
    */
    unitName = undefined;
    /**
    * Default value to use for the measurement when tracking
    * @member {Number} defaultValue
    */
    defaultValue = undefined;
    /**
    * True if the reminders should be delivered via email
    * @member {Boolean} email
    */
    email = undefined;
    /**
    * Ex: reminderStartTimeLocal is less than $user->earliestReminderTime or greater than  $user->latestReminderTime
    * @member {String} errorMessage
    */
    errorMessage = undefined;
    /**
    * Ex: 0
    * @member {Number} fillingValue
    */
    fillingValue = undefined;
    /**
    * Ex: 02:45:20 in UTC timezone
    * @member {String} firstDailyReminderTime
    */
    firstDailyReminderTime = undefined;
    /**
    * Ex: Daily
    * @member {String} frequencyTextDescription
    */
    frequencyTextDescription = undefined;
    /**
    * Ex: Daily at 09:45 PM
    * @member {String} frequencyTextDescriptionWithTime
    */
    frequencyTextDescriptionWithTime = undefined;
    /**
    * id
    * @member {Number} id
    */
    id = undefined;
    /**
    * Ex: saddestFaceIsFive
    * @member {String} inputType
    */
    inputType = undefined;
    /**
    * Ex: I am an instruction!
    * @member {String} instructions
    */
    instructions = undefined;
    /**
    * Ex: ion-sad-outline
    * @member {String} ionIcon
    */
    ionIcon = undefined;
    /**
    * UTC ISO 8601 YYYY-MM-DDThh:mm:ss timestamp for the last time a measurement was received for this user and variable
    * @member {String} lastTracked
    */
    lastTracked = undefined;
    /**
    * Ex: 2
    * @member {Number} lastValue
    */
    lastValue = undefined;
    /**
    * UTC ISO 8601 YYYY-MM-DDThh:mm:ss  timestamp for the reminder time of the latest tracking reminder notification that has been pre-emptively generated in the database
    * @member {String} latestTrackingReminderNotificationReminderTime
    */
    latestTrackingReminderNotificationReminderTime = undefined;
    /**
    * @member {Array.<String>} localDailyReminderNotificationTimes
    */
    localDailyReminderNotificationTimes = undefined;
    /**
    * @member {Array.<String>} localDailyReminderNotificationTimesForAllReminders
    */
    localDailyReminderNotificationTimesForAllReminders = undefined;
    /**
    * Ex: 1
    * @member {Boolean} manualTracking
    */
    manualTracking = undefined;
    /**
    * Ex: 5
    * @member {Number} maximumAllowedValue
    */
    maximumAllowedValue = undefined;
    /**
    * Ex: 1
    * @member {Number} minimumAllowedValue
    */
    minimumAllowedValue = undefined;
    /**
    * Ex: 1501555520
    * @member {Number} nextReminderTimeEpochSeconds
    */
    nextReminderTimeEpochSeconds = undefined;
    /**
    * True if the reminders should appear in the notification bar
    * @member {Boolean} notificationBar
    */
    notificationBar = undefined;
    /**
    * Ex: 445
    * @member {Number} numberOfRawMeasurements
    */
    numberOfRawMeasurements = undefined;
    /**
    * Ex: 1
    * @member {Number} numberOfUniqueValues
    */
    numberOfUniqueValues = undefined;
    /**
    * Indicates whether or not the variable is usually an outcome of interest such as a symptom or emotion
    * @member {Boolean} outcome
    */
    outcome = undefined;
    /**
    * Ex: img/variable_categories/symptoms.png
    * @member {String} pngPath
    */
    pngPath = undefined;
    /**
    * Ex: https://quantimodo.quantimo.do/ionic/Modo/www/img/variable_categories/symptoms.png
    * @member {String} pngUrl
    */
    pngUrl = undefined;
    /**
    * Link to associated product for purchase
    * @member {String} productUrl
    */
    productUrl = undefined;
    /**
    * True if the reminders should appear as a popup notification
    * @member {Boolean} popUp
    */
    popUp = undefined;
    /**
    * Ex: How is your overall mood?
    * @member {String} question
    */
    question = undefined;
    /**
    * Latest time of day at which reminders should appear in UTC HH:MM:SS format
    * @member {String} reminderEndTime
    */
    reminderEndTime = undefined;
    /**
    * Number of seconds between one reminder and the next
    * @member {Number} reminderFrequency
    */
    reminderFrequency = undefined;
    /**
    * String identifier for the sound to accompany the reminder
    * @member {String} reminderSound
    */
    reminderSound = undefined;
    /**
    * Ex: 1469760320
    * @member {Number} reminderStartEpochSeconds
    */
    reminderStartEpochSeconds = undefined;
    /**
    * Earliest time of day at which reminders should appear in UTC HH:MM:SS format
    * @member {String} reminderStartTime
    */
    reminderStartTime = undefined;
    /**
    * Ex: 21:45:20
    * @member {String} reminderStartTimeLocal
    */
    reminderStartTimeLocal = undefined;
    /**
    * Ex: 09:45 PM
    * @member {String} reminderStartTimeLocalHumanFormatted
    */
    reminderStartTimeLocalHumanFormatted = undefined;
    /**
    * Ex: true
    * @member {Boolean} repeating
    */
    repeating = undefined;
    /**
    * Ex: 01:00:00
    * @member {String} secondDailyReminderTime
    */
    secondDailyReminderTime = undefined;
    /**
    * Ex: 1
    * @member {Number} secondToLastValue
    */
    secondToLastValue = undefined;
    /**
    * True if the reminders should be delivered via SMS
    * @member {Boolean} sms
    */
    sms = undefined;
    /**
    * Earliest date on which the user should be reminded to track in YYYY-MM-DD format
    * @member {String} startTrackingDate
    */
    startTrackingDate = undefined;
    /**
    * Latest date on which the user should be reminded to track in YYYY-MM-DD format
    * @member {String} stopTrackingDate
    */
    stopTrackingDate = undefined;
    /**
    * Ex: https://quantimodo.quantimo.do/ionic/Modo/www/img/variable_categories/symptoms.svg
    * @member {String} svgUrl
    */
    svgUrl = undefined;
    /**
    * Ex: 20:00:00
    * @member {String} thirdDailyReminderTime
    */
    thirdDailyReminderTime = undefined;
    /**
    * Ex: 3
    * @member {Number} thirdToLastValue
    */
    thirdToLastValue = undefined;
    /**
    * Ex: 11841
    * @member {Number} trackingReminderId
    */
    trackingReminderId = undefined;
    /**
    * Ex: Not Found
    * @member {String} trackingReminderImageUrl
    */
    trackingReminderImageUrl = undefined;
    /**
    * UPC or other barcode scan result
    * @member {String} upc
    */
    upc = undefined;
    /**
    * When the record in the database was last updated. Use UTC ISO 8601 YYYY-MM-DDThh:mm:ss  datetime format. Time zone should be UTC and not local.
    * @member {String} updatedAt
    */
    updatedAt = undefined;
    /**
    * ID of User
    * @member {Number} userId
    */
    userId = undefined;
    /**
    * Ex: /5
    * @member {String} userVariableUnitAbbreviatedName
    */
    userVariableUnitAbbreviatedName = undefined;
    /**
    * Ex: 5
    * @member {Number} userVariableUnitCategoryId
    */
    userVariableUnitCategoryId = undefined;
    /**
    * Ex: Rating
    * @member {String} userVariableUnitCategoryName
    */
    userVariableUnitCategoryName = undefined;
    /**
    * Ex: 10
    * @member {Number} userVariableUnitId
    */
    userVariableUnitId = undefined;
    /**
    * Ex: 1 to 5 Rating
    * @member {String} userVariableUnitName
    */
    userVariableUnitName = undefined;
    /**
    * Ex: 10
    * @member {Number} userVariableVariableCategoryId
    */
    userVariableVariableCategoryId = undefined;
    /**
    * Ex: Symptoms
    * @member {String} userVariableVariableCategoryName
    */
    userVariableVariableCategoryName = undefined;
    /**
    * Ex: negative
    * @member {String} valence
    */
    valence = undefined;
    /**
    * Ex: Rate daily
    * @member {String} valueAndFrequencyTextDescription
    */
    valueAndFrequencyTextDescription = undefined;
    /**
    * Ex: Rate daily at 09:45 PM
    * @member {String} valueAndFrequencyTextDescriptionWithTime
    */
    valueAndFrequencyTextDescriptionWithTime = undefined;
    /**
    * Ex: 10
    * @member {Number} variableCategoryId
    */
    variableCategoryId = undefined;
    /**
    * Ex: https://maxcdn.icons8.com/Color/PNG/96/Messaging/sad-96.png
    * @member {String} variableCategoryImageUrl
    */
    variableCategoryImageUrl = undefined;
    /**
    * Name of the variable category to be used when sending measurements
    * @member {String} variableCategoryName
    */
    variableCategoryName = undefined;
    /**
    * Ex: negative
    * @member {String} variableDescription
    */
    variableDescription = undefined;
    /**
    * Id for the variable to be tracked
    * @member {Number} variableId
    */
    variableId = undefined;
    /**
    * Name of the variable to be used when sending measurements
    * @member {String} variableName
    */
    variableName = undefined;






    /**
    * Allowed values for the <code>combinationOperation</code> property.
    * @enum {String}
    * @readonly
    */
    static CombinationOperationEnum = {
    
        /**
         * value: "MEAN"
         * @const
         */
        "MEAN": "MEAN",
    
        /**
         * value: "SUM"
         * @const
         */
        "SUM": "SUM"    
    };



}


