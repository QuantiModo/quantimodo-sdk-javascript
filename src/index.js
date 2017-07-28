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

(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/CommonResponse', 'model/Connector', 'model/ConnectorInstruction', 'model/ConversionStep', 'model/Correlation', 'model/InlineResponse200', 'model/InlineResponse2001', 'model/InlineResponse2002', 'model/JsonErrorResponse', 'model/Measurement', 'model/MeasurementDelete', 'model/MeasurementItem', 'model/MeasurementSet', 'model/MeasurementUpdate', 'model/Measurements', 'model/Pairs', 'model/PostCorrelation', 'model/TrackingReminder', 'model/TrackingReminderDelete', 'model/TrackingReminderNotification', 'model/TrackingReminderNotificationPost', 'model/Unit', 'model/UnitCategory', 'model/Update', 'model/User', 'model/UserTag', 'model/UserTokenFailedResponse', 'model/UserTokenRequest', 'model/UserTokenRequestInnerUserField', 'model/UserTokenSuccessfulResponse', 'model/UserTokenSuccessfulResponseInnerUserField', 'model/UserVariable', 'model/UserVariableDelete', 'model/UserVariables', 'model/Variable', 'model/VariableCategory', 'model/Vote', 'model/VoteDelete', 'api/AnalyticsApi', 'api/AuthenticationApi', 'api/ConnectorsApi', 'api/MeasurementsApi', 'api/RemindersApi', 'api/UnitsApi', 'api/UserApi', 'api/VariablesApi'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('./ApiClient'), require('./model/CommonResponse'), require('./model/Connector'), require('./model/ConnectorInstruction'), require('./model/ConversionStep'), require('./model/Correlation'), require('./model/InlineResponse200'), require('./model/InlineResponse2001'), require('./model/InlineResponse2002'), require('./model/JsonErrorResponse'), require('./model/Measurement'), require('./model/MeasurementDelete'), require('./model/MeasurementItem'), require('./model/MeasurementSet'), require('./model/MeasurementUpdate'), require('./model/Measurements'), require('./model/Pairs'), require('./model/PostCorrelation'), require('./model/TrackingReminder'), require('./model/TrackingReminderDelete'), require('./model/TrackingReminderNotification'), require('./model/TrackingReminderNotificationPost'), require('./model/Unit'), require('./model/UnitCategory'), require('./model/Update'), require('./model/User'), require('./model/UserTag'), require('./model/UserTokenFailedResponse'), require('./model/UserTokenRequest'), require('./model/UserTokenRequestInnerUserField'), require('./model/UserTokenSuccessfulResponse'), require('./model/UserTokenSuccessfulResponseInnerUserField'), require('./model/UserVariable'), require('./model/UserVariableDelete'), require('./model/UserVariables'), require('./model/Variable'), require('./model/VariableCategory'), require('./model/Vote'), require('./model/VoteDelete'), require('./api/AnalyticsApi'), require('./api/AuthenticationApi'), require('./api/ConnectorsApi'), require('./api/MeasurementsApi'), require('./api/RemindersApi'), require('./api/UnitsApi'), require('./api/UserApi'), require('./api/VariablesApi'));
  }
}(function(ApiClient, CommonResponse, Connector, ConnectorInstruction, ConversionStep, Correlation, InlineResponse200, InlineResponse2001, InlineResponse2002, JsonErrorResponse, Measurement, MeasurementDelete, MeasurementItem, MeasurementSet, MeasurementUpdate, Measurements, Pairs, PostCorrelation, TrackingReminder, TrackingReminderDelete, TrackingReminderNotification, TrackingReminderNotificationPost, Unit, UnitCategory, Update, User, UserTag, UserTokenFailedResponse, UserTokenRequest, UserTokenRequestInnerUserField, UserTokenSuccessfulResponse, UserTokenSuccessfulResponseInnerUserField, UserVariable, UserVariableDelete, UserVariables, Variable, VariableCategory, Vote, VoteDelete, AnalyticsApi, AuthenticationApi, ConnectorsApi, MeasurementsApi, RemindersApi, UnitsApi, UserApi, VariablesApi) {
  'use strict';

  /**
   * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do)..<br>
   * The <code>index</code> module provides access to constructors for all the classes which comprise the public API.
   * <p>
   * An AMD (recommended!) or CommonJS application will generally do something equivalent to the following:
   * <pre>
   * var Quantimodo = require('index'); // See note below*.
   * var xxxSvc = new Quantimodo.XxxApi(); // Allocate the API class we're going to use.
   * var yyyModel = new Quantimodo.Yyy(); // Construct a model instance.
   * yyyModel.someProperty = 'someValue';
   * ...
   * var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
   * ...
   * </pre>
   * <em>*NOTE: For a top-level AMD script, use require(['index'], function(){...})
   * and put the application logic within the callback function.</em>
   * </p>
   * <p>
   * A non-AMD browser application (discouraged) might do something like this:
   * <pre>
   * var xxxSvc = new Quantimodo.XxxApi(); // Allocate the API class we're going to use.
   * var yyy = new Quantimodo.Yyy(); // Construct a model instance.
   * yyyModel.someProperty = 'someValue';
   * ...
   * var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
   * ...
   * </pre>
   * </p>
   * @module index
   * @version 5.8.728
   */
  var exports = {
    /**
     * The ApiClient constructor.
     * @property {module:ApiClient}
     */
    ApiClient: ApiClient,
    /**
     * The CommonResponse model constructor.
     * @property {module:model/CommonResponse}
     */
    CommonResponse: CommonResponse,
    /**
     * The Connector model constructor.
     * @property {module:model/Connector}
     */
    Connector: Connector,
    /**
     * The ConnectorInstruction model constructor.
     * @property {module:model/ConnectorInstruction}
     */
    ConnectorInstruction: ConnectorInstruction,
    /**
     * The ConversionStep model constructor.
     * @property {module:model/ConversionStep}
     */
    ConversionStep: ConversionStep,
    /**
     * The Correlation model constructor.
     * @property {module:model/Correlation}
     */
    Correlation: Correlation,
    /**
     * The InlineResponse200 model constructor.
     * @property {module:model/InlineResponse200}
     */
    InlineResponse200: InlineResponse200,
    /**
     * The InlineResponse2001 model constructor.
     * @property {module:model/InlineResponse2001}
     */
    InlineResponse2001: InlineResponse2001,
    /**
     * The InlineResponse2002 model constructor.
     * @property {module:model/InlineResponse2002}
     */
    InlineResponse2002: InlineResponse2002,
    /**
     * The JsonErrorResponse model constructor.
     * @property {module:model/JsonErrorResponse}
     */
    JsonErrorResponse: JsonErrorResponse,
    /**
     * The Measurement model constructor.
     * @property {module:model/Measurement}
     */
    Measurement: Measurement,
    /**
     * The MeasurementDelete model constructor.
     * @property {module:model/MeasurementDelete}
     */
    MeasurementDelete: MeasurementDelete,
    /**
     * The MeasurementItem model constructor.
     * @property {module:model/MeasurementItem}
     */
    MeasurementItem: MeasurementItem,
    /**
     * The MeasurementSet model constructor.
     * @property {module:model/MeasurementSet}
     */
    MeasurementSet: MeasurementSet,
    /**
     * The MeasurementUpdate model constructor.
     * @property {module:model/MeasurementUpdate}
     */
    MeasurementUpdate: MeasurementUpdate,
    /**
     * The Measurements model constructor.
     * @property {module:model/Measurements}
     */
    Measurements: Measurements,
    /**
     * The Pairs model constructor.
     * @property {module:model/Pairs}
     */
    Pairs: Pairs,
    /**
     * The PostCorrelation model constructor.
     * @property {module:model/PostCorrelation}
     */
    PostCorrelation: PostCorrelation,
    /**
     * The TrackingReminder model constructor.
     * @property {module:model/TrackingReminder}
     */
    TrackingReminder: TrackingReminder,
    /**
     * The TrackingReminderDelete model constructor.
     * @property {module:model/TrackingReminderDelete}
     */
    TrackingReminderDelete: TrackingReminderDelete,
    /**
     * The TrackingReminderNotification model constructor.
     * @property {module:model/TrackingReminderNotification}
     */
    TrackingReminderNotification: TrackingReminderNotification,
    /**
     * The TrackingReminderNotificationPost model constructor.
     * @property {module:model/TrackingReminderNotificationPost}
     */
    TrackingReminderNotificationPost: TrackingReminderNotificationPost,
    /**
     * The Unit model constructor.
     * @property {module:model/Unit}
     */
    Unit: Unit,
    /**
     * The UnitCategory model constructor.
     * @property {module:model/UnitCategory}
     */
    UnitCategory: UnitCategory,
    /**
     * The Update model constructor.
     * @property {module:model/Update}
     */
    Update: Update,
    /**
     * The User model constructor.
     * @property {module:model/User}
     */
    User: User,
    /**
     * The UserTag model constructor.
     * @property {module:model/UserTag}
     */
    UserTag: UserTag,
    /**
     * The UserTokenFailedResponse model constructor.
     * @property {module:model/UserTokenFailedResponse}
     */
    UserTokenFailedResponse: UserTokenFailedResponse,
    /**
     * The UserTokenRequest model constructor.
     * @property {module:model/UserTokenRequest}
     */
    UserTokenRequest: UserTokenRequest,
    /**
     * The UserTokenRequestInnerUserField model constructor.
     * @property {module:model/UserTokenRequestInnerUserField}
     */
    UserTokenRequestInnerUserField: UserTokenRequestInnerUserField,
    /**
     * The UserTokenSuccessfulResponse model constructor.
     * @property {module:model/UserTokenSuccessfulResponse}
     */
    UserTokenSuccessfulResponse: UserTokenSuccessfulResponse,
    /**
     * The UserTokenSuccessfulResponseInnerUserField model constructor.
     * @property {module:model/UserTokenSuccessfulResponseInnerUserField}
     */
    UserTokenSuccessfulResponseInnerUserField: UserTokenSuccessfulResponseInnerUserField,
    /**
     * The UserVariable model constructor.
     * @property {module:model/UserVariable}
     */
    UserVariable: UserVariable,
    /**
     * The UserVariableDelete model constructor.
     * @property {module:model/UserVariableDelete}
     */
    UserVariableDelete: UserVariableDelete,
    /**
     * The UserVariables model constructor.
     * @property {module:model/UserVariables}
     */
    UserVariables: UserVariables,
    /**
     * The Variable model constructor.
     * @property {module:model/Variable}
     */
    Variable: Variable,
    /**
     * The VariableCategory model constructor.
     * @property {module:model/VariableCategory}
     */
    VariableCategory: VariableCategory,
    /**
     * The Vote model constructor.
     * @property {module:model/Vote}
     */
    Vote: Vote,
    /**
     * The VoteDelete model constructor.
     * @property {module:model/VoteDelete}
     */
    VoteDelete: VoteDelete,
    /**
     * The AnalyticsApi service constructor.
     * @property {module:api/AnalyticsApi}
     */
    AnalyticsApi: AnalyticsApi,
    /**
     * The AuthenticationApi service constructor.
     * @property {module:api/AuthenticationApi}
     */
    AuthenticationApi: AuthenticationApi,
    /**
     * The ConnectorsApi service constructor.
     * @property {module:api/ConnectorsApi}
     */
    ConnectorsApi: ConnectorsApi,
    /**
     * The MeasurementsApi service constructor.
     * @property {module:api/MeasurementsApi}
     */
    MeasurementsApi: MeasurementsApi,
    /**
     * The RemindersApi service constructor.
     * @property {module:api/RemindersApi}
     */
    RemindersApi: RemindersApi,
    /**
     * The UnitsApi service constructor.
     * @property {module:api/UnitsApi}
     */
    UnitsApi: UnitsApi,
    /**
     * The UserApi service constructor.
     * @property {module:api/UserApi}
     */
    UserApi: UserApi,
    /**
     * The VariablesApi service constructor.
     * @property {module:api/VariablesApi}
     */
    VariablesApi: VariablesApi
  };

  return exports;
}));
