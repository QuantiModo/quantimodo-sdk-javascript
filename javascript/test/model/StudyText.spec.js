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

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define(['expect.js', '../../src/index'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    factory(require('expect.js'), require('../../src/index'));
  } else {
    // Browser globals (root is window)
    factory(root.expect, root.quantimodo-api);
  }
}(this, function(expect, quantimodo-api) {
  'use strict';

  var instance;

  beforeEach(function() {
    instance = new quantimodo-api.StudyText();
  });

  var getProperty = function(object, getter, property) {
    // Use getter method if present; otherwise, get the property directly.
    if (typeof object[getter] === 'function')
      return object[getter]();
    else
      return object[property];
  }

  var setProperty = function(object, setter, property, value) {
    // Use setter method if present; otherwise, set the property directly.
    if (typeof object[setter] === 'function')
      object[setter](value);
    else
      object[property] = value;
  }

  describe('StudyText', function() {
    it('should create an instance of StudyText', function() {
      // uncomment below and update the code to test StudyText
      //var instane = new quantimodo-api.StudyText();
      //expect(instance).to.be.a(quantimodo-api.StudyText);
    });

    it('should have the property averageEffectFollowingHighCauseExplanation (base name: "averageEffectFollowingHighCauseExplanation")', function() {
      // uncomment below and update the code to test the property averageEffectFollowingHighCauseExplanation
      //var instane = new quantimodo-api.StudyText();
      //expect(instance).to.be();
    });

    it('should have the property averageEffectFollowingLowCauseExplanation (base name: "averageEffectFollowingLowCauseExplanation")', function() {
      // uncomment below and update the code to test the property averageEffectFollowingLowCauseExplanation
      //var instane = new quantimodo-api.StudyText();
      //expect(instance).to.be();
    });

    it('should have the property valuePredictingHighOutcomeExplanation (base name: "valuePredictingHighOutcomeExplanation")', function() {
      // uncomment below and update the code to test the property valuePredictingHighOutcomeExplanation
      //var instane = new quantimodo-api.StudyText();
      //expect(instance).to.be();
    });

    it('should have the property valuePredictingLowOutcomeExplanation (base name: "valuePredictingLowOutcomeExplanation")', function() {
      // uncomment below and update the code to test the property valuePredictingLowOutcomeExplanation
      //var instane = new quantimodo-api.StudyText();
      //expect(instance).to.be();
    });

    it('should have the property dataAnalysis (base name: "dataAnalysis")', function() {
      // uncomment below and update the code to test the property dataAnalysis
      //var instane = new quantimodo-api.StudyText();
      //expect(instance).to.be();
    });

    it('should have the property dataSources (base name: "dataSources")', function() {
      // uncomment below and update the code to test the property dataSources
      //var instane = new quantimodo-api.StudyText();
      //expect(instance).to.be();
    });

    it('should have the property dataSourcesParagraphForCause (base name: "dataSourcesParagraphForCause")', function() {
      // uncomment below and update the code to test the property dataSourcesParagraphForCause
      //var instane = new quantimodo-api.StudyText();
      //expect(instance).to.be();
    });

    it('should have the property dataSourcesParagraphForEffect (base name: "dataSourcesParagraphForEffect")', function() {
      // uncomment below and update the code to test the property dataSourcesParagraphForEffect
      //var instane = new quantimodo-api.StudyText();
      //expect(instance).to.be();
    });

    it('should have the property lastCauseDailyValueSentenceExtended (base name: "lastCauseDailyValueSentenceExtended")', function() {
      // uncomment below and update the code to test the property lastCauseDailyValueSentenceExtended
      //var instane = new quantimodo-api.StudyText();
      //expect(instance).to.be();
    });

    it('should have the property lastCauseAndOptimalValueSentence (base name: "lastCauseAndOptimalValueSentence")', function() {
      // uncomment below and update the code to test the property lastCauseAndOptimalValueSentence
      //var instane = new quantimodo-api.StudyText();
      //expect(instance).to.be();
    });

    it('should have the property lastCauseDailyValueSentence (base name: "lastCauseDailyValueSentence")', function() {
      // uncomment below and update the code to test the property lastCauseDailyValueSentence
      //var instane = new quantimodo-api.StudyText();
      //expect(instance).to.be();
    });

    it('should have the property optimalDailyValueSentence (base name: "optimalDailyValueSentence")', function() {
      // uncomment below and update the code to test the property optimalDailyValueSentence
      //var instane = new quantimodo-api.StudyText();
      //expect(instance).to.be();
    });

    it('should have the property predictorExplanation (base name: "predictorExplanation")', function() {
      // uncomment below and update the code to test the property predictorExplanation
      //var instane = new quantimodo-api.StudyText();
      //expect(instance).to.be();
    });

    it('should have the property significanceExplanation (base name: "significanceExplanation")', function() {
      // uncomment below and update the code to test the property significanceExplanation
      //var instane = new quantimodo-api.StudyText();
      //expect(instance).to.be();
    });

    it('should have the property studyAbstract (base name: "studyAbstract")', function() {
      // uncomment below and update the code to test the property studyAbstract
      //var instane = new quantimodo-api.StudyText();
      //expect(instance).to.be();
    });

    it('should have the property studyDesign (base name: "studyDesign")', function() {
      // uncomment below and update the code to test the property studyDesign
      //var instane = new quantimodo-api.StudyText();
      //expect(instance).to.be();
    });

    it('should have the property studyLimitations (base name: "studyLimitations")', function() {
      // uncomment below and update the code to test the property studyLimitations
      //var instane = new quantimodo-api.StudyText();
      //expect(instance).to.be();
    });

    it('should have the property studyObjective (base name: "studyObjective")', function() {
      // uncomment below and update the code to test the property studyObjective
      //var instane = new quantimodo-api.StudyText();
      //expect(instance).to.be();
    });

    it('should have the property studyResults (base name: "studyResults")', function() {
      // uncomment below and update the code to test the property studyResults
      //var instane = new quantimodo-api.StudyText();
      //expect(instance).to.be();
    });

    it('should have the property studyTitle (base name: "studyTitle")', function() {
      // uncomment below and update the code to test the property studyTitle
      //var instane = new quantimodo-api.StudyText();
      //expect(instance).to.be();
    });

    it('should have the property studyInvitation (base name: "studyInvitation")', function() {
      // uncomment below and update the code to test the property studyInvitation
      //var instane = new quantimodo-api.StudyText();
      //expect(instance).to.be();
    });

    it('should have the property studyQuestion (base name: "studyQuestion")', function() {
      // uncomment below and update the code to test the property studyQuestion
      //var instane = new quantimodo-api.StudyText();
      //expect(instance).to.be();
    });

    it('should have the property studyBackground (base name: "studyBackground")', function() {
      // uncomment below and update the code to test the property studyBackground
      //var instane = new quantimodo-api.StudyText();
      //expect(instance).to.be();
    });

  });

}));
