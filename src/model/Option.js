/**
 * quantimodo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do).
 *
 * OpenAPI spec version: 5.8.728
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
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/Chart', 'model/Color', 'model/Credit', 'model/Lang', 'model/Legend', 'model/Loading', 'model/PlotOption', 'model/Title', 'model/XAxi', 'model/YAxi'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./Chart'), require('./Color'), require('./Credit'), require('./Lang'), require('./Legend'), require('./Loading'), require('./PlotOption'), require('./Title'), require('./XAxi'), require('./YAxi'));
  } else {
    // Browser globals (root is window)
    if (!root.Quantimodo) {
      root.Quantimodo = {};
    }
    root.Quantimodo.Option = factory(root.Quantimodo.ApiClient, root.Quantimodo.Chart, root.Quantimodo.Color, root.Quantimodo.Credit, root.Quantimodo.Lang, root.Quantimodo.Legend, root.Quantimodo.Loading, root.Quantimodo.PlotOption, root.Quantimodo.Title, root.Quantimodo.XAxi, root.Quantimodo.YAxi);
  }
}(this, function(ApiClient, Chart, Color, Credit, Lang, Legend, Loading, PlotOption, Title, XAxi, YAxi) {
  'use strict';




  /**
   * The Option model module.
   * @module model/Option
   * @version 5.8.810
   */

  /**
   * Constructs a new <code>Option</code>.
   * @alias module:model/Option
   * @class
   * @param chart {module:model/Chart} 
   * @param plotOptions {module:model/PlotOption} 
   * @param credits {module:model/Credit} 
   * @param yAxis {Array.<module:model/YAxi>} 
   * @param title {module:model/Title} 
   * @param xAxis {module:model/XAxi} 
   * @param lang {module:model/Lang} 
   * @param loading {module:model/Loading} 
   * @param legend {module:model/Legend} 
   * @param colors {Array.<module:model/Color>} 
   */
  var exports = function(chart, plotOptions, credits, yAxis, title, xAxis, lang, loading, legend, colors) {
    var _this = this;

    _this['chart'] = chart;
    _this['plotOptions'] = plotOptions;
    _this['credits'] = credits;
    _this['yAxis'] = yAxis;
    _this['title'] = title;
    _this['xAxis'] = xAxis;
    _this['lang'] = lang;
    _this['loading'] = loading;
    _this['legend'] = legend;
    _this['colors'] = colors;
  };

  /**
   * Constructs a <code>Option</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Option} obj Optional instance to populate.
   * @return {module:model/Option} The populated <code>Option</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('chart')) {
        obj['chart'] = Chart.constructFromObject(data['chart']);
      }
      if (data.hasOwnProperty('plotOptions')) {
        obj['plotOptions'] = PlotOption.constructFromObject(data['plotOptions']);
      }
      if (data.hasOwnProperty('credits')) {
        obj['credits'] = Credit.constructFromObject(data['credits']);
      }
      if (data.hasOwnProperty('yAxis')) {
        obj['yAxis'] = ApiClient.convertToType(data['yAxis'], [YAxi]);
      }
      if (data.hasOwnProperty('title')) {
        obj['title'] = Title.constructFromObject(data['title']);
      }
      if (data.hasOwnProperty('xAxis')) {
        obj['xAxis'] = XAxi.constructFromObject(data['xAxis']);
      }
      if (data.hasOwnProperty('lang')) {
        obj['lang'] = Lang.constructFromObject(data['lang']);
      }
      if (data.hasOwnProperty('loading')) {
        obj['loading'] = Loading.constructFromObject(data['loading']);
      }
      if (data.hasOwnProperty('legend')) {
        obj['legend'] = Legend.constructFromObject(data['legend']);
      }
      if (data.hasOwnProperty('colors')) {
        obj['colors'] = ApiClient.convertToType(data['colors'], [Color]);
      }
    }
    return obj;
  }

  /**
   * @member {module:model/Chart} chart
   */
  exports.prototype['chart'] = undefined;
  /**
   * @member {module:model/PlotOption} plotOptions
   */
  exports.prototype['plotOptions'] = undefined;
  /**
   * @member {module:model/Credit} credits
   */
  exports.prototype['credits'] = undefined;
  /**
   * @member {Array.<module:model/YAxi>} yAxis
   */
  exports.prototype['yAxis'] = undefined;
  /**
   * @member {module:model/Title} title
   */
  exports.prototype['title'] = undefined;
  /**
   * @member {module:model/XAxi} xAxis
   */
  exports.prototype['xAxis'] = undefined;
  /**
   * @member {module:model/Lang} lang
   */
  exports.prototype['lang'] = undefined;
  /**
   * @member {module:model/Loading} loading
   */
  exports.prototype['loading'] = undefined;
  /**
   * @member {module:model/Legend} legend
   */
  exports.prototype['legend'] = undefined;
  /**
   * @member {Array.<module:model/Color>} colors
   */
  exports.prototype['colors'] = undefined;



  return exports;
}));


