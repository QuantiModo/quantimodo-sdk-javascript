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
    instance = new Quantimodo.Friend();
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

  describe('Friend', function() {
    it('should create an instance of Friend', function() {
      // uncomment below and update the code to test Friend
      //var instane = new Quantimodo.Friend();
      //expect(instance).to.be.a(Quantimodo.Friend);
    });

    it('should have the property id (base name: "id")', function() {
      // uncomment below and update the code to test the property id
      //var instane = new Quantimodo.Friend();
      //expect(instance).to.be();
    });

    it('should have the property initiatorUserId (base name: "initiatorUserId")', function() {
      // uncomment below and update the code to test the property initiatorUserId
      //var instane = new Quantimodo.Friend();
      //expect(instance).to.be();
    });

    it('should have the property friendUserId (base name: "friendUserId")', function() {
      // uncomment below and update the code to test the property friendUserId
      //var instane = new Quantimodo.Friend();
      //expect(instance).to.be();
    });

    it('should have the property isConfirmed (base name: "isConfirmed")', function() {
      // uncomment below and update the code to test the property isConfirmed
      //var instane = new Quantimodo.Friend();
      //expect(instance).to.be();
    });

    it('should have the property isLimited (base name: "isLimited")', function() {
      // uncomment below and update the code to test the property isLimited
      //var instane = new Quantimodo.Friend();
      //expect(instance).to.be();
    });

    it('should have the property dateCreated (base name: "dateCreated")', function() {
      // uncomment below and update the code to test the property dateCreated
      //var instane = new Quantimodo.Friend();
      //expect(instance).to.be();
    });

    it('should have the property metaDataArray (base name: "metaDataArray")', function() {
      // uncomment below and update the code to test the property metaDataArray
      //var instane = new Quantimodo.Friend();
      //expect(instance).to.be();
    });

  });

}));