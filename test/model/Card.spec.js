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
    instance = new Quantimodo.Card();
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

  describe('Card', function() {
    it('should create an instance of Card', function() {
      // uncomment below and update the code to test Card
      //var instane = new Quantimodo.Card();
      //expect(instance).to.be.a(Quantimodo.Card);
    });

    it('should have the property title (base name: "title")', function() {
      // uncomment below and update the code to test the property title
      //var instane = new Quantimodo.Card();
      //expect(instance).to.be();
    });

    it('should have the property subTitle (base name: "subTitle")', function() {
      // uncomment below and update the code to test the property subTitle
      //var instane = new Quantimodo.Card();
      //expect(instance).to.be();
    });

    it('should have the property content (base name: "content")', function() {
      // uncomment below and update the code to test the property content
      //var instane = new Quantimodo.Card();
      //expect(instance).to.be();
    });

    it('should have the property htmlContent (base name: "htmlContent")', function() {
      // uncomment below and update the code to test the property htmlContent
      //var instane = new Quantimodo.Card();
      //expect(instance).to.be();
    });

    it('should have the property buttons (base name: "buttons")', function() {
      // uncomment below and update the code to test the property buttons
      //var instane = new Quantimodo.Card();
      //expect(instance).to.be();
    });

    it('should have the property sharingButtons (base name: "sharingButtons")', function() {
      // uncomment below and update the code to test the property sharingButtons
      //var instane = new Quantimodo.Card();
      //expect(instance).to.be();
    });

    it('should have the property image (base name: "image")', function() {
      // uncomment below and update the code to test the property image
      //var instane = new Quantimodo.Card();
      //expect(instance).to.be();
    });

    it('should have the property avatar (base name: "avatar")', function() {
      // uncomment below and update the code to test the property avatar
      //var instane = new Quantimodo.Card();
      //expect(instance).to.be();
    });

    it('should have the property link (base name: "link")', function() {
      // uncomment below and update the code to test the property link
      //var instane = new Quantimodo.Card();
      //expect(instance).to.be();
    });

  });

}));