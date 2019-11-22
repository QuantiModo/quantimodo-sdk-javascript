/**
 * quantimodo
 * We make it easy to retrieve and analyze normalized user data from a wide array of devices and applications. Check out our [docs and sdk's](https://github.com/QuantiModo/docs) or [contact us](https://help.quantimo.do).
 *
 * OpenAPI spec version: 5.8.112511
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.4.8
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
    instance = new Quantimodo.XprofileGroup();
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

  describe('XprofileGroup', function() {
    it('should create an instance of XprofileGroup', function() {
      // uncomment below and update the code to test XprofileGroup
      //var instance = new Quantimodo.XprofileGroup();
      //expect(instance).to.be.a(Quantimodo.XprofileGroup);
    });

    it('should have the property id (base name: "id")', function() {
      // uncomment below and update the code to test the property id
      //var instance = new Quantimodo.XprofileGroup();
      //expect(instance).to.be();
    });

    it('should have the property name (base name: "name")', function() {
      // uncomment below and update the code to test the property name
      //var instance = new Quantimodo.XprofileGroup();
      //expect(instance).to.be();
    });

    it('should have the property description (base name: "description")', function() {
      // uncomment below and update the code to test the property description
      //var instance = new Quantimodo.XprofileGroup();
      //expect(instance).to.be();
    });

    it('should have the property groupOrder (base name: "groupOrder")', function() {
      // uncomment below and update the code to test the property groupOrder
      //var instance = new Quantimodo.XprofileGroup();
      //expect(instance).to.be();
    });

    it('should have the property canDelete (base name: "canDelete")', function() {
      // uncomment below and update the code to test the property canDelete
      //var instance = new Quantimodo.XprofileGroup();
      //expect(instance).to.be();
    });

    it('should have the property metaDataArray (base name: "metaDataArray")', function() {
      // uncomment below and update the code to test the property metaDataArray
      //var instance = new Quantimodo.XprofileGroup();
      //expect(instance).to.be();
    });

  });

}));