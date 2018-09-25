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
    instance = new Quantimodo.Notification();
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

  describe('Notification', function() {
    it('should create an instance of Notification', function() {
      // uncomment below and update the code to test Notification
      //var instane = new Quantimodo.Notification();
      //expect(instance).to.be.a(Quantimodo.Notification);
    });

    it('should have the property id (base name: "id")', function() {
      // uncomment below and update the code to test the property id
      //var instane = new Quantimodo.Notification();
      //expect(instance).to.be();
    });

    it('should have the property userId (base name: "userId")', function() {
      // uncomment below and update the code to test the property userId
      //var instane = new Quantimodo.Notification();
      //expect(instance).to.be();
    });

    it('should have the property itemId (base name: "itemId")', function() {
      // uncomment below and update the code to test the property itemId
      //var instane = new Quantimodo.Notification();
      //expect(instance).to.be();
    });

    it('should have the property secondaryItemId (base name: "secondaryItemId")', function() {
      // uncomment below and update the code to test the property secondaryItemId
      //var instane = new Quantimodo.Notification();
      //expect(instance).to.be();
    });

    it('should have the property componentName (base name: "componentName")', function() {
      // uncomment below and update the code to test the property componentName
      //var instane = new Quantimodo.Notification();
      //expect(instance).to.be();
    });

    it('should have the property componentAction (base name: "componentAction")', function() {
      // uncomment below and update the code to test the property componentAction
      //var instane = new Quantimodo.Notification();
      //expect(instance).to.be();
    });

    it('should have the property dateNotified (base name: "dateNotified")', function() {
      // uncomment below and update the code to test the property dateNotified
      //var instane = new Quantimodo.Notification();
      //expect(instance).to.be();
    });

    it('should have the property isNew (base name: "isNew")', function() {
      // uncomment below and update the code to test the property isNew
      //var instane = new Quantimodo.Notification();
      //expect(instance).to.be();
    });

    it('should have the property metaDataArray (base name: "metaDataArray")', function() {
      // uncomment below and update the code to test the property metaDataArray
      //var instane = new Quantimodo.Notification();
      //expect(instance).to.be();
    });

  });

}));
