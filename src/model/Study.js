/**
 * quantimodo
 * We make it easy to retrieve and analyze normalized user data from a wide array of devices and applications. Check out our [docs and sdk's](https://github.com/QuantiModo/docs) or [contact us](https://help.quantimo.do).
 *
 * OpenAPI spec version: 5.8.112511
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.4.5
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/Card', 'model/Correlation', 'model/ParticipantInstruction', 'model/StudyCharts', 'model/StudyHtml', 'model/StudyImages', 'model/StudyLinks', 'model/StudySharing', 'model/StudyText', 'model/StudyVotes', 'model/Variable'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./Card'), require('./Correlation'), require('./ParticipantInstruction'), require('./StudyCharts'), require('./StudyHtml'), require('./StudyImages'), require('./StudyLinks'), require('./StudySharing'), require('./StudyText'), require('./StudyVotes'), require('./Variable'));
  } else {
    // Browser globals (root is window)
    if (!root.Quantimodo) {
      root.Quantimodo = {};
    }
    root.Quantimodo.Study = factory(root.Quantimodo.ApiClient, root.Quantimodo.Card, root.Quantimodo.Correlation, root.Quantimodo.ParticipantInstruction, root.Quantimodo.StudyCharts, root.Quantimodo.StudyHtml, root.Quantimodo.StudyImages, root.Quantimodo.StudyLinks, root.Quantimodo.StudySharing, root.Quantimodo.StudyText, root.Quantimodo.StudyVotes, root.Quantimodo.Variable);
  }
}(this, function(ApiClient, Card, Correlation, ParticipantInstruction, StudyCharts, StudyHtml, StudyImages, StudyLinks, StudySharing, StudyText, StudyVotes, Variable) {
  'use strict';




  /**
   * The Study model module.
   * @module model/Study
   * @version 5.8.112511
   */

  /**
   * Constructs a new <code>Study</code>.
   * A study analyzes the relationship between a predictor variable like gluten-intake and an outcome of interest such as overall mood.
   * @alias module:model/Study
   * @class
   * @param type {String} Ex: population, cohort, or individual
   */
  var exports = function(type) {
    var _this = this;

    _this['type'] = type;

















  };

  /**
   * Constructs a <code>Study</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Study} obj Optional instance to populate.
   * @return {module:model/Study} The populated <code>Study</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('type')) {
        obj['type'] = ApiClient.convertToType(data['type'], 'String');
      }
      if (data.hasOwnProperty('userId')) {
        obj['userId'] = ApiClient.convertToType(data['userId'], 'Number');
      }
      if (data.hasOwnProperty('id')) {
        obj['id'] = ApiClient.convertToType(data['id'], 'String');
      }
      if (data.hasOwnProperty('causeVariable')) {
        obj['causeVariable'] = Variable.constructFromObject(data['causeVariable']);
      }
      if (data.hasOwnProperty('causeVariableName')) {
        obj['causeVariableName'] = ApiClient.convertToType(data['causeVariableName'], 'String');
      }
      if (data.hasOwnProperty('studyCharts')) {
        obj['studyCharts'] = StudyCharts.constructFromObject(data['studyCharts']);
      }
      if (data.hasOwnProperty('effectVariable')) {
        obj['effectVariable'] = Variable.constructFromObject(data['effectVariable']);
      }
      if (data.hasOwnProperty('effectVariableName')) {
        obj['effectVariableName'] = ApiClient.convertToType(data['effectVariableName'], 'String');
      }
      if (data.hasOwnProperty('participantInstructions')) {
        obj['participantInstructions'] = ParticipantInstruction.constructFromObject(data['participantInstructions']);
      }
      if (data.hasOwnProperty('statistics')) {
        obj['statistics'] = Correlation.constructFromObject(data['statistics']);
      }
      if (data.hasOwnProperty('studyCard')) {
        obj['studyCard'] = Card.constructFromObject(data['studyCard']);
      }
      if (data.hasOwnProperty('studyHtml')) {
        obj['studyHtml'] = StudyHtml.constructFromObject(data['studyHtml']);
      }
      if (data.hasOwnProperty('studyImages')) {
        obj['studyImages'] = StudyImages.constructFromObject(data['studyImages']);
      }
      if (data.hasOwnProperty('studyLinks')) {
        obj['studyLinks'] = StudyLinks.constructFromObject(data['studyLinks']);
      }
      if (data.hasOwnProperty('studySharing')) {
        obj['studySharing'] = StudySharing.constructFromObject(data['studySharing']);
      }
      if (data.hasOwnProperty('studyText')) {
        obj['studyText'] = StudyText.constructFromObject(data['studyText']);
      }
      if (data.hasOwnProperty('studyVotes')) {
        obj['studyVotes'] = StudyVotes.constructFromObject(data['studyVotes']);
      }
      if (data.hasOwnProperty('joined')) {
        obj['joined'] = ApiClient.convertToType(data['joined'], 'Boolean');
      }
    }
    return obj;
  }

  /**
   * Ex: population, cohort, or individual
   * @member {String} type
   */
  exports.prototype['type'] = undefined;
  /**
   * The user id of the principal investigator or subject if an individual studies
   * @member {Number} userId
   */
  exports.prototype['userId'] = undefined;
  /**
   * ID of the cohort study which is necessary to allow participants to join
   * @member {String} id
   */
  exports.prototype['id'] = undefined;
  /**
   * @member {module:model/Variable} causeVariable
   */
  exports.prototype['causeVariable'] = undefined;
  /**
   * Ex: Sleep Quality
   * @member {String} causeVariableName
   */
  exports.prototype['causeVariableName'] = undefined;
  /**
   * @member {module:model/StudyCharts} studyCharts
   */
  exports.prototype['studyCharts'] = undefined;
  /**
   * @member {module:model/Variable} effectVariable
   */
  exports.prototype['effectVariable'] = undefined;
  /**
   * Ex: Overall Mood
   * @member {String} effectVariableName
   */
  exports.prototype['effectVariableName'] = undefined;
  /**
   * @member {module:model/ParticipantInstruction} participantInstructions
   */
  exports.prototype['participantInstructions'] = undefined;
  /**
   * @member {module:model/Correlation} statistics
   */
  exports.prototype['statistics'] = undefined;
  /**
   * Contains a summary, images, sharing buttons, and links
   * @member {module:model/Card} studyCard
   */
  exports.prototype['studyCard'] = undefined;
  /**
   * @member {module:model/StudyHtml} studyHtml
   */
  exports.prototype['studyHtml'] = undefined;
  /**
   * @member {module:model/StudyImages} studyImages
   */
  exports.prototype['studyImages'] = undefined;
  /**
   * @member {module:model/StudyLinks} studyLinks
   */
  exports.prototype['studyLinks'] = undefined;
  /**
   * @member {module:model/StudySharing} studySharing
   */
  exports.prototype['studySharing'] = undefined;
  /**
   * @member {module:model/StudyText} studyText
   */
  exports.prototype['studyText'] = undefined;
  /**
   * @member {module:model/StudyVotes} studyVotes
   */
  exports.prototype['studyVotes'] = undefined;
  /**
   * True if you are sharing your data with this study
   * @member {Boolean} joined
   */
  exports.prototype['joined'] = undefined;



  return exports;
}));


