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
    instance = new quantimodo-api.StudyCharts();
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

  describe('StudyCharts', function() {
    it('should create an instance of StudyCharts', function() {
      // uncomment below and update the code to test StudyCharts
      //var instane = new quantimodo-api.StudyCharts();
      //expect(instance).to.be.a(quantimodo-api.StudyCharts);
    });

    it('should have the property populationTraitScatterPlot (base name: "populationTraitScatterPlot")', function() {
      // uncomment below and update the code to test the property populationTraitScatterPlot
      //var instane = new quantimodo-api.StudyCharts();
      //expect(instance).to.be();
    });

    it('should have the property outcomeDistributionColumnChart (base name: "outcomeDistributionColumnChart")', function() {
      // uncomment below and update the code to test the property outcomeDistributionColumnChart
      //var instane = new quantimodo-api.StudyCharts();
      //expect(instance).to.be();
    });

    it('should have the property predictorDistributionColumnChart (base name: "predictorDistributionColumnChart")', function() {
      // uncomment below and update the code to test the property predictorDistributionColumnChart
      //var instane = new quantimodo-api.StudyCharts();
      //expect(instance).to.be();
    });

    it('should have the property correlationScatterPlot (base name: "correlationScatterPlot")', function() {
      // uncomment below and update the code to test the property correlationScatterPlot
      //var instane = new quantimodo-api.StudyCharts();
      //expect(instance).to.be();
    });

    it('should have the property pairsOverTimeLineChart (base name: "pairsOverTimeLineChart")', function() {
      // uncomment below and update the code to test the property pairsOverTimeLineChart
      //var instane = new quantimodo-api.StudyCharts();
      //expect(instance).to.be();
    });

  });

}));
