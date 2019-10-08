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
    instance = new Quantimodo.ConnectorsApi();
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

  describe('ConnectorsApi', function() {
    describe('connectConnector', function() {
      it('should call connectConnector successfully', function(done) {
        //uncomment below and update the code to test connectConnector
        //instance.connectConnector(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('disconnectConnector', function() {
      it('should call disconnectConnector successfully', function(done) {
        //uncomment below and update the code to test disconnectConnector
        //instance.disconnectConnector(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('getConnectors', function() {
      it('should call getConnectors successfully', function(done) {
        //uncomment below and update the code to test getConnectors
        //instance.getConnectors(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('getIntegrationJs', function() {
      it('should call getIntegrationJs successfully', function(done) {
        //uncomment below and update the code to test getIntegrationJs
        //instance.getIntegrationJs(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('getMobileConnectPage', function() {
      it('should call getMobileConnectPage successfully', function(done) {
        //uncomment below and update the code to test getMobileConnectPage
        //instance.getMobileConnectPage(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('updateConnector', function() {
      it('should call updateConnector successfully', function(done) {
        //uncomment below and update the code to test updateConnector
        //instance.updateConnector(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
  });

}));
