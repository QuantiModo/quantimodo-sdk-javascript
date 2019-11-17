
    const expect = require('expect.js'), Quantimodo = require('../../src/index')
    'use strict';
    var instance;
    beforeEach(function(){
        instance = new Quantimodo.UnitsApi();
    });
    var getProperty = function(object, getter, property){
        // Use getter method if present; otherwise, get the property directly.
        if(typeof object[getter] === 'function')
            return object[getter]();
        else
            return object[property];
    }
    var setProperty = function(object, setter, property, value){
        // Use setter method if present; otherwise, set the property directly.
        if(typeof object[setter] === 'function')
            object[setter](value);
        else
            object[property] = value;
    }
    describe('UnitsApi', function(){
        describe('getUnitCategories', function(){
            it('should call getUnitCategories successfully', function(done){
                //uncomment below and update the code to test getUnitCategories
                //instance.getUnitCategories(function(error) {
                //  if (error) throw error;
                //expect().to.be();
                //});
                done();
            });
        });
        describe('getUnits', function(){
            it('should call getUnits successfully', function(done){
                //uncomment below and update the code to test getUnits
                instance.getUnits(function(error, data){
                    if(error) throw error;
                    expect(data).to.be.an('array');
                    expect(data).to.have.length(62);
                });
                done();
            });
        });
    });
