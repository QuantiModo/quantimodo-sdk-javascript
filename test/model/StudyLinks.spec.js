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
    instance = new Quantimodo.StudyLinks();
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

  describe('StudyLinks', function() {
    it('should create an instance of StudyLinks', function() {
      // uncomment below and update the code to test StudyLinks
      //var instane = new Quantimodo.StudyLinks();
      //expect(instance).to.be.a(Quantimodo.StudyLinks);
    });

    it('should have the property studyJoinLink (base name: "studyJoinLink")', function() {
      // uncomment below and update the code to test the property studyJoinLink
      //var instane = new Quantimodo.StudyLinks();
      //expect(instance).to.be();
    });

    it('should have the property studyLinkEmail (base name: "studyLinkEmail")', function() {
      // uncomment below and update the code to test the property studyLinkEmail
      //var instane = new Quantimodo.StudyLinks();
      //expect(instance).to.be();
    });

    it('should have the property studyLinkFacebook (base name: "studyLinkFacebook")', function() {
      // uncomment below and update the code to test the property studyLinkFacebook
      //var instane = new Quantimodo.StudyLinks();
      //expect(instance).to.be();
    });

    it('should have the property studyLinkGoogle (base name: "studyLinkGoogle")', function() {
      // uncomment below and update the code to test the property studyLinkGoogle
      //var instane = new Quantimodo.StudyLinks();
      //expect(instance).to.be();
    });

    it('should have the property studyLinkStatic (base name: "studyLinkStatic")', function() {
      // uncomment below and update the code to test the property studyLinkStatic
      //var instane = new Quantimodo.StudyLinks();
      //expect(instance).to.be();
    });

    it('should have the property studyLinkDynamic (base name: "studyLinkDynamic")', function() {
      // uncomment below and update the code to test the property studyLinkDynamic
      //var instane = new Quantimodo.StudyLinks();
      //expect(instance).to.be();
    });

    it('should have the property studyLinkTwitter (base name: "studyLinkTwitter")', function() {
      // uncomment below and update the code to test the property studyLinkTwitter
      //var instane = new Quantimodo.StudyLinks();
      //expect(instance).to.be();
    });

  });

}));
