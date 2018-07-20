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
    instance = new Quantimodo.StudyImages();
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

  describe('StudyImages', function() {
    it('should create an instance of StudyImages', function() {
      // uncomment below and update the code to test StudyImages
      //var instane = new Quantimodo.StudyImages();
      //expect(instance).to.be.a(Quantimodo.StudyImages);
    });

    it('should have the property causeVariableImageUrl (base name: "causeVariableImageUrl")', function() {
      // uncomment below and update the code to test the property causeVariableImageUrl
      //var instane = new Quantimodo.StudyImages();
      //expect(instance).to.be();
    });

    it('should have the property causeVariableIonIcon (base name: "causeVariableIonIcon")', function() {
      // uncomment below and update the code to test the property causeVariableIonIcon
      //var instane = new Quantimodo.StudyImages();
      //expect(instance).to.be();
    });

    it('should have the property effectVariableImageUrl (base name: "effectVariableImageUrl")', function() {
      // uncomment below and update the code to test the property effectVariableImageUrl
      //var instane = new Quantimodo.StudyImages();
      //expect(instance).to.be();
    });

    it('should have the property effectVariableIonIcon (base name: "effectVariableIonIcon")', function() {
      // uncomment below and update the code to test the property effectVariableIonIcon
      //var instane = new Quantimodo.StudyImages();
      //expect(instance).to.be();
    });

    it('should have the property gaugeImage (base name: "gaugeImage")', function() {
      // uncomment below and update the code to test the property gaugeImage
      //var instane = new Quantimodo.StudyImages();
      //expect(instance).to.be();
    });

    it('should have the property gaugeImageSquare (base name: "gaugeImageSquare")', function() {
      // uncomment below and update the code to test the property gaugeImageSquare
      //var instane = new Quantimodo.StudyImages();
      //expect(instance).to.be();
    });

    it('should have the property gaugeSharingImageUrl (base name: "gaugeSharingImageUrl")', function() {
      // uncomment below and update the code to test the property gaugeSharingImageUrl
      //var instane = new Quantimodo.StudyImages();
      //expect(instance).to.be();
    });

    it('should have the property imageUrl (base name: "imageUrl")', function() {
      // uncomment below and update the code to test the property imageUrl
      //var instane = new Quantimodo.StudyImages();
      //expect(instance).to.be();
    });

    it('should have the property robotSharingImageUrl (base name: "robotSharingImageUrl")', function() {
      // uncomment below and update the code to test the property robotSharingImageUrl
      //var instane = new Quantimodo.StudyImages();
      //expect(instance).to.be();
    });

    it('should have the property avatar (base name: "avatar")', function() {
      // uncomment below and update the code to test the property avatar
      //var instane = new Quantimodo.StudyImages();
      //expect(instance).to.be();
    });

  });

}));
