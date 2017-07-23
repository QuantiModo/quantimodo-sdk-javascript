/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
    factory(root.expect, root.QuantimodoApi);
  }
}(this, function(expect, QuantimodoApi) {
  'use strict';

  var instance;

  beforeEach(function() {
    instance = new QuantimodoApi.VariablesApi();
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

  describe('VariablesApi', function() {
    describe('v1PublicVariablesGet', function() {
      it('should call v1PublicVariablesGet successfully', function(done) {
        //uncomment below and update the code to test v1PublicVariablesGet
        //instance.v1PublicVariablesGet(pet, function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('v1PublicVariablesSearchSearchGet', function() {
      it('should call v1PublicVariablesSearchSearchGet successfully', function(done) {
        //uncomment below and update the code to test v1PublicVariablesSearchSearchGet
        //instance.v1PublicVariablesSearchSearchGet(pet, function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('v1UserVariablesDeletePost', function() {
      it('should call v1UserVariablesDeletePost successfully', function(done) {
        //uncomment below and update the code to test v1UserVariablesDeletePost
        //instance.v1UserVariablesDeletePost(pet, function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('v1UserVariablesPost', function() {
      it('should call v1UserVariablesPost successfully', function(done) {
        //uncomment below and update the code to test v1UserVariablesPost
        //instance.v1UserVariablesPost(pet, function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('v1UserVariablesResetPost', function() {
      it('should call v1UserVariablesResetPost successfully', function(done) {
        //uncomment below and update the code to test v1UserVariablesResetPost
        //instance.v1UserVariablesResetPost(pet, function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('v1VariableCategoriesGet', function() {
      it('should call v1VariableCategoriesGet successfully', function(done) {
        //uncomment below and update the code to test v1VariableCategoriesGet
        //instance.v1VariableCategoriesGet(pet, function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('v1VariablesGet', function() {
      it('should call v1VariablesGet successfully', function(done) {
        //uncomment below and update the code to test v1VariablesGet
        //instance.v1VariablesGet(pet, function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('v1VariablesPost', function() {
      it('should call v1VariablesPost successfully', function(done) {
        //uncomment below and update the code to test v1VariablesPost
        //instance.v1VariablesPost(pet, function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('v1VariablesSearchSearchGet', function() {
      it('should call v1VariablesSearchSearchGet successfully', function(done) {
        //uncomment below and update the code to test v1VariablesSearchSearchGet
        //instance.v1VariablesSearchSearchGet(pet, function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('v1VariablesVariableNameGet', function() {
      it('should call v1VariablesVariableNameGet successfully', function(done) {
        //uncomment below and update the code to test v1VariablesVariableNameGet
        //instance.v1VariablesVariableNameGet(pet, function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
  });

}));
