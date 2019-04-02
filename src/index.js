/**
 * quantimodo
 * We make it easy to retrieve and analyze normalized user data from a wide array of devices and applications. Check out our [docs and sdk's](https://github.com/QuantiModo/docs) or [contact us](https://help.quantimo.do).
 *
 * OpenAPI spec version: 5.8.112511
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.4.4
 *
 * Do not edit the class manually.
 *
 */

(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/ActivitiesResponse', 'model/Activity', 'model/AppSettings', 'model/AppSettingsResponse', 'model/AuthorizedClients', 'model/Button', 'model/Card', 'model/Chart', 'model/CommonResponse', 'model/ConnectInstructions', 'model/ConversionStep', 'model/Correlation', 'model/DataSource', 'model/DeviceToken', 'model/Explanation', 'model/ExplanationStartTracking', 'model/FeedResponse', 'model/Friend', 'model/FriendsResponse', 'model/GetConnectorsResponse', 'model/GetCorrelationsDataResponse', 'model/GetCorrelationsResponse', 'model/GetSharesResponse', 'model/GetStudiesResponse', 'model/GetTrackingReminderNotificationsResponse', 'model/Group', 'model/GroupsMember', 'model/GroupsMembersResponse', 'model/GroupsResponse', 'model/Image', 'model/InputField', 'model/JsonErrorResponse', 'model/Measurement', 'model/MeasurementDelete', 'model/MeasurementItem', 'model/MeasurementSet', 'model/MeasurementUpdate', 'model/MessagesMessage', 'model/MessagesMessagesResponse', 'model/MessagesNotice', 'model/MessagesNoticesResponse', 'model/MessagesRecipient', 'model/MessagesRecipientsResponse', 'model/Notification', 'model/NotificationsResponse', 'model/Pair', 'model/ParticipantInstruction', 'model/PostMeasurementsDataResponse', 'model/PostMeasurementsResponse', 'model/PostStudyCreateResponse', 'model/PostStudyPublishResponse', 'model/PostTrackingRemindersDataResponse', 'model/PostTrackingRemindersResponse', 'model/PostUserSettingsDataResponse', 'model/PostUserSettingsResponse', 'model/ShareInvitationBody', 'model/Study', 'model/StudyCharts', 'model/StudyCreationBody', 'model/StudyHtml', 'model/StudyImages', 'model/StudyJoinResponse', 'model/StudyLinks', 'model/StudySharing', 'model/StudyText', 'model/StudyVotes', 'model/TrackingReminder', 'model/TrackingReminderDelete', 'model/TrackingReminderNotification', 'model/TrackingReminderNotificationAction', 'model/TrackingReminderNotificationPost', 'model/TrackingReminderNotificationTrackAllAction', 'model/Unit', 'model/UnitCategory', 'model/User', 'model/UserBlog', 'model/UserBlogsResponse', 'model/UserTag', 'model/UserVariableDelete', 'model/UsersResponse', 'model/Variable', 'model/VariableCategory', 'model/VariableCharts', 'model/Vote', 'model/VoteDelete', 'model/XprofileDataResponse', 'model/XprofileDatum', 'model/XprofileField', 'model/XprofileFieldsResponse', 'model/XprofileGroup', 'model/XprofileGroupsResponse', 'api/ActivitiesApi', 'api/AnalyticsApi', 'api/AppSettingsApi', 'api/AuthenticationApi', 'api/ConnectorsApi', 'api/FeedApi', 'api/FriendsApi', 'api/GroupsApi', 'api/MeasurementsApi', 'api/MessagesApi', 'api/NotificationsApi', 'api/RemindersApi', 'api/SharesApi', 'api/StudiesApi', 'api/UnitsApi', 'api/UserApi', 'api/VariablesApi', 'api/XprofileApi'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('./ApiClient'), require('./model/ActivitiesResponse'), require('./model/Activity'), require('./model/AppSettings'), require('./model/AppSettingsResponse'), require('./model/AuthorizedClients'), require('./model/Button'), require('./model/Card'), require('./model/Chart'), require('./model/CommonResponse'), require('./model/ConnectInstructions'), require('./model/ConversionStep'), require('./model/Correlation'), require('./model/DataSource'), require('./model/DeviceToken'), require('./model/Explanation'), require('./model/ExplanationStartTracking'), require('./model/FeedResponse'), require('./model/Friend'), require('./model/FriendsResponse'), require('./model/GetConnectorsResponse'), require('./model/GetCorrelationsDataResponse'), require('./model/GetCorrelationsResponse'), require('./model/GetSharesResponse'), require('./model/GetStudiesResponse'), require('./model/GetTrackingReminderNotificationsResponse'), require('./model/Group'), require('./model/GroupsMember'), require('./model/GroupsMembersResponse'), require('./model/GroupsResponse'), require('./model/Image'), require('./model/InputField'), require('./model/JsonErrorResponse'), require('./model/Measurement'), require('./model/MeasurementDelete'), require('./model/MeasurementItem'), require('./model/MeasurementSet'), require('./model/MeasurementUpdate'), require('./model/MessagesMessage'), require('./model/MessagesMessagesResponse'), require('./model/MessagesNotice'), require('./model/MessagesNoticesResponse'), require('./model/MessagesRecipient'), require('./model/MessagesRecipientsResponse'), require('./model/Notification'), require('./model/NotificationsResponse'), require('./model/Pair'), require('./model/ParticipantInstruction'), require('./model/PostMeasurementsDataResponse'), require('./model/PostMeasurementsResponse'), require('./model/PostStudyCreateResponse'), require('./model/PostStudyPublishResponse'), require('./model/PostTrackingRemindersDataResponse'), require('./model/PostTrackingRemindersResponse'), require('./model/PostUserSettingsDataResponse'), require('./model/PostUserSettingsResponse'), require('./model/ShareInvitationBody'), require('./model/Study'), require('./model/StudyCharts'), require('./model/StudyCreationBody'), require('./model/StudyHtml'), require('./model/StudyImages'), require('./model/StudyJoinResponse'), require('./model/StudyLinks'), require('./model/StudySharing'), require('./model/StudyText'), require('./model/StudyVotes'), require('./model/TrackingReminder'), require('./model/TrackingReminderDelete'), require('./model/TrackingReminderNotification'), require('./model/TrackingReminderNotificationAction'), require('./model/TrackingReminderNotificationPost'), require('./model/TrackingReminderNotificationTrackAllAction'), require('./model/Unit'), require('./model/UnitCategory'), require('./model/User'), require('./model/UserBlog'), require('./model/UserBlogsResponse'), require('./model/UserTag'), require('./model/UserVariableDelete'), require('./model/UsersResponse'), require('./model/Variable'), require('./model/VariableCategory'), require('./model/VariableCharts'), require('./model/Vote'), require('./model/VoteDelete'), require('./model/XprofileDataResponse'), require('./model/XprofileDatum'), require('./model/XprofileField'), require('./model/XprofileFieldsResponse'), require('./model/XprofileGroup'), require('./model/XprofileGroupsResponse'), require('./api/ActivitiesApi'), require('./api/AnalyticsApi'), require('./api/AppSettingsApi'), require('./api/AuthenticationApi'), require('./api/ConnectorsApi'), require('./api/FeedApi'), require('./api/FriendsApi'), require('./api/GroupsApi'), require('./api/MeasurementsApi'), require('./api/MessagesApi'), require('./api/NotificationsApi'), require('./api/RemindersApi'), require('./api/SharesApi'), require('./api/StudiesApi'), require('./api/UnitsApi'), require('./api/UserApi'), require('./api/VariablesApi'), require('./api/XprofileApi'));
  }
}(function(ApiClient, ActivitiesResponse, Activity, AppSettings, AppSettingsResponse, AuthorizedClients, Button, Card, Chart, CommonResponse, ConnectInstructions, ConversionStep, Correlation, DataSource, DeviceToken, Explanation, ExplanationStartTracking, FeedResponse, Friend, FriendsResponse, GetConnectorsResponse, GetCorrelationsDataResponse, GetCorrelationsResponse, GetSharesResponse, GetStudiesResponse, GetTrackingReminderNotificationsResponse, Group, GroupsMember, GroupsMembersResponse, GroupsResponse, Image, InputField, JsonErrorResponse, Measurement, MeasurementDelete, MeasurementItem, MeasurementSet, MeasurementUpdate, MessagesMessage, MessagesMessagesResponse, MessagesNotice, MessagesNoticesResponse, MessagesRecipient, MessagesRecipientsResponse, Notification, NotificationsResponse, Pair, ParticipantInstruction, PostMeasurementsDataResponse, PostMeasurementsResponse, PostStudyCreateResponse, PostStudyPublishResponse, PostTrackingRemindersDataResponse, PostTrackingRemindersResponse, PostUserSettingsDataResponse, PostUserSettingsResponse, ShareInvitationBody, Study, StudyCharts, StudyCreationBody, StudyHtml, StudyImages, StudyJoinResponse, StudyLinks, StudySharing, StudyText, StudyVotes, TrackingReminder, TrackingReminderDelete, TrackingReminderNotification, TrackingReminderNotificationAction, TrackingReminderNotificationPost, TrackingReminderNotificationTrackAllAction, Unit, UnitCategory, User, UserBlog, UserBlogsResponse, UserTag, UserVariableDelete, UsersResponse, Variable, VariableCategory, VariableCharts, Vote, VoteDelete, XprofileDataResponse, XprofileDatum, XprofileField, XprofileFieldsResponse, XprofileGroup, XprofileGroupsResponse, ActivitiesApi, AnalyticsApi, AppSettingsApi, AuthenticationApi, ConnectorsApi, FeedApi, FriendsApi, GroupsApi, MeasurementsApi, MessagesApi, NotificationsApi, RemindersApi, SharesApi, StudiesApi, UnitsApi, UserApi, VariablesApi, XprofileApi) {
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
   * @version 5.8.112511
   */
  var exports = {
    /**
     * The ApiClient constructor.
     * @property {module:ApiClient}
     */
    ApiClient: ApiClient,
    /**
     * The ActivitiesResponse model constructor.
     * @property {module:model/ActivitiesResponse}
     */
    ActivitiesResponse: ActivitiesResponse,
    /**
     * The Activity model constructor.
     * @property {module:model/Activity}
     */
    Activity: Activity,
    /**
     * The AppSettings model constructor.
     * @property {module:model/AppSettings}
     */
    AppSettings: AppSettings,
    /**
     * The AppSettingsResponse model constructor.
     * @property {module:model/AppSettingsResponse}
     */
    AppSettingsResponse: AppSettingsResponse,
    /**
     * The AuthorizedClients model constructor.
     * @property {module:model/AuthorizedClients}
     */
    AuthorizedClients: AuthorizedClients,
    /**
     * The Button model constructor.
     * @property {module:model/Button}
     */
    Button: Button,
    /**
     * The Card model constructor.
     * @property {module:model/Card}
     */
    Card: Card,
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
     * The ConnectInstructions model constructor.
     * @property {module:model/ConnectInstructions}
     */
    ConnectInstructions: ConnectInstructions,
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
     * The DeviceToken model constructor.
     * @property {module:model/DeviceToken}
     */
    DeviceToken: DeviceToken,
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
     * The FeedResponse model constructor.
     * @property {module:model/FeedResponse}
     */
    FeedResponse: FeedResponse,
    /**
     * The Friend model constructor.
     * @property {module:model/Friend}
     */
    Friend: Friend,
    /**
     * The FriendsResponse model constructor.
     * @property {module:model/FriendsResponse}
     */
    FriendsResponse: FriendsResponse,
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
     * The GetSharesResponse model constructor.
     * @property {module:model/GetSharesResponse}
     */
    GetSharesResponse: GetSharesResponse,
    /**
     * The GetStudiesResponse model constructor.
     * @property {module:model/GetStudiesResponse}
     */
    GetStudiesResponse: GetStudiesResponse,
    /**
     * The GetTrackingReminderNotificationsResponse model constructor.
     * @property {module:model/GetTrackingReminderNotificationsResponse}
     */
    GetTrackingReminderNotificationsResponse: GetTrackingReminderNotificationsResponse,
    /**
     * The Group model constructor.
     * @property {module:model/Group}
     */
    Group: Group,
    /**
     * The GroupsMember model constructor.
     * @property {module:model/GroupsMember}
     */
    GroupsMember: GroupsMember,
    /**
     * The GroupsMembersResponse model constructor.
     * @property {module:model/GroupsMembersResponse}
     */
    GroupsMembersResponse: GroupsMembersResponse,
    /**
     * The GroupsResponse model constructor.
     * @property {module:model/GroupsResponse}
     */
    GroupsResponse: GroupsResponse,
    /**
     * The Image model constructor.
     * @property {module:model/Image}
     */
    Image: Image,
    /**
     * The InputField model constructor.
     * @property {module:model/InputField}
     */
    InputField: InputField,
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
     * The MessagesMessage model constructor.
     * @property {module:model/MessagesMessage}
     */
    MessagesMessage: MessagesMessage,
    /**
     * The MessagesMessagesResponse model constructor.
     * @property {module:model/MessagesMessagesResponse}
     */
    MessagesMessagesResponse: MessagesMessagesResponse,
    /**
     * The MessagesNotice model constructor.
     * @property {module:model/MessagesNotice}
     */
    MessagesNotice: MessagesNotice,
    /**
     * The MessagesNoticesResponse model constructor.
     * @property {module:model/MessagesNoticesResponse}
     */
    MessagesNoticesResponse: MessagesNoticesResponse,
    /**
     * The MessagesRecipient model constructor.
     * @property {module:model/MessagesRecipient}
     */
    MessagesRecipient: MessagesRecipient,
    /**
     * The MessagesRecipientsResponse model constructor.
     * @property {module:model/MessagesRecipientsResponse}
     */
    MessagesRecipientsResponse: MessagesRecipientsResponse,
    /**
     * The Notification model constructor.
     * @property {module:model/Notification}
     */
    Notification: Notification,
    /**
     * The NotificationsResponse model constructor.
     * @property {module:model/NotificationsResponse}
     */
    NotificationsResponse: NotificationsResponse,
    /**
     * The Pair model constructor.
     * @property {module:model/Pair}
     */
    Pair: Pair,
    /**
     * The ParticipantInstruction model constructor.
     * @property {module:model/ParticipantInstruction}
     */
    ParticipantInstruction: ParticipantInstruction,
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
     * The PostStudyCreateResponse model constructor.
     * @property {module:model/PostStudyCreateResponse}
     */
    PostStudyCreateResponse: PostStudyCreateResponse,
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
     * The ShareInvitationBody model constructor.
     * @property {module:model/ShareInvitationBody}
     */
    ShareInvitationBody: ShareInvitationBody,
    /**
     * The Study model constructor.
     * @property {module:model/Study}
     */
    Study: Study,
    /**
     * The StudyCharts model constructor.
     * @property {module:model/StudyCharts}
     */
    StudyCharts: StudyCharts,
    /**
     * The StudyCreationBody model constructor.
     * @property {module:model/StudyCreationBody}
     */
    StudyCreationBody: StudyCreationBody,
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
     * The StudyJoinResponse model constructor.
     * @property {module:model/StudyJoinResponse}
     */
    StudyJoinResponse: StudyJoinResponse,
    /**
     * The StudyLinks model constructor.
     * @property {module:model/StudyLinks}
     */
    StudyLinks: StudyLinks,
    /**
     * The StudySharing model constructor.
     * @property {module:model/StudySharing}
     */
    StudySharing: StudySharing,
    /**
     * The StudyText model constructor.
     * @property {module:model/StudyText}
     */
    StudyText: StudyText,
    /**
     * The StudyVotes model constructor.
     * @property {module:model/StudyVotes}
     */
    StudyVotes: StudyVotes,
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
     * The TrackingReminderNotificationAction model constructor.
     * @property {module:model/TrackingReminderNotificationAction}
     */
    TrackingReminderNotificationAction: TrackingReminderNotificationAction,
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
     * The UserBlog model constructor.
     * @property {module:model/UserBlog}
     */
    UserBlog: UserBlog,
    /**
     * The UserBlogsResponse model constructor.
     * @property {module:model/UserBlogsResponse}
     */
    UserBlogsResponse: UserBlogsResponse,
    /**
     * The UserTag model constructor.
     * @property {module:model/UserTag}
     */
    UserTag: UserTag,
    /**
     * The UserVariableDelete model constructor.
     * @property {module:model/UserVariableDelete}
     */
    UserVariableDelete: UserVariableDelete,
    /**
     * The UsersResponse model constructor.
     * @property {module:model/UsersResponse}
     */
    UsersResponse: UsersResponse,
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
     * The VariableCharts model constructor.
     * @property {module:model/VariableCharts}
     */
    VariableCharts: VariableCharts,
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
     * The XprofileDataResponse model constructor.
     * @property {module:model/XprofileDataResponse}
     */
    XprofileDataResponse: XprofileDataResponse,
    /**
     * The XprofileDatum model constructor.
     * @property {module:model/XprofileDatum}
     */
    XprofileDatum: XprofileDatum,
    /**
     * The XprofileField model constructor.
     * @property {module:model/XprofileField}
     */
    XprofileField: XprofileField,
    /**
     * The XprofileFieldsResponse model constructor.
     * @property {module:model/XprofileFieldsResponse}
     */
    XprofileFieldsResponse: XprofileFieldsResponse,
    /**
     * The XprofileGroup model constructor.
     * @property {module:model/XprofileGroup}
     */
    XprofileGroup: XprofileGroup,
    /**
     * The XprofileGroupsResponse model constructor.
     * @property {module:model/XprofileGroupsResponse}
     */
    XprofileGroupsResponse: XprofileGroupsResponse,
    /**
     * The ActivitiesApi service constructor.
     * @property {module:api/ActivitiesApi}
     */
    ActivitiesApi: ActivitiesApi,
    /**
     * The AnalyticsApi service constructor.
     * @property {module:api/AnalyticsApi}
     */
    AnalyticsApi: AnalyticsApi,
    /**
     * The AppSettingsApi service constructor.
     * @property {module:api/AppSettingsApi}
     */
    AppSettingsApi: AppSettingsApi,
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
     * The FeedApi service constructor.
     * @property {module:api/FeedApi}
     */
    FeedApi: FeedApi,
    /**
     * The FriendsApi service constructor.
     * @property {module:api/FriendsApi}
     */
    FriendsApi: FriendsApi,
    /**
     * The GroupsApi service constructor.
     * @property {module:api/GroupsApi}
     */
    GroupsApi: GroupsApi,
    /**
     * The MeasurementsApi service constructor.
     * @property {module:api/MeasurementsApi}
     */
    MeasurementsApi: MeasurementsApi,
    /**
     * The MessagesApi service constructor.
     * @property {module:api/MessagesApi}
     */
    MessagesApi: MessagesApi,
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
     * The SharesApi service constructor.
     * @property {module:api/SharesApi}
     */
    SharesApi: SharesApi,
    /**
     * The StudiesApi service constructor.
     * @property {module:api/StudiesApi}
     */
    StudiesApi: StudiesApi,
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
    VariablesApi: VariablesApi,
    /**
     * The XprofileApi service constructor.
     * @property {module:api/XprofileApi}
     */
    XprofileApi: XprofileApi
  };

  return exports;
}));
