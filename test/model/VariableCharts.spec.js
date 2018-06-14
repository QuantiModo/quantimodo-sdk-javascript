/**
 * quantimodo
 * We make it easy to retrieve and analyze normalized user data from a wide array of devices and applications. Check out our [docs and sdk's](https://github.com/QuantiModo/docs) or [contact us](https://help.quantimo.do).
 *
 * OpenAPI spec version: 5.8.112511
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
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
    factory(root.expect, root.Quantimodo);
  }
}(this, function(expect, Quantimodo) {
  'use strict';

  var instance;

  beforeEach(function() {
    instance = new Quantimodo.VariableCharts();
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

  describe('VariableCharts', function() {
    it('should create an instance of VariableCharts', function() {
      // uncomment below and update the code to test VariableCharts
      //var instane = new Quantimodo.VariableCharts();
      //expect(instance).to.be.a(Quantimodo.VariableCharts);
    });

    it('should have the property hourlyColumnChart (base name: "hourlyColumnChart")', function() {
      // uncomment below and update the code to test the property hourlyColumnChart
      //var instane = new Quantimodo.VariableCharts();
      //expect(instance).to.be();
    });

    it('should have the property monthlyColumnChart (base name: "monthlyColumnChart")', function() {
      // uncomment below and update the code to test the property monthlyColumnChart
      //var instane = new Quantimodo.VariableCharts();
      //expect(instance).to.be();
    });

    it('should have the property distributionColumnChart (base name: "distributionColumnChart")', function() {
      // uncomment below and update the code to test the property distributionColumnChart
      //var instane = new Quantimodo.VariableCharts();
      //expect(instance).to.be();
    });

    it('should have the property weekdayColumnChart (base name: "weekdayColumnChart")', function() {
      // uncomment below and update the code to test the property weekdayColumnChart
      //var instane = new Quantimodo.VariableCharts();
      //expect(instance).to.be();
    });

    it('should have the property lineChartWithoutSmoothing (base name: "lineChartWithoutSmoothing")', function() {
      // uncomment below and update the code to test the property lineChartWithoutSmoothing
      //var instane = new Quantimodo.VariableCharts();
      //expect(instance).to.be();
    });

    it('should have the property lineChartWithSmoothing (base name: "lineChartWithSmoothing")', function() {
      // uncomment below and update the code to test the property lineChartWithSmoothing
      //var instane = new Quantimodo.VariableCharts();
      //expect(instance).to.be();
    });

  });

}));
