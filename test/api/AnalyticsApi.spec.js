/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.7
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
    factory(root.expect, root.QMApi);
  }
}(this, function(expect, QMApi) {
  'use strict';

  var instance;

  beforeEach(function() {
    instance = new QMApi.AnalyticsApi();
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

  describe('AnalyticsApi', function() {
    describe('deleteVote', function() {
      it('should call deleteVote successfully', function(done) {
        //uncomment below and update the code to test deleteVote
        //instance.deleteVote(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('getAggregatedCorrelations', function() {
      it('should call getAggregatedCorrelations successfully', function(done) {
        //uncomment below and update the code to test getAggregatedCorrelations
        //instance.getAggregatedCorrelations(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('getCorrelations', function() {
      it('should call getCorrelations successfully', function(done) {
        //uncomment below and update the code to test getCorrelations
        //instance.getCorrelations(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('postAggregatedCorrelations', function() {
      it('should call postAggregatedCorrelations successfully', function(done) {
        //uncomment below and update the code to test postAggregatedCorrelations
        //instance.postAggregatedCorrelations(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('postVote', function() {
      it('should call postVote successfully', function(done) {
        //uncomment below and update the code to test postVote
        //instance.postVote(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
  });

}));
