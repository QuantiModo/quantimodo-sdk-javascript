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
    instance = new Quantimodo.Pair();
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

  describe('Pair', function() {
    it('should create an instance of Pair', function() {
      // uncomment below and update the code to test Pair
      //var instane = new Quantimodo.Pair();
      //expect(instance).to.be.a(Quantimodo.Pair);
    });

    it('should have the property causeMeasurement (base name: "causeMeasurement")', function() {
      // uncomment below and update the code to test the property causeMeasurement
      //var instane = new Quantimodo.Pair();
      //expect(instance).to.be();
    });

    it('should have the property causeMeasurementValue (base name: "causeMeasurementValue")', function() {
      // uncomment below and update the code to test the property causeMeasurementValue
      //var instane = new Quantimodo.Pair();
      //expect(instance).to.be();
    });

    it('should have the property causeVariableUnitAbbreviatedName (base name: "causeVariableUnitAbbreviatedName")', function() {
      // uncomment below and update the code to test the property causeVariableUnitAbbreviatedName
      //var instane = new Quantimodo.Pair();
      //expect(instance).to.be();
    });

    it('should have the property effectMeasurement (base name: "effectMeasurement")', function() {
      // uncomment below and update the code to test the property effectMeasurement
      //var instane = new Quantimodo.Pair();
      //expect(instance).to.be();
    });

    it('should have the property effectMeasurementValue (base name: "effectMeasurementValue")', function() {
      // uncomment below and update the code to test the property effectMeasurementValue
      //var instane = new Quantimodo.Pair();
      //expect(instance).to.be();
    });

    it('should have the property effectVariableUnitAbbreviatedName (base name: "effectVariableUnitAbbreviatedName")', function() {
      // uncomment below and update the code to test the property effectVariableUnitAbbreviatedName
      //var instane = new Quantimodo.Pair();
      //expect(instance).to.be();
    });

    it('should have the property eventAt (base name: "eventAt")', function() {
      // uncomment below and update the code to test the property eventAt
      //var instane = new Quantimodo.Pair();
      //expect(instance).to.be();
    });

    it('should have the property eventAtUnixTime (base name: "eventAtUnixTime")', function() {
      // uncomment below and update the code to test the property eventAtUnixTime
      //var instane = new Quantimodo.Pair();
      //expect(instance).to.be();
    });

    it('should have the property startTimeString (base name: "startTimeString")', function() {
      // uncomment below and update the code to test the property startTimeString
      //var instane = new Quantimodo.Pair();
      //expect(instance).to.be();
    });

    it('should have the property timestamp (base name: "timestamp")', function() {
      // uncomment below and update the code to test the property timestamp
      //var instane = new Quantimodo.Pair();
      //expect(instance).to.be();
    });

  });

}));
