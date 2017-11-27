/**
 * quantimodo
 * We make it easy to retrieve and analyze normalized user data from a wide array of devices and applications. Check out our [docs and sdk's](https://github.com/QuantiModo/docs) or [contact us](https://help.quantimo.do).
 *
 * OpenAPI spec version: 5.8.112511
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
    define(['ApiClient', 'model/Button', 'model/Chart', 'model/CommonResponse', 'model/CommonVariable', 'model/CommonVariableArray', 'model/Connector', 'model/ConversionStep', 'model/Correlation', 'model/DataSource', 'model/Explanation', 'model/ExplanationStartTracking', 'model/GetConnectorsResponse', 'model/GetCorrelationsDataResponse', 'model/GetCorrelationsResponse', 'model/GetTrackingReminderNotificationsResponse', 'model/Image', 'model/JsonErrorResponse', 'model/Measurement', 'model/MeasurementArray', 'model/MeasurementDelete', 'model/MeasurementItem', 'model/MeasurementSet', 'model/MeasurementUpdate', 'model/Pair', 'model/PairArray', 'model/PairsOfAveragesForAllUser', 'model/ParticipantInstruction', 'model/PostCorrelation', 'model/PostMeasurementsDataResponse', 'model/PostMeasurementsResponse', 'model/PostStudyPublishResponse', 'model/PostTrackingRemindersDataResponse', 'model/PostTrackingRemindersResponse', 'model/PostUserSettingsDataResponse', 'model/PostUserSettingsResponse', 'model/ProcessedDailyMeasurement', 'model/Scope', 'model/Study', 'model/StudyHtml', 'model/StudyImages', 'model/StudyLinks', 'model/StudyText', 'model/TrackingReminder', 'model/TrackingReminderArray', 'model/TrackingReminderDelete', 'model/TrackingReminderNotification', 'model/TrackingReminderNotificationActionArray', 'model/TrackingReminderNotificationPost', 'model/TrackingReminderNotificationTrackAllAction', 'model/TrackingReminderNotificationsArray', 'model/Unit', 'model/UnitCategory', 'model/User', 'model/UserTag', 'model/UserVariable', 'model/UserVariableDelete', 'model/VariableCategory', 'model/Vote', 'model/VoteDelete', 'api/AnalyticsApi', 'api/AuthenticationApi', 'api/ConnectorsApi', 'api/MeasurementsApi', 'api/NotificationsApi', 'api/RemindersApi', 'api/StudyApi', 'api/UnitsApi', 'api/UserApi', 'api/VariablesApi'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('./ApiClient'), require('./model/Button'), require('./model/Chart'), require('./model/CommonResponse'), require('./model/CommonVariable'), require('./model/CommonVariableArray'), require('./model/Connector'), require('./model/ConversionStep'), require('./model/Correlation'), require('./model/DataSource'), require('./model/Explanation'), require('./model/ExplanationStartTracking'), require('./model/GetConnectorsResponse'), require('./model/GetCorrelationsDataResponse'), require('./model/GetCorrelationsResponse'), require('./model/GetTrackingReminderNotificationsResponse'), require('./model/Image'), require('./model/JsonErrorResponse'), require('./model/Measurement'), require('./model/MeasurementArray'), require('./model/MeasurementDelete'), require('./model/MeasurementItem'), require('./model/MeasurementSet'), require('./model/MeasurementUpdate'), require('./model/Pair'), require('./model/PairArray'), require('./model/PairsOfAveragesForAllUser'), require('./model/ParticipantInstruction'), require('./model/PostCorrelation'), require('./model/PostMeasurementsDataResponse'), require('./model/PostMeasurementsResponse'), require('./model/PostStudyPublishResponse'), require('./model/PostTrackingRemindersDataResponse'), require('./model/PostTrackingRemindersResponse'), require('./model/PostUserSettingsDataResponse'), require('./model/PostUserSettingsResponse'), require('./model/ProcessedDailyMeasurement'), require('./model/Scope'), require('./model/Study'), require('./model/StudyHtml'), require('./model/StudyImages'), require('./model/StudyLinks'), require('./model/StudyText'), require('./model/TrackingReminder'), require('./model/TrackingReminderArray'), require('./model/TrackingReminderDelete'), require('./model/TrackingReminderNotification'), require('./model/TrackingReminderNotificationActionArray'), require('./model/TrackingReminderNotificationPost'), require('./model/TrackingReminderNotificationTrackAllAction'), require('./model/TrackingReminderNotificationsArray'), require('./model/Unit'), require('./model/UnitCategory'), require('./model/User'), require('./model/UserTag'), require('./model/UserVariable'), require('./model/UserVariableDelete'), require('./model/VariableCategory'), require('./model/Vote'), require('./model/VoteDelete'), require('./api/AnalyticsApi'), require('./api/AuthenticationApi'), require('./api/ConnectorsApi'), require('./api/MeasurementsApi'), require('./api/NotificationsApi'), require('./api/RemindersApi'), require('./api/StudyApi'), require('./api/UnitsApi'), require('./api/UserApi'), require('./api/VariablesApi'));
  }
}(function(ApiClient, Button, Chart, CommonResponse, CommonVariable, CommonVariableArray, Connector, ConversionStep, Correlation, DataSource, Explanation, ExplanationStartTracking, GetConnectorsResponse, GetCorrelationsDataResponse, GetCorrelationsResponse, GetTrackingReminderNotificationsResponse, Image, JsonErrorResponse, Measurement, MeasurementArray, MeasurementDelete, MeasurementItem, MeasurementSet, MeasurementUpdate, Pair, PairArray, PairsOfAveragesForAllUser, ParticipantInstruction, PostCorrelation, PostMeasurementsDataResponse, PostMeasurementsResponse, PostStudyPublishResponse, PostTrackingRemindersDataResponse, PostTrackingRemindersResponse, PostUserSettingsDataResponse, PostUserSettingsResponse, ProcessedDailyMeasurement, Scope, Study, StudyHtml, StudyImages, StudyLinks, StudyText, TrackingReminder, TrackingReminderArray, TrackingReminderDelete, TrackingReminderNotification, TrackingReminderNotificationActionArray, TrackingReminderNotificationPost, TrackingReminderNotificationTrackAllAction, TrackingReminderNotificationsArray, Unit, UnitCategory, User, UserTag, UserVariable, UserVariableDelete, VariableCategory, Vote, VoteDelete, AnalyticsApi, AuthenticationApi, ConnectorsApi, MeasurementsApi, NotificationsApi, RemindersApi, StudyApi, UnitsApi, UserApi, VariablesApi) {
  'use strict';

  /**
   * We make it easy to retrieve and analyze normalized user data from a wide array of devices and applications. Check out our [docs and sdk&#39;s](https://github.com/QuantiModo/docs) or [contact us](https://help.quantimo.do)..<br>
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
   * @version 5.8.1126
   */
  var exports = {
    /**
     * The ApiClient constructor.
     * @property {module:ApiClient}
     */
    ApiClient: ApiClient,
    /**
     * The Button model constructor.
     * @property {module:model/Button}
     */
    Button: Button,
    /**
     * The Chart model constructor.
     * @property {module:model/Chart}
     */
    Chart: Chart,
    /**
     * The CommonResponse model constructor.
     * @property {module:model/CommonResponse}
     */
    CommonResponse: CommonResponse,
    /**
     * The CommonVariable model constructor.
     * @property {module:model/CommonVariable}
     */
    CommonVariable: CommonVariable,
    /**
     * The CommonVariableArray model constructor.
     * @property {module:model/CommonVariableArray}
     */
    CommonVariableArray: CommonVariableArray,
    /**
     * The Connector model constructor.
     * @property {module:model/Connector}
     */
    Connector: Connector,
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
     * The DataSource model constructor.
     * @property {module:model/DataSource}
     */
    DataSource: DataSource,
    /**
     * The Explanation model constructor.
     * @property {module:model/Explanation}
     */
    Explanation: Explanation,
    /**
     * The ExplanationStartTracking model constructor.
     * @property {module:model/ExplanationStartTracking}
     */
    ExplanationStartTracking: ExplanationStartTracking,
    /**
     * The GetConnectorsResponse model constructor.
     * @property {module:model/GetConnectorsResponse}
     */
    GetConnectorsResponse: GetConnectorsResponse,
    /**
     * The GetCorrelationsDataResponse model constructor.
     * @property {module:model/GetCorrelationsDataResponse}
     */
    GetCorrelationsDataResponse: GetCorrelationsDataResponse,
    /**
     * The GetCorrelationsResponse model constructor.
     * @property {module:model/GetCorrelationsResponse}
     */
    GetCorrelationsResponse: GetCorrelationsResponse,
    /**
     * The GetTrackingReminderNotificationsResponse model constructor.
     * @property {module:model/GetTrackingReminderNotificationsResponse}
     */
    GetTrackingReminderNotificationsResponse: GetTrackingReminderNotificationsResponse,
    /**
     * The Image model constructor.
     * @property {module:model/Image}
     */
    Image: Image,
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
     * The MeasurementArray model constructor.
     * @property {module:model/MeasurementArray}
     */
    MeasurementArray: MeasurementArray,
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
     * The Pair model constructor.
     * @property {module:model/Pair}
     */
    Pair: Pair,
    /**
     * The PairArray model constructor.
     * @property {module:model/PairArray}
     */
    PairArray: PairArray,
    /**
     * The PairsOfAveragesForAllUser model constructor.
     * @property {module:model/PairsOfAveragesForAllUser}
     */
    PairsOfAveragesForAllUser: PairsOfAveragesForAllUser,
    /**
     * The ParticipantInstruction model constructor.
     * @property {module:model/ParticipantInstruction}
     */
    ParticipantInstruction: ParticipantInstruction,
    /**
     * The PostCorrelation model constructor.
     * @property {module:model/PostCorrelation}
     */
    PostCorrelation: PostCorrelation,
    /**
     * The PostMeasurementsDataResponse model constructor.
     * @property {module:model/PostMeasurementsDataResponse}
     */
    PostMeasurementsDataResponse: PostMeasurementsDataResponse,
    /**
     * The PostMeasurementsResponse model constructor.
     * @property {module:model/PostMeasurementsResponse}
     */
    PostMeasurementsResponse: PostMeasurementsResponse,
    /**
     * The PostStudyPublishResponse model constructor.
     * @property {module:model/PostStudyPublishResponse}
     */
    PostStudyPublishResponse: PostStudyPublishResponse,
    /**
     * The PostTrackingRemindersDataResponse model constructor.
     * @property {module:model/PostTrackingRemindersDataResponse}
     */
    PostTrackingRemindersDataResponse: PostTrackingRemindersDataResponse,
    /**
     * The PostTrackingRemindersResponse model constructor.
     * @property {module:model/PostTrackingRemindersResponse}
     */
    PostTrackingRemindersResponse: PostTrackingRemindersResponse,
    /**
     * The PostUserSettingsDataResponse model constructor.
     * @property {module:model/PostUserSettingsDataResponse}
     */
    PostUserSettingsDataResponse: PostUserSettingsDataResponse,
    /**
     * The PostUserSettingsResponse model constructor.
     * @property {module:model/PostUserSettingsResponse}
     */
    PostUserSettingsResponse: PostUserSettingsResponse,
    /**
     * The ProcessedDailyMeasurement model constructor.
     * @property {module:model/ProcessedDailyMeasurement}
     */
    ProcessedDailyMeasurement: ProcessedDailyMeasurement,
    /**
     * The Scope model constructor.
     * @property {module:model/Scope}
     */
    Scope: Scope,
    /**
     * The Study model constructor.
     * @property {module:model/Study}
     */
    Study: Study,
    /**
     * The StudyHtml model constructor.
     * @property {module:model/StudyHtml}
     */
    StudyHtml: StudyHtml,
    /**
     * The StudyImages model constructor.
     * @property {module:model/StudyImages}
     */
    StudyImages: StudyImages,
    /**
     * The StudyLinks model constructor.
     * @property {module:model/StudyLinks}
     */
    StudyLinks: StudyLinks,
    /**
     * The StudyText model constructor.
     * @property {module:model/StudyText}
     */
    StudyText: StudyText,
    /**
     * The TrackingReminder model constructor.
     * @property {module:model/TrackingReminder}
     */
    TrackingReminder: TrackingReminder,
    /**
     * The TrackingReminderArray model constructor.
     * @property {module:model/TrackingReminderArray}
     */
    TrackingReminderArray: TrackingReminderArray,
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
     * The TrackingReminderNotificationActionArray model constructor.
     * @property {module:model/TrackingReminderNotificationActionArray}
     */
    TrackingReminderNotificationActionArray: TrackingReminderNotificationActionArray,
    /**
     * The TrackingReminderNotificationPost model constructor.
     * @property {module:model/TrackingReminderNotificationPost}
     */
    TrackingReminderNotificationPost: TrackingReminderNotificationPost,
    /**
     * The TrackingReminderNotificationTrackAllAction model constructor.
     * @property {module:model/TrackingReminderNotificationTrackAllAction}
     */
    TrackingReminderNotificationTrackAllAction: TrackingReminderNotificationTrackAllAction,
    /**
     * The TrackingReminderNotificationsArray model constructor.
     * @property {module:model/TrackingReminderNotificationsArray}
     */
    TrackingReminderNotificationsArray: TrackingReminderNotificationsArray,
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
     * The NotificationsApi service constructor.
     * @property {module:api/NotificationsApi}
     */
    NotificationsApi: NotificationsApi,
    /**
     * The RemindersApi service constructor.
     * @property {module:api/RemindersApi}
     */
    RemindersApi: RemindersApi,
    /**
     * The StudyApi service constructor.
     * @property {module:api/StudyApi}
     */
    StudyApi: StudyApi,
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
