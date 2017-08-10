/**
 * quantimodo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do).
 *
 * OpenAPI spec version: 5.8.728
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.2.3
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
    instance = new Quantimodo.Option();
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

  describe('Option', function() {
    it('should create an instance of Option', function() {
      // uncomment below and update the code to test Option
      //var instane = new Quantimodo.Option();
      //expect(instance).to.be.a(Quantimodo.Option);
    });

    it('should have the property chart (base name: "chart")', function() {
      // uncomment below and update the code to test the property chart
      //var instane = new Quantimodo.Option();
      //expect(instance).to.be();
    });

    it('should have the property plotOptions (base name: "plotOptions")', function() {
      // uncomment below and update the code to test the property plotOptions
      //var instane = new Quantimodo.Option();
      //expect(instance).to.be();
    });

    it('should have the property credits (base name: "credits")', function() {
      // uncomment below and update the code to test the property credits
      //var instane = new Quantimodo.Option();
      //expect(instance).to.be();
    });

    it('should have the property yAxis (base name: "yAxis")', function() {
      // uncomment below and update the code to test the property yAxis
      //var instane = new Quantimodo.Option();
      //expect(instance).to.be();
    });

    it('should have the property title (base name: "title")', function() {
      // uncomment below and update the code to test the property title
      //var instane = new Quantimodo.Option();
      //expect(instance).to.be();
    });

    it('should have the property xAxis (base name: "xAxis")', function() {
      // uncomment below and update the code to test the property xAxis
      //var instane = new Quantimodo.Option();
      //expect(instance).to.be();
    });

    it('should have the property lang (base name: "lang")', function() {
      // uncomment below and update the code to test the property lang
      //var instane = new Quantimodo.Option();
      //expect(instance).to.be();
    });

    it('should have the property loading (base name: "loading")', function() {
      // uncomment below and update the code to test the property loading
      //var instane = new Quantimodo.Option();
      //expect(instance).to.be();
    });

    it('should have the property legend (base name: "legend")', function() {
      // uncomment below and update the code to test the property legend
      //var instane = new Quantimodo.Option();
      //expect(instance).to.be();
    });

    it('should have the property colors (base name: "colors")', function() {
      // uncomment below and update the code to test the property colors
      //var instane = new Quantimodo.Option();
      //expect(instance).to.be();
    });

  });

}));
