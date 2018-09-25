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
    instance = new Quantimodo.XprofileField();
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

  describe('XprofileField', function() {
    it('should create an instance of XprofileField', function() {
      // uncomment below and update the code to test XprofileField
      //var instane = new Quantimodo.XprofileField();
      //expect(instance).to.be.a(Quantimodo.XprofileField);
    });

    it('should have the property id (base name: "id")', function() {
      // uncomment below and update the code to test the property id
      //var instane = new Quantimodo.XprofileField();
      //expect(instance).to.be();
    });

    it('should have the property groupId (base name: "groupId")', function() {
      // uncomment below and update the code to test the property groupId
      //var instane = new Quantimodo.XprofileField();
      //expect(instance).to.be();
    });

    it('should have the property parentId (base name: "parentId")', function() {
      // uncomment below and update the code to test the property parentId
      //var instane = new Quantimodo.XprofileField();
      //expect(instance).to.be();
    });

    it('should have the property type (base name: "type")', function() {
      // uncomment below and update the code to test the property type
      //var instane = new Quantimodo.XprofileField();
      //expect(instance).to.be();
    });

    it('should have the property name (base name: "name")', function() {
      // uncomment below and update the code to test the property name
      //var instane = new Quantimodo.XprofileField();
      //expect(instance).to.be();
    });

    it('should have the property description (base name: "description")', function() {
      // uncomment below and update the code to test the property description
      //var instane = new Quantimodo.XprofileField();
      //expect(instance).to.be();
    });

    it('should have the property isRequired (base name: "isRequired")', function() {
      // uncomment below and update the code to test the property isRequired
      //var instane = new Quantimodo.XprofileField();
      //expect(instance).to.be();
    });

    it('should have the property isDefaultOption (base name: "isDefaultOption")', function() {
      // uncomment below and update the code to test the property isDefaultOption
      //var instane = new Quantimodo.XprofileField();
      //expect(instance).to.be();
    });

    it('should have the property fieldOrder (base name: "fieldOrder")', function() {
      // uncomment below and update the code to test the property fieldOrder
      //var instane = new Quantimodo.XprofileField();
      //expect(instance).to.be();
    });

    it('should have the property optionOrder (base name: "optionOrder")', function() {
      // uncomment below and update the code to test the property optionOrder
      //var instane = new Quantimodo.XprofileField();
      //expect(instance).to.be();
    });

    it('should have the property orderBy (base name: "orderBy")', function() {
      // uncomment below and update the code to test the property orderBy
      //var instane = new Quantimodo.XprofileField();
      //expect(instance).to.be();
    });

    it('should have the property canDelete (base name: "canDelete")', function() {
      // uncomment below and update the code to test the property canDelete
      //var instane = new Quantimodo.XprofileField();
      //expect(instance).to.be();
    });

    it('should have the property metaDataArray (base name: "metaDataArray")', function() {
      // uncomment below and update the code to test the property metaDataArray
      //var instane = new Quantimodo.XprofileField();
      //expect(instance).to.be();
    });

  });

}));
