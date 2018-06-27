/**
 * quantimodo
 * We make it easy to retrieve and analyze normalized user data from a wide array of devices and applications. Check out our [docs and sdk's](https://github.com/QuantiModo/docs) or [contact us](https://help.quantimo.do).
 *
 * OpenAPI spec version: 2.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
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
    factory(root.expect, root.quantimodo-api);
  }
}(this, function(expect, quantimodo-api) {
  'use strict';

  var instance;

  beforeEach(function() {
    instance = new quantimodo-api.MeasurementsApi();
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

  describe('MeasurementsApi', function() {
    describe('deleteMeasurement', function() {
      it('should call deleteMeasurement successfully', function(done) {
        //uncomment below and update the code to test deleteMeasurement
        //instance.deleteMeasurement(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('getMeasurements', function() {
      it('should call getMeasurements successfully', function(done) {
        //uncomment below and update the code to test getMeasurements
        //instance.getMeasurements(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('getPairs', function() {
      it('should call getPairs successfully', function(done) {
        //uncomment below and update the code to test getPairs
        //instance.getPairs(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('measurementExportRequest', function() {
      it('should call measurementExportRequest successfully', function(done) {
        //uncomment below and update the code to test measurementExportRequest
        //instance.measurementExportRequest(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('postMeasurements', function() {
      it('should call postMeasurements successfully', function(done) {
        //uncomment below and update the code to test postMeasurements
        //instance.postMeasurements(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('updateMeasurement', function() {
      it('should call updateMeasurement successfully', function(done) {
        //uncomment below and update the code to test updateMeasurement
        //instance.updateMeasurement(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
  });

}));
