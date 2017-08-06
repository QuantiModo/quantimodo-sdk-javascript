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
    instance = new Quantimodo.DataSource();
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

  describe('DataSource', function() {
    it('should create an instance of DataSource', function() {
      // uncomment below and update the code to test DataSource
      //var instane = new Quantimodo.DataSource();
      //expect(instance).to.be.a(Quantimodo.DataSource);
    });

    it('should have the property id (base name: "id")', function() {
      // uncomment below and update the code to test the property id
      //var instane = new Quantimodo.DataSource();
      //expect(instance).to.be();
    });

    it('should have the property name (base name: "name")', function() {
      // uncomment below and update the code to test the property name
      //var instane = new Quantimodo.DataSource();
      //expect(instance).to.be();
    });

    it('should have the property connectorClientId (base name: "connectorClientId")', function() {
      // uncomment below and update the code to test the property connectorClientId
      //var instane = new Quantimodo.DataSource();
      //expect(instance).to.be();
    });

    it('should have the property connectorClientSecret (base name: "connectorClientSecret")', function() {
      // uncomment below and update the code to test the property connectorClientSecret
      //var instane = new Quantimodo.DataSource();
      //expect(instance).to.be();
    });

    it('should have the property displayName (base name: "displayName")', function() {
      // uncomment below and update the code to test the property displayName
      //var instane = new Quantimodo.DataSource();
      //expect(instance).to.be();
    });

    it('should have the property image (base name: "image")', function() {
      // uncomment below and update the code to test the property image
      //var instane = new Quantimodo.DataSource();
      //expect(instance).to.be();
    });

    it('should have the property getItUrl (base name: "getItUrl")', function() {
      // uncomment below and update the code to test the property getItUrl
      //var instane = new Quantimodo.DataSource();
      //expect(instance).to.be();
    });

    it('should have the property shortDescription (base name: "shortDescription")', function() {
      // uncomment below and update the code to test the property shortDescription
      //var instane = new Quantimodo.DataSource();
      //expect(instance).to.be();
    });

    it('should have the property longDescription (base name: "longDescription")', function() {
      // uncomment below and update the code to test the property longDescription
      //var instane = new Quantimodo.DataSource();
      //expect(instance).to.be();
    });

    it('should have the property enabled (base name: "enabled")', function() {
      // uncomment below and update the code to test the property enabled
      //var instane = new Quantimodo.DataSource();
      //expect(instance).to.be();
    });

    it('should have the property affiliate (base name: "affiliate")', function() {
      // uncomment below and update the code to test the property affiliate
      //var instane = new Quantimodo.DataSource();
      //expect(instance).to.be();
    });

    it('should have the property defaultVariableCategoryName (base name: "defaultVariableCategoryName")', function() {
      // uncomment below and update the code to test the property defaultVariableCategoryName
      //var instane = new Quantimodo.DataSource();
      //expect(instance).to.be();
    });

    it('should have the property imageHtml (base name: "imageHtml")', function() {
      // uncomment below and update the code to test the property imageHtml
      //var instane = new Quantimodo.DataSource();
      //expect(instance).to.be();
    });

    it('should have the property linkedDisplayNameHtml (base name: "linkedDisplayNameHtml")', function() {
      // uncomment below and update the code to test the property linkedDisplayNameHtml
      //var instane = new Quantimodo.DataSource();
      //expect(instance).to.be();
    });

  });

}));
