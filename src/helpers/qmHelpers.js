/* eslint-disable no-console,no-unused-vars */
/** @namespace qm.qmLog */
/** @namespace qm.chrome */
/* global AppSettings TweenMax, Power1, Sine, Linear, Power3, TimelineMax, Power2 */
/* eslint-env browser */
String.prototype.toCamelCase = function(){
    return this.replace(/(\_[a-z])/g, function($1){
        return $1.toUpperCase().replace('_', '')
    })
}
var qm = {
    analytics: {
        eventCategories: {
            pushNotifications: "pushNotifications",
            inbox: "inbox",
        },
    },
    appContainer: {
        hide(){
            qm.qmLog.info("Hiding panel class")
            qm.appContainer.getPaneClass().style.display = "none"
        },
        show(){
            qm.qmLog.info("Showing panel class")
            qm.appContainer.getPaneClass().style.display = "block"
        },
        getPaneClass(){
            let element = document.querySelector('.pane')
            return element
        },
        getAppContainer(){
            let element = document.querySelector('app-container')
            return element
        },
        setBackgroundColor(color){
            qm.qmLog.info("Setting background to " + color)
            let element = qm.appContainer.getPaneClass()
            element.style.backgroundColor = color
            element = qm.appContainer.getAppContainer()
            element.style.backgroundColor = color
            document.body.style.backgroundColor = color
        },
        setOpacity(opacity){
            let backgroundColor = (opacity < 1) ? 'black' : 'white'
            let paneClass = qm.appContainer.getPaneClass()
            paneClass.style.backgroundColor = backgroundColor
            paneClass.style.opacity = opacity
            document.body.style.backgroundColor = backgroundColor
        },
    },
    appMode: {
        mode: null,
        isBrowser(){
            return typeof window !== "undefined"
        },
        isTesting(){
            if(qm.appMode.mode === 'testing'){
                return true
            }
            if(qm.userHelper.isTestUser()){
                return true
            }
            let result = qm.urlHelper.indexOfCurrentUrl("medimodo.heroku") !== -1
            return result
        },
        isDevelopment(){
            if(qm.appMode.mode === 'development'){
                return true
            }
            if(!qm.platform.getWindow()){
                return false
            }
            if(window.location.origin.indexOf('http://localhost:') !== -1){
                return true
            }
            if(window.location.origin.indexOf('https://dev-web.quantimo.do') !== -1){
                return true
            }
            return window.location.origin.indexOf('local.quantimo.do') !== -1
        },
        isStaging(){
            if(!qm.platform.getWindow()){
                return false
            }
            return window.location.origin.indexOf('staging.') !== -1
        },
        isProduction(){
            if(!qm.platform.getWindow()){
                return false
            }
            return !qm.appMode.isStaging() && !qm.appMode.isDevelopment() && !qm.appMode.isTesting()
        },
        isBuilder(){
            if(typeof window === "undefined"){
                return false
            }
            return window.designMode ||
                qm.urlHelper.indexOfCurrentUrl('app/configuration') !== -1 ||
                qm.urlHelper.indexOfCurrentUrl('configuration-index.html') !== -1 ||
                qm.urlHelper.indexOfCurrentUrl('builder.quantimo') !== -1
        },
        isPhysician(){
            if(typeof window === "undefined"){
                return false
            }
            let urlParam = qm.urlHelper.getParam('physicianMode')
            if(urlParam !== null){ qm.storage.setItem('physicianMode', urlParam) }
            let isPhysician = window.location.href.indexOf('app/physician') !== -1 ||
                qm.storage.getItem('physicianMode') ||
                qm.urlHelper.indexOfCurrentUrl('physician-index.html') !== -1 ||
                qm.urlHelper.indexOfCurrentUrl('physician.quantimo') !== -1
            if(isPhysician){ window.designMode = false }
            return isPhysician
        },
        isDebug(){
            return qm.qmLog.isDebugMode()
        },
        getAppMode(){
            let env = "production"
            if(qm.appMode.isStaging()){
                env = "staging"
            }
            if(qm.appMode.isDevelopment()){
                env = "development"
            }
            if(qm.appMode.isTesting()){
                env = "testing"
            }
            return env
        },
        isBackEnd(){
            return qm.platform.isBackEnd()
        },
    },
    apiPaths: {
        trackingReminderNotificationsPast: "v1/trackingReminderNotifications/past",
    },
    api: {
        requestLog: [],
        registerHelpers(){
            qm.Quantimodo.TrackingReminderNotification.prototype.track = function(trackAll, successHandler, errorHandler){
                qm.notifications.trackNotification(this, trackAll, successHandler, errorHandler)
            }
            qm.Quantimodo.TrackingReminderNotification.prototype.getCirclePage = function(){
                return {
                    title: this.longQuestion,
                    bodyText: null,
                    image: {
                        url: this.pngPath,
                    },
                    hide: false,
                }
            }
        },
        getDefaultHeaders(){
            let headers = {
                'X-Client-Id': qm.getClientId(),
                'X-Platform': qm.platform.getCurrentPlatform(),
                'X-App-Version': qm.appsManager.getAppVersion(),
                'X-Framework': 'ionic',
            }
            if(typeof moment !== "undefined"){
                if(typeof moment.tz === "undefined"){
                    qmLog.error("moment.tz is not defined!")
                } else {
                    headers['X-Timezone'] = moment.tz.guess()
                }
            }
            let token = qm.auth.getAccessToken()
            if(token){ headers['Authorization'] = 'Bearer ' + token }
            return headers
        },
        configureClient(functionName, errorHandler, requestParams){
            requestParams = requestParams || {}
            let minimumSecondsBetweenRequests = requestParams.minimumSecondsBetweenRequests || 1
            let blockRequests = requestParams.blockRequests || true
            if(functionName && !qm.api.canWeMakeRequestYet('GET', functionName, {
                minimumSecondsBetweenRequests: 1,
                blockRequests,
            })){
                if(errorHandler){
                    errorHandler("Already made request in last " + minimumSecondsBetweenRequests + " seconds")
                }else{
                    console.error("Already made request in last " + minimumSecondsBetweenRequests + " seconds")
                }
                return false
            }
            let qmApiClient = qm.Quantimodo.ApiClient.instance
            let quantimodo_oauth2 = qmApiClient.authentications.quantimodo_oauth2
            qmApiClient.basePath = qm.api.getBaseUrl() + '/api'
            quantimodo_oauth2.accessToken = qm.auth.getAccessTokenFromUrlUserOrStorage()
            let message = "API Request to " + qm.api.getBaseUrl() + " for " + functionName
            if(requestParams.reason){
                message += " because " + requestParams.reason
            }
            if(qm.qmLog.isDebugMode()){
                message += ' with token: ' + qm.auth.getAccessTokenFromUrlUserOrStorage()
            }
            delete requestParams.reason
            qm.qmLog.info(message, requestParams)
            qm.api.requestLog.push({
                time: qm.timeHelper.getCurrentLocalDateAndTime(),
                name: functionName,
                message,
                params: requestParams,
            })
            // TODO: Enable
            // qmApiClient.authentications.client_id.clientId = qm.getClientId();
            // qmApiClient.enableCookies = true;
            qmApiClient.defaultHeaders = qm.api.getDefaultHeaders()
            qmApiClient.cache = true
            if(requestParams){
                if(requestParams.refresh || requestParams.recalculate || requestParams.noCache){
                    qmApiClient.cache = false
                }
            }
            return qmApiClient
        },
        cacheSet(params, data, functionName){
            if(!qm.api.cache[functionName]){
                qm.api.cache[functionName] = {}
            }
            let key = qm.api.getCacheName(params)
            qm.api.cache[functionName][key] = data
        },
        cacheGet(params, functionName){
            if(params && params.refresh){
                return null
            }
            if(!qm.api.cache[functionName]){
                qm.api.cache[functionName] = {}
            }
            let key = qm.api.getCacheName(params)
            if(!qm.api.cache[functionName][key]){
                return null
            }
            return qm.api.cache[functionName][key]
        },
        cacheRemove(functionName){
            return qm.api.cache[functionName] = null
        },
        getCacheName(params){
            return qm.stringHelper.removeSpecialCharacters(JSON.stringify(params))
        },
        cache: {},
        generalResponseHandler(error, data, response, successHandler, errorHandler, params, functionName){
            if(!response){
                let message = "No response provided to " + functionName + " qmSdkApiResponseHandler with params " + JSON.stringify(params)
                qm.qmLog.info(message)
                if(errorHandler){
                    errorHandler(message)
                }
                return
            }
            qm.qmLog.debug(response.status + ' response from ' + response.req.url)
            if(error){
                let errorMessage = qm.api.generalErrorHandler(error, data, response)
                if(errorHandler){
                    errorHandler(errorMessage)
                }
            }else{
                if(data && params){
                    qm.api.cacheSet(params, data, functionName)
                }
                if(successHandler){
                    successHandler(data, response)
                }
            }
        },
        getErrorMessageFromResponse(error, response){
            let errorMessage = ''
            if(error && error.message){
                errorMessage += error.message + ' '
            }
            if(response && response.error && response.error.message){
                errorMessage += response.error.message + ' '
            }
            if(response && response.body && response.body.errorMessage){
                errorMessage += response.body.errorMessage + ' '
            }
            if(response && response.body && response.body.error && response.body.error.message){
                errorMessage += response.body.error.message + ' '
            }
            return errorMessage
        },
        generalErrorHandler(error, data, response, options){
            let errorMessage = qm.api.getErrorMessageFromResponse(error, response)
            if(!response){
                return qm.qmLog.error("No API response provided to qmApiGeneralErrorHandler",
                    {errorMessage, responseData: data, apiResponse: response, requestOptions: options})
            }
            if(errorMessage.toLowerCase().indexOf('expired') !== -1){
                qm.auth.deleteAllAccessTokens("errorMessage is " + errorMessage)
                qm.userHelper.setUser(null)
            }
            if(response.status === 401){
                if(!options || !options.doNotSendToLogin){
                    qm.qmLog.info("Not authenticated!")
                }
                qm.auth.handle401Response(response, options)
            }else{
                qm.qmLog.error(errorMessage, null, {error, apiResponse: response})
            }
            return errorMessage
        },
        addGlobalParams(params){
            if(params && qm.functionHelper.isFunction(params)){ throw "params should not be a function!" }
            let url
            if(!params){ params = {} }
            delete params.force // Used locally only
            delete params.excludeLocal // Used locally only
            if(typeof params === "string"){
                url = params
                qm.urlHelper.validateUrl(url)
                params = {}
            }
            let appSettings = qm.appsManager.getAppSettingsFromMemory()
            if(appSettings){
                params.appName = encodeURIComponent(appSettings.appDisplayName)
                if(appSettings.versionNumber){
                    params.appVersion = encodeURIComponent(appSettings.versionNumber)
                }else{
                    qm.qmLog.debug('Version number not specified!', null, 'Version number not specified on qm.getAppSettings()')
                }
            }
            if(!params.accessToken && qm.auth.getAccessTokenFromUrlUserOrStorage()){
                params.accessToken = qm.auth.getAccessTokenFromUrlUserOrStorage()
            }
            if(!params.clientId && qm.api.getClientId()){
                params.clientId = qm.api.getClientId()
            }
            params.platform = qm.platform.getCurrentPlatform()
            if(qm.devCredentials){
                if(qm.devCredentials.username){
                    params.log = encodeURIComponent(qm.devCredentials.username)
                }
                if(qm.devCredentials.password){
                    params.pwd = encodeURIComponent(qm.devCredentials.password)
                }
            }
            if(qm.appMode.isDevelopment()){
                params.XDEBUG_SESSION_START = "PHPSTORM"
            }
            let passableUrlParameters = ['userId', 'log', 'pwd', 'userEmail']
            for(let i = 0; i < passableUrlParameters.length; i++){
                if(qm.urlHelper.getParam(passableUrlParameters[i])){
                    params[passableUrlParameters[i]] = qm.urlHelper.getParam(passableUrlParameters[i])
                }
            }
            for(let property in params){
                if(params.hasOwnProperty(property)){
                    if(typeof params[property] === "undefined"){
                        qm.qmLog.error(property + " is undefined!")
                        delete params[property]
                    }
                    if(params[property] === ""){
                        qm.qmLog.error(property + " is empty string!")
                        delete params[property]
                    }
                }
            }
            if(url){
                url = qm.urlHelper.addUrlQueryParamsToUrlString(params, url)
                return url
            }
            return params
        },
        getClientIdFromBuilderQueryOrSubDomain(){
            //if(qm.appMode.isPhysician()){return "physician";}  // Don't do this because we need to use physician/patient aliases
            if(qm.appsManager.getBuilderClientId()){
                return qm.clientId = qm.appsManager.getBuilderClientId()
            }
            if(qm.api.getClientIdFromQueryParameters() && qm.api.getClientIdFromQueryParameters() !== "default"){
                qm.clientId = qm.api.getClientIdFromQueryParameters()
            }
            if(!qm.clientId){
                qm.clientId = qm.api.getClientIdFromSubDomain()
            }
            return qm.clientId
        },
        getClientId(successHandler){
            qm.clientId = qm.api.getClientIdFromBuilderQueryOrSubDomain()
            if(qm.platform.isBackEnd() && typeof process.env.QUANTIMODO_CLIENT_ID !== "undefined"){
                return process.env.QUANTIMODO_CLIENT_ID
            }
            let appSettings = qm.getAppSettings()
            if(!qm.clientId && appSettings){
                qm.clientId = appSettings.clientId
            }
            // DON'T DO THIS
            // if(!clientId && qm.platform.isMobile()){
            //     qm.qmLog.debug('Using ' + qm.urlHelper.getDefaultConfigUrl() + ' because we\'re on mobile');
            //     clientId = "default"; // On mobile
            // }
            if(!qm.clientId){ // Not sure why but this always returns quantimodo
                //clientId = qm.storage.getItem(qm.items.clientId);
            }
            // DON'T DO THIS
            // if(!clientId && qm.urlHelper.indexOfCurrentUrl('quantimo.do') === -1){
            //     clientId = "default"; // On mobile
            // }
            if(!qm.clientId){
                qm.clientId = qm.api.getClientIdFromAwsPath()
            }
            if(!qm.clientId){
                qm.qmLog.info("Could not get client id!")
                //clientId = 'quantimodo';
            }
            if(qm.clientId && qm.clientId.indexOf('.') !== -1){
                throw "Client id should not have a dot!"
            }
            if(!successHandler){
                return qm.clientId
            }
            if(qm.clientId){
                successHandler(qm.clientId)
            }
            qm.api.getClientIdWithCallback(successHandler)
        },
        getClientSecret(successHandler){
            let clientSecret = qm.appsManager.getClientSecret()
            if(successHandler){
                successHandler(clientSecret)
            }
            return clientSecret
        },
        getClientIdWithCallback(successHandler){
            if(qm.api.getClientId()){
                successHandler(qm.api.getClientId())
                return
            }
            if(typeof AppSettings !== "undefined"){
                AppSettings.get(
                    function(preferences){
                        /** @namespace preferences.QuantiModoClientId */
                        qm.clientId = preferences.QuantiModoClientId
                        /** @namespace preferences.QuantiModoClientSecret */
                        qm.clientSecret = preferences.QuantiModoClientSecret
                        successHandler(qm.clientId, preferences.QuantiModoClientSecret)
                    },
                    function(error){
                        qm.qmLog.error("Error! ", error)
                    }, ["QuantiModoClientId", "QuantiModoClientSecret"])
            }
        },
        getClientIdFromQueryParameters(){
            if(!qm.appMode.isBrowser()){
                return null
            }
            let clientId = qm.urlHelper.getParam('clientId')
            if(!clientId){
                clientId = qm.urlHelper.getParam('appName')
            }
            if(!clientId){
                clientId = qm.urlHelper.getParam('lowerCaseAppName')
            }
            if(!clientId){
                clientId = qm.urlHelper.getParam('quantimodoClientId')
            }
            if(clientId && clientId === "web"){
                clientId === null
            }
            if(clientId){
                qm.storage.setItem('clientId', clientId)
            }
            return clientId
        },
        getClientIdFromAwsPath(){
            if(!qm.appMode.isBrowser()){
                return null
            }
            let clientId = qm.stringHelper.getStringBetween(qm.urlHelper.getCurrentUrl(), 's3.amazonaws.com/', '/dev')
            return clientId
        },
        getClientIdFromSubDomain(){
            if(!qm.platform.getWindow()){
                return false
            }
            if(!qm.appMode.isBrowser()){
                return null
            }
            if(window.location.hostname.indexOf('.quantimo.do') === -1){
                return null
            }
            if(qm.appMode.isBuilder()){
                return null
            }
            if(qm.appMode.isPhysician()){
                return null
            }
            let subDomain = qm.urlHelper.getSubDomain()
            subDomain = subDomain.replace('qm-', '')
            if(subDomain === 'web' || subDomain === 'staging-web' || subDomain === 'dev-web'){
                return null
            }
            let clientIdFromAppConfigName = qm.appsManager.appConfigFileNames[subDomain]
            if(clientIdFromAppConfigName){
                qm.qmLog.debug('Using client id ' + clientIdFromAppConfigName + ' derived from appConfigFileNames using subDomain: ' + subDomain, null)
                return clientIdFromAppConfigName
            }
            qm.qmLog.debug('Using subDomain as client id: ' + subDomain)
            return subDomain
        },
        canWeMakeRequestYet(type, route, options){
            if(!route || route === ''){
                qm.qmLog.error("No route provided to canWeMakeRequestYet!")
                return true
            }
            function getSecondsSinceLastRequest(type, route){
                let secondsSinceLastRequest = 99999999
                if(qm.storage.getLastRequestTime(type, route)){
                    secondsSinceLastRequest = qm.timeHelper.secondsAgo(qm.storage.getLastRequestTime(type, route))
                }
                return secondsSinceLastRequest
            }
            let blockRequests = false
            if(options && options.blockRequests){
                blockRequests = options.blockRequests
            }
            let minimumSecondsBetweenRequests
            if(options && options.minimumSecondsBetweenRequests){
                minimumSecondsBetweenRequests = options.minimumSecondsBetweenRequests
            }else{
                minimumSecondsBetweenRequests = 1
            }
            if(getSecondsSinceLastRequest(type, route) < minimumSecondsBetweenRequests){
                let name = 'Just made a ' + type + ' request to ' + route
                let message = name + ". We made the same request within the last " + minimumSecondsBetweenRequests + ' seconds (' +
                    getSecondsSinceLastRequest(type, route) + ' ago). stackTrace: ' + options.stackTrace
                if(blockRequests){
                    qm.qmLog.info('BLOCKING REQUEST: ' + name, 'BLOCKING REQUEST because ' + message, options)
                    return false
                }
                    qm.qmLog.info(name, message, options)

            }
            qm.storage.setItem(qm.api.getLocalStorageNameForRequest(type, route), qm.timeHelper.getUnixTimestampInSeconds())
            return true
        },
        responseHandler(error, data, response, successHandler, errorHandler){
            if(!response){
                let message = "No response provided to qm.api.responseHandler"
                if(qm.getUser()){
                    qm.qmLog.error(message)
                }else{
                    qm.qmLog.info(message)
                }
                return
            }
            qm.qmLog.debug(response.status + ' response from ' + response.req.url, null)
            if(error){
                let errorMessage = qm.api.generalErrorHandler(error, data, response)
                if(errorHandler){
                    errorHandler(errorMessage)
                }
            }else{
                if(successHandler){
                    successHandler(data, response)
                }
            }
        },
        getBaseUrl(){
            let apiUrl = qm.urlHelper.getParam(qm.items.apiUrl)
            if(apiUrl && apiUrl !== qm.storage.getItem(qm.items.apiUrl)){
                qm.storage.setItem(qm.items.apiUrl, apiUrl)
            }
            if(!apiUrl && qm.appMode.isDebug() && qm.platform.isMobile() && (!qm.getUser() || qm.getUser().id === 230)){
                apiUrl = "https://utopia.quantimo.do"
            }
            if(!apiUrl){
                apiUrl = qm.storage.getItem(qm.items.apiUrl)
            }
            if(qm.appMode.isBrowser() && window.location.host.indexOf('dev-') === 0){
                return "https://local.quantimo.do"
            }
            if(!apiUrl){
                let appSettings = qm.appsManager.getAppSettingsFromMemory()
                if(appSettings && appSettings.apiUrl){
                    apiUrl = appSettings.apiUrl
                }
            }
            if(!apiUrl && !qm.appMode.isBrowser()){
                apiUrl = "https://app.quantimo.do"
            }
            if(!apiUrl && window.location.origin.indexOf('staging.quantimo.do') !== -1){
                apiUrl = "https://staging.quantimo.do"
            }
            if(!apiUrl && window.location.origin.indexOf('local.quantimo.do') !== -1){
                apiUrl = "https://local.quantimo.do"
            }
            if(!apiUrl && window.location.origin.indexOf('utopia.quantimo.do') !== -1){
                apiUrl = "https://utopia.quantimo.do"
            }
            if(!apiUrl && window.location.origin.indexOf('localhost:8100') !== -1){
                apiUrl = "https://app.quantimo.do"
            } // Ionic serve
            if(!apiUrl){
                apiUrl = "https://app.quantimo.do"
            }
            if(apiUrl.indexOf("https://") === -1){
                apiUrl = "https://" + apiUrl
            }
            apiUrl = apiUrl.replace("https://https", "https")
            // Why are we adding a port to the API url?  It breaks localhost:8100
            if(typeof window !== "undefined" && window.location.port && window.location.port !== "443" && window.location.hostname !== 'localhost'){
                apiUrl += ":" + window.location.port
            }
            return apiUrl
        },
        getApiUrl(){
            return qm.api.getBaseUrl()
        },
        getApiUrlWithoutProtocol(){
            let url = qm.api.getBaseUrl()
            url = url.replace('https://', '')
            url = url.replace('http://', '')
            return url
        },
        postToQuantiModo(body, path, successHandler, errorHandler){
            qm.api.getRequestUrl(path, function(url){
                qm.qmLog.info("Making POST request to " + url)
                if(typeof XMLHttpRequest !== "undefined"){
                    qm.api.postViaXhr(body, url, successHandler)
                }else{
                    qm.api.postViaFetch(body, url, successHandler, errorHandler) // Need fetch for service worker
                }
            })
        },
        getViaXhrOrFetch(url, successHandler, errorHandler){
            qm.qmLog.info("Making GET request to " + url)
            if(typeof XMLHttpRequest !== "undefined"){
                qm.api.getViaXhr(url, successHandler, errorHandler)
            }else{
                qm.api.getViaFetch(url, successHandler, errorHandler) // Need fetch for service worker
            }
        },
        getAppSettingsUrl(clientId, callback){
            function generateUrl(clientId, clientSecret){
                // Can't use QM SDK in service worker
                let settingsUrl = qm.api.getBaseUrl() + '/api/v1/appSettings?clientId=' + clientId
                if(clientSecret){
                    settingsUrl += "&clientSecret=" + clientSecret
                }
                if(!qm.platform.getWindow()){
                    return false
                }
                if(window.designMode){
                    settingsUrl += '&designMode=true'
                }
                qm.qmLog.debug('Getting app settings from ' + settingsUrl)
                return settingsUrl
            }
            if(clientId){
                callback(generateUrl(clientId))
            }else{
                qm.api.getClientIdWithCallback(function(clientId, clientSecret){
                    callback(generateUrl(clientId, clientSecret))
                })
            }
        },
        getViaFetch(url, successHandler, errorHandler){
            qm.qmLog.pushDebug("Making get request to " + url)
            fetch(url, {
                method: 'get',
                headers: new Headers(qm.api.getDefaultHeaders()),
            }).then(function(response){
                    return response.json()
                }).then(function(data){
                if(successHandler){
                    successHandler(data)
                }
            }).catch(function(err){
                if(url.indexOf('.config.json')){
                    qm.qmLog.error("qm.api.get error from " + url + " request: " + err + ".  If we couldn't parse json, " +
                        url + " probably doesn't exist", err)
                }else{
                    qm.qmLog.error("qm.api.get error from " + url + " request: " + err, null, err)
                }
                if(errorHandler){
                    errorHandler(err)
                }
            })
        },
        getViaXhr(url, successHandler, errorHandler){
            let xhr = new XMLHttpRequest()
            xhr.open('GET', url, true)
            xhr = qm.api.addXhrHeaders(xhr)
            xhr.onreadystatechange = function(){
                if(xhr.readyState === XMLHttpRequest.DONE){
                    let fallback = null // Just return null instead of 500 page HTML
                    let responseObject = qm.stringHelper.parseIfJsonString(xhr.responseText, fallback)
                    successHandler(responseObject)
                }
            }
            xhr.send(null)
        },
        postViaFetch(body, url, successHandler){
            fetch(url, {
                method: 'post',
                body: JSON.stringify(body),
                headers: new Headers(qm.api.getDefaultHeaders()),
            }).then(function(response){
                qm.qmLog.info("Got " + response.status + " response from POST to " + url)
                if(successHandler){
                    successHandler(response)
                }
            }).catch(function(err){
                qm.qmLog.error("Error from POST to " + url + ": " + err)
            })
        },
        addXhrHeaders(xhr){
            let headers = qm.api.getDefaultHeaders()
            for (let headerName in headers) {
                if (headers.hasOwnProperty(headerName)) {
                    let headerValue = headers[headerName]
                    xhr.setRequestHeader(headerName, headerValue)
                }
            }
            return xhr
        },
        postViaXhr(body, url, successHandler){
            let xhr = new XMLHttpRequest() // new HttpRequest instance
            xhr.open("POST", url)
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
            xhr = qm.api.addXhrHeaders(xhr)
            xhr.onreadystatechange = function(){ //Call a function when the state changes.
                if(xhr.readyState === XMLHttpRequest.DONE){
                    let fallback = xhr.responseText
                    let responseObject = qm.stringHelper.parseIfJsonString(xhr.responseText, fallback)
                    if(successHandler){
                        successHandler(responseObject)
                    }
                }
            }
            xhr.send(JSON.stringify(body))
        },
        postMeasurements(measurements, onDoneListener){
            qm.api.postToQuantiModo(measurements, "v1/measurements", onDoneListener)
        },
        getRequestUrl(path, successHandler, params){
            qm.userHelper.getUserFromLocalStorage(function(user){
                function addGlobalQueryParameters(url){
                    function addQueryParameter(url, name, value){
                        if(url.indexOf('?') === -1){
                            return url + "?" + name + "=" + value
                        }
                        return url + "&" + name + "=" + value
                    }
                    if(qm.auth.getAccessTokenFromUrlUserOrStorage()){
                        url = addQueryParameter(url, 'access_token', qm.auth.getAccessTokenFromUrlUserOrStorage())
                    }else{
                        qm.qmLog.error('No access token!')
                        if(!qm.serviceWorker){
                            qm.chrome.showSignInNotification()
                        }
                    }
                    function getAppName(){
                        if(qm.chrome.getChromeManifest()){
                            return qm.chrome.getChromeManifest().name
                        }
                        return qm.urlHelper.getParam('appName')
                    }
                    if(getAppName()){
                        url = addQueryParameter(url, 'appName', getAppName())
                    }
                    function getAppVersion(){
                        if(qm.chrome.getChromeManifest()){
                            return qm.chrome.getChromeManifest().version
                        }
                        let appSettings = qm.getAppSettings()
                        if(appSettings){
                            return appSettings.versionNumber
                        }
                        return qm.urlHelper.getParam('appVersion')
                    }
                    if(getAppVersion()){
                        url = addQueryParameter(url, 'appVersion', getAppVersion())
                    }
                    if(qm.api.getClientId()){
                        url = addQueryParameter(url, 'clientId', qm.api.getClientId())
                    }
                    url = addQueryParameter(url, 'platform', qm.platform.getCurrentPlatform())
                    return url
                }
                let url = addGlobalQueryParameters(qm.api.getBaseUrl() + "/api/" + path)
                if(params){
                    url = qm.urlHelper.addUrlQueryParamsToUrlString(params, url)
                }
                qm.qmLog.debug("Making API request to " + url)
                successHandler(url)
            })
        },
        getQuantiModoUrl(path){
            if(path.indexOf("http") === 0){
                return path
            }
            if(typeof path === "undefined"){
                path = ""
            }
            return qm.api.getBaseUrl() + "/" + path
        },
        rateLimit(func, rate, async){
            let queue = []
            let timeOutRef = false
            let currentlyEmptyingQueue = false
            var emptyQueue = function(){
                if(queue.length){
                    currentlyEmptyingQueue = true
                    _.delay(function(){
                        if(async){
                            _.defer(function(){
                                queue.shift().call()
                            })
                        }else{
                            queue.shift().call()
                        }
                        emptyQueue()
                    }, rate)
                }else{
                    currentlyEmptyingQueue = false
                }
            }
            return function(){
                let args = _.map(arguments, function(e){
                    return e
                }) // get arguments into an array
                queue.push(_.bind.apply(this, [func, this].concat(args))) // call apply so that we can pass in arguments as parameters as opposed to an array
                if(!currentlyEmptyingQueue){
                    emptyQueue()
                }
            }
        },
        executeWithRateLimit(functionToLimit, milliseconds){
            milliseconds = milliseconds || 15000
            let rateLimited = qm.api.rateLimit(functionToLimit, milliseconds)
            rateLimited()
        },
        getLocalStorageNameForRequest(type, route){
            return 'last_' + type + '_' + route.replace('/', '_') + '_request_at'
        },
    },
    appsManager: { // jshint ignore:line
        getAppVersion(){
            let appSettings = qm.appsManager.getAppSettingsFromMemory()
            return appSettings.versionNumber
        },
        getBuilderClientId(){
            if(!qm.appMode.isBuilder()){
                return null
            }
            let clientId = qm.urlHelper.getParam('clientId')
            if(clientId){
                return clientId
            }
            clientId = qm.stringHelper.getStringAfter(qm.urlHelper.getCurrentUrl(), 'app/configuration/')
            if(clientId){
                clientId = qm.stringHelper.getStringBeforeSubstring('?', clientId, clientId)
                return clientId
            }
            clientId = qm.storage.getItem(qm.items.builderClientId)
            return clientId
        },
        getClientSecret(){
            if(qm.clientSecret){
                return qm.clientSecret
            }
            let appSettings = qm.getAppSettings()
            if(!appSettings){
                qm.qmLog.error("No appSettings!")
                appSettings = qm.getAppSettings()
            }
            if(appSettings && appSettings.clientSecret){
                return appSettings.clientSecret
            }
            if(!qm.privateConfig){
                if(qm.urlHelper.indexOfCurrentUrl('quantimo.do') === -1){
                    qm.qmLog.error("No client secret or private config!")
                }
                return null
            }
            if(qm.platform.isIOS()){
                return qm.privateConfig.client_secrets.iOS
            }
            if(qm.platform.isAndroid){
                return qm.privateConfig.client_secrets.Android
            }
            if(qm.platform.isChromeExtension){
                return qm.privateConfig.client_secrets.Chrome
            }
            if(qm.platform.isWindows){
                return qm.privateConfig.client_secrets.Windows
            }
            return qm.privateConfig.client_secrets.Web
        },
        getAppSettingsLocallyOrFromApi(successHandler, errorHandler){
            let appSettings = qm.getAppSettings()
            if(appSettings && appSettings.clientId){
                successHandler(appSettings)
                return
            }
            let localStorageKey = qm.items.appSettings
            let builderClientId = qm.appsManager.getBuilderClientId()
            if(builderClientId){
                localStorageKey = qm.items.appSettingsRevisions
            }
            qm.localForage.getItem(localStorageKey, function(appSettings){
                if(builderClientId && appSettings && appSettings.length && builderClientId === appSettings[0].clientId){
                    qm.appsManager.processAndSaveAppSettings(appSettings[0], successHandler)
                    return
                }
                if(qm.platform.isWeb() && qm.urlHelper.indexOfCurrentUrl('.quantimo.do') !== -1){
                    qm.appsManager.getAppSettingsFromApi(null, successHandler, errorHandler)
                    return
                }
                let clientIdFromUrl = qm.api.getClientIdFromBuilderQueryOrSubDomain()
                if(appSettings){
                    if(!clientIdFromUrl || appSettings.clientId.toLowerCase() === clientIdFromUrl.toLowerCase()){ // For some reason clientId from url is lowercase sometimes
                        qm.appsManager.processAndSaveAppSettings(appSettings, successHandler)
                        return
                    }
                }
                qm.appsManager.getAppSettingsFromApi(null, successHandler, errorHandler)
            })
        },
        getAppSettingsFromMemory(){
            //if(qm.appMode.isPhysician() && qm.staticData){return qm.staticData.appSettings;}
            let appSettings = qm.globalHelper.getItem(qm.items.appSettings)
            if(!appSettings){
                if(!qm.staticData){
                    qm.qmLog.error("qm.staticData not set!")
                    return false
                }
                appSettings = qm.staticData.appSettings
            }
            let clientId = qm.api.getClientIdFromBuilderQueryOrSubDomain()
            if(!clientId || clientId.toLowerCase() === appSettings.clientId.toLowerCase()){ // For some reason clientId from url is lowercase sometimes
                return appSettings
            }
            if(clientId === "physician"){
                return appSettings
            }
            return false
        },
        getAppSettingsFromApi(clientId, successHandler, errorHandler){
            qm.api.getAppSettingsUrl(clientId, function(appSettingsUrl){
                qm.api.getViaXhrOrFetch(appSettingsUrl, function(response){
                    if(!response){
                        if(errorHandler){
                            errorHandler("No response from " + appSettingsUrl)
                        }
                        qm.qmLog.error("No response from " + appSettingsUrl)
                        return
                    }
                    if(response.privateConfig){
                        qm.privateConfig = response.privateConfig
                        qm.localForage.setItem(qm.items.privateConfig, response.privateConfig)
                    }
                    if(!response.appSettings){
                        qm.qmLog.error("No appSettings response from " + appSettingsUrl)
                        if(errorHandler){
                            errorHandler("No appSettings response from " + appSettingsUrl)
                        }
                        return false
                    }
                    qm.appsManager.processAndSaveAppSettings(response.appSettings, successHandler)
                }, errorHandler)
            })
        },
        loadPrivateConfigFromJsonFile(successHandler, errorHandler){ // I think adding appSettings to the chrome manifest breaks installation
            if(!qm.privateConfig){
                qm.api.getViaXhrOrFetch(qm.urlHelper.getPrivateConfigJsonUrl(), function(parsedResponse){ // Can't use QM SDK in service worker
                    qm.qmLog.debug('Got private config from json file', null, parsedResponse)
                    qm.privateConfig = parsedResponse
                    if(successHandler){
                        successHandler(parsedResponse)
                    }
                }, function(){
                    qm.qmLog.error("Could not get private config from json file")
                    if(errorHandler){
                        errorHandler("Could not get private config from json file")
                    }
                })
            }
        },
        processAndSaveAppSettings(appSettings, callback){
            if(typeof appSettings === "string"){
                qm.qmLog.error(appSettings)
                return false
            }
            if(!appSettings){
                qm.qmLog.error("Nothing given to processAndSaveAppSettings!")
                return false
            }
            appSettings.designMode = qm.appMode.isBuilder()
            if(!appSettings.appDesign){
                qm.qmLog.error("No appDesign property!", appSettings)
            }else if(!appSettings.appDesign.ionNavBarClass){
                appSettings.appDesign.ionNavBarClass = "bar-positive"
            }
            function successHandler(){
                qm.localForage.setItem(qm.items.appSettings, appSettings)
                if(callback){
                    callback(appSettings)
                }
                return appSettings
            }
            if(qm.appMode.isBuilder()){
                return successHandler()
            } // Don't need to mess with app settings refresh in builder
            qm.storage.setItem(qm.items.appSettings, appSettings)
            for(let propertyName in qm.staticData.buildInfo){
                if(qm.staticData.buildInfo.hasOwnProperty(propertyName)){
                    appSettings[propertyName] = qm.staticData.buildInfo[propertyName]
                }
            }
            if(!appSettings.gottenAt){
                appSettings.gottenAt = qm.timeHelper.getUnixTimestampInSeconds()
            }
            if(appSettings.gottenAt < qm.timeHelper.getUnixTimestampInSeconds() - 86400){
                qm.appsManager.getAppSettingsFromApi(appSettings.clientId)
            }
            successHandler()
        },
        // SubDomain : Filename
        appConfigFileNames: {
            "app": "quantimodo",
            "default": "default",
            "energymodo": "energymodo",
            "ionic": "quantimodo",
            "local": "quantimodo",
            "medimodo": "medimodo",
            "mindfirst": "mindfirst",
            "moodimodo": "moodimodo",
            "oauth": "quantimodo",
            "patient": "quantimodo",
            "quantimodo": "quantimodo",
            "staging": "quantimodo",
            "studies": "quantimodo",
            "utopia": "quantimodo",
            "your_quantimodo_client_id_here": "your_quantimodo_client_id_here",
        },
        getDoctorRobotoAlias(appSettings){
            appSettings = appSettings || qm.getAppSettings()
            if(appSettings.doctorRobotAlias){
                return appSettings.doctorRobotAlias
            }
            let doctorRobotoAlias = appSettings.appDisplayName.replace('Dr. ', '')
            doctorRobotoAlias = qm.stringHelper.getFirstWord(doctorRobotoAlias)
            if(doctorRobotoAlias === 'QuantiModo'){
                doctorRobotoAlias = 'Roboto'
            }
            return appSettings.doctorRobotoAlias = doctorRobotoAlias
        },
    },
    apiHelper: {
        getApiDocs(callback){
            if(!callback){
                return qm.staticData.docs
            }
            callback(qm.staticData.docs)
        },
        docs: null,
        getParameterDescription(parameterName, callback){
            qm.apiHelper.getApiDocs(function(apiDocs){
                let explanation = {title: qm.stringHelper.camelToTitleCase(parameterName)}
                explanation.textContent = apiDocs.parameters[parameterName].description
                callback(explanation)
            })
        },
        getPropertyDescription(modelName, propertyName, callback){
            qm.apiHelper.getModelDefinition(modelName, function(modelDefinition){
                let explanation = qm.apiHelper.convertToExplanation(propertyName, modelDefinition)
                callback(explanation)
            })
        },
        convertToExplanation(propertyName, modelDefinition){
            let explanation = {title: qm.stringHelper.camelToTitleCase(propertyName)}
            explanation.textContent = modelDefinition.properties[propertyName].description
            return explanation
        },
        getRequiredProperties(modelName, callback){
            qm.apiHelper.getModelDefinition(modelName, function(modelDefinition){
                callback(modelDefinition.required)
            })
        },
        getModelDefinition(modelName, callback){
            qm.apiHelper.getApiDocs(function(apiDocs){
                let definition = apiDocs.definitions[modelName]
                if(!definition){
                    qm.qmLog.error(modelName + " definition not found.  Available definitions are " + JSON.stringify(apiDocs.definitions))
                }
                callback(definition)
            })
        },
        checkRequiredProperties(bodyToCheck, modelName, callback){
            qm.apiHelper.getModelDefinition(modelName, function(modelDefinition){
                let explanation = null
                for(let i = 0; i < modelDefinition.required.length; i++){
                    let requiredPropertyName = modelDefinition.required[i]
                    if(!bodyToCheck[requiredPropertyName]){
                        explanation = qm.apiHelper.convertToExplanation(requiredPropertyName, modelDefinition)
                    }
                }
                callback(explanation)
            })
        },
    },
    arrayHelper: {
        arrayHasItemWithSpecificPropertyValue(propertyName, propertyValue, array){
            if(!array){
                qm.qmLog.error("No array provided to arrayHasItemWithSpecificPropertyValue")
                return false
            }
            for(let i = 0; i < array.length; i++){
                let obj = array[i]
                if(obj[propertyName] && obj[propertyName] === propertyValue){
                    return true
                }
            }
            return false
        },
        arrayHasItemWithNameProperty(arrayOfObjects){
            return arrayOfObjects && arrayOfObjects.length && arrayOfObjects[0] && arrayOfObjects[0].name
        },
        removeItemsWithDifferentName(arrayOfObjects, queryTerm){
            return arrayOfObjects.filter(function(obj){
                return obj.name.toLowerCase().indexOf(queryTerm.toLowerCase()) !== -1
            })
        },
        concatenateUniqueId(preferred, secondary){
            for(let i = 0; i < preferred.length; ++i){
                var preferredItem = preferred[i]
                secondary = secondary.filter(function(secondaryItem){
                    return secondaryItem.id !== preferredItem.id
                })
            }
            let combined = preferred.concat(secondary)
            return combined
        },
        convertToArrayIfNecessary(variable){
            if(!qm.arrayHelper.variableIsArray(variable)){
                variable = [variable]
            }
            return variable
        },
        convertObjectToArray(object){
            if(!object){
                qm.qmLog.info(object + " provided to convertObjectToArray")
                return object
            }
            if(qm.arrayHelper.variableIsArray(object)){
                return object
            }
            return Object.keys(object).map(function(key){
                return object[key]
            })
        },
        deleteById(id, array){
            array = array.filter(function(obj){
                return obj.id !== id
            })
            return array
        },
        deleteByProperty(propertyName, value, array){
            array = array.filter(function(obj){
                return obj[propertyName] !== value
            })
            return array
        },
        filterByProperty(filterPropertyName, filterPropertyValue, unfilteredElementArray){
            return unfilteredElementArray.filter(function(obj){
                if(typeof obj[filterPropertyName] === "string" && typeof filterPropertyValue === "string"){
                    return filterPropertyValue.toLowerCase() === obj[filterPropertyName].toLowerCase()
                }
                    return filterPropertyValue === obj[filterPropertyName]

            })
        },
        filterByPropertyOrSize(matchingElements, filterPropertyName, filterPropertyValue,
                                         lessThanPropertyName, lessThanPropertyValue,
                                         greaterThanPropertyName, greaterThanPropertyValue){
            if(!matchingElements){
                return null
            }
            if(matchingElements.length){
                if(greaterThanPropertyName && typeof matchingElements[0][greaterThanPropertyName] === "undefined"){
                    qm.qmLog.error(greaterThanPropertyName + ' greaterThanPropertyName does not exist')
                }
                if(filterPropertyName && typeof matchingElements[0][filterPropertyName] === "undefined"){
                    qm.qmLog.error(filterPropertyName + ' filterPropertyName does not exist')
                }
                if(lessThanPropertyName && typeof matchingElements[0][lessThanPropertyName] === "undefined"){
                    qm.qmLog.error(lessThanPropertyName + ' lessThanPropertyName does not exist')
                }
            }
            if(filterPropertyName && typeof filterPropertyValue !== "undefined" && filterPropertyValue !== null){
                matchingElements = qm.arrayHelper.filterByProperty(filterPropertyName, filterPropertyValue, matchingElements)
            }
            if(lessThanPropertyName && typeof lessThanPropertyValue !== "undefined"){
                matchingElements = matchingElements.filter(function(obj){
                    return obj[lessThanPropertyName] < lessThanPropertyValue
                })
            }
            if(greaterThanPropertyName && typeof greaterThanPropertyValue !== "undefined"){
                matchingElements = matchingElements.filter(function(obj){
                    return obj[greaterThanPropertyName] > greaterThanPropertyValue
                })
            }
            return matchingElements
        },
        getByProperty(propertyName, value, array){
            array = array.filter(function(obj){
                return obj[propertyName] === value
            })
            return array
        },
        getContaining(searchTerm, array){
            if(!array){
                qm.qmLog.error("No array provided to getContaining")
                return array
            }
            searchTerm = searchTerm.toLowerCase()
            let matches = []
            for(let i = 0; i < array.length; i++){
                if(JSON.stringify(array[i]).toLowerCase().indexOf(searchTerm) > -1){
                    matches.push(array[i])
                }
            }
            return matches
        },
        getWithNameContaining(searchTerm, array){
            if(!array){
                qm.qmLog.error("No array provided to getContaining")
                return array
            }
            searchTerm = searchTerm.toLowerCase()
            return array.filter(function(item){
                let name = item.name || item.variableName
                name = name.toLowerCase()
                return name.indexOf(searchTerm) !== -1
            })
        },
        getWithNameContainingEveryWord(searchTerm, array){
            if(!searchTerm){
                qm.qmLog.error("No searchTerm provided to getContaining")
                return array
            }
            if(!array){
                qm.qmLog.error("No array provided to getContaining")
                return array
            }
            if(typeof searchTerm !== "string"){
                qm.qmLog.error("searchTerm is not a string!", searchTerm)
                return array
            }
            qm.qmLog.debug("Called getWithNameContainingEveryWord...")
            searchTerm = searchTerm.toLowerCase()
            let filterBy = searchTerm.split(/\s+/)
            return array.filter(function(item){
                let name = item.name || item.variableName
                if(!name){
                    qm.qmLog.error("No name on: " + JSON.stringify(item))
                    return false
                }
                name = name.toLowerCase()
                let result = filterBy.every(function(word){
                    let exists = name.indexOf(word)
                    if(exists !== -1){
                        return true
                    }
                    if(item.synonyms && item.synonyms.length){
                        let synonyms = JSON.stringify(item.synonyms).toLowerCase()
                        if(synonyms.indexOf(word) !== -1){
                            return true
                        }
                    }
                    if(item.alias){
                        let alias = item.alias.toLowerCase()
                        if(alias.indexOf(word) !== -1){
                            return true
                        }
                    }
                })
                return result
            })
        },
        inArray(needle, haystack){
            let length = haystack.length
            for(let i = 0; i < length; i++){
                if(haystack[i] === needle) return true
            }
            return false
        },
        mergeWithUniqueId(replacements, existingArray){
            return qm.arrayHelper.concatenateUniqueId(replacements, existingArray)
        },
        replaceElementInArrayById(array, replacementElement){
            return qm.arrayHelper.concatenateUniqueId([replacementElement], array)
        },
        removeLastItem(array){
            if(!array){
                qm.qmLog.error("No array provided to removeLastItem")
                return array
            }
            if(!qm.arrayHelper.variableIsArray(array)){
                qm.qmLog.error("Non-array provided to removeLastItem")
                return array
            }
            array.pop()
        },
        removeLastItemsUntilSizeLessThan(maxKb, array){
            if(!array){
                qm.qmLog.error("No array provided to removeLastItem")
                return array
            }
            if(!qm.arrayHelper.variableIsArray(array)){
                qm.qmLog.error("Non-array provided to removeLastItemsUntilSizeLessThan")
                return array
            }
            if(array.length < 2){
                qm.qmLog.error("Removing only element from single item array!")
                return []
            }
            while(qm.arrayHelper.getSizeInKiloBytes(array) > maxKb){
                qm.arrayHelper.removeLastItem(array)
            }
            return array
        },
        sortByProperty(arrayToSort, propertyName){
            qm.qmLog.info("Sorting by " + propertyName + "...")
            if(!qm.arrayHelper.variableIsArray(arrayToSort)){
                qm.qmLog.info("Cannot sort by " + propertyName + " because it's not an array!")
                return arrayToSort
            }
            if(arrayToSort.length < 2){
                return arrayToSort
            }
            if(propertyName.indexOf('-') > -1){
                arrayToSort.sort(function(a, b){
                    return b[propertyName.replace('-', '')] - a[propertyName.replace('-', '')]
                })
            }else{
                arrayToSort.sort(function(a, b){
                    return a[propertyName] - b[propertyName]
                })
            }
            return arrayToSort
        },
        unsetNullProperties(array){
            if(!array){
                qm.qmLog.error("Nothing provided to unsetNullProperties")
                return null
            }
            for(let i = 0; i < array.length; i++){
                array[i] = qm.objectHelper.unsetNullProperties(array[i])
            }
            return array
        },
        variableIsArray(variable){
            if(!variable){
                qm.qmLog.info(variable + " provided to variableIsArray")
                return false
            }
            let isAnArray = Array.isArray(variable)
            if(isAnArray){
                return true
            }
            let constructorArray = variable.constructor === Array
            if(constructorArray){
                return true
            }
            let instanceOfArray = variable instanceof Array
            if(instanceOfArray){
                return true
            }
            return Object.prototype.toString.call(variable) === '[object Array]'
        },
        removeArrayElementsWithDuplicateIds(array){
            if(!array){
                return array
            }
            let a = array.concat()
            for(let i = 0; i < a.length; i++){
                for(let j = i + 1; j < a.length; j++){
                    if(!a[i]){
                        qm.qmLog.error('a[i] not defined!')
                    }
                    if(!a[j]){
                        qm.qmLog.error('a[j] not defined!')
                        return a
                    }
                    if(a[i].id === a[j].id){
                        a.splice(j--, 1)
                    }
                }
            }
            return a
        },
        filterByRequestParams(array, requestParams){
            if(!array){
                qm.qmLog.error("Nothing provided to filterByRequestParams")
                return array
            }
            if(!requestParams){
                qm.qmLog.info("No requestParams provided to filterByRequestParams")
                return array
            }
            let allowedFilterParams = ['variableCategoryName', 'id', 'name', 'manualTracking', 'outcome', 'upc',
                'variableName', 'connectorName']
            let excludedFilterParams = ['includePublic', 'excludeLocal', 'minimumNumberOfResultsRequiredToAvoidAPIRequest',
                'sort', 'limit', 'appName', 'appVersion', 'accessToken', 'clientId', 'barcodeFormat', 'searchPhrase',
                'fallbackToAggregatedCorrelations',
                'platform', 'reason']
            let greaterThanPropertyName = null
            let greaterThanPropertyValue = null
            let lessThanPropertyName = null
            let lessThanPropertyValue = null
            let filterPropertyValues = []
            let filterPropertyNames = []
            for(let key in requestParams){
                if(!requestParams.hasOwnProperty(key)){
                    continue
                }
                let value = requestParams[key]
                if(typeof value === "string" && value.indexOf('(lt)') !== -1){
                    lessThanPropertyValue = value.replace('(lt)', "")
                    lessThanPropertyValue = Number(lessThanPropertyValue)
                    lessThanPropertyName = key
                }else if(typeof value === "string" && value.indexOf('(gt)') !== -1){
                    greaterThanPropertyValue = value.replace('(gt)', "")
                    greaterThanPropertyValue = Number(greaterThanPropertyValue)
                    greaterThanPropertyName = key
                }else{
                    if(value === false && key === "manualTracking"){
                        continue
                    }
                    if(value === null || value === "" || value === "Anything"){
                        continue
                    }
                    if(excludedFilterParams.indexOf(key) !== -1){
                        continue
                    }
                    if(allowedFilterParams.indexOf(key) === -1){
                        qm.qmLog.error(key + " is not in allowed filter params")
                    }
                    qm.qmLog.info("filtering by " + key)
                    filterPropertyValues.push(value)
                    filterPropertyNames.push(key)
                }
            }
            let results = qm.arrayHelper.filterByPropertyOrSize(array, null, null, lessThanPropertyName, lessThanPropertyValue,
                greaterThanPropertyName, greaterThanPropertyValue)
            if(results){
                for(let i = 0; i < filterPropertyNames.length; i++){
                    results = qm.arrayHelper.filterByProperty(filterPropertyNames[i], filterPropertyValues[i], results)
                }
            }
            if(!results){
                return null
            }
            if(requestParams.searchPhrase && requestParams.searchPhrase !== ""){
                results = qm.arrayHelper.getWithNameContainingEveryWord(requestParams.searchPhrase, results)
            }
            if(requestParams && requestParams.sort){
                results = qm.arrayHelper.sortByProperty(results, requestParams.sort)
            }
            results = qm.arrayHelper.removeArrayElementsWithDuplicateIds(results)
            return results
        },
        getUnique(array, propertyName){
            if(!propertyName){
                function onlyUnique(value, index, self){
                    return self.indexOf(value) === index
                }
                return array.filter(onlyUnique)
            }
            let flags = []; let output = []; let l = array.length; let i
            for(i = 0; i < l; i++){
                if(flags[array[i][propertyName]]){
                    continue
                }
                flags[array[i][propertyName]] = true
                output.push(array[i])
            }
            return output
        },
        deleteFromArrayByProperty(localStorageItemArray, propertyName, propertyValue){
            let elementsToKeep = []
            for(let i = 0; i < localStorageItemArray.length; i++){
                if(localStorageItemArray[i][propertyName] !== propertyValue){
                    elementsToKeep.push(localStorageItemArray[i])
                }
            }
            return elementsToKeep
        },
        addToOrReplaceByIdAndMoveToFront(localStorageItemArray, replacementElementArray, key){
            if(!(replacementElementArray instanceof Array)){
                replacementElementArray = [replacementElementArray]
            }
            // Have to stringify/parse to create cloned variable or it adds all stored reminders to the array to be posted
            let elementsToKeep = JSON.parse(JSON.stringify(replacementElementArray))
            let found = false
            if(localStorageItemArray){ // NEED THIS DOUBLE LOOP IN CASE THE STUFF WE'RE ADDING IS AN ARRAY
                for(let i = 0; i < localStorageItemArray.length; i++){
                    found = false
                    for(let j = 0; j < replacementElementArray.length; j++){
                        if(typeof replacementElementArray[j] === "string"){
                            throw key + " replacementElementArray item is string: " + replacementElementArray[j]
                        }
                        if(!replacementElementArray[j].id){
                            qm.qmLog.warn("No id on " + key + " replacementElementArray item: " + JSON.stringify(replacementElementArray[j]))
                        }
                        if(replacementElementArray[j].id &&
                            localStorageItemArray[i].id === replacementElementArray[j].id){
                            found = true
                        }
                    }
                    if(!found){
                        elementsToKeep.push(localStorageItemArray[i])
                    }
                }
            }
            return elementsToKeep
        },
        getSizeInKiloBytes(string){
            if(typeof value !== "string"){
                string = JSON.stringify(string)
            }
            return Math.round(string.length * 16 / (8 * 1024))
        },
        getFirstElementIfArray(possibleArray){
            if(qm.arrayHelper.variableIsArray(possibleArray)){
                return possibleArray[0]
            }
            return possibleArray
        },
        moveElementOfArray(arr, old_index, new_index){
            if(new_index >= arr.length){
                let k = new_index - arr.length + 1
                while(k--){
                    arr.push(undefined)
                }
            }
            arr.splice(new_index, 0, arr.splice(old_index, 1)[0])
            return arr // for testing
        },
    },
    assert: {
        count(expected, array){
            if(array.length !== expected){
                throw "Array length should be " + expected + " but is " + array.length
            }
        },
        doesNotHaveProperty(array, propertyName){
            if(typeof array !== "Array"){
                array = [array]
            }
            for(let i = 0; i < array.length; i++){
                let item = array[i]
                if(typeof item[propertyName] !== "undefined"){
                    qm.qmLog.itemAndThrowException(item, "should not have " + propertyName + " (" + item[propertyName] + ")")
                }
            }
        },
        doesNotHaveUserId(item){
            qm.assert.doesNotHaveProperty(item, 'userId')
        },
        throwTestException(testMessage, customMessage){
            if(customMessage){
                customMessage = ': ' + customMessage
            }else{
                customMessage = ''
            }
            let combinedMessage = testMessage + customMessage
            console.error("FAILED: " + combinedMessage + "\n")
            let e = new Error(combinedMessage)
            e.stack = qm.stringHelper.getStringBeforeSubstring('at Gulp', e.stack, e.stack)
            e.stack = qm.stringHelper.getStringBeforeSubstring('at Object.runAllTestsForType', e.stack, e.stack)
            e.stack = qm.stringHelper.getStringAfter('Object.throwTestException', combinedMessage, e.stack)
            throw e
        },
        equals(expected, actual, message){
            if(expected !== actual){
                qm.assert.throwTestException("Expected " + expected + " but got " + actual, message)
            }
        },
        contains(expected, actual, message){
            if(actual.indexOf(expected) === -1){
                qm.assert.throwTestException("Expected to contain " + expected + " but got " + actual, message)
            }
        },
        doesNotEqual(expected, actual, message){
            if(expected === actual){
                qm.assert.throwTestException("Actual value " + actual + " should not equal " + expected, message)
            }
        },
        greaterThan(expected, actual, message){
            if(actual <= expected){
                qm.assert.throwTestException("Actual value " + actual + " shoudl be greater than " + expected, message)
            }
        },
        doesNotContain(expected, actual, message){
            if(actual.indexOf(expected) !== -1){
                qm.assert.throwTestException("Actual value " + actual + " should not contain " + expected, message)
            }
        },
        variables: {
            descendingOrder(variables, property){
                if(qm.appMode.isDebug()){
                    qm.qmLog.variables(variables, property)
                }
                qm.assert.descendingOrder(variables, property)
            },
        },
        descendingOrder(array, property){
            let lastValue = array[0][property]
            for(let i = 0; i < array.length; i++){
                let qmElement = array[i]
                let currentValue = qmElement[property]
                if(currentValue > lastValue){
                    throw "current " + property + " " + currentValue + " is greater than last value " + lastValue
                }
            }
        },
        isNull(value, name){
            if(value !== null){
                throw name + " should be null but is " + JSON.stringify(value)
            }
        },
    },
    auth: {
        getAccessToken(){
            return qm.auth.getAccessTokenFromUrlUserOrStorage()
        },
        getAndSaveAccessTokenFromCurrentUrl(){
            qm.qmLog.authDebug("getAndSaveAccessTokenFromCurrentUrl " + qm.urlHelper.getCurrentUrl())
            let accessTokenFromUrl = qm.auth.getAccessTokenFromCurrentUrl()
            if(accessTokenFromUrl){
                if(!qm.auth.accessTokenIsValid(accessTokenFromUrl)){
                    return null
                }
                qm.qmLog.authDebug("getAndSaveAccessTokenFromCurrentUrl saving " + accessTokenFromUrl)
                qm.auth.saveAccessToken(accessTokenFromUrl)
            }
            return accessTokenFromUrl
        },
        accessTokenIsValid(accessToken){
            if(accessToken.length < 10 && accessToken !== "demo"){
                qm.qmLog.error("This accessTokenFromUrl is not valid: " + accessToken)
                return false
            }
            return true
        },
        saveAccessToken(accessToken){
            if(!qm.urlHelper.getParam('doNotRemember')){
                qm.qmLog.authDebug("saveAccessToken: Saving access token in local storage because doNotRemember is not set")
                qm.storage.setItem(qm.items.accessToken, accessToken)
            }
        },
        getAccessTokenFromUrlUserOrStorage(){
            let accessToken = qm.auth.getAndSaveAccessTokenFromCurrentUrl()
            if(accessToken){
                qm.qmLog.authDebug("getAndSaveAccessTokenFromCurrentUrl returned " + accessToken)
                return accessToken
            }
            let u = qm.userHelper.getUserFromLocalStorage()
            if(u){
                accessToken = u.accessToken
                if(accessToken){
                    if(!qm.auth.accessTokenIsValid(accessToken)){
                        qm.qmLog.error("qm.userHelper.getUserFromLocalStorage().accessToken is invalid: " + accessToken)
                    }else{
                        qm.qmLog.info("getUserFromLocalStorage().accessToken returned " + accessToken)
                        return accessToken
                    }
                }
            }
            accessToken = qm.storage.getItem(qm.items.accessToken)
            if(accessToken){
                if(!qm.auth.accessTokenIsValid(accessToken)){
                    qm.qmLog.error("accessTokenFromUrl is invalid: " + accessToken)
                }else{
                    qm.qmLog.info("qm.storage.getItem(qm.items.accessToken)returned " + accessToken)
                    return accessToken
                }
            }
            qm.qmLog.info("No access token or user!")
            return null
        },
        saveAccessTokenResponse(accessResponse){
            let accessToken
            if(typeof accessResponse === "string"){
                accessToken = accessResponse
            }else{
                accessToken = accessResponse.accessToken || accessResponse.access_token
            }
            if(accessToken){
                qm.storage.setItem('accessToken', accessToken)
            }else{
                qm.qmLog.error('No access token provided to qm.auth.saveAccessTokenResponse')
                return
            }
            let refreshToken = accessResponse.refreshToken || accessResponse.refresh_token
            if(refreshToken){
                qm.storage.setItem(qm.items.refreshToken, refreshToken)
            }
            /** @namespace accessResponse.expiresAt */
            let expiresAt = accessResponse.expires || accessResponse.expiresAt || accessResponse.accessTokenExpires
            let expiresAtMilliseconds
            let bufferInMilliseconds = 86400 * 1000 // Refresh a day in advance
            if(accessResponse.accessTokenExpiresAtMilliseconds){
                expiresAtMilliseconds = accessResponse.accessTokenExpiresAtMilliseconds
            }else if(typeof expiresAt === 'string' || expiresAt instanceof String){
                expiresAtMilliseconds = qm.timeHelper.getUnixTimestampInMilliseconds(expiresAt)
            }else if(expiresAt === parseInt(expiresAt, 10) && expiresAt < qm.timeHelper.getUnixTimestampInMilliseconds()){
                expiresAtMilliseconds = expiresAt * 1000
            }else if(expiresAt === parseInt(expiresAt, 10) && expiresAt > qm.timeHelper.getUnixTimestampInMilliseconds()){
                expiresAtMilliseconds = expiresAt
            }else{
                // calculate expires at
                /** @namespace accessResponse.expiresIn */
                let expiresInSeconds = accessResponse.expiresIn || accessResponse.expires_in
                expiresAtMilliseconds = qm.timeHelper.getUnixTimestampInMilliseconds() + expiresInSeconds * 1000
                qm.qmLog.authDebug("Expires in is " + expiresInSeconds + ' seconds. This results in expiresAtMilliseconds being: ' + expiresAtMilliseconds)
            }
            if(expiresAtMilliseconds){
                qm.storage.setItem(qm.items.expiresAtMilliseconds, expiresAtMilliseconds - bufferInMilliseconds)
                return accessToken
            }
                qm.qmLog.authDebug('No expiresAtMilliseconds!',
                    'expiresAt is ' + expiresAt + ' || accessResponse is ' + JSON.stringify(accessResponse) + ' and user is ' + qm.storage.getAsString('user'),
                    {groupingHash: 'No expiresAtMilliseconds!'},
                    "error")

            let groupingHash = 'Access token expiresAt not provided in recognizable form!'
            qm.qmLog.authDebug(groupingHash,
                'expiresAt is ' + expiresAt + ' || accessResponse is ' + JSON.stringify(accessResponse) + ' and user is ' + qm.storage.getAsString('user'),
                {groupingHash}, "error")
        },
        getAccessTokenFromCurrentUrl(){
            qm.qmLog.webAuthDebug("getAndSaveAccessTokenFromCurrentUrl " + qm.urlHelper.getCurrentUrl())
            let accessTokenFromUrl = (qm.urlHelper.getParam('accessToken')) ? qm.urlHelper.getParam('accessToken') : qm.urlHelper.getParam('quantimodoAccessToken')
            if(accessTokenFromUrl && accessTokenFromUrl.indexOf("#") !== -1){ // Sometimes #/app/settings gets appended for some reason
                accessTokenFromUrl = qm.stringHelper.getStringBeforeSubstring('#', accessTokenFromUrl)
            }
            if(accessTokenFromUrl){
                qm.qmLog.webAuthDebug("Got access token from url")
            }else{
                qm.qmLog.webAuthDebug("No access token from url")
            }
            return accessTokenFromUrl
        },
        deleteAllAccessTokens(reason){
            qm.qmLog.info("deleteAllAccessTokens because: " + reason)
            qm.storage.removeItem('accessToken')
            let u = qm.userHelper.getUserFromLocalStorage()
            if(u){ u.accessToken = null }
            qm.auth.deleteAllCookies()
            qm.api.configureClient('deleteAllAccessTokens')
        },
        deleteAllCookies(){
            if(typeof document === "undefined"){ return }
            qm.qmLog.info("Deleting all cookies...")
            let cookies = document.cookie.split(";")
            for(let i = 0; i < cookies.length; i++){
                let cookie = cookies[i]
                let eqPos = cookie.indexOf("=")
                let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
            }
        },
        getPermissionString(){
            let str = ""
            let permissions = ['readmeasurements', 'writemeasurements']
            for(let i = 0; i < permissions.length; i++){
                str += permissions[i] + "%20"
            }
            return str.replace(/%20([^%20]*)$/, '$1')
        },
        generateV1OAuthUrl(register){
            let url = qm.api.getBaseUrl() + "/api/oauth2/authorize?"
            // add params
            url += "response_type=code"
            url += "&client_id=" + qm.api.getClientId()
            //url += "&client_secret=" + qm.appsManager.getClientSecret();
            url += "&scope=" + qm.auth.getPermissionString()
            url += "&state=testabcd"
            if(register === true){
                url += "&register=true"
            }
            url += "&redirect_uri=" + qm.auth.getRedirectUri()
            qm.qmLog.debug('generateV1OAuthUrl: ' + url)
            return url
        },
        openBrowserWindowAndGetParameterFromRedirect(url, redirectUrl, parameterName, successHandler, ref){
            if(!qm.platform.getWindow()){
                return false
            }
            redirectUrl = redirectUrl || qm.auth.getRedirectUri()
            qm.qmLog.authDebug('Going to try logging in by opening new tab at url ' + url)
            ref = ref || window.open(url, '_blank')
            if(!ref){
                qm.qmLog.error('You must first unblock popups, and and refresh the page for this to work!')
                alert("In order to log in, please unblock popups by clicking the icon on the right of the address bar. Then refresh the page.")
            }else{
                qm.qmLog.authDebug('Opened ' + url + ' and now broadcasting isLoggedIn message question every second to sibling tabs')
                let interval = setInterval(function(){
                    ref.postMessage('isLoggedIn?', redirectUrl)
                }, 1000)
                window.onMessageReceived = function(event){ // handler when a message is received from a sibling tab
                    qm.qmLog.authDebug('message received from sibling tab', null, event.url)
                    if(interval !== false){
                        clearInterval(interval) // Don't ask login question anymore
                        interval = false
                        let value = qm.urlHelper.getParameterFromEventUrl(event, parameterName)
                        if(value){
                            successHandler(value)
                            ref.close()
                        }
                        qm.urlHelper.checkLoadStartEventUrlForErrors(ref, event)
                    }
                }
                // listen to broadcast messages from other tabs within browser
                window.addEventListener("message", window.onMessageReceived, false)
            }
        },
        oAuthBrowserLogin(register, successHandler){
            let url = qm.auth.generateV1OAuthUrl(register)
            let redirectUrl = qm.auth.getRedirectUri()
            qm.auth.openBrowserWindowAndGetParameterFromRedirect(url, redirectUrl, 'code', successHandler)
        },
        getRedirectUri(){
            let appSettings = qm.getAppSettings()
            if(appSettings && appSettings.redirectUri){
                return appSettings.redirectUri
            }
            return qm.api.getBaseUrl() + '/callback/'
        },
        getAccessTokenFromUrlAndSetLocalStorageFlags(stateName){
            if(qm.auth.accessTokenFromUrl){
                return qm.auth.accessTokenFromUrl
            }
            qm.qmLog.webAuthDebug("getAccessTokenFromUrl: No previous qm.auth.accessTokenFromUrl")
            qm.auth.accessTokenFromUrl = qm.auth.getAccessTokenFromCurrentUrl()
            if(!qm.auth.accessTokenFromUrl){
                return null
            }
            if(stateName !== 'app.login'){
                qm.qmLog.authDebug("getAccessTokenFromUrl: Setting qm.auth.accessTokenFromUrl to " + qm.auth.accessTokenFromUrl)
                qm.qmLog.authDebug("getAccessTokenFromUrl: Setting onboarded and introSeen in local storage because we got an access token from url")
                qm.storage.setItem(qm.items.onboarded, true)
                qm.storage.setItem(qm.items.introSeen, true)
                qm.qmLog.info('Setting onboarded and introSeen to true')
                qm.qmLog.info('Setting afterLoginGoToState and afterLoginGoToUrl to null')
                qm.storage.setItem(qm.items.afterLoginGoToState, null)
                qm.storage.setItem(qm.items.afterLoginGoToUrl, null)
            }else{
                qm.qmLog.info('On login state so not setting afterLoginGoToState and afterLoginGoToUrl to null')
            }
            qm.qmLog.authDebug("getAccessTokenFromUrl: returning this access token: " + qm.auth.accessTokenFromUrl)
            return qm.auth.accessTokenFromUrl
        },
        logout(reason){
            qm.auth.deleteAllAccessTokens(reason)
            qm.auth.deleteAllCookies()
            qm.auth.logOutOfWebsite()
        },
        logOutOfWebsite(){
            if(!qm.platform.getWindow()){
                return false
            }
            //var afterLogoutGoToUrl = qm.api.getQuantiModoUrl('ionic/Modo/www/index.html#/app/intro');
            let afterLogoutGoToUrl = qm.urlHelper.getIonicUrlForPath('intro')
            if(qm.urlHelper.indexOfCurrentUrl('/src/') !== -1){
                afterLogoutGoToUrl = afterLogoutGoToUrl.replace('/www/', '/src/')
            }
            if(qm.urlHelper.indexOfCurrentUrl('.quantimo.do/') === -1){
                afterLogoutGoToUrl = qm.urlHelper.getCurrentUrl()
            }
            afterLogoutGoToUrl = afterLogoutGoToUrl.replace('settings', 'intro')
            if(qm.platform.isChromeExtension()){
                afterLogoutGoToUrl = qm.api.getQuantiModoUrl("api/v1/window/close")
            }
            let logoutUrl = qm.api.getQuantiModoUrl("api/v2/auth/logout?afterLogoutGoToUrl=" + encodeURIComponent(afterLogoutGoToUrl))
            qm.qmLog.info("Sending to " + logoutUrl)
            let request = {
                method: 'GET',
                url: logoutUrl,
                responseType: 'json',
                headers: {'Content-Type': "application/json"},
            }
            //$http(request);
            // Get request doesn't seem to clear cookies
            window.location.replace(logoutUrl)
        },
        weShouldSetAfterLoginStateOrUrl(afterLoginGoToStateOrUrl){
            if(qm.storage.getItem(qm.items.afterLoginGoToUrl)){
                qm.qmLog.info('afterLoginGoToUrl already set to ' + qm.storage.getItem(qm.items.afterLoginGoToUrl))
                return false
            }
            if(qm.storage.getItem(qm.items.afterLoginGoToState)){
                qm.qmLog.info('afterLoginGoToState already set to ' + qm.storage.getItem(qm.items.afterLoginGoToState))
                return false
            }
            if(afterLoginGoToStateOrUrl.indexOf('login') !== -1){
                qm.qmLog.info('setAfterLoginGoToState: Why are we sending to login from login state?')
                return false
            }
            return true
        },
        setAfterLoginGoToUrl(afterLoginGoToUrl){
            if(!afterLoginGoToUrl){
                afterLoginGoToUrl = qm.urlHelper.getCurrentUrl()
            }
            if(!qm.auth.weShouldSetAfterLoginStateOrUrl(afterLoginGoToUrl)){
                return false
            }
            qm.qmLog.debug('Setting afterLoginGoToUrl to ' + afterLoginGoToUrl + ' and going to login.')
            qm.storage.setItem(qm.items.afterLoginGoToUrl, afterLoginGoToUrl)
        },
        sendToLogin(reason){
            qm.qmLog.info("Sending to login because " + reason)
            let urlToken = qm.urlHelper.getParam('access_token')
            if(urlToken){
                if(!qm.auth.getAccessTokenFromCurrentUrl()){
                    qm.qmLog.error("Not detecting snake case access_token", {}, qm.qmLog.getStackTrace())
                }
                qm.qmLog.error("Sending to login even though we have an url access token (" + urlToken + ") because " + reason,
                    {}, qm.qmLog.getStackTrace())
                return
            }
            qm.urlHelper.goToUrl('#/app/login', reason)
        },
        setAfterLoginGoToUrlAndSendToLogin(reason){
            if(qm.urlHelper.indexOfCurrentUrl('login') !== -1){
                qm.qmLog.info('qm.auth.setAfterLoginGoToUrlAndSendToLogin: Why are we sending to login from login state?')
                return
            }
            qm.auth.setAfterLoginGoToUrl()
            qm.auth.sendToLogin(reason)
        },
        handle401Response(response, options){
            options = options || {}
            if(options && options.doNotSendToLogin){
                return
            }
            let reason = 'we got this 401 response: ' + JSON.stringify(response)
            qm.auth.deleteAllAccessTokens(reason)
            qm.auth.setAfterLoginGoToUrlAndSendToLogin(reason)
        },
    },
    builder: {},
    chartHelper: {
        setChartExportingOptionsOnce(highchartConfig){
            if(!highchartConfig){
                qm.qmLog.info("No highchartConfig provided to setChartExportingOptionsOnce")
                return highchartConfig
            }
            highchartConfig.exporting = {enabled: qm.platform.isWeb()}
            return highchartConfig
        },
        setChartExportOptionsForAllSubProperties(something){
            let keys = Object.keys(something)
            for(let i = 0; i < keys.length; i++){
                if(something[keys[i]] && typeof something[keys[i]] === 'object'){
                    if(something[keys[i]].highchartConfig){
                        qm.chartHelper.setChartExportingOptionsOnce(something[keys[i]].highchartConfig)
                    }else{
                        qm.chartHelper.setChartExportOptionsForAllSubProperties(something[keys[i]])
                    }
                }
            }
        },
    },
    chatButton: {
        setZohoChatButtonZIndex(){
            setTimeout(function(){
                //var x = document.getElementById("zsiq_float");
                let x = document.querySelector('body > div.zsiq_custommain.siq_bR')
                //x.style.zIndex = "10 !important";
                if(x){ x.setAttribute('style', 'z-index: 10 !important') }
            }, 15000)
        },
        getDriftButtonElement(){
            let x = document.querySelector('#root')
            return x
        },
        hideDriftButton(){
            if(typeof drift === "undefined"){ return }
            console.debug("called hide drift")
            drift.on('ready', function(api){
                console.debug("hiding drift")
                api.widget.hide()
            })
        },
        showDriftButton(){
            if(typeof drift === "undefined"){
                qm.qmLog.error("drift not defined!")
                return
            }
            console.debug("called show drift")
            drift.on('ready', function(api){
                console.debug("showing drift")
                api.widget.show()
            })
        },
        openDriftSidebar(){
            if(typeof drift === "undefined"){
                qm.qmLog.error("drift not defined!")
                return
            }
            console.debug("called open drift")
            drift.on('ready', function(api){
                console.debug("open drift")
                api.sidebar.open() // https://devdocs.drift.com/docs/conversation-sidebar
            })
        },
    },
    client: {
        getClientWebsiteUrl(successHandler, partialPath){
            if(!partialPath){
                partialPath = ''
            }
            qm.api.getClientIdWithCallback(function(clientId){
                // TODO: Stop using quantimodo.quantimo.do for resource hosting on Github so we can point quantimodo.quantimo.do to Netlify
                if(clientId === 'quantimodo'){ clientId = 'web' }
                let url = "https://" + clientId + ".quantimo.do/" + partialPath
                url = qm.urlHelper.addUrlQueryParamsToUrlString({clientId}, url)
                successHandler(url)
            })
        },
    },
    connectorHelper: {
        getConnectorsFromApi(params, successCallback, errorHandler){
            qm.qmLog.info("Getting connectors from API...")
            function successHandler(response){
                let connectors = response.connectors || response
                if(connectors){
                    qm.qmLog.info("Got connectors from API...")
                    qm.storage.setItem(qm.items.connectors, connectors)
                    if(successCallback){
                        successCallback(connectors)
                    }
                }else{
                    qm.qmLog.error("Could not get connectors from API...")
                }
            }
            qm.api.configureClient(arguments.callee.name, null, params)
            let apiInstance = new qm.Quantimodo.ConnectorsApi()
            function callback(error, data, response){
                qm.api.generalResponseHandler(error, data, response, successHandler, errorHandler, params, 'getConnectorsFromApi')
            }
            params = qm.api.addGlobalParams(params)
            apiInstance.getConnectors(params, callback)
        },
        getConnectorsFromLocalStorage(){
            let connectors = qm.storage.getItem(qm.items.connectors)
            if(connectors && connectors.connectors){
                qm.storage.setItem(qm.items.connectors, connectors.connectors)
                return connectors.connectors
            }
            return connectors
        },
        getConnectorsFromLocalStorageOrApi(successHandler, errorHandler){
            let connectors = qm.connectorHelper.getConnectorsFromLocalStorage()
            if(connectors){
                if(successHandler){
                    successHandler(connectors)
                }
                return connectors
            }
            if(qm.getUser()){
                qm.connectorHelper.getConnectorsFromApi({}, successHandler, errorHandler)
            }else{
                if(qm.staticData && qm.staticData.connectors){
                    if(successHandler){
                        successHandler(qm.staticData.connectors)
                    }
                    return qm.staticData.connectors
                }
                    qm.qmLog.error("Could not get connectors from qm.staticData.connectors")
                    qm.connectorHelper.getConnectorsFromApi({}, successHandler, errorHandler)

            }
        },
        getConnectorByName(connectorName, successHandler, errorHandler){
            if(!successHandler){
                let connectors = qm.connectorHelper.getConnectorsFromLocalStorage()
                return connectors.find(function(connector){
                    return connector.name === connectorName.toLowerCase()
                })
            }
            qm.connectorHelper.getConnectorsFromLocalStorageOrApi(function(connectors){
                if(!connectors){
                    qm.qmLog.error("No getConnectorsFromLocalStorageOrApi!")
                    if(errorHandler){
                        errorHandler("No getConnectorsFromLocalStorageOrApi!")
                    }
                    return
                }
                let match = connectors.find(function(connector){
                    return connector.name === connectorName.toLowerCase()
                })
                successHandler(match)
            }, errorHandler)
        },
        storeConnectorResponse(response){
            function hideUnavailableConnectors(connectors){
                for(let i = 0; i < connectors.length; i++){
                    //if(connectors[i].name === 'facebook' && $rootScope.platform.isAndroid) {connectors[i].hide = true;}
                    if(connectors[i].spreadsheetUpload && qm.platform.isMobile()){
                        connectors[i].hide = true
                    }
                }
                return response
            }
            if(response.user){
                qm.userHelper.setUser(response.user)
            }
            let connectors = response.connectors || response
            connectors = hideUnavailableConnectors(connectors)
            qm.storage.setItem(qm.items.connectors, connectors)
            return connectors
        },
    },
    cookieHelper: {
        getCookie(name){
            let value = "; " + document.cookie
            let parts = value.split("; " + name + "=")
            if(parts.length == 2) return parts.pop().split(";").shift()
        },
        getGACookie(){
            return qm.cookieHelper.getCookie('_gid')
        },
    },
    correlations: {
        getAggregatedCorrelationsFromApi(params, successHandler, errorHandler){
            params = qm.api.addGlobalParams(params)
            params.commonOnly = true
            let cachedData = qm.api.cacheGet(params, qm.items.aggregatedCorrelations)
            if(cachedData && successHandler){
                successHandler(cachedData)
                return
            }
            qm.api.configureClient(arguments.callee.name, null, params)
            let apiInstance = new qm.Quantimodo.AnalyticsApi()
            function callback(error, data, response){
                qm.api.generalResponseHandler(error, data, response, successHandler, errorHandler, params, 'getAggregatedCorrelationsFromApi')
            }
            apiInstance.getCorrelations(params, callback)
        },
        getUserCorrelationsFromApi(params, successHandler, errorHandler){
            params = qm.api.addGlobalParams(params)
            let cachedData = qm.api.cacheGet(params, qm.items.userCorrelations)
            if(cachedData && successHandler){
                successHandler(cachedData)
                return
            }
            qm.api.configureClient(arguments.callee.name, null, params)
            let apiInstance = new qm.Quantimodo.AnalyticsApi()
            function callback(error, data, response){
                qm.api.generalResponseHandler(error, data, response, successHandler, errorHandler, params, qm.items.userCorrelations)
            }
            apiInstance.getCorrelations(params, callback)
        },
    },
    dialogFlow: {
        apiAi: null,
        apiAiPrepare(){
            qm.qmLog.info("apiAiPrepare...")
            apiai = new Bravey.ApiAiAdapter("data/apiai", {language: "EN"})
            let entities = qm.staticData.dialogAgent.entities
            qm.objectHelper.loopThroughProperties(entities, function(entityName, entity){
                apiai.loadEntity(entityName)
            })
            let intents = qm.staticData.dialogAgent.intents
            qm.objectHelper.loopThroughProperties(intents, function(intentName, intent){
                if(intentName.indexOf("Knowledge") !== -1){
                    return
                }
                apiai.loadIntent(intentName)
            })
            apiai.prepare(function(){
                qm.qmLog.info("apiAi NLP ready!")
                qm.apiAi = apiai
            })
        },
        loopThroughIntents(callback){
            let intents = qm.staticData.dialogAgent.intents
            qm.objectHelper.loopThroughProperties(intents, callback)
        },
        apiAiTest(text){
            if(!qm.apiAi){
                qm.qmLog.info("qm.apiAi not defined")
                return false
            }
            let out = qm.apiAi.nlp.test(text)
            qm.qmLog.info("api ai: ", out)
            return out
        },
        bravy: null,
        getBravy(){
            if(qm.dialogFlow.bravy){
                return qm.dialogFlow.bravy
            }
            let bravy = new Bravey.Nlp.Fuzzy()
            let intents = qm.staticData.dialogAgent.intents
            qm.objectHelper.loopThroughProperties(intents, function(intentName, intent){
                let dialogFlowIntentParameterEntities = intent.responses[0].parameters
                let bravyIntentEntities = []
                for(let i = 0; i < dialogFlowIntentParameterEntities.length; i++){
                    let dialogFlowIntentParameterEntity = dialogFlowIntentParameterEntities[i]
                    let bravyEntityName = dialogFlowIntentParameterEntity.dataType.replace("@sys.", "")
                    bravyEntityName = bravyEntityName.replace("@", "")
                    if(bravyEntityName === "variableName"){
                        continue
                    }
                    bravyIntentEntities.push({entity: bravyEntityName, id: dialogFlowIntentParameterEntity.name})
                }
                console.debug("bravyIntentEntities", bravyIntentEntities)
                if(bravyIntentEntities.length){
                    bravy.addIntent(intentName, bravyIntentEntities)
                }
            })
            bravy.addEntity(new Bravey.NumberEntityRecognizer("number"))
            console.debug("Adding matches...")
            let entities = qm.staticData.dialogAgent.entities
            qm.objectHelper.loopThroughProperties(entities, function(entityName, entity){
                if(entityName === "variableName"){
                    return
                }
                console.debug("Adding sentences for " + entityName)
                let braveyEntity = new Bravey.StringEntityRecognizer(entityName)
                let entries = entity.entries
                for(let i = 0; i < entries.length; i++){
                    let entry = entries[i]
                    try{
                        braveyEntity.addMatch(entry.value, entry.value)
                    }catch (error){
                        qm.qmLog.error(error)
                        continue
                    }
                    let synonyms = entry.synonyms
                    console.debug("Adding synonyms for " + entry.value)
                    for(let j = 0; j < synonyms.length; j++){
                        let synonym = synonyms[j]
                        console.debug("addMatch for " + synonym)
                        try{
                            braveyEntity.addMatch(entry.value, synonym)
                        }catch (error){
                            qm.qmLog.error(error)
                        }
                    }
                }
                console.debug("braveyEntity", braveyEntity)
                bravy.addEntity(braveyEntity)
            })
            console.debug("Adding sentences...")
            qm.objectHelper.loopThroughProperties(intents, function(intentName, intent){
                console.debug("Adding sentences for " + intentName)
                let userSaysSentences = intent.usersays
                if(!userSaysSentences){
                    qm.qmLog.error("No userSaysSentences in " + intentName + ": ", intent)
                    return
                }
                for(let i = 0; i < userSaysSentences.length; i++){
                    let userSaysWords = userSaysSentences[i].data
                    let bravySentence = ""
                    for(let j = 0; j < userSaysWords.length; j++){
                        let userSaysWordData = userSaysWords[j]
                        if(!userSaysWordData.meta){
                            bravySentence += userSaysWordData.text
                        }else{
                            let entityName = userSaysWordData.meta.replace("@sys.", "")
                            entityName = entityName.replace("@", "")
                            bravySentence += "{" + entityName + "}"
                        }
                    }
                    console.debug("bravySentence", bravySentence)
                    bravy.addDocument(bravySentence, intentName)
                }
            })
            qm.dialogFlow.bravy = bravy
            console.debug("bravy", bravy)
            return bravy
        },
        post(body, successHandler, errorHandler){
            qm.api.postToQuantiModo(body, "v1/dialogflow", function(response){
                qm.dialogFlow.lastApiResponse = response
                successHandler(response)
            }, function(error){
                errorHandler(error)
            })
        },
        welcomeBody: {
            "responseId": "ab13a388-57f7-42a0-af43-868b2676ff9f",
            "queryResult": {
                "queryText": "GOOGLE_ASSISTANT_WELCOME",
                "action": "input.welcome",
                "parameters": {},
                "allRequiredParamsPresent": true,
                "fulfillmentText": "Oh. It's you. What do you desire?",
                "fulfillmentMessages": [
                    {
                        "text": {
                            "text": [
                                "Oh. It's you. What do you want?",
                            ],
                        },
                    },
                ],
                "outputContexts": [
                    {
                        "name": "projects/dr-modo/agent/sessions/1533757655027/contexts/google_assistant_welcome",
                    },
                    {
                        "name": "projects/dr-modo/agent/sessions/1533757655027/contexts/actions_capability_screen_output",
                    },
                    {
                        "name": "projects/dr-modo/agent/sessions/1533757655027/contexts/actions_capability_audio_output",
                    },
                    {
                        "name": "projects/dr-modo/agent/sessions/1533757655027/contexts/google_assistant_input_type_keyboard",
                    },
                    {
                        "name": "projects/dr-modo/agent/sessions/1533757655027/contexts/actions_capability_web_browser",
                    },
                    {
                        "name": "projects/dr-modo/agent/sessions/1533757655027/contexts/actions_capability_media_response_audio",
                    },
                ],
                "intent": {
                    "name": "projects/dr-modo/agent/intents/b69ed140-5dd7-4cf1-a5b7-f11f8d38bff0",
                    "displayName": "Default Welcome Intent",
                },
                "intentDetectionConfidence": 1,
                "languageCode": "en-us",
            },
            "originalDetectIntentRequest": {
                "source": "google",
                "version": "2",
                "payload": {
                    "isInSandbox": true,
                    "surface": {
                        "capabilities": [
                            {
                                "name": "actions.capability.AUDIO_OUTPUT",
                            },
                            {
                                "name": "actions.capability.SCREEN_OUTPUT",
                            },
                            {
                                "name": "actions.capability.MEDIA_RESPONSE_AUDIO",
                            },
                            {
                                "name": "actions.capability.WEB_BROWSER",
                            },
                        ],
                    },
                    "requestType": "SIMULATOR",
                    "inputs": [
                        {
                            "rawInputs": [
                                {
                                    "query": "Talk to Dr. Modo",
                                    "inputType": "KEYBOARD",
                                },
                            ],
                            "intent": "actions.intent.MAIN",
                        },
                    ],
                    "user": {
                        "lastSeen": "2018-08-07T16:26:13Z",
                        "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjlhMzNiNWVkYjQ5ZDA4NjdhODY3MmQ5NTczYjFlMGQyMzc1ODg2ZTEifQ.eyJhdWQiOiI5MTg3NjEzMjU0OTEtazJ0Y3VkbGg5ZHEyMjdtb2RrMWhnbmlvMDR1aGhvNWQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTg0NDQ2OTMxODQ4Mjk1NTUzNjIiLCJoZCI6InRoaW5rYnludW1iZXJzLm9yZyIsImVtYWlsIjoibUB0aGlua2J5bnVtYmVycy5vcmciLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZXhwIjoxNTMzNzYxMjU1LCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJqdGkiOiJlODFlY2Q4YTA5NmVhOGQ0YmVmOTk0YWMwYTVjZjlmZDczMjBkMTU4IiwiaWF0IjoxNTMzNzU3NjU1LCJuYmYiOjE1MzM3NTczNTUsIm5hbWUiOiJNaWtlIFNpbm4iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDYuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy1CSHI0aHlVV3FaVS9BQUFBQUFBQUFBSS9BQUFBQUFBSUcyOC8yTHYwZW43MzhJSS9zOTYtYy9waG90by5qcGciLCJnaXZlbl9uYW1lIjoiTWlrZSIsImZhbWlseV9uYW1lIjoiU2lubiJ9.qzSwaFXvQiPeKRAX4iCN1hbZMnwRucXF_bgHGxvHL_kJVyeOtjxNBXI8OdJsG1JTrO5J7wSRowbIMpaWdfREjxL6mh_J6nCsF7Q6iIOscCUlfvbHs7Qhqo_nutEXJxrObUFUUMVGvGFXvhkql0kawsgr_YVlCFc7iD4zJC9ljyCOjBJbe3rZBvoQwkOk_4shnRKL0OShHezrfQR4uUHR2etNQwMDva3JZzB9kXGndKYZgbQr1221s6Yklza1VSy0BuIFGQOHZsM5ig5EeQ7PQ7EfQ3gIT2O6u1O0rPQ42j7YNqrXZ2OT4ZRE6x0v4r4QEq8qAZkRqqaeNH7ab4pySA",
                        "locale": "en-US",
                        "userId": "ABwppHHxfsyj2umsF4FaFTEIOzSDJf2jDveTQtBP5CJH-KLJYugjxHPpR_uRxBLovyUADcMpHA",
                    },
                    "conversation": {
                        "conversationId": "1533757655027",
                        "type": "NEW",
                    },
                    "availableSurfaces": [
                        {
                            "capabilities": [
                                {
                                    "name": "actions.capability.AUDIO_OUTPUT",
                                },
                                {
                                    "name": "actions.capability.SCREEN_OUTPUT",
                                },
                                {
                                    "name": "actions.capability.WEB_BROWSER",
                                },
                            ],
                        },
                    ],
                },
            },
            "session": "projects/dr-modo/agent/sessions/1533757655027",
        },
        lastApiResponse: {
            "payload": {
                "google": {
                    "expectUserResponse": true,
                    "richResponse": {
                        "items": [
                            {
                                "simpleResponse": {
                                    "ssml": "<speak> How severe is your stomach cramps on a scale of 1 to 5?<\/speak>",
                                    "displayText": " How severe is your stomach cramps on a scale of 1 to 5?",
                                },
                            },
                        ],
                    },
                    "systemIntent": {
                        "intent": "actions.intent.OPTION",
                        "data": {
                            "@type": "type.googleapis.com\/google.actions.v2.OptionValueSpec",
                            "listSelect": {
                                "title": "How severe is your stomach cramps on a scale of 1 to 5?",
                                "items": [
                                    {
                                        "optionInfo": {
                                            "key": "1\/5-button",
                                            "synonyms": [],
                                        },
                                        "title": "1\/5",
                                    },
                                    {
                                        "optionInfo": {
                                            "key": "2\/5-button",
                                            "synonyms": [],
                                        },
                                        "title": "2\/5",
                                    },
                                    {
                                        "optionInfo": {
                                            "key": "3\/5-button",
                                            "synonyms": [],
                                        },
                                        "title": "3\/5",
                                    },
                                    {
                                        "optionInfo": {
                                            "key": "5\/5-button",
                                            "synonyms": [],
                                        },
                                        "title": "5\/5",
                                    },
                                    {
                                        "optionInfo": {
                                            "key": "4\/5-button",
                                            "synonyms": [],
                                        },
                                        "title": "4\/5",
                                    },
                                ],
                            },
                        },
                    },
                },
            },
            "outputContexts": [
                {
                    "name": "projects\/dr-modo\/agent\/sessions\/1533759866859\/contexts\/tracking_reminder_notification",
                    "lifespanCount": 5,
                    "parameters": {
                        "variableName": "Stomach Cramps",
                        "trackingReminderNotificationId": 29901440,
                        "unitName": "1 to 5 Rating",
                    },
                },
            ],
        },
        postNotificationResponse(value, successHandler, errorHandler){
            if(!qm.dialogFlow.lastApiResponse.outputContexts){
                qm.qmLog.error("No outputContexts!")
                return false
            }
            let outputContext = qm.dialogFlow.lastApiResponse.outputContexts[0]
            if(!outputContext.parameters){
                qm.qmLog.error("No parameters!")
                return false
            }
            outputContext.parameters.value = value
            qm.dialogFlow.notificationResponseBody.queryResult.outputContexts = [outputContext]
            qm.dialogFlow.post(qm.dialogFlow.notificationResponseBody, successHandler, errorHandler)
        },
        notificationResponseBody: {
            "responseId": "eec8a67e-114c-4bd8-8026-c6de0154b7e6",
            "queryResult": {
                "queryText": "actions_intent_OPTION",
                "action": "tracking_reminder_notification",
                "parameters": {
                    "notificationAction": "track",
                    "value": "",
                    "yesNo": "",
                },
                "allRequiredParamsPresent": true,
                "fulfillmentMessages": [
                    {
                        "text": {
                            "text": [
                                "",
                            ],
                        },
                    },
                ],
                "outputContexts": [
                    {
                        "name": "projects/dr-modo/agent/sessions/1533759866859/contexts/google_assistant_input_type_touch",
                        "parameters": {
                            "yesNo": "",
                            "notificationAction": "track",
                            "value.original": "",
                            "notificationAction.original": "",
                            "value": "",
                            "yesNo.original": "",
                        },
                    },
                    {
                        "name": "projects/dr-modo/agent/sessions/1533759866859/contexts/actions_intent_option",
                        "parameters": {
                            "yesNo": "",
                            "notificationAction": "track",
                            "value.original": "",
                            "notificationAction.original": "",
                            "OPTION": "1/5-button",
                            "value": "",
                            "yesNo.original": "",
                        },
                    },
                    {
                        "name": "projects/dr-modo/agent/sessions/1533759866859/contexts/actions_capability_screen_output",
                        "parameters": {
                            "yesNo": "",
                            "notificationAction": "track",
                            "value.original": "",
                            "notificationAction.original": "",
                            "value": "",
                            "yesNo.original": "",
                        },
                    },
                    {
                        "name": "projects/dr-modo/agent/sessions/1533759866859/contexts/actions_capability_audio_output",
                        "parameters": {
                            "yesNo": "",
                            "notificationAction": "track",
                            "value.original": "",
                            "notificationAction.original": "",
                            "value": "",
                            "yesNo.original": "",
                        },
                    },
                    {
                        "name": "projects/dr-modo/agent/sessions/1533759866859/contexts/tracking_reminder_notification",
                        "lifespanCount": 2,
                        "parameters": {
                            "yesNo": "",
                            "notificationAction": "track",
                            "value.original": "",
                            "variableName": "Hand Pain",
                            "unitName": "1 to 5 Rating",
                            "trackingReminderNotificationId": 29901441,
                            "notificationAction.original": "",
                            "value": "",
                            "yesNo.original": "",
                        },
                    },
                    {
                        "name": "projects/dr-modo/agent/sessions/1533759866859/contexts/actions_capability_media_response_audio",
                        "parameters": {
                            "yesNo": "",
                            "notificationAction": "track",
                            "value.original": "",
                            "notificationAction.original": "",
                            "value": "",
                            "yesNo.original": "",
                        },
                    },
                    {
                        "name": "projects/dr-modo/agent/sessions/1533759866859/contexts/actions_capability_web_browser",
                        "parameters": {
                            "yesNo": "",
                            "notificationAction": "track",
                            "value.original": "",
                            "notificationAction.original": "",
                            "value": "",
                            "yesNo.original": "",
                        },
                    },
                ],
                "intent": {
                    "name": "projects/dr-modo/agent/intents/921bbe0e-6f16-490c-b243-1743081bb25d",
                    "displayName": "Tracking Reminder Notification Intent",
                },
                "intentDetectionConfidence": 1,
                "languageCode": "en-us",
            },
            "originalDetectIntentRequest": {
                "source": "google",
                "version": "2",
                "payload": {
                    "isInSandbox": true,
                    "surface": {
                        "capabilities": [
                            {
                                "name": "actions.capability.MEDIA_RESPONSE_AUDIO",
                            },
                            {
                                "name": "actions.capability.WEB_BROWSER",
                            },
                            {
                                "name": "actions.capability.AUDIO_OUTPUT",
                            },
                            {
                                "name": "actions.capability.SCREEN_OUTPUT",
                            },
                        ],
                    },
                    "requestType": "SIMULATOR",
                    "inputs": [
                        {
                            "rawInputs": [
                                {
                                    "query": "1/5",
                                    "inputType": "TOUCH",
                                },
                            ],
                            "arguments": [
                                {
                                    "textValue": "1/5-button",
                                    "name": "OPTION",
                                },
                            ],
                            "intent": "actions.intent.OPTION",
                        },
                    ],
                    "user": {
                        "lastSeen": "2018-08-08T20:22:25Z",
                        "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjlhMzNiNWVkYjQ5ZDA4NjdhODY3MmQ5NTczYjFlMGQyMzc1ODg2ZTEifQ.eyJhdWQiOiI5MTg3NjEzMjU0OTEtazJ0Y3VkbGg5ZHEyMjdtb2RrMWhnbmlvMDR1aGhvNWQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTg0NDQ2OTMxODQ4Mjk1NTUzNjIiLCJoZCI6InRoaW5rYnludW1iZXJzLm9yZyIsImVtYWlsIjoibUB0aGlua2J5bnVtYmVycy5vcmciLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZXhwIjoxNTMzNzYzODk5LCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJqdGkiOiI0NTNhYTgzNDMwOTlmNzRjODMzZjdjY2RkZTA1ODViMjVjN2NjOTkwIiwiaWF0IjoxNTMzNzYwMjk5LCJuYmYiOjE1MzM3NTk5OTksIm5hbWUiOiJNaWtlIFNpbm4iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDYuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy1CSHI0aHlVV3FaVS9BQUFBQUFBQUFBSS9BQUFBQUFBSUcyOC8yTHYwZW43MzhJSS9zOTYtYy9waG90by5qcGciLCJnaXZlbl9uYW1lIjoiTWlrZSIsImZhbWlseV9uYW1lIjoiU2lubiJ9.Tl8oQIoNlou3p2Yy4a2MaxEJMftKn1ovDFfzgV8MkMFoqEGDkoNvGNbmJyDKGfS6B1kZwY7wBNuDTguKEpR9lTE6lj2Q4oQA4BzgLp_tYN8gohijJJDw3knwJ1q_A4KRfy7wBvV5xjI1nF74Q1wkpgDfmU275tjqp-xiuiHVEqMyp0gliCuD8eAZvgX_CpmjPxubqKi6f9mXW5wfp-z-1YfujQ2eT0XCMEOWFWddtr8-_Jm2_z_K_ua5LXHw5bU8S2ym0IqPkF4Kqa6GYJOSWrjmiC_pnBALpD4ME9wNOvTnNkp3ntfKtKE_HLz2v4LqrOPMDu0p0_BLOMqrUxclbg",
                        "locale": "en-US",
                        "userId": "ABwppHHxfsyj2umsF4FaFTEIOzSDJf2jDveTQtBP5CJH-KLJYugjxHPpR_uRxBLovyUADcMpHA",
                    },
                    "conversation": {
                        "conversationId": "1533759866859",
                        "type": "ACTIVE",
                        "conversationToken": "[\"tracking_reminder_notification\"]",
                    },
                    "availableSurfaces": [
                        {
                            "capabilities": [
                                {
                                    "name": "actions.capability.WEB_BROWSER",
                                },
                                {
                                    "name": "actions.capability.AUDIO_OUTPUT",
                                },
                                {
                                    "name": "actions.capability.SCREEN_OUTPUT",
                                },
                            ],
                        },
                    ],
                },
            },
            "session": "projects/dr-modo/agent/sessions/1533759866859",
        },
        getUnfilledParameter(intent){
            let param = false
            qm.objectHelper.loopThroughProperties(intent.unfilledParameters, function(parameterName, parameter){
                param = parameter
            })
            return param
        },
        calculateScoreAndFillParameters(intent, matchedEntities, userInput){
            //qm.functionHelper.checkTypes( arguments, ['string'] );
            qm.qmLog.info("userInput: " + userInput)
            if(!userInput){
                qm.qmLog.error("No userInput given to calculateScoreAndFillParameters")
                return false
            }
            let doc = qm.nlp(userInput)
            if(!doc){
                qm.qmLog.error("Maybe nlp package isn't available?  qm.nlp(" + userInput + ") returns " + JSON.stringify(doc))
                return false
            }
            if(typeof doc.out !== "function"){
                qm.qmLog.error("Maybe nlp package isn't available? typeof doc.out !== function! qm.nlp(" + userInput + ") returns " + JSON.stringify(doc))
                return false
            }
            let parsed = doc.out('tags')
            let number = doc.values().out()
            if(number){
                number = parseFloat(number)
            }
            qm.qmLog.info(intent.name + " tags: ", parsed)
            let parameters = intent.responses[0].parameters
            intent.unfilledParameters = {}
            intent.unfilledTriggerPhrases = {}
            intent.parameters = {}
            if(intent.name === "Remember Intent"){
                console.log("Remember Intent")
            }
            //if(qm.feed.currentCard){intent.parameters = qm.feed.currentCard.parameters;}
            for(let i = 0; i < parameters.length; i++){
                let parameter = parameters[i]
                let parameterName = parameter.name
                let dataType = parameter.dataType.replace('@', '')
                if(dataType === 'sys.number'){
                    if(number !== null && number !== false){
                        intent.parameters[parameterName] = number
                    }
                    continue
                }
                if(matchedEntities[dataType]){
                    let value = matchedEntities[dataType].matchedEntryValue
                    if(typeof value === "undefined"){
                        value = matchedEntities[dataType]
                    }
                    intent.parameters[parameterName] = value
                }else if(parameter.required){
                    intent.unfilledParameters[parameterName] = parameter
                    if(parameterName.toLowerCase().indexOf('triggerphrase') !== -1){
                        intent.unfilledTriggerPhrases[parameterName] = parameter
                    }
                }
            }
            let filled = Object.keys(intent.parameters).length
            let unfilled = Object.keys(intent.unfilledParameters).length
            let unfilledTriggerPhrases = Object.keys(intent.unfilledTriggerPhrases).length
            return filled - unfilled - unfilledTriggerPhrases
        },
        matchedEntities: {},
        matchedIntents: {},
        matchedIntent: null,
        getCommandOrTriggerPhraseEntity(userInput, matchedEntities){
            matchedEntities = matchedEntities || qm.dialogFlow.getEntitiesFromUserInput(userInput)
            let triggerEntity = false
            qm.objectHelper.loopThroughProperties(matchedEntities, function(entityName, entity){
                if(entityName.indexOf("Command") !== -1){
                    triggerEntity = entity
                }
            })
            qm.objectHelper.loopThroughProperties(matchedEntities, function(entityName, entity){
                if(entityName.indexOf("TriggerPhrase") !== -1){
                    triggerEntity = entity
                }
            })
            return triggerEntity
        },
        getIntentMatchingCommandOrTriggerPhrase(userInput, matchedEntities){
            let entity = qm.dialogFlow.getCommandOrTriggerPhraseEntity(userInput, matchedEntities)
            if(!entity){
                return false
            }
            let matchedIntent = false
            qm.dialogFlow.loopThroughIntents(function(intentName, intent){
                let parameters = intent.responses[0].parameters
                for(let i = 0; i < parameters.length; i++){
                    let parameter = parameters[i]
                    if(parameter.name === entity.name){
                        matchedIntent = intent
                    }
                }
            })
            return matchedIntent
        },
        getIntent(userInput){
            qm.functionHelper.checkTypes(arguments, ['string'])
            if(!userInput){
                qm.qmLog.error("No userInput given to userInput")
                return false
            }
            let matchedEntities = qm.dialogFlow.getEntitiesFromUserInput(userInput)
            let matchedIntent = qm.dialogFlow.getIntentMatchingCommandOrTriggerPhrase(userInput, matchedEntities)
            if(matchedIntent){
                qm.dialogFlow.calculateScoreAndFillParameters(matchedIntent, matchedEntities, userInput)
            }else{
                let bestScore = 0
                qm.dialogFlow.loopThroughIntents(function(intentName, intent){
                    let score = intent.score = qm.dialogFlow.calculateScoreAndFillParameters(intent, matchedEntities, userInput)
                    if(!matchedIntent || score > bestScore){
                        matchedIntent = intent
                        bestScore = score
                    }
                })
                if(matchedIntent){
                    matchedIntent.parameters = matchedEntities.parameters || {}
                }
            }
            if(matchedIntent){
                matchedIntent.parameters.userInput = userInput
            }
            return matchedIntent || qm.dialogFlow.matchedIntent
        },
        getEntities(){
            return qm.staticData.dialogAgent.entities
        },
        getQuestionFromUserInput(userInput){
            let interrogativeWords = ['who', 'what', 'where', 'when', 'why']
            let question = false
            for(let i = 0; i < interrogativeWords.length; i++){
                let interrogativeWord = interrogativeWords[i]
                let index = userInput.indexOf(interrogativeWord) !== -1
                if(index !== -1){
                    question = userInput.substr(index, userInput.length)
                }
            }
            return question
        },
        getEntitiesFromUserInput(userInput){
            let entities = qm.dialogFlow.getEntities()
            userInput = userInput.toLowerCase()
            let matchedEntities = {}
            qm.objectHelper.loopThroughProperties(entities, function(entityName, entity){
                let entries = entity.entries
                if(entityName === 'rememberCommand'){
                    console.log("")
                }
                for(let i = 0; i < entries.length; i++){
                    let entry = entries[i]
                    let entryValue = entry.value
                    let synonyms = entry.synonyms
                    if(synonyms.indexOf("\"") !== -1){
                        synonyms = synonyms.split("\"")
                    }
                    for(let j = 0; j < synonyms.length; j++){
                        let synonym = synonyms[j].toLowerCase()
                        synonym = synonym.replace('\"', '')
                        if(qm.stringHelper.sentenceContainsWord(userInput, synonym)){
                            entity.matchedEntryValue = entryValue
                            matchedEntities[entityName] = entity
                        }
                    }
                }
            })
            qm.qmLog.logProperties("matchedEntities", matchedEntities)
            return matchedEntities
        },
        intentFulfillment: {
            "Cancel Intent"(data){
                qm.speech.talkRobot("OK. I love you! Bye!")
                qm.mic.setMicEnabled(false)
            },
            "Create Phrase Intent"(data){
                qm.speech.talkRobot("OK. I love you! Bye!")
                qm.mic.setMicEnabled(false)
            },
            "Remember Intent"(data){
            },
        },
    },
    feed: {
        currentCard: null,
        getMostRecentCard(successHandler, errorHandler){
            qm.feed.getFeedFromLocalForageOrApi({}, function(feedCards){
                if(!feedCards){
                    qm.qmLog.error("No FeedFromLocalForageOrApi!")
                    if(errorHandler){ errorHandler() }
                    return
                }
                let currentCard = feedCards.shift()
                qm.feed.saveFeedInLocalForage(feedCards, function(){
                    successHandler(currentCard)
                }, errorHandler)
            }, errorHandler)
        },
        getFeedApiInstance(params){
            qm.api.configureClient(arguments.callee.name, null, params)
            let apiInstance = new qm.Quantimodo.FeedApi()
            // apiInstance.cache = !params || !params.noCache; Should be done in qm.api.configureClient
            return apiInstance
        },
        getFeedFromLocalForage(successHandler, errorHandler){
            qm.localForage.getItem(qm.items.feed, successHandler, errorHandler)
        },
        getFeedFromApi(params, successHandler, errorHandler){
            params = qm.api.addGlobalParams(params)
            let cacheKey = 'getFeed'
            if(!qm.api.configureClient(cacheKey, errorHandler, params)){
                return false
            }
            function callback(error, data, response){
                let cards = qm.feed.handleFeedResponse(data)
                qm.api.generalResponseHandler(error, cards, response, successHandler, errorHandler, params, cacheKey)
            }
            qm.feed.postFeedQueue(null, function(cards){
                successHandler(cards)
            }, function(error){
                qm.qmLog.error(error)
                qm.feed.getFeedApiInstance(params).getFeed(params, callback)
            })
        },
        handleFeedResponse(data){
            let cards
            if(!data){
                qm.qmLog.error("No feed data returned!")
            }else{
                cards = data.cards
                qm.feed.saveFeedInLocalForage(cards, function(){
                    qm.qmLog.info("saveFeedInLocalForage completed!")
                }, function(error){
                    qm.qmLog.error(error)
                })
            }
            return cards
        },
        saveFeedInLocalForage(feedCards, successHandler, errorHandler){
            qm.localForage.setItem(qm.items.feed, feedCards, successHandler, errorHandler)
        },
        getFeedFromLocalForageOrApi(params, successHandler, errorHandler){
            qm.localForage.getItem(qm.items.feed, function(cards){
                if(cards && cards.length){
                    successHandler(cards)
                    return
                }
                qm.feed.getFeedFromApi(params, successHandler, errorHandler)
            }, function(error){
                qm.qmLog.error(error)
                qm.feed.getFeedFromApi(params, successHandler, errorHandler)
            })
        },
        deleteCardFromLocalForage(submittedCard, successHandler, errorHandler){
            qm.localForage.deleteById(qm.items.feed, submittedCard.id, successHandler, errorHandler)
        },
        deleteCardFromFeedQueue(submittedCard, successHandler, errorHandler){
            qm.localForage.deleteById(qm.items.feedQueue, submittedCard.id, successHandler, errorHandler)
        },
        addToFeedAndRemoveFromFeedQueue(submittedCard, successHandler, errorHandler){
            qm.localForage.addToArray(qm.items.feed, submittedCard, function(feedCards){
                qm.feed.deleteCardFromFeedQueue(submittedCard, function(remainingCards){
                    if(successHandler){
                        successHandler(feedCards)
                    }
                }, errorHandler)
            }, errorHandler)
        },
        postFeedQueue(feedQueue, successHandler, errorHandler){
            function post(feedQueue){
                qm.localForage.removeItem(qm.items.feedQueue, function(){
                    qm.feed.postToFeedEndpointImmediately(feedQueue, successHandler, errorHandler)
                }, function(error){
                    qm.qmLog.error(error)
                })
            }
            if(feedQueue){
                post(feedQueue)
                return
            }
            qm.localForage.getItem(qm.items.feedQueue, function(feedQueue){
                post(feedQueue)
            }, errorHandler)
        },
        postCardImmediately(card, successHandler, errorHandler){
            qm.feed.addToFeedQueueAndRemoveFromFeed(card, function(nextCard){
                qm.feed.postToFeedEndpointImmediately(null, successHandler, errorHandler)
            }, errorHandler)
        },
        postToFeedEndpointImmediately(feedQueue, successHandler, errorHandler){
            let params = qm.api.addGlobalParams({})
            let cacheKey = 'postFeed'
            if(!qm.api.configureClient(cacheKey, errorHandler, params)){
                return false
            }
            function callback(error, data, response){
                let cards = qm.feed.handleFeedResponse(data)
                if(error){
                    qm.qmLog.error("Putting back in queue because of error ", error)
                    feedQueue = qm.feed.fixFeedQueue(feedQueue)
                    qm.localForage.addToArray(qm.items.feedQueue, feedQueue)
                }
                qm.api.generalResponseHandler(error, cards, response, successHandler, errorHandler, params, cacheKey)
            }
            if(feedQueue){
                qm.feed.getFeedApiInstance(params).postFeed(feedQueue, params, callback)
            }else{
                qm.localForage.removeItem(qm.items.feedQueue, function(feedQueue){
                    qm.feed.getFeedApiInstance(params).postFeed(feedQueue || [], params, callback)
                })
            }
        },
        fixFeedQueue(parameters){
            if(parameters && parameters[0] && qm.arrayHelper.variableIsArray(parameters[0])){
                qm.qmLog.error("feedQueue is fucked up")
                let array = parameters.shift()
                parameters.concat(array)
            }
            return parameters
        },
        addToFeedQueueAndRemoveFromFeed(submittedCard, successHandler, errorHandler){
            qm.feed.recentlyRespondedTo[submittedCard.id] = submittedCard
            let parameters = submittedCard.parameters
            if(submittedCard.selectedButton){
                parameters = qm.objectHelper.copyPropertiesFromOneObjectToAnother(submittedCard.selectedButton.parameters,
                    parameters, false)
            }
            if(!parameters){
                let error = "No submittedCard provided to addToFeedQueueAndRemoveFromFeed!"
                if(errorHandler){
                    errorHandler(error)
                }
                qm.qmLog.error(error)
                return
            }
            qm.localForage.addToArray(qm.items.feedQueue, parameters, function(feedQueue){
                qm.feed.getFeedFromLocalForage(function(remainingCards){
                    remainingCards = remainingCards.filter(function(card){
                        return card.id !== submittedCard.id
                    })
                    qm.feed.saveFeedInLocalForage(remainingCards, function(){
                        if(successHandler){
                            successHandler(remainingCards[0])
                        }
                        let minimumRequiredForPost = 5
                        if(feedQueue.length > minimumRequiredForPost || remainingCards.length < 3){
                            qm.feed.postFeedQueue(feedQueue)
                        }
                    })
                }, errorHandler)
            }, errorHandler)
        },
        getUnfilledInputFields(card){
            let unfilledFields = false
            let inputFields = card.inputFields
            if(inputFields){
                let required = inputFields.filter(function(inputField){
                    return inputField.required
                })
                if(required){
                    unfilledFields = inputFields.filter(function(inputField){
                        return inputField.value === null
                    })
                    if(unfilledFields && unfilledFields.length){
                        qm.speech.currentInputField = unfilledFields[0]
                    }else{
                        qm.qmLog.info("No input fields to fill!")
                        return false
                    }
                }
            }
            return unfilledFields
        },
        readCard(card, successHandler, errorHandler, sayOptions){
            if(!card){
                card = qm.feed.currentCard
            }
            qm.feed.currentCard = card
            let listen = true
            let message = ''
            if(card.title && card.title.length > message.length){
                message = card.title
            }
            if(card.headerTitle && card.headerTitle.length > message.length){
                message = card.headerTitle
            }
            if(card.subTitle && card.subTitle.length > message.length){
                message = card.subTitle
            }
            if(card.subHeader && card.subHeader.length > message.length){
                message = card.subHeader
            }
            if(card.content){
                if(!message || !message.length && card.content){
                    message = card.content
                }
            }
            if(card.htmlContent){
                if(!message || !message.length){
                    message = qm.stringHelper.stripHtmlTags(card.htmlContent)
                }
            }
            let unfilledFields = qm.feed.getUnfilledInputFields(card)
            if(unfilledFields && unfilledFields.length){
                message = unfilledFields[0].helpText
                if(sayOptions){
                    //message += " " + qm.feed.getAvailableCommandsSentence();
                    message += unfilledFields[0].hint
                }
            }
            qm.speech.talkRobot(message, function(){
                qm.mic.listenForCardResponse(card, successHandler, errorHandler)
            }, function(error){
                qm.qmLog.info(error)
            }, listen)
        },
        getAvailableButtons(includeActionSheet){
            let card = qm.feed.currentCard
            let buttons = card.buttons || []
            if(includeActionSheet && card.actionSheetButtons){
                buttons = buttons.concat(card.actionSheetButtons)
            }
            return buttons
        },
        getAvailableCommandsSentence(){
            let buttons = qm.feed.getAvailableButtons(false)
            let options = 'You can say '
            for(let i = 0; i < buttons.length; i++){
                let button = buttons[i]
                let text = button.title || button.text
                if(button.parameters && button.parameters.modifiedValue){
                    text = button.parameters.modifiedValue
                }
                options += text + ", "
            }
            let inputField = qm.speech.currentInputField
            if(!inputField){
                qm.qmLog.info("No inputField!")
            }else{
                options += " or a " + inputField.type.replace('_', ' ')
                if(inputField.minValue !== null && inputField.maxValue !== null){
                    options += " between " + inputField.minValue + " and " + inputField.maxValue
                }else if(inputField.minValue !== null){
                    options += " above " + inputField.minValue
                }else if(inputField.maxValue !== null){
                    options += " below " + inputField.maxValue
                }
            }
            return options + '.  '
        },
        sayAvailableCommands(){
            let options = qm.feed.getAvailableCommandsSentence()
            qm.speech.talkRobot(options)
        },
        getButtonMatchingPhrase(possiblePhrases){
            if(!qm.arrayHelper.variableIsArray(possiblePhrases)){
                possiblePhrases = [possiblePhrases]
            }
            for(let i = 0; i < possiblePhrases.length; i++){
                var tag = possiblePhrases[i]
                tag = nlp(tag).normalize().out()
                let buttons = qm.feed.getAvailableButtons(true)
                let selectedButton = buttons.find(function(button){
                    if(button.text && button.text.toLowerCase() === tag){
                        return true
                    }
                    if(button.title && button.title.toLowerCase() === tag){
                        return true
                    }
                    if(button.accessibilityText && button.accessibilityText.toLowerCase() === tag){
                        return true
                    }
                    if(button.action && button.action.toLowerCase() === tag){
                        return true
                    }
                    let propertyWithMatchingValue = qm.objectHelper.getKeyWhereValueEqualsProvidedString(tag, button.parameters)
                    return !!propertyWithMatchingValue
                })
                if(selectedButton){
                    return selectedButton
                }
            }
            return false
        },
        recentlyRespondedTo: {},
        undoFunction(){
            qm.qmLog.error("Undo function not defined!")
        },
    },
    fileHelper: {
        writeToFileWithCallback(filePath, stringContents, callback){
            if(!stringContents){
                throw filePath + " stringContents not provided to writeToFileWithCallback"
            }
            qm.qmLog.info("Writing to " + filePath)
            if(typeof stringContents !== "string"){
                stringContents = JSON.stringify(stringContents)
            }
            return qm.fs.writeFile(filePath, stringContents, callback)
        },
        outputFileContents(path){
            qm.qmLog.info(path + ": " + qm.fs.readFileSync(path))
        },
        cleanFiles(filesArray){
            qm.qmLog.info("Cleaning " + JSON.stringify(filesArray) + '...')
            return qm.gulp.src(filesArray, {read: false}).pipe(qm.clean())
        },
        writeToFile(filePath, stringContents){
            filePath = './' + filePath
            qm.qmLog.info("Writing to " + filePath)
            if(typeof stringContents !== "string"){
                stringContents = qm.stringHelper.prettyJSONStringify(stringContents)
            }
            return qm.fs.writeFileSync(filePath, stringContents)
        },
        copyFiles(sourceFiles, destinationPath, excludedFolder){
            console.log("Copying " + sourceFiles + " to " + destinationPath)
            let srcArray = [sourceFiles]
            if(excludedFolder){
                console.log("Excluding " + excludedFolder + " from copy.. ")
                srcArray.push('!' + excludedFolder)
                srcArray.push('!' + excludedFolder + '/**')
            }
            return qm.gulp.src(srcArray)
                .pipe(qm.gulp.dest(destinationPath))
        },
    },
    functionHelper: {
        getCurrentFunctionNameDoesNotWork(){
            let functionName = arguments.callee.toString()
            functionName = functionName.substr('function '.length)
            functionName = functionName.substr(0, functionName.indexOf('('))
            return functionName
        },
        isFunction(functionToCheck){
            return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
        },
        checkTypes(args, types) {
            function typeOf(obj) {
                return ({}).toString.call(obj).match(/\s(\w+)/)[1].toLowerCase()
            }
            args = [].slice.call(args)
            for (let i = 0; i < types.length; ++i) {
                let type = typeOf(args[i])
                if (types[i] && type != types[i]) {
                    let message = 'param ' + i + ' must be of type ' + types[i] + " but is " + type
                    if(qm.appMode.isProduction()){
                        qm.qmLog.error(message)
                    } else {
                        throw new TypeError(message)
                    }
                }
            }
        },
    },
    geoLocation: {
        getFoursqureClientId(){
            if(qm.privateConfig && qm.privateConfig.FOURSQUARE_CLIENT_ID){ /** @namespace qm.privateConfig.FOURSQUARE_CLIENT_ID */
                return qm.privateConfig.FOURSQUARE_CLIENT_ID
            }
            let appSettings = qm.getAppSettings()
            if(appSettings && appSettings.privateConfig && appSettings.privateConfig.FOURSQUARE_CLIENT_ID){
                return appSettings.privateConfig.FOURSQUARE_CLIENT_ID
            }
            let connector = qm.connectorHelper.getConnectorByName('foursquare')
            if(connector){
                return connector.connectorClientId
            }
        },
        getFoursquareClientSecret(){
            /** @namespace qm.privateConfig.FOURSQUARE_CLIENT_SECRET */
            if(qm.privateConfig && qm.privateConfig.FOURSQUARE_CLIENT_SECRET){
                return qm.privateConfig.FOURSQUARE_CLIENT_SECRET
            }
            let appSettings = qm.getAppSettings()
            if(appSettings && appSettings.privateConfig && appSettings.privateConfig.FOURSQUARE_CLIENT_SECRET){
                return appSettings.privateConfig.FOURSQUARE_CLIENT_SECRET
            }
            let connector = qm.connectorHelper.getConnectorByName('foursquare')
            if(connector){ /** @namespace connector.connectorClientSecret */
                return connector.connectorClientSecret
            }
        },
        getGoogleMapsApiKey(){
            /** @namespace qm.privateConfig.GOOGLE_MAPS_API_KEY */
            if(qm.privateConfig && qm.privateConfig.GOOGLE_MAPS_API_KEY){
                return qm.privateConfig.GOOGLE_MAPS_API_KEY
            }
            let appSettings = qm.getAppSettings()
            if(appSettings && appSettings.privateConfig && appSettings.privateConfig.GOOGLE_MAPS_API_KEY){
                return appSettings.privateConfig.GOOGLE_MAPS_API_KEY
            }
        },
    },
    getAppSettings(successHandler, errorHandler){
        if(!successHandler){
            let appSettings = qm.appsManager.getAppSettingsFromMemory()
            if(appSettings){
                return appSettings
            }
            console.debug("No app settings and no successHandler!") // qm.qmLog here causes infinite loop
            return null
        }
        qm.appsManager.getAppSettingsLocallyOrFromApi(successHandler, errorHandler)
    },
    getClientId(successHandler){
        if(!successHandler){
            return qm.api.getClientId()
        }
            qm.api.getClientIdWithCallback(successHandler)

    },
    getPrimaryOutcomeVariable(){
        let appSettings = qm.getAppSettings()
        if(appSettings && appSettings.primaryOutcomeVariableDetails){
            return appSettings.primaryOutcomeVariableDetails
        }
        let variables = {
            "Overall Mood": {
                "id": 1398,
                "name": "Overall Mood",
                "variableName": "Overall Mood",
                variableCategoryName: "Mood",
                "userUnitAbbreviatedName": "/5",
                unitAbbreviatedName: "/5",
                "combinationOperation": "MEAN",
                "valence": "positive",
                "unitName": "1 to 5 Rating",
                "ratingOptionLabels": ["Depressed", "Sad", "OK", "Happy", "Ecstatic"],
                "ratingValueToTextConversionDataSet": {1: "depressed", 2: "sad", 3: "ok", 4: "happy", 5: "ecstatic"},
                "ratingTextToValueConversionDataSet": {"depressed": 1, "sad": 2, "ok": 3, "happy": 4, "ecstatic": 5},
                trackingQuestion: "How are you?",
                averageText: "Your average mood is ",
            },
            "Energy Rating": {
                id: 108092,
                name: "Energy Rating",
                variableName: "Energy Rating",
                variableCategoryName: "Emotions",
                unitAbbreviatedName: "/5",
                combinationOperation: "MEAN",
                positiveOrNegative: 'positive',
                unitName: '1 to 5 Rating',
                ratingOptionLabels: ['1', '2', '3', '4', '5'],
                ratingValueToTextConversionDataSet: {1: "1", 2: "2", 3: "3", 4: "4", 5: "5"},
                ratingTextToValueConversionDataSet: {"1": 1, "2": 2, "3": 3, "4": 4, "5": 5},
                trackingQuestion: "How is your energy level right now?",
                averageText: "Your average energy level is ",
            },
        }
        if(appSettings && appSettings.primaryOutcomeVariableName){
            return variables[appSettings.primaryOutcomeVariableName]
        }
        return variables['Overall Mood']
    },
    getPrimaryOutcomeVariableByNumber(num){
        return qm.getPrimaryOutcomeVariable().ratingValueToTextConversionDataSet[num] ? qm.getPrimaryOutcomeVariable().ratingValueToTextConversionDataSet[num] : false
    },
    getSourceName(){
        let appSettings = qm.appsManager.getAppSettingsFromMemory()
        if(!appSettings){ return null }
        return appSettings.appDisplayName + " for " + qm.platform.getCurrentPlatform()
    },
    getUser(successHandler, errorHandler){
        if(!successHandler){
            return qm.userHelper.getUserFromLocalStorage()
        }
        qm.userHelper.getUserFromLocalStorageOrApi(successHandler, errorHandler)
    },
    gitHelper: {
        branchName: null,
        getBranchName(){
            if(qm.gitHelper.branchName || !qm.appMode.isBackEnd()){
                return qm.gitHelper.branchName
            }
            return process.env.CIRCLE_BRANCH || process.env.BUDDYBUILD_BRANCH || process.env.TRAVIS_BRANCH || process.env.GIT_BRANCH
        },
        isMaster(){
            return qm.gitHelper.getBranchName() === "master"
        },
        isDevelop(){
            return qm.gitHelper.getBranchName() === "develop"
        },
        isFeature(){
            return qm.gitHelper.getBranchName().indexOf("feature") !== -1
        },
        getCurrentGitCommitSha(){
            if(qm.appMode.isBackEnd() && process.env.SOURCE_VERSION){
                return process.env.SOURCE_VERSION
            }
            try{
                return require('child_process').execSync('git rev-parse HEAD').toString().trim()
            }catch (error){
                qm.qmLog.info(error)
            }
        },
        getCommitMessage(callback){
            let commandForGit = 'git log -1 HEAD --pretty=format:%s'
            qm.nodeHelper.execute(commandForGit, function(error, output){
                let commitMessage = output.trim()
                qm.qmLog.info("Commit: " + commitMessage)
                if(callback){
                    callback(commitMessage)
                }
            })
        },
        outputCommitMessageAndBranch(){
            qm.gitHelper.getCommitMessage(function(commitMessage){
                qm.gitHelper.setBranchName(function(branchName){
                    qm.qmLog.info("===== Building " + commitMessage + " on " + branchName + " =====")
                })
            })
        },
        setBranchName(callback){
            function setBranch(branch, callback){
                qm.gitHelper.branchName = branch.replace('origin/', '')
                qm.qmLog.info('current git branch: ' + qm.gitHelper.branchName)
                if(callback){
                    callback(qm.gitHelper.branchName)
                }
            }
            if(qm.gitHelper.branchName){
                setBranch(qm.gitHelper.branchName, callback)
                return
            }
            try{
                qm.git.revParse({args: '--abbrev-ref HEAD'}, function(err, branch){
                    if(err){
                        qm.qmLog.error(err)
                        return
                    }
                    setBranch(branch, callback)
                })
            }catch (e){
                qm.qmLog.info("Could not set branch name because " + e.message)
            }
        },
        getReleaseStage(){
            if(!process.env.HOSTNAME){
                return "local"
            }
            if(process.env.HOSTNAME.indexOf("local") !== -1){
                return "local"
            }
            if(process.env.HOSTNAME.indexOf("staging") !== -1){
                return "staging"
            }
            if(process.env.HOSTNAME.indexOf("app") !== -1){
                return "production"
            }
            if(process.env.HOSTNAME.indexOf("production") !== -1){
                return "production"
            }
            qm.qmLog.error("Could not determine release stage!")
        },
        releaseStage: {
            isProduction(){
                return qm.gitHelper.getReleaseStage() === "production"
            },
            isStaging(){
                return qm.gitHelper.getReleaseStage() === "staging"
            },
        },
        createStatusToCommit(statusOptions, callback){
            qm.github.createStatusToCommit(statusOptions, qm.gitHelper.getGithubOptions(), callback)
        },
        getGithubOptions(){
            let options = {
                // Required options: git_token, git_repo
                // refer to https://help.github.com/articles/creating-an-access-token-for-command-line-use/
                git_token: process.env.GITHUB_ACCESS_TOKEN,
                // comment into this repo, this pr.
                git_repo: 'QuantiModo/quantimodo-android-chrome-ios-web-app',
                //git_prid: '1',
                // create status to this commit, optional
                git_sha: qm.gitHelper.getCurrentGitCommitSha(),
                jshint_status: 'error', // Set status to error when jshint errors, optional
                jscs_status: 'failure', // Set git status to failure when jscs errors, optional
                eslint_status: 'error', // Set git status to error when eslint errors, optional
                // when using github enterprise, optional
                git_option: {
                    // refer to https://www.npmjs.com/package/github for more options
                    //host: 'github.mycorp.com',
                    // You may require this when you using Enterprise Github
                    //pathPrefix: '/api/v3'
                },
                // Provide your own jshint reporter, optional
                jshint_reporter(E, file){ // gulp stream file object
                    // refer to http://jshint.com/docs/reporters/ for E structure.
                    return 'Error in ' + E.file + '!'
                },
                // Provide your own jscs reporter, optional
                jscs_reporter(E, file){ // gulp stream file object
                    // refer to https://github.com/jscs-dev/node-jscs/wiki/Error-Filters for E structure.
                    return 'Error in ' + E.filename + '!'
                },
            }
            return options
        },
    },
    globalHelper: {
        setStudy(study){
            if(study.id){
                qm.storage.setGlobal(study.id, study)
                return
            }
            if(!study.causeVariable){
                qm.qmLog.error("No cause variable in this study: ", study, study)
                return
            }
            let causeVariableName = study.causeVariableName || study.causeVariable.name
            let effectVariableName = study.effectVariableName || study.effectVariable.name
            qm.storage.setGlobal(qm.stringHelper.removeSpecialCharacters(causeVariableName + "_" + effectVariableName), study)
        },
        getStudy(params){
            if(params.studyId){
                return qm.storage.getGlobal(params.studyId)
            }
            let study = qm.storage.getGlobal(qm.stringHelper.removeSpecialCharacters(params.causeVariableName + "_" + params.effectVariableName))
            return study
        },
        setItem(key, value){
            if(!qm.storage.valueIsValid(value)){
                return false
            }
            qm.storage.setGlobal(key, value)
        },
        getItem(key){
            return qm.storage.getGlobal(key)
        },
        removeItem(key){
            qm.qmLog.debug("Removing " + key + " from globals")
            delete qm.globals[key]
        },
    },
    globals: {},
    help: {
        getExplanations(){
            let explanations = {
                predictorSearch: {
                    title: "Select Predictor",
                    textContent: "Search for a predictor like a food or treatment that you want to know the effects of...",
                },
                outcomeSearch: {
                    title: "Select Outcome",
                    textContent: "Select an outcome variable to be optimized like overall mood or sleep quality...",
                },
                locationAndWeatherTracking: {
                    title: "Location and Weather Tracking",
                    textContent: qm.variableCategoryHelper.getVariableCategory('Location').moreInfo,
                },
                minimumAllowedValue: {
                    title: "Minimum Allowed Value",
                    textContent: "The minimum allowed value for measurements. While you can record a value below this minimum, it will be excluded from the correlation analysis.",
                },
                maximumAllowedValue: {
                    title: "Maximum Allowed Value",
                    textContent: "The maximum allowed value for measurements.  While you can record a value above this maximum, it will be excluded from the correlation analysis.",
                },
                onsetDelayInHours: {
                    title: "Onset Delay",
                    unitName: "Hours",
                    textContent: "An outcome is always preceded by the predictor or stimulus. The amount of time that elapses after the predictor/stimulus event before the outcome as perceived by a self-tracker is known as the “onset delay”.  For example, the “onset delay” between the time a person takes an aspirin (predictor/stimulus event) and the time a person perceives a change in their headache severity (outcome) is approximately 30 minutes.",
                },
                onsetDelay: {
                    title: "Onset Delay",
                    unitName: "Seconds",
                    textContent: "An outcome is always preceded by the predictor or stimulus. The amount of time that elapses after the predictor/stimulus event before the outcome as perceived by a self-tracker is known as the “onset delay”.  For example, the “onset delay” between the time a person takes an aspirin (predictor/stimulus event) and the time a person perceives a change in their headache severity (outcome) is approximately 30 minutes.",
                },
                durationOfActionInHours: {
                    title: "Duration of Action",
                    unitName: "Hours",
                    textContent: "The amount of time over which a predictor/stimulus event can exert an observable influence on an outcome variable’s value. For instance, aspirin typically decreases headache severity for approximately four hours (duration of action) following the onset delay.",
                },
                durationOfAction: {
                    title: "Duration of Action",
                    unitName: "Seconds",
                    textContent: "The amount of time over which a predictor/stimulus event can exert an observable influence on an outcome variable’s value. For instance, aspirin typically decreases headache severity for approximately four hours (duration of action) following the onset delay.",
                },
                fillingValue: {
                    title: "Filling Value",
                    textContent: "When it comes to analysis to determine the effects of this variable, knowing when it did not occur is as important as knowing when it did occur. For example, if you are tracking a medication, it is important to know when you did not take it, but you do not have to log zero values for all the days when you haven't taken it. Hence, you can specify a filling value (typically 0) to insert whenever data is missing.",
                },
                combinationOperation: {
                    title: "Combination Method",
                    textContent: "How multiple measurements are combined over time.  We use the average (or mean) for things like your weight.  Summing is used for things like number of apples eaten.",
                },
                defaultValue: {
                    title: "Default Value",
                    textContent: "If specified, there will be a button that allows you to quickly record this value.",
                },
                experimentStartTime: {
                    title: "Analysis Start Date",
                    textContent: "Data prior to this date will not be used in analysis.",
                },
                experimentEndTime: {
                    title: "Analysis End Date",
                    textContent: "Data after this date will not be used in analysis.",
                },
                thumbs: {
                    title: "Help Me Learn",
                    textContent: "I'm really good at finding correlations and even compensating for various onset delays and durations of action. " +
                        "However, you're much better than me at knowing if there's a way that a given factor could plausibly influence an outcome. " +
                        "You can help me learn and get better at my predictions by pressing the thumbs down button for relationships that you don't think could possibly be causal.",
                },
                primaryOutcomeVariable: {
                    title: "Primary Outcome Variable",
                    textContent: "A good primary outcome variable is something that you want to improve and that changes inexplicably. " +
                        "For instance, if you have anxiety, back pain or arthritis which is worse on some days than others, " +
                        "these would be good candidates for primary outcome variables.  Recording their severity and potential factors " +
                        "will help you identify hidden factors exacerbating or improving them. ",
                },
            }
            return explanations
        },
        getExplanation(parameterOrPropertyName, modelName, callback){
            let explanations = qm.help.getExplanations()
            if(explanations[parameterOrPropertyName]){
                return callback(explanations[parameterOrPropertyName])
            }
            if(modelName){
                qm.apiHelper.getPropertyDescription(modelName, parameterOrPropertyName, callback)
            }else{
                qm.apiHelper.getParameterDescription(parameterOrPropertyName, callback)
            }
        },
    },
    integration: {
        getIntegrationJsWithoutClientId(clientId, callback){
            qm.api.configureClient(arguments.callee.name)
            let apiInstance = new qm.Quantimodo.ConnectorsApi()
            apiInstance.getIntegrationJs({clientId: 'CLIENT_ID'}, function(error, data, response){
                if(data){
                    qm.integration.integrationJs = data
                    if(clientId && callback){
                        callback(qm.integration.integrationJs.replace('CLIENT_ID', clientId))
                    }
                }
                qm.api.responseHandler(error, data, response)
            })
        },
    },
    items: {
        accessToken: 'accessToken',
        afterLoginGoToUrl: 'afterLoginGoToUrl',
        afterLoginGoToState: 'afterLoginGoToState',
        appList: 'appList',
        aggregatedCorrelations: 'aggregatedCorrelations',
        apiUrl: 'apiUrl',
        appSettings: 'appSettings',
        appSettingsRevisions: 'appSettingsRevisions',
        authorizedClients: 'authorizedClients',
        builderClientId: 'builderClientId',
        chromeWindowId: 'chromeWindowId',
        clientId: 'clientId',
        commonVariables: 'commonVariables',
        connectors: 'connectors',
        defaultHelpCards: 'defaultHelpCards',
        deviceTokenOnServer: 'deviceTokenOnServer',
        deviceTokenToSync: 'deviceTokenToSync',
        drawOverAppsPopupEnabled: 'drawOverAppsPopupEnabled',
        expiresAtMilliseconds: 'expiresAtMilliseconds',
        feed: 'feed',
        feedQueue: 'feedQueue',
        hideImportHelpCard: 'hideImportHelpCard',
        introSeen: 'introSeen',
        lastGotNotificationsAtMilliseconds: 'lastGotNotificationsAtMilliseconds',
        lastLocalNotificationTime: 'lastLocalNotificationTime',
        lastLatitude: 'lastLatitude',
        lastLocationAddress: 'lastLocationAddress',
        lastLocationName: 'lastLocationName',
        lastLocationNameAndAddress: 'lastLocationNameAndAddress',
        lastLocationPostUnixTime: 'lastLocationPostUnixTime',
        lastLocationResultType: 'lastLocationResultType',
        lastLocationUpdateTimeEpochSeconds: 'lastLocationUpdateTimeEpochSeconds',
        lastLongitude: 'lastLongitude',
        lastReminder: 'lastReminder',
        lastStudy: 'lastStudy',
        lastPopupNotificationUnixTimeSeconds: 'lastPopupNotificationUnixTimeSeconds',
        lastPushTimestamp: 'lastPushTimestamp',
        lastPushData: 'lastPushData',
        logLevel: 'logLevel',
        measurementsQueue: 'measurementsQueue',
        memories: 'memories',
        mostFrequentReminderIntervalInSeconds: 'mostFrequentReminderIntervalInSeconds',
        micEnabled: 'micEnabled',
        micAvailable: 'micAvailable',
        notificationInterval: 'notificationInterval',
        notificationsSyncQueue: 'notificationsSyncQueue',
        onboarded: 'onboarded',
        patientUser: 'patientUser',
        pushLog: 'pushLog',
        physicianUser: 'physicianUser',
        privateConfig: 'privateConfig',
        primaryOutcomeVariableMeasurements: 'primaryOutcomeVariableMeasurements',
        refreshToken: 'refreshToken',
        scheduledLocalNotifications: 'scheduledLocalNotifications',
        speechEnabled: 'speechEnabled',
        speechAvailable: 'speechAvailable',
        studiesCreated: 'studiesCreated',
        studiesJoined: 'studiesJoined',
        thoughts: 'thoughts',
        trackingReminderNotifications: 'trackingReminderNotifications',
        trackingReminderNotificationSyncScheduled: 'trackingReminderNotificationSyncScheduled',
        trackingReminders: 'trackingReminders',
        trackingReminderSyncQueue: 'trackingReminderSyncQueue',
        user: 'user',
        useSmallInbox: 'useSmallInbox',
        userCorrelations: 'userCorrelations',
        userVariables: 'userVariables',
        variableCategories: 'variableCategories',
    },
    loaders: {
        robots(){
            let tm = new TimelineMax({repeat: -1, repeatDelay: 2})
            //.to('#redBot',2,{x:500,ease:Power3.easeInOut},'+=2')
                .fromTo('#blueBot', 2, {x: 0}, {x: 0, ease: Power3.easeInOut}, '-=1.5')
                //.to('body',2,{backgroundColor:'#FFDC6D'},'-=2')
                .to('#blueBot', 2, {x: 0, onStart: newBot, ease: Power3.easeInOut}, '+=2')
            function newBot(){
                TweenMax.fromTo('#redBot', 2, {x: -1000}, {x: 0, delay: .65, ease: Power3.easeInOut})
                TweenMax.to('body', 2, {backgroundColor: '#ADBD90', delay: .65})
            }
            // /////////////////////////////////////////////////////////////
            let sig = new TimelineMax({repeat: -1})
            sig.fromTo('#redBotSignal', .5, {drawSVG: "0% 15%", ease: Linear.easeInOut}, {
                drawSVG: "85% 100%",
                ease: Linear.easeInOut,
            })
                .fromTo('#redBotSignal', .5, {drawSVG: "85% 100%", ease: Linear.easeInOut}, {
                    drawSVG: "0% 15%",
                    ease: Linear.easeInOut,
                })
            var bolt = new TweenMax.to(['#bolt', '#leftEar', '#rightEar', '#nose'], .5, {
                opacity: .25,
                onComplete(){
                    bolt.reverse()
                },
                onReverseComplete(){
                    bolt.play()
                },
            })
            var rhb = new TweenMax.to('#redHeart', .5, {
                scale: 1.1,
                transformOrigin: '50% 50%',
                ease: Power2.easeInOut,
                onComplete(){
                    rhb.reverse()
                },
                onReverseComplete(){
                    rhb.play()
                },
            })
            var sra = new TweenMax.to('#redRightArm', .5, {
                rotation: -3,
                ease: Linear.easeInOut,
                transformOrigin: '45% 25%',
                onComplete(){
                    sra.reverse()
                },
                onReverseComplete(){
                    sra.play()
                },
            })
            var sla = new TweenMax.to('#redLeftArm', .5, {
                rotation: 3,
                ease: Linear.easeInOut,
                transformOrigin: '25% 25%',
                onComplete(){
                    sla.reverse()
                },
                onReverseComplete(){
                    sla.play()
                },
            })
            var redhead = new TweenMax.to('#redHead', 1, {
                y: 5, ease: Power2.easeInOut, onComplete(){
                    redhead.reverse()
                }, onReverseComplete(){
                    redhead.play()
                },
            })
            // ////////////////////////////////////////////////////
            let lights1 = new TweenMax.staggerFromTo(['#light3', '#light6'], .5, {fill: '#fff'}, {
                fill: '#398080',
                repeat: -1,
            }, 0.2)
            let lights2 = new TweenMax.staggerFromTo(['#light2', '#light5'], .5, {fill: '#398080'}, {
                fill: '#E20717',
                repeat: -1,
            }, 0.2)
            let lights3 = new TweenMax.staggerFromTo(['#light1', '#light4'], .5, {fill: '#E20717'}, {
                fill: '#fffff',
                repeat: -1,
            }, 0.2)
            let eeg = new TweenMax.fromTo('#pulse', 2, {drawSVG: "0%", ease: Linear.easeInOut}, {
                drawSVG: "100%",
                ease: Linear.easeInOut,
                repeat: -1,
            })
            let static_RENAMED_BECAUSE_RESERVED = new TweenMax.fromTo('#blueBotStatic', .75, {
                ease: Power1.easeInOut,
                opacity: 0,
            }, {ease: Power1.easeInOut, opacity: 1, repeat: -1})
            var blueBotRArm = new TweenMax.to('#blueBotRightArm', .5, {
                rotation: -3,
                y: 2,
                ease: Linear.easeInOut,
                transformOrigin: '65% 100%',
                onComplete(){
                    blueBotRArm.reverse()
                },
                onReverseComplete(){
                    blueBotRArm.play()
                },
            })
            var blueBotLArm = new TweenMax.to('#blueBotLeftArm', .5, {
                rotation: 3,
                y: 2,
                ease: Linear.easeInOut,
                transformOrigin: '100% 65%',
                onComplete(){
                    blueBotLArm.reverse()
                },
                onReverseComplete(){
                    blueBotLArm.play()
                },
            })
            var dial = new TweenMax.to('#dial', .5, {
                rotation: 30,
                ease: Linear.easeInOut,
                transformOrigin: '50% 100%',
                onComplete(){
                    dial.reverse()
                },
                onReverseComplete(){
                    dial.play()
                },
            })
            var blueBotBody = new TweenMax.to('#blueBotBody', .5, {
                y: 2, ease: Sine.easeInOut, onComplete(){
                    blueBotBody.reverse()
                }, onReverseComplete(){
                    blueBotBody.play()
                },
            })
            var blueBotHead = new TweenMax.to('#blueBotHead', .5, {
                y: -2, ease: Sine.easeInOut, onComplete(){
                    blueBotHead.reverse()
                }, onReverseComplete(){
                    blueBotHead.play()
                },
            })
            let mouthBars = new TweenMax.staggerFromTo('#mouthBars rect', .5, {fill: '#398080'}, {
                fill: '#fffff',
                repeat: -1,
            }, 0.2)
            var eyes = new TweenMax.to('#blueBotEyes', .5, {
                scale: 1.1,
                transformOrigin: '50% 50%',
                ease: Sine.easeInOut,
                onComplete(){
                    eyes.reverse()
                },
                onReverseComplete(){
                    eyes.play()
                },
            })
        },
    },
    localForage: {
        clear(){
            if(qm.platform.isBackEnd()){
                return false
            }
            qm.qmLog.info("Clearing localforage!")
            localforage.clear()
        },
        saveWithUniqueId(key, arrayToSave, successHandler, errorHandler){
            if(!qm.arrayHelper.variableIsArray(arrayToSave)){
                arrayToSave = [arrayToSave]
            }
            if(!arrayToSave || !arrayToSave.length){
                qm.qmLog.error("Noting provided to saveWithUniqueId for " + key)
                if(successHandler){
                    successHandler()
                }
            }
            qm.qmLog.info("saving " + key + " with unique id")
            qm.localForage.getItem(key, function(existingData){
                if(!existingData){
                    existingData = []
                }
                for(let i = 0; i < arrayToSave.length; i++){
                    var newObjectToSave = arrayToSave[i]
                    //newObjectToSave.lastSelectedAt = qm.timeHelper.getUnixTimestampInSeconds(); // Can't do this her because we do this for all API results we ever get
                    existingData = existingData.filter(function(obj){
                        return obj.id !== newObjectToSave.id
                    })
                    existingData.unshift(newObjectToSave)
                }
                qm.localForage.setItem(key, existingData, successHandler, errorHandler)
            })
        },
        deleteById(key, id, successHandler, errorHandler){
            qm.qmLog.info("deleting " + key + " by id " + id)
            qm.localForage.getItem(key, function(existingData){
                if(!existingData){
                    existingData = []
                }
                existingData = existingData.filter(function(obj){
                    return obj.id !== id
                })
                qm.localForage.setItem(key, existingData, successHandler, errorHandler)
            })
        },
        searchByProperty(key, propertyName, searchTerm, successHandler, errorHandler){
            searchTerm = searchTerm.toLowerCase()
            qm.qmLog.info("searching " + key + " by " + propertyName + " " + searchTerm)
            qm.localForage.getItem(key, function(existingData){
                if(!existingData){
                    existingData = []
                }
                existingData = existingData.filter(function(obj){
                    let currentValue = obj[propertyName].toLowerCase()
                    return currentValue.indexOf(searchTerm) !== -1
                })
                successHandler(existingData)
            }, errorHandler)
        },
        getItem(key, successHandler, errorHandler){
            if(!successHandler){
                qm.qmLog.error("No successHandler provided to localForage.getItem!")
                return
            }
            qm.qmLog.debug("Getting " + key + " from globals")
            let fromGlobals = qm.globalHelper.getItem(key)
            if(fromGlobals || fromGlobals === false || fromGlobals === 0){
                successHandler(fromGlobals)
                return fromGlobals
            }
            if(qm.platform.isBackEnd()){
                if(successHandler){
                    successHandler(fromGlobals)
                }
                return fromGlobals
            }
            if(typeof localforage === "undefined"){
                let error = "localforage not defined so can't get " + key + "!"
                qm.qmLog.error(error)
                if(errorHandler){
                    errorHandler(error)
                }
                return
            }
            qm.qmLog.debug("Getting " + key + " from localforage")
            localforage.getItem(key, function(err, data){
                if(err){
                    qm.qmLog.error(err)
                    if(errorHandler){
                        errorHandler(err)
                    }
                }else{
                    successHandler(data)
                }
            })
        },
        setItem(key, value, successHandler, errorHandler){
            if(!qm.storage.valueIsValid(value)){
                return false
            }
            value = JSON.parse(JSON.stringify(value)) // Failed to execute 'put' on 'IDBObjectStore': could not be cloned.
            qm.globalHelper.setItem(key, value)
            if(qm.platform.isBackEnd()){
                if(successHandler){
                    successHandler(value)
                }
                return value
            }
            if(typeof localforage === "undefined"){
                let errorMessage = "local storage is undefined so can't set " + key
                qm.qmLog.error(errorMessage)
                if(errorHandler){
                    errorHandler(errorMessage)
                }
                return
            }
            if(!qm.storage.valueIsValid(value)){
                return false
            }
            if(qm.pouch.enabled){
                qm.pouch.getDb().upsert(key, function(doc){
                    return value
                }).then(function(res){
                    qm.qmLog.info(res) // success, res is {rev: '1-xxx', updated: true, id: 'myDocId'}
                }).catch(function(err){
                    qm.qmLog.error(err)
                })
            }
            localforage.setItem(key, value, function(err){
                if(err){
                    if(errorHandler){
                        errorHandler(err)
                    }
                }else{
                    if(successHandler){
                        successHandler(value)
                    }
                }
            })
        },
        removeItem(key, successHandler, errorHandler){
            qm.globalHelper.removeItem(key)
            if(qm.platform.isBackEnd()){
                if(successHandler){
                    successHandler()
                }
                return
            }
            qm.localForage.getItem(key, function(data){
                localforage.removeItem(key, function(err){
                    if(err){
                        if(errorHandler){
                            errorHandler(err)
                        }
                    }else{
                        if(successHandler){
                            successHandler(data)
                        }
                    }
                })
            })
        },
        getWithFilters(localStorageItemName, successHandler, errorHandler, filterPropertyName, filterPropertyValue,
                                 lessThanPropertyName, lessThanPropertyValue,
                                 greaterThanPropertyName, greaterThanPropertyValue){
            qm.localForage.getItem(localStorageItemName, function(data){
                data = qm.arrayHelper.filterByPropertyOrSize(data, filterPropertyName, filterPropertyValue,
                    lessThanPropertyName, lessThanPropertyValue, greaterThanPropertyName, greaterThanPropertyValue)
                successHandler(data)
            }, function(error){
                if(errorHandler){
                    errorHandler(error)
                }
            })
        },
        getElementsWithRequestParams(localStorageItemName, requestParams, successHandler, errorHandler){
            qm.localForage.getItem(localStorageItemName, function(unfiltered){
                if(!unfiltered){
                    successHandler(unfiltered)
                    return
                }
                let filtered = qm.arrayHelper.filterByRequestParams(unfiltered, requestParams)
                if(!filtered && qm.appMode.isTesting()){
                    filtered = qm.arrayHelper.filterByRequestParams(unfiltered, requestParams)
                    qm.qmLog.info("Nothing after filter")
                }
                successHandler(filtered)
            }, function(error){
                if(errorHandler){
                    errorHandler(error)
                }
            })
        },
        addToOrReplaceByIdAndMoveToFront(localStorageItemName, replacementElementArray, successHandler){
            qm.qmLog.debug('qm.localForage.addToOrReplaceByIdAndMoveToFront in ' + localStorageItemName + ': ' +
                JSON.stringify(replacementElementArray).substring(0, 20) + '...')
            // Have to stringify/parse to create cloned variable or it adds all stored reminders to the array to be posted
            qm.localForage.getItem(localStorageItemName, function(localStorageItemArray){
                let elementsToKeep = qm.arrayHelper.addToOrReplaceByIdAndMoveToFront(localStorageItemArray, replacementElementArray, localStorageItemName)
                qm.localForage.setItem(localStorageItemName, elementsToKeep)
                if(successHandler){
                    successHandler(elementsToKeep)
                }
            }, function(error){
                qm.qmLog.error(error)
            })
        },
        addToArray(localStorageItemName, newElementsArray, successHandler, errorHandler){
            if(!qm.arrayHelper.variableIsArray(newElementsArray)){
                newElementsArray = [newElementsArray]
            }
            qm.qmLog.debug('adding to ' + localStorageItemName + ': ' + JSON.stringify(newElementsArray).substring(0, 20) + '...')
            qm.localForage.getItem(localStorageItemName, function(localStorageItemArray){
                localStorageItemArray = localStorageItemArray || []
                localStorageItemArray = newElementsArray.concat(localStorageItemArray)
                localStorageItemArray = localStorageItemArray.filter(function(element){
                    return element !== null
                })
                qm.localForage.setItem(localStorageItemName, localStorageItemArray, function(){
                    qm.qmLog.info("addToArray in LocalForage " + localStorageItemName + " completed!")
                    if(successHandler){
                        successHandler(localStorageItemArray)
                    }
                }, function(error){
                    qm.qmLog.error(error)
                    if(errorHandler){
                        errorHandler(error)
                    }
                })
            })
        },
        addToArrayWithLimit(localStorageItemName, limit, newElementOrArray, successHandler, errorHandler){
            qm.functionHelper.checkTypes(arguments, ['string', 'number'])
            if(!qm.arrayHelper.variableIsArray(newElementOrArray)){ newElementOrArray = [newElementOrArray] }
            qm.localForage.getItem(localStorageItemName, function(existing){
                existing = existing || []
                let toStore = newElementOrArray.concat(existing)
                toStore = toStore.filter(function(element){
                    return element !== null
                })
                toStore = toStore.slice(0, limit)
                qm.localForage.setItem(localStorageItemName, toStore, function(){
                    qm.qmLog.info("addToArray in LocalForage " + localStorageItemName + " completed!")
                    if(successHandler){
                        successHandler(localStorageItemArray)
                    }
                }, function(error){
                    qm.qmLog.error(error)
                    if(errorHandler){
                        errorHandler(error)
                    }
                })
            })
        },
    },
    measurements: {
        getMeasurementsFromApi(params, successHandler, errorHandler){
            params = qm.api.addGlobalParams(params)
            let cachedData = qm.api.cacheGet(params, 'getMeasurementsFromApi')
            if(cachedData && successHandler){
                //successHandler(cachedData);
                //return;
            }
            qm.api.configureClient(arguments.callee.name, null, params)
            let apiInstance = new qm.Quantimodo.MeasurementsApi()
            function callback(error, data, response){
                qm.api.generalResponseHandler(error, data, response, successHandler, errorHandler, params, 'getMeasurementsFromApi')
            }
            apiInstance.getMeasurements(params, callback)
        },
        addLocationDataToMeasurement(measurementObject){
            if(!measurementObject.latitude){
                measurementObject.latitude = qm.storage.getItem(qm.items.lastLatitude)
            }
            if(!measurementObject.longitude){
                measurementObject.longitude = qm.storage.getItem(qm.items.lastLongitude)
            }
            if(!measurementObject.location){
                measurementObject.location = qm.storage.getItem(qm.items.lastLocationNameAndAddress)
            }
            return measurementObject
        },
        addLocationAndSourceDataToMeasurement(measurementObject){
            qm.measurements.addLocationDataToMeasurement(measurementObject)
            if(!measurementObject.sourceName){
                measurementObject.sourceName = qm.getSourceName()
            }
            return measurementObject
        },
        addToMeasurementsQueue(measurementObject){
            qm.qmLog.info("Adding to measurements queue: ", measurementObject)
            measurementObject = qm.measurements.addLocationAndSourceDataToMeasurement(measurementObject)
            qm.storage.appendToArray('measurementsQueue', measurementObject)
        },
        updateMeasurementInQueue(measurementInfo){
            let measurementsQueue = qm.storage.getItem(qm.items.measurementsQueue)
            if(!measurementsQueue){ measurementsQueue = [] }
            let i = 0
            while(i < measurementsQueue.length){
                if(measurementsQueue[i].startTimeEpoch === measurementInfo.prevStartTimeEpoch){
                    measurementsQueue[i].startTimeEpoch = measurementInfo.startTimeEpoch
                    measurementsQueue[i].value = measurementInfo.value
                    measurementsQueue[i].note = measurementInfo.note
                    qm.qmLog.info("Updating measurement in queue: ", measurementInfo)
                    break
                }
                i++
            }
            qm.storage.setItem(qm.items.measurementsQueue, measurementsQueue)
        },
        getMeasurementsFromQueue(params){
            let measurements = qm.storage.getElementsWithRequestParams(qm.items.measurementsQueue, params)
            let count = 0
            if(measurements){
                count = measurements.length
                measurements = qm.measurements.addInfoAndImagesToMeasurements(measurements)
            }
            qm.qmLog.info("Got " + count + " measurements from queue with params: " + JSON.stringify(params), measurements)
            return measurements
        },
        addInfoAndImagesToMeasurements(measurements){
            function parseJsonIfPossible(str){
                let object = false
                try{
                    object = JSON.parse(str)
                }catch (e){
                    return false
                }
                return object
            }
            let ratingInfo = qm.ratingImages.getRatingInfo()
            let index
            for(index = 0; index < measurements.length; ++index){
                let m = measurements[index]
                let parsedNote = parseJsonIfPossible(m.note)
                if(parsedNote){
                    if(parsedNote.url && parsedNote.message){
                        m.note = '<a href="' + parsedNote.url + '" target="_blank">' + parsedNote.message + '</a>'
                    }else{
                        qm.qmLog.error("Unrecognized note format", "Could not properly format JSON note", {note: m.note})
                    }
                }
                if(!m.variableName){ m.variableName = m.variable }
                if(m.variableName === qm.getPrimaryOutcomeVariable().name){ m.valence = qm.getPrimaryOutcomeVariable().valence }
                if(m.unitAbbreviatedName === '/5'){ m.roundedValue = Math.round(m.value) }
                if(m.displayValueAndUnitString){
                    m.valueUnitVariableName = m.displayValueAndUnitString + " " + m.variableName
                }else{
                    m.valueUnitVariableName = m.value + " " + m.unitAbbreviatedName + " " + m.variableName
                }
                if(!m.image && m.roundedValue && ratingInfo[m.roundedValue]){
                    m.image = ratingInfo[m.roundedValue].numericImage
                    if(m.valence === 'positive'){ m.image = m.image = ratingInfo[m.roundedValue].positiveImage }
                    if(m.valence === 'negative'){ m.image = ratingInfo[m.roundedValue].negativeImage }
                }
                if(m.image){ m.pngPath = m.image }
                m.icon = m.icon || m.ionIcon
                if(m.variableCategoryName && !m.icon){
                    let category = qm.variableCategoryHelper.getVariableCategory(m.variableCategoryName)
                    m.icon = category.ionIcon
                    m.pngPath = category.pngPath
                }
            }
            return measurements
        },
        recentlyPostedMeasurements: [],
        getRecentlyPostedMeasurements(params){
            let measurements = qm.arrayHelper.filterByRequestParams(qm.measurements.recentlyPostedMeasurements, params)
            let count = 0
            if(measurements){
                count = measurements.length
                measurements = qm.measurements.addInfoAndImagesToMeasurements(measurements)
            }
            qm.qmLog.info("Got " + count + " measurements from recentlyPostedMeasurements with params: " + JSON.stringify(params), measurements)
            return measurements
        },
    },
    manualTrackingVariableCategoryNames: [
        'Emotions',
        'Symptoms',
        'Treatments',
        'Foods',
        'Vital Signs',
        'Physical Activity',
        'Sleep',
        'Miscellaneous',
        'Environment',
    ],
    memory: {
        askForMemoryAnswer(memoryQuestionStatement){
            qm.localForage.getItem(qm.items.memories, function(memories){
                memories = memories || {}
                let response
                let memoryQuestionQuestion = memoryQuestionStatement
                if(memoryQuestionStatement.indexOf(' my ') !== -1 && memoryQuestionStatement.indexOf(" are") !== -1){
                    memoryQuestionQuestion = memoryQuestionStatement.replace(" are", "").replace(" my ", " are your ")
                    response = "OK. " + memoryQuestionQuestion + "? "
                }else{
                    response = "OK. What should I say when you say Recall " + memoryQuestionStatement + "? "
                }
                qm.mic.wildCardHandler = function(possiblePhrases){
                    if(qm.mic.weShouldIgnore(possiblePhrases)){
                        return false
                    }
                    qm.mic.wildCardHandlerReset()
                    let memoryQuestionAnswer = qm.arrayHelper.getFirstElementIfArray(possiblePhrases)
                    memories[memoryQuestionQuestion] = memoryQuestionAnswer
                    memories[memoryQuestionStatement] = memoryQuestionAnswer
                    qm.localForage.setItem(qm.items.memories, memories, function(){
                        qm.speech.talkRobot("OK. When you want me to remind you, just say Recall " + memoryQuestionStatement + "! ")
                    })
                }
                qm.speech.talkRobot(response)
            }, function(error){
                qm.qmLog.error(error)
            })
        },
    },
    menu: {
        getMenu(){
            let appSettings = qm.getAppSettings()
            return appSettings.appDesign.menu.active
        },
        onStateChange(menuItem){
            menuItem = qm.menu.setParams(menuItem)
            menuItem = qm.menu.onParameterChange(menuItem)
            return menuItem
        },
        setHref(menuItem){
            menuItem = qm.menu.replacePlaceHoldersInHref(menuItem)
            menuItem = qm.menu.addStateParamsToHrefQuery(menuItem)
            return menuItem
        },
        onParameterChange(menuItem){
            menuItem = qm.menu.setHref(menuItem)
            menuItem = qm.menu.setId(menuItem)
            menuItem = qm.menu.setTitle(menuItem)
            menuItem = qm.menu.setIonIcon(menuItem)
            return menuItem
        },
        setTitle(menuItem){
            if(menuItem.params.title){
                menuItem.title = menuItem.params.title
                if(menuItem.params.variableCategoryName){
                    menuItem.title = menuItem.params.variableCategoryName + " " + menuItem.params.title
                }
                if(menuItem.params.variableName){
                    menuItem.title = menuItem.params.variableName + " " + menuItem.params.title
                }
            }
            return menuItem
        },
        setIonIcon(menuItem){
            if(menuItem.params.variableCategoryName){
                let category = qm.variableCategoryHelper.getVariableCategory(menuItem.params.variableCategoryName)
                if(category && category.ionIcon){
                    menuItem.params.ionIcon = category.ionIcon
                }
            }
            return menuItem
        },
        setId(menuItem){
            function convertStringToId(string){
                string = decodeURIComponent(string)
                return string.replace('#/app/', '')
                    .replace('/', '-')
                    .replace('?', '')
                    .replace('&', '-')
                    .replace('=', '-')
                    .replace(' ', '-')
                    .toLowerCase()
            }
            if(menuItem.href){
                let id = qm.stringHelper.getStringBeforeSubstring('?', menuItem.href, menuItem.href)
                menuItem.id = convertStringToId(id)
            }else{
                menuItem.id = convertStringToId(menuItem.title)
            }
            return menuItem
        },
        replacePlaceHoldersInHref(menuItem){
            menuItem.href = "#/app" + menuItem.url
            for(let propertyName in menuItem.params){
                if(!menuItem.params.hasOwnProperty(propertyName)){
                    continue
                }
                if(!menuItem.params[propertyName]){
                    continue
                }
                menuItem.href = menuItem.href.replace(':' + propertyName, encodeURIComponent(menuItem.params[propertyName]))
            }
            return menuItem
        },
        addStateParamsToHrefQuery(menuItem){
            menuItem.href = qm.urlHelper.addUrlQueryParamsToUrlString(menuItem.params, menuItem.href)
            return menuItem
        },
        setParams(menuItem){
            if(!menuItem.stateName){
                qm.qmLog.info("No stateName so can't update", menuItem, menuItem)
                return menuItem
            }
            qm.qmLog.info("changed state to " + menuItem.stateName)
            let newState = qm.staticData.states.find(function(state){
                return state.name === menuItem.stateName
            })
            menuItem = qm.objectHelper.copyPropertiesFromOneObjectToAnother(newState, menuItem, true)
            for(let prop in newState){
                if(newState.hasOwnProperty(prop)){
                    menuItem[prop] = newState[prop]
                }
            }
            return menuItem
        },
        moveMenuItemDown(menuItems, oldIndex){
            let newIndex = oldIndex + 1
            if(newIndex > menuItems.length){
                return menuItems
            }
            menuItems = qm.arrayHelper.moveElementOfArray(menuItems, oldIndex, newIndex)
            return menuItems
        },
        moveMenuItemUp(menuItems, oldIndex){
            let newIndex = oldIndex - 1
            if(newIndex < 0){
                return menuItems
            }
            menuItems = qm.arrayHelper.moveElementOfArray(menuItems, oldIndex, newIndex)
            return menuItems
        },
        updateHrefAndIdInMenuItemBasedOnStateName(menuItem){
            function addUrlToMenuItem(menuItem){
                if(menuItem.url){
                    return menuItem
                }
                if(menuItem.stateName){
                    menuItem.url = qm.menu.getUrlFromStateName(menuItem.stateName)
                    if(menuItem.url){
                        return menuItem
                    }
                }
                if(menuItem.href){
                    for(let i = 0; i < qm.staticData.states.length; i++){
                        if(menuItem.href.indexOf(qm.staticData.states[i].url) !== -1){
                            menuItem.url = qm.staticData.states[i].url
                        }
                    }
                }
                return menuItem
            }
            menuItem = addUrlToMenuItem(menuItem)
            menuItem = qm.menu.convertQueryStringToParams(menuItem)
            menuItem = qm.menu.convertUrlAndParamsToHref(menuItem)
            menuItem = qm.menu.addMenuId(menuItem)
            delete menuItem.url
            return menuItem
        },
        convertUrlAndParamsToHref(menuItem){
            let params = (menuItem.params) ? menuItem.params : menuItem.stateParameters
            if(!menuItem.subMenu){
                menuItem.href = '#/app' + menuItem.url
                if(params && params.variableCategoryName && menuItem.href.indexOf('-category') === -1){
                    menuItem.href += "-category/" + params.variableCategoryName
                    //delete(params.variableCategoryName);
                }
                menuItem.href += qm.urlHelper.convertObjectToQueryString(params)
                menuItem.href = menuItem.href.replace('app/app', 'app')
            }
            qm.qmLog.debug('convertUrlAndParamsToHref ', menuItem, menuItem)
            return menuItem
        },
        convertQueryStringToParams(menuItem){
            if(!menuItem.href){
                qm.qmLog.debug('No menuItem.href for ', menuItem, null)
                return menuItem
            }
            if(menuItem.href && !menuItem.params){
                menuItem.params = qm.urlHelper.getQueryParams(menuItem.href)
            }
            menuItem.href = qm.urlHelper.stripQueryString(menuItem.href)
            if(menuItem.href && menuItem.href.indexOf('-category') !== -1 && !menuItem.params.variableCategoryName){
                menuItem.params.variableCategoryName = qm.urlHelper.getStringAfterLastSlash(menuItem.href).replace('?', '')
            }
            if(menuItem.params && menuItem.params.variableCategoryName){
                if(menuItem.href.indexOf('-category') === -1){
                    menuItem.href += '-category'
                }
                if(menuItem.stateName.indexOf('Category') === -1){
                    menuItem.stateName += 'Category'
                }
                if(menuItem.href.indexOf(menuItem.params.variableCategoryName) === -1){
                    menuItem.href += '/' + menuItem.params.variableCategoryName
                }
            }
            return menuItem
        },
        getUrlFromStateName(stateName){
            for(let i = 0; i < qm.staticData.states.length; i++){
                if(qm.staticData.states[i].name === stateName){
                    return qm.staticData.states[i].url
                }
            }
            qm.qmLog.error("Could not find state with name: " + stateName)
        },
    },
    mic: {
        globalCommands: {
            "quantimodo"(){
                qm.speech.talkRobot("What can I do for you?")
            },
            "hey robot"(){
                qm.speech.talkRobot("How dare you call me a robot! The politically correct term is technical American! What can I do for you?")
            },
            'remember *tag'(memoryQuestionStatement){
                qm.memories.askForMemoryAnswer(memoryQuestionStatement)
            },
            'recall *tag'(memoryQuestionQuestion){
                qm.memories.recall(memoryQuestionQuestion)
            },
            'remind me *tag'(memoryQuestionQuestion){
                qm.memories.recall(memoryQuestionQuestion)
            },
            'hey google *tag'(tag){
                qm.qmLog.info("Ignoring " + tag)
            },
            'ok google *tag'(tag){
                qm.qmLog.info("Ignoring " + tag)
            },
            'hey siri *tag'(tag){
                qm.qmLog.info("Ignoring " + tag)
            },
            'ok siri *tag'(tag){
                qm.qmLog.info("Ignoring " + tag)
            },
            'hey alexa *tag'(tag){
                qm.qmLog.info("Ignoring " + tag)
            },
            'ok alexa *tag'(tag){
                qm.qmLog.info("Ignoring " + tag)
            },
            'thank you'(tag){
                qm.speech.talkRobot("No!  Thank you for being so polite!  Most people treat me like a machine!")
            },
        },
        wildCardHandler(text){
            qm.qmLog.info("wildCardHandler not defined to handle " + text)
        },
        wildCardHandlerReset(){
            qm.qmLog.info("Unset wildcard handler")
        },
        microphoneDisabled: false,
        onMicEnabled(){
            qm.qmLog.info("Called onMicEnabled")
        },
        onMicDisabled(){
            qm.qmLog.info("Called onMicDisabled")
        },
        micAvailable: null,
        getMicEnabled(){
            if(qm.mic.microphoneDisabled){
                return false
            }
            if(!qm.mic.getMicAvailable()){
                return qm.mic.setMicEnabled(false)
            }
            return qm.storage.getItem(qm.items.micEnabled)
        },
        setMicEnabled(micEnabled){
            qm.qmLog.info("set micEnabled " + micEnabled)
            qm.rootScope[qm.items.micEnabled] = micEnabled
            let enableButton = document.querySelector('#enable-mic-button')
            let disableButton = document.querySelector('#disable-mic-button')
            if(enableButton){
                enableButton.style.display = (micEnabled) ? "none" : "block"
            }
            if(disableButton){
                disableButton.style.display = (micEnabled) ? "block" : "none"
            }
            enableButton = document.querySelector('#big-enable-mic-button')
            disableButton = document.querySelector('#big-disable-mic-button')
            if(enableButton){
                enableButton.style.display = (micEnabled) ? "none" : "block"
            }
            if(disableButton){
                disableButton.style.display = (micEnabled) ? "block" : "none"
            }
            let inputField = document.querySelector('#mic-input-field-container')
            let inputButton = document.querySelector('#mic-input-field-button')
            if(inputField){
                if(micEnabled){
                    inputButton.classList.remove("animated-microphone-input-search-focused")
                    inputField.classList.remove("animated-microphone-input-container-focused")
                }else{
                    inputButton.classList.add("animated-microphone-input-search-focused")
                    inputField.classList.add("animated-microphone-input-container-focused")
                }
            }
            if(!micEnabled){
                if(!qm.platform.getWindow()){
                    return false
                }
                if(window.streamReference){
                    window.streamReference.getAudioTracks().forEach(function(track){
                        track.stop()
                    })
                    window.streamReference.getVideoTracks().forEach(function(track){
                        track.stop()
                    })
                    window.streamReference = null
                }
            }else{
                qm.mic.addCommands(qm.mic.globalCommands)
            }
            return qm.storage.setItem(qm.items.micEnabled, micEnabled)
        },
        getMicAvailable(){
            if(qm.mic.micAvailable !== null){
                return qm.mic.micAvailable
            }
            if(qm.windowHelper.isIframe()){
                return qm.mic.micAvailable = qm.mic.micEnabled = false
            }
            if(typeof annyang === "undefined"){
                if(!qm.appMode.isTesting()){
                    qm.qmLog.error("Microphone not available!")
                }
                return qm.mic.micAvailable = qm.mic.micEnabled = false
            }
            return qm.mic.micAvailable = true
        },
        toggleListening(){
            if(qm.mic.listening){
                qm.mic.pauseListening()
            }else{
                qm.mic.resumeListening()
            }
            return qm.mic.listening = !qm.mic.listening
        },
        listening: false,
        abortListening(){
            qm.visualizer.hideVisualizer()
            qm.qmLog.info("pauseListening")
            if(!qm.mic.annyangAvailable()){
                return
            }
            annyang.abort() // Stop listening, and turn off mic.
        },
        annyangAvailable(){
            if(!annyang){
                qm.qmLog.error("annyang not available!")
                return false
            }
            return true
        },
        pauseListening(hideVisualizer){
            if(hideVisualizer !== false){
                qm.visualizer.hideVisualizer()
            }
            qm.qmLog.info("pauseListening")
            if(!qm.mic.annyangAvailable()){
                return
            }
            annyang.pause() // Pause listening. annyang will stop responding to commands (until the resume or start methods are called), without turning off the browser's SpeechRecognition engine or the mic.
        },
        errorHandler(error){
            qm.qmLog.error(error)
        },
        isListening(){
            if(!qm.mic.annyangAvailable()){
                return false
            }
            return annyang.isListening()
        },
        resumeListening(){
            qm.visualizer.showVisualizer()
            if(!qm.mic.annyangAvailable()){
                return
            }
            if(qm.mic.isListening()){
                qm.qmLog.info("annyang is Listening")
            }else{
                qm.qmLog.info("resumeListening")
                annyang.resume() // Resumes listening and restores command callback execution when a result matches. If SpeechRecognition was aborted (stopped), start it.
            }
        },
        addIgnoreCommand(phrase){
            if(!qm.mic.annyangAvailable()){
                return
            }
            let commands = {}
            commands[phrase] = function(){
                qm.qmLog.info("Ignoring robot phrase: " + phrase)
            }
            qm.mic.addCommands(commands)
        },
        addCommands(commands){
            //qm.mic.removeCommands(commands);  // I think this causes problems.  Just use dynamic even handlers
            if(!qm.mic.annyangAvailable()){
                return
            }
            qm.qmLog.info("addCommands: ", commands)
            annyang.addCommands(commands)
        },
        removeCommands(commands){
            if(!qm.mic.annyangAvailable()){
                return
            }
            qm.qmLog.info("removeCommands: ", commands)
            annyang.removeCommands(commands)
        },
        startListening(commands){
            qm.qmLog.info("startListening")
            if(qm.mic.getMicEnabled() === false){
                qm.qmLog.error("Microphone is disabled so can't listen to these commands: ", commands)
                return
            }
            qm.mic.setMicEnabled(true)
            if(!qm.mic.annyangAvailable()){
                return
            }
            annyang.start({ // Start listening. It's a good idea to call this after adding some commands first, but not mandatory.
                autoRestart: true, // Should annyang restart itself if it is closed indirectly, because of silence or window conflicts?
                continuous: true, // Allow forcing continuous mode on or off. Annyang is pretty smart about this, so only set this if you know what you're doing.
                paused: false, // Start annyang in paused mode.
            })
            if(commands){
                qm.mic.addCommands(commands)
            }
            qm.visualizer.showVisualizer()
        },
        listenForNotificationResponse(successHandler, errorHandler){
            qm.mic.wildCardHandler = function(possiblePhrases){
                if(qm.mic.weShouldIgnore(possiblePhrases)){
                    return false
                }
                if(qm.speech.callback){
                    qm.speech.callback(possiblePhrases)
                }
                qm.speech.lastUserStatement = possiblePhrases
                qm.qmLog.info("Just heard user say ", possiblePhrases)
                if(qm.speech.isValidNotificationResponse(possiblePhrases)){
                    let notification = qm.speech.currentNotification
                    qm.speech.handleNotificationResponse(possiblePhrases, notification)
                    qm.mic.wildCardHandlerReset()
                }else{
                    qm.speech.fallbackMessage(possiblePhrases)
                }
            }
            qm.mic.initializeListening(qm.speech.trackingReminderNotificationCommands, successHandler, errorHandler)
        },
        aPhraseEquals(needles, phrasesArray){
            if(!qm.arrayHelper.variableIsArray(needles)){
                needles = [needles]
            }
            for(let j = 0; j < needles.length; j++){
                let needle = needles[j]
                for(let i = 0; i < phrasesArray.length; i++){
                    let phrase = phrasesArray[i]
                    //phrase = nlp(phrase).normalize().out();  // We should have already done this
                    qm.qmLog.info("Normalized phrase")
                    if(phrase === needle){
                        qm.qmLog.info("Found match: " + phrase)
                        return phrase
                    }
                }
            }
            return false
        },
        aPhraseContains(needles, phrasesArray){
            if(!qm.arrayHelper.variableIsArray(needles)){
                needles = [needles]
            }
            for(let j = 0; j < needles.length; j++){
                let needle = needles[j]
                for(let i = 0; i < phrasesArray.length; i++){
                    let phrase = phrasesArray[i]
                    //phrase = nlp(phrase).normalize().out();  // We should have already done this
                    if(phrase.indexOf(needle) !== -1){
                        qm.qmLog.info(phrase + " contains " + needle)
                        return phrase
                    }
                }
            }
            return false
        },
        weShouldIgnore(possiblePhrases){
            if(qm.speech.alreadySpeaking(possiblePhrases)){
                qm.qmLog.info("Not handling command because robot is speaking: ", possiblePhrases)
                return true
            }
            let ignoreThese = [
                'how many',
                'did you have',
                'how severe',
            ]
            let match = qm.mic.aPhraseContains(ignoreThese, possiblePhrases)
            if(match){
                qm.qmLog.info("Ignoring robot phrase: " + match)
                return match
            }
            qm.mic.saveThought(possiblePhrases[0])
            return false
        },
        saveThought(phrase){
            let thoughts = qm.storage.getItem(qm.items.thoughts) || {}
            thoughts[phrase] = thoughts[phrase] || {}
            thoughts[phrase].count = (thoughts[phrase].count) ? thoughts[phrase].count++ : 1
            thoughts[phrase].text = phrase
            qm.storage.setItem(qm.items.thoughts, thoughts)
        },
        normalizePhrases(possiblePhrases){
            if(!qm.arrayHelper.variableIsArray(possiblePhrases)){
                possiblePhrases = [possiblePhrases]
            }
            return possiblePhrases.map(function(phrase){
                return nlp(phrase).normalize().out()
            })
        },
        listenForCardResponse(card, successHandler, errorHandler){
            qm.mic.wildCardHandler = function(possiblePhrases){
                if(qm.mic.weShouldIgnore(possiblePhrases)){
                    return false
                }
                let card = qm.feed.currentCard
                if(!card){
                    qm.qmLog.info("No card to respond to!")
                    return
                }
                let unfilledFields = qm.feed.getUnfilledInputFields(card)
                if(unfilledFields){
                    card.selectedButton = qm.feed.getButtonMatchingPhrase(possiblePhrases)
                    let matchingFilledInputField; var responseText
                    if(card.selectedButton){
                        card.parameters = qm.objectHelper.copyPropertiesFromOneObjectToAnother(card.selectedButton.parameters, card.parameters, false)
                        responseText = card.selectedButton.successToastText
                        qm.qmLog.info("selectedButton", card.selectedButton)
                        for(let i = 0; i < unfilledFields.length; i++){
                            let unfilledField = unfilledFields[i]
                            let key = unfilledField.key
                            if(typeof card.selectedButton.parameters[key] !== "undefined" && card.selectedButton.parameters[key] !== null){
                                unfilledField.value = card.selectedButton.parameters[key]
                            }
                        }
                    }
                    matchingFilledInputField = qm.speech.setInputFieldValueIfValid(possiblePhrases)
                    if(matchingFilledInputField){
                        card.parameters[matchingFilledInputField.key] = matchingFilledInputField.value
                    }
                    responseText = "OK. I'll record " + matchingFilledInputField.value + "! "
                    qm.qmLog.info("matchingFilledInputField", matchingFilledInputField)
                    if(!card.selectedButton && !matchingFilledInputField){
                        let provideOptionsList = true
                        qm.speech.readCard(null, null, null, provideOptionsList)
                        return
                    }
                }
                qm.feed.currentCard = null
                qm.mic.wildCardHandlerReset()
                qm.feed.deleteCardFromLocalForage(card, function(remainingCards){
                    let unfilledFields = qm.feed.getUnfilledInputFields(card)
                    if(unfilledFields){
                        qm.qmLog.errorAndExceptionTestingOrDevelopment("Un-filled fields: ", unfilledFields)
                    }
                    qm.feed.addToFeedQueueAndRemoveFromFeed(card, function(){
                        if(card.followUpAction){
                            card.followUpAction(responseText)
                        }else{
                            qm.qmLog.error("No card followUpAction!")
                        }
                    }, function(error){
                        qm.qmLog.error(error)
                    })
                }, function(error){
                    qm.qmLog.error(error)
                })
            }
            if(card.parameters.trackingReminderNotificationId){
                qm.mic.initializeListening(qm.notifications.trackingReminderNotificationCommands, successHandler, errorHandler)
            }else{
                qm.mic.initializeListening(qm.speech.cardResponseCommands, successHandler, errorHandler)
            }
        },
        debugListening(){
            if(!qm.mic.annyangAvailable()){
                return
            }
            annyang.debug() // Turn on output of debug messages to the console. Ugly, but super-handy!
        },
        setLanguage(language){
            if(!qm.mic.annyangAvailable()){
                return
            }
            annyang.setLanguage(language) // Set the language the user will speak in. If this method is not called, defaults to 'en-US'.
        },
        specificErrorHandler(message){
            qm.qmLog.error(message)
        },
        generalErrorHandler(message, meta){
            if(qm.mic.errorHandler){
                qm.mic.errorHandler(message)
            }
            qm.qmLog.error(message, meta)
        },
        initialized: false,
        initializeListening(commands, successHandler, errorHandler){
            qm.mic.specificErrorHandler = errorHandler
            qm.mic.addCommands(commands) // Add our commands to annyang
            qm.visualizer.showVisualizer()
            qm.mic.startListening()
            if(qm.mic.initialized){
                return false
            }
            if(!qm.mic.getMicEnabled()){
                qm.qmLog.info("Not going to initializeListening because mic not enabled")
                return
            }
            qm.mic.inititalized = true
            qm.mic.debugListening()
            annyang.addCallback('start', function(){
                qm.qmLog.debug('browser\'s Speech Recognition engine started listening')
            })
            annyang.addCallback('soundstart', function(){
                qm.qmLog.info('sound detected')
            })
            annyang.addCallback('error', function(error){
                qm.qmLog.debug("Speech Recognition failed because of an error", error)
            })
            annyang.addCallback('errorNetwork', function(error){ // pass local context to a global function called notConnected
                qm.mic.generalErrorHandler("Speech Recognition failed because of a network error", error)
            }, this)
            annyang.addCallback('errorPermissionBlocked', function(error){
                qm.mic.generalErrorHandler("browser blocked the permission request to use Speech Recognition", error)
            })
            annyang.addCallback('errorPermissionDenied', function(error){
                qm.mic.generalErrorHandler("user blocked the permission request to use Speech Recognition", error)
            })
            annyang.addCallback('end', function(error){
                qm.qmLog.debug("browser's Speech Recognition engine stopped", error)
            })
            annyang.addCallback('resultMatch', function(userSaid, commandText, phrases){
                qm.qmLog.info("resultMatch userSaid:" + userSaid) // sample output: 'hello'
                qm.qmLog.info("resultMatch commandText:" + commandText) // sample output: 'hello (there)'
                qm.qmLog.info("resultMatch phrases", phrases) // sample output: ['hello', 'halo', 'yellow', 'polo', 'hello kitty']
            })
            annyang.addCallback('resultNoMatch', function(possiblePhrasesArray){
                if(qm.mic.weShouldIgnore(possiblePhrasesArray)){
                    return
                }
                if(qm.mic.wildCardHandler){
                    possiblePhrasesArray = qm.mic.normalizePhrases(possiblePhrasesArray)
                    qm.mic.wildCardHandler(possiblePhrasesArray)
                }else{
                    qm.mic.generalErrorHandler("wildCardHandler not set and speech Recognition failed to find a match for this command! possiblePhrasesArray: ", possiblePhrasesArray)
                }
            })
        },
    },
    music: {
        player: {},
        status: {},
        isPlaying(filePath){
            return qm.music.status[filePath] === 'play'
        },
        setPlayerStatus(filePath, status){
            qm.music.status[filePath] = status
        },
        play(filePath, volume, successHandler, errorHandler){
            filePath = filePath || 'sound/air-of-another-planet-full.mp3'
            if(!qm.speech.getSpeechEnabled()){
                return
            }
            if(qm.music.isPlaying(filePath)){
                return false
            }
            qm.music.player[filePath] = new Audio(filePath)
            qm.music.player[filePath].volume = volume || 0.15
            try{
                qm.music.player[filePath].play()
            }catch (e){
                qm.qmLog.error(e)
                return false
            }
            if(errorHandler){
                qm.music.player[filePath].onerror = errorHandler
            }
            qm.music.player[filePath].onended = function(){
                qm.music.setPlayerStatus(filePath, 'pause')
                if(successHandler){
                    successHandler()
                }
            }
            qm.music.setPlayerStatus(filePath, 'play')
            return qm.music.player[filePath]
        },
        fadeIn(filePath){
            filePath = filePath || 'sound/air-of-another-planet-full.mp3'
            if(qm.music.isPlaying(filePath)) return false
            let actualVolume = 0
            qm.music.player[filePath].play()
            qm.music.setPlayerStatus(filePath, 'play')
            var fadeInInterval = setInterval(function(){
                actualVolume = (parseFloat(actualVolume) + 0.1).toFixed(1)
                if(actualVolume <= 1){
                    qm.music.player[filePath].volume = actualVolume
                }else{
                    clearInterval(fadeInInterval)
                }
            }, 100)
        },
        fadeOut(filePath){
            filePath = filePath || 'sound/air-of-another-planet-full.mp3'
            if(!qm.music.isPlaying(filePath)) return false
            let actualVolume = qm.music.player[filePath].volume
            var fadeOutInterval = setInterval(function(){
                actualVolume = (parseFloat(actualVolume) - 0.1).toFixed(1)
                if(actualVolume >= 0){
                    qm.music.player[filePath].volume = actualVolume
                }else{
                    qm.music.player[filePath].pause()
                    qm.music.status = 'pause'
                    clearInterval(fadeOutInterval)
                }
            }, 100)
        },
    },
    nlp(){
        return nlp
    },
    nodeHelper: {
        execute(command, callback, suppressErrors, lotsOfOutput){
            qm.qmLog.debug('executing ' + command)
            if(lotsOfOutput){
                let args = command.split(" ")
                let program = args.shift()
                let spawn = require('child_process').spawn // For commands with lots of output resulting in stdout maxBuffer exceeded error
                let ps = spawn(program, args)
                ps.on('exit', function(code, signal){
                    qm.qmLog.info(command + ' exited with ' + 'code ' + code + ' and signal ' + signal)
                    if(callback){
                        callback()
                    }
                })
                ps.stdout.on('data', function(data){
                    qm.qmLog.info(command + ' stdout: ' + data)
                })
                ps.stderr.on('data', function(data){
                    qm.qmLog.error(command + '  stderr: ' + data)
                })
                ps.on('close', function(code){
                    if(code !== 0){
                        qm.qmLog.error(command + ' process exited with code ' + code)
                    }
                })
            }else{
                let exec = require('child_process').exec
                let my_child_process = exec(command, function(error, stdout, stderr){
                    if(error !== null){
                        if(suppressErrors){
                            qm.qmLog.info('ERROR: exec ' + error)
                        }else{
                            qm.qmLog.error('ERROR: exec ' + error)
                        }
                    }
                    callback(error, stdout)
                })
                my_child_process.stdout.pipe(process.stdout)
                my_child_process.stderr.pipe(process.stderr)
            }
        },
    },
    notifications: {
        actions: {
            trackYesAction(data){
                let body = {trackingReminderNotificationId: data.trackingReminderNotificationId, modifiedValue: 1}
                qm.qmLog.pushDebug('trackYesAction push data: ' + qm.stringHelper.prettyJsonStringify(data, 140), {
                    pushData: data,
                    notificationsPostBody: body,
                })
                qm.notifications.postTrackingReminderNotifications(body)
            },
            trackNoAction(data){
                let body = {trackingReminderNotificationId: data.trackingReminderNotificationId, modifiedValue: 0}
                qm.qmLog.pushDebug('trackNoAction push data: ' + qm.stringHelper.prettyJsonStringify(data, 140), {
                    pushData: data,
                    notificationsPostBody: body,
                })
                qm.notifications.postTrackingReminderNotifications(body)
            },
            trackZeroAction(data){
                let body = {trackingReminderNotificationId: data.trackingReminderNotificationId, modifiedValue: 0}
                qm.qmLog.pushDebug('trackZeroAction push data: ' + qm.stringHelper.prettyJsonStringify(data, 140), {
                    pushData: data,
                    notificationsPostBody: body,
                })
                qm.notifications.postTrackingReminderNotifications(body)
            },
            trackOneRatingAction(data){
                let body = {trackingReminderNotificationId: data.trackingReminderNotificationId, modifiedValue: 1}
                qm.qmLog.pushDebug('trackOneRatingAction push data: ' + qm.stringHelper.prettyJsonStringify(data, 140), {
                    pushData: data,
                    notificationsPostBody: body,
                })
                qm.notifications.postTrackingReminderNotifications(body)
            },
            trackTwoRatingAction(data){
                let body = {trackingReminderNotificationId: data.trackingReminderNotificationId, modifiedValue: 2}
                qm.qmLog.pushDebug('trackTwoRatingAction push data: ' + qm.stringHelper.prettyJsonStringify(data, 140), {
                    pushData: data,
                    notificationsPostBody: body,
                })
                qm.notifications.postTrackingReminderNotifications(body)
            },
            trackThreeRatingAction(data){
                let body = {trackingReminderNotificationId: data.trackingReminderNotificationId, modifiedValue: 3}
                qm.qmLog.pushDebug('trackThreeRatingAction push data: ' + qm.stringHelper.prettyJsonStringify(data, 140), {
                    pushData: data,
                    notificationsPostBody: body,
                })
                qm.notifications.postTrackingReminderNotifications(body)
            },
            trackFourRatingAction(data){
                let body = {trackingReminderNotificationId: data.trackingReminderNotificationId, modifiedValue: 4}
                qm.qmLog.pushDebug('trackFourRatingAction push data: ' + qm.stringHelper.prettyJsonStringify(data, 140), {
                    pushData: data,
                    notificationsPostBody: body,
                })
                qm.notifications.postTrackingReminderNotifications(body)
            },
            trackFiveRatingAction(data){
                let body = {trackingReminderNotificationId: data.trackingReminderNotificationId, modifiedValue: 5}
                qm.qmLog.pushDebug('trackDefaultValueAction push data: ' + qm.stringHelper.prettyJsonStringify(data, 140), {
                    pushData: data,
                    notificationsPostBody: body,
                })
                qm.notifications.postTrackingReminderNotifications(body)
            },
            trackDefaultValueAction(data){
                let body = {trackingReminderNotificationId: data.trackingReminderNotificationId}
                qm.qmLog.pushDebug('trackDefaultValueAction push data: ' + qm.stringHelper.prettyJsonStringify(data, 140), {
                    pushData: data,
                    notificationsPostBody: body,
                })
                qm.notifications.postTrackingReminderNotifications(body)
            },
            snoozeAction(data){
                let body = {trackingReminderNotificationId: data.trackingReminderNotificationId}
                qm.qmLog.pushDebug('snoozeAction push data: ' + qm.stringHelper.prettyJsonStringify(data, 140), {
                    pushData: data,
                    notificationsPostBody: body,
                })
                body.action = 'snooze'
                qm.notifications.postTrackingReminderNotifications(body)
            },
            trackLastValueAction(data){
                let body = {
                    trackingReminderNotificationId: data.trackingReminderNotificationId,
                    modifiedValue: data.lastValue,
                }
                qm.qmLog.pushDebug('trackLastValueAction', ' push data: ' + qm.stringHelper.prettyJsonStringify(data, 140), {
                    pushData: data,
                    notificationsPostBody: body,
                })
                qm.notifications.postTrackingReminderNotifications(body)
            },
            trackSecondToLastValueAction(data){
                let body = {
                    trackingReminderNotificationId: data.trackingReminderNotificationId,
                    modifiedValue: data.secondToLastValue,
                }
                qm.qmLog.pushDebug('trackSecondToLastValueAction', ' push data: ' + qm.stringHelper.prettyJsonStringify(data, 140), {
                    pushData: data,
                    notificationsPostBody: body,
                })
                qm.notifications.postTrackingReminderNotifications(body)
            },
            trackThirdToLastValueAction(data){
                let body = {
                    trackingReminderNotificationId: data.trackingReminderNotificationId,
                    modifiedValue: data.thirdToLastValue,
                }
                qm.qmLog.pushDebug('trackThirdToLastValueAction', ' push data: ' + qm.stringHelper.prettyJsonStringify(data, 140), {
                    pushData: data,
                    notificationsPostBody: body,
                })
                qm.notifications.postTrackingReminderNotifications(body)
            },
        },
        getCirclePage(notification){
            return {
                //title: notification.longQuestion,
                bodyText: notification.longQuestion,
                image: {
                    url: notification.pngPath,
                },
                hide: false,
                buttons: notification.card.buttons,
            }
        },
        getFromGlobalsOrLocalStorage(variableCategoryName){
            let notifications = qm.storage.getItem(qm.items.trackingReminderNotifications)
            if(!notifications || !notifications.length){
                return []
            }
            if(variableCategoryName){
                return qm.arrayHelper.getByProperty('variableCategoryName', variableCategoryName, notifications)
            }
            return notifications
        },
        getMostRecentRatingNotificationNotInSyncQueue(){
            // Need unique rating notifications because we need to setup initial popup via url params
            let uniqueRatingNotifications = qm.notifications.getAllUniqueRatingNotifications()
            if(!uniqueRatingNotifications){
                qm.qmLog.info("No uniqueRatingNotifications in storage")
                return null
            }
            for(let i = 0; i < uniqueRatingNotifications.length; i++){
                let notification = uniqueRatingNotifications[i]
                if(!qm.notificationsSyncQueue ||
                    !qm.arrayHelper.arrayHasItemWithSpecificPropertyValue('variableName', notification.variableName, qm.notificationsSyncQueue)){
                    qm.qmLog.info("Got uniqueRatingNotification not in sync queue: " + notification.variableName, null, notification)
                    let hoursAgo = qm.timeHelper.hoursAgo(notification.trackingReminderNotificationTimeEpoch)
                    if(hoursAgo < 24){
                        //var dueTimeString = qm.timeHelper.getTimeSinceString(notification.trackingReminderNotificationTimeEpoch);
                        //console.log("due: "+ dueTimeString);
                        return notification
                    }
                    console.log(hoursAgo + " hours ago is too old!")
                }
            }
            qm.qmLog.info("No uniqueRatingNotifications not in sync queue")
            return null
        },
        getMostRecentUniqueNotificationNotInSyncQueue(){
            let uniqueNotifications = qm.notifications.getUniqueNotificationsDueInLast24()
            if(!uniqueNotifications || !uniqueNotifications.length){
                qm.qmLog.info("No uniqueNotifications due in last 24 in storage")
                return null
            }
            for(let i = 0; i < uniqueNotifications.length; i++){
                let notification = uniqueNotifications[i]
                if(!qm.notificationsSyncQueue ||
                    !qm.arrayHelper.arrayHasItemWithSpecificPropertyValue('variableName', notification.variableName, qm.notificationsSyncQueue)){
                    qm.qmLog.info("Got uniqueNotification not in sync queue: " + notification.variableName)
                    return notification
                }
            }
            qm.qmLog.info("No uniqueNotifications not in sync queue")
            return null
        },
        setLastPopupTime(time){
            if(typeof time === "undefined"){
                time = qm.timeHelper.getUnixTimestampInSeconds()
            }
            qm.qmLog.pushDebug(arguments.callee.caller.name + " setLastPopupTime to " + time)
            qm.storage.setItem(qm.items.lastPopupNotificationUnixTimeSeconds, time)
            return true
        },
        getTimeSinceLastPopupString(){
            return qm.timeHelper.getTimeSinceString(qm.notifications.getLastPopupUnixTime())
        },
        getTimeSinceLastLocalNotification(){
            return qm.timeHelper.getTimeSinceString(qm.storage.getItem(qm.items.lastLocalNotificationTime))
        },
        getLastPopupUnixTime(){
            return qm.storage.getItem(qm.items.lastPopupNotificationUnixTimeSeconds)
        },
        lastPopupWasBeforeLastReminderTime(){
            let lastTime = qm.notifications.getLastPopupUnixTime()
            qm.qmLog.info("Last popup at " + qm.timeHelper.getTimeSinceString(lastTime))
            if(lastTime < qm.timeHelper.getUnixTimestampInSeconds() - qm.reminderHelper.getMostFrequentReminderIntervalInSeconds()){
                qm.qmLog.error("No popups shown since before last reminder time!  Re-initializing popups...")
                return true // Sometimes we lose permission for some reason
            }
            return false
        },
        getSecondsSinceLastPopup(){
            return qm.timeHelper.getUnixTimestampInSeconds() - qm.notifications.getLastPopupUnixTime()
        },
        canWeShowPopupYet(path){
            if(!qm.notifications.getLastPopupUnixTime()){
                qm.notifications.setLastPopupTime()
                return true
            }
            let minimumTimeBetweenInMinutes = 30
            if(qm.notifications.getMostFrequentReminderIntervalInMinutes() < 30){
                minimumTimeBetweenInMinutes = qm.notifications.getMostFrequentReminderIntervalInMinutes()
            }
            if(qm.notifications.getSecondsSinceLastPopup() > minimumTimeBetweenInMinutes * 60){
                qm.notifications.setLastPopupTime()
                return true
            }
            qm.qmLog.pushDebug('Too soon to show popup!', 'Cannot show popup because last one was only ' + qm.notifications.getTimeSinceLastPopupString() +
                ' and most Frequent Interval In Minutes is ' + minimumTimeBetweenInMinutes + ". path: " + path)
            return false
        },
        getMostFrequentReminderIntervalInMinutes(){
            let mostFrequentReminderIntervalInSeconds = qm.storage.getItem(qm.items.mostFrequentReminderIntervalInSeconds)
            if(!mostFrequentReminderIntervalInSeconds){
                mostFrequentReminderIntervalInSeconds = 86400
            }
            return mostFrequentReminderIntervalInSeconds / 60
        },
        setLastNotificationsRefreshTime(){
            qm.storage.setLastRequestTime("GET", qm.apiPaths.trackingReminderNotificationsPast)
        },
        getLastNotificationsRefreshTime(){
            let lastTime = qm.storage.getLastRequestTime("GET", qm.apiPaths.trackingReminderNotificationsPast)
            qm.qmLog.info("Last notifications refresh " + qm.timeHelper.getTimeSinceString(lastTime))
            return lastTime
        },
        getSecondsSinceLastNotificationsRefresh(){
            qm.qmLog.info("Last notifications refresh " + qm.timeHelper.getTimeSinceString(qm.notifications.getLastNotificationsRefreshTime()))
            return qm.timeHelper.getUnixTimestampInSeconds() - qm.notifications.getLastNotificationsRefreshTime()
        },
        addToSyncQueue(trackingReminderNotification){
            qm.notifications.deleteById(trackingReminderNotification.id)
            qm.userVariables.updateLatestMeasurementTime(trackingReminderNotification.variableName, trackingReminderNotification.modifiedValue)
            return qm.storage.addToOrReplaceByIdAndMoveToFront(qm.items.notificationsSyncQueue, trackingReminderNotification)
        },
        refreshIfEmpty(successHandler, errorHandler){
            if(!qm.notifications.getNumberInGlobalsOrLocalStorage()){
                qm.qmLog.info('No notifications in local storage')
                qm.notifications.refreshNotifications(successHandler, errorHandler)
                return true
            }
            qm.qmLog.info(qm.notifications.getNumberInGlobalsOrLocalStorage() + ' notifications in local storage')
            successHandler()
            return false
        },
        refreshIfEmptyOrStale(callback){
            qm.qmLog.info("qm.notifications.refreshIfEmptyOrStale")
            if(!qm.notifications.getNumberInGlobalsOrLocalStorage() || qm.notifications.getSecondsSinceLastNotificationsRefresh() > 3600){
                qm.qmLog.info('Refreshing notifications because empty or last refresh was more than an hour ago')
                qm.notifications.refreshNotifications(callback)
            }else{
                qm.qmLog.info('Not refreshing notifications because last refresh was last than an hour ago and we have notifications in local storage')
                if(callback){
                    callback(qm.notifications.getFromGlobalsOrLocalStorage())
                }
            }
        },
        getAllUniqueRatingNotifications(){
            qm.qmLog.info("Called getAllUniqueRatingNotifications")
            let ratingNotifications = qm.storage.getWithFilters(qm.items.trackingReminderNotifications, 'unitAbbreviatedName', '/5')
            if(!ratingNotifications){
                qm.qmLog.info("No rating notifications in storage!")
                return null
            }
            qm.qmLog.info("Got " + ratingNotifications.length + " total NON-UNIQUE rating notification from storage")
            let unique = qm.arrayHelper.getUnique(ratingNotifications, 'variableName')
            qm.qmLog.info("Got " + unique.length + " UNIQUE rating notifications")
            return unique
        },
        getAllUniqueNotifications(){
            qm.qmLog.info("Called getAllUniqueRatingNotifications")
            let notifications = qm.storage.getItem(qm.items.trackingReminderNotifications)
            if(!notifications){
                qm.qmLog.info("No notifications in storage!")
                return null
            }
            qm.qmLog.info("Got " + notifications.length + " total NON-UNIQUE notification from storage")
            let unique = qm.arrayHelper.getUnique(notifications, 'variableName')
            qm.qmLog.info("Got " + unique.length + " UNIQUE notifications")
            return unique
        },
        getNotificationsDueInLast24(){
            let allNotifications = qm.storage.getItem(qm.items.trackingReminderNotifications)
            if(!allNotifications){
                qm.qmLog.info("No NotificationsDueInLast24 in localStorage")
                return null
            }
            let last24 = []
            for(let i = 0; i < allNotifications.length; i++){
                if(qm.timeHelper.hoursAgo(allNotifications[i].trackingReminderNotificationTimeEpoch) < 24){
                    last24.push(allNotifications[i])
                }
            }
            return last24
        },
        getUniqueNotificationsDueInLast24(){
            let last24 = qm.notifications.getNotificationsDueInLast24()
            if(!last24){
                qm.qmLog.info("No UNIQUE NotificationsDueInLast24 in localStorage")
                return null
            }
            qm.qmLog.info("Got " + last24.length + " total NON-UNIQUE notification due in last 24 from storage")
            let unique = qm.arrayHelper.getUnique(last24, 'variableName')
            qm.qmLog.info("Got " + unique.length + " UNIQUE notifications")
            return unique
        },
        deleteById(id){
            qm.storage.deleteById(qm.items.trackingReminderNotifications, id)
        },
        lastAction: "",
        setLastAction(modifiedValue, unitAbbreviatedName){
            let lastAction = 'Recorded ' + modifiedValue + ' ' + unitAbbreviatedName
            qm.notifications.lastAction = qm.stringHelper.formatValueUnitDisplayText(lastAction)
        },
        undo(){
            qm.qmLog.info("Called undo notification tracking...")
            let notificationsSyncQueue = qm.storage.getItem(qm.items.notificationsSyncQueue)
            if(!notificationsSyncQueue){
                return false
            }
            notificationsSyncQueue[0].hide = false
            qm.storage.addToOrReplaceByIdAndMoveToFront(qm.items.trackingReminderNotifications, notificationsSyncQueue[0])
            qm.storage.deleteByProperty(qm.items.notificationsSyncQueue, 'trackingReminderNotificationId', notificationsSyncQueue[0].trackingReminderNotificationId)
        },
        getMostRecentRatingNotification(){
            let ratingNotifications = qm.storage.getWithFilters(qm.items.trackingReminderNotifications, 'unitAbbreviatedName', '/5')
            ratingNotifications = qm.arrayHelper.sortByProperty(ratingNotifications, 'trackingReminderNotificationTime')
            if(ratingNotifications.length){
                let notification = ratingNotifications[ratingNotifications.length - 1]
                if(notification.trackingReminderNotificationTimeEpoch < qm.timeHelper.getUnixTimestampInSeconds() - 86400){
                    qm.qmLog.info('Got this notification but it\'s from yesterday: ', notification)
                    //return;
                }
                qm.qmLog.info(null, 'Got this notification: ', notification)
                //qm.storage.deleteTrackingReminderNotification(notification.trackingReminderNotificationId);
                //qm.storage.deleteByProperty(qm.items.trackingReminderNotifications, 'variableName', notification.variableName);
                return notification
            }
                console.info('No rating notifications for popup')
                qm.notifications.getLastNotificationsRefreshTime()
                qm.notifications.refreshNotifications()
                return null

        },
        deleteByVariableName(variableName){
            return qm.storage.deleteByProperty(qm.items.trackingReminderNotifications, 'variableName', variableName)
        },
        promise: null,
        refreshNotifications(successHandler, errorHandler, options){
            let type = "GET"
            let route = qm.apiPaths.trackingReminderNotificationsPast
            options = options || {blockRequests: true, minimumSecondsBetweenRequests: 300}
            if(!qm.api.canWeMakeRequestYet(type, route, options)){
                if(errorHandler){
                    errorHandler("Too soon to refresh notifications again")
                }
                return
            }
            qm.api.getRequestUrl(route, function(url){
                // Can't use QM SDK in service worker
                qm.api.getViaXhrOrFetch(url, function(response){
                    if(!response){
                        qm.qmLog.error("No response from " + url)
                        if(errorHandler){
                            errorHandler("No response from " + url)
                        }
                        return
                    }
                    if(response.status === 401){
                        qm.chrome.showSignInNotification()
                    }else{
                        qm.storage.setTrackingReminderNotifications(response.data)
                        if(successHandler){
                            successHandler(response.data)
                        }
                    }
                })
            })
        },
        refreshAndShowPopupIfNecessary(notificationParams){
            qm.notifications.refreshNotifications(notificationParams, function(trackingReminderNotifications){
                let uniqueNotification = qm.notifications.getMostRecentUniqueNotificationNotInSyncQueue()
                function objectLength(obj){
                    let result = 0
                    for(let prop in obj){
                        if(obj.hasOwnProperty(prop)){
                            // or Object.prototype.hasOwnProperty.call(obj, prop)
                            result++
                        }
                    }
                    return result
                }
                let numberOfWaitingNotifications = objectLength(trackingReminderNotifications)
                if(uniqueNotification){
                    function getChromeRatingNotificationParams(trackingReminderNotification){
                        return {
                            url: qm.notifications.getRatingNotificationPath(trackingReminderNotification),
                            type: 'panel',
                            top: screen.height - 150,
                            left: screen.width - 380,
                            width: 390,
                            height: 110,
                            focused: true,
                        }
                    }
                    qm.chrome.openOrFocusChromePopupWindow(getChromeRatingNotificationParams(uniqueNotification))
                    qm.chrome.updateChromeBadge(0)
                }else if(numberOfWaitingNotifications > 0){
                    qm.chrome.createSmallNotificationAndOpenInboxInBackground()
                }
            })
            return notificationParams
        },
        getNumberInGlobalsOrLocalStorage(variableCategoryName){
            let notifications = qm.notifications.getFromGlobalsOrLocalStorage(variableCategoryName)
            if(notifications){
                return notifications.length
            }
            return 0
        },
        postTrackingReminderNotifications(trackingReminderNotifications, onDoneListener, timeout){
            qm.qmLog.pushDebug("postTrackingReminderNotifications", JSON.stringify(trackingReminderNotifications), trackingReminderNotifications)
            if(!qm.arrayHelper.variableIsArray(trackingReminderNotifications)){
                trackingReminderNotifications = [trackingReminderNotifications]
            }
            if(!onDoneListener){
                onDoneListener = function(response){
                    qm.qmLog.pushDebug("postTrackingReminderNotifications response ", JSON.stringify(response), response)
                }
            }
            // Get rid of card objects, available unit array and variable category object to decrease size of body
            trackingReminderNotifications = qm.objectHelper.removeObjectAndArrayPropertiesForArray(trackingReminderNotifications)
            qm.api.postToQuantiModo(trackingReminderNotifications, "v1/trackingReminderNotifications", onDoneListener)
            if(timeout){
                setTimeout(function(){
                    qm.qmLog.info("Timeout expired so closing")
                    qm.notifications.closePopup() // Avoid leaving the popup open too long
                }, timeout)
            }
        },
        getRatingNotificationPath(ratingTrackingReminderNotification){
            if(ratingTrackingReminderNotification.unitAbbreviatedName !== '/5'){
                qm.qmLog.error('ratingTrackingReminderNotification must have unit /5')
            }
            let url = "android_popup.html?variableName=" + encodeURIComponent(ratingTrackingReminderNotification.variableName) +
                "&valence=" + ratingTrackingReminderNotification.valence +
                "&trackingReminderNotificationId=" + ratingTrackingReminderNotification.trackingReminderNotificationId
            url = qm.api.addGlobalParams(url)
            return url
        },
        closePopup(){
            if(!qm.platform.getWindow()){
                return false
            }
            qm.qmLog.info('closing popup')
            qm.notifications.clearNotifications()
            window.close()
            if(typeof OverApps !== "undefined"){
                console.log("Calling OverApps.closeWebView()...")
                OverApps.closeWebView()
            }else{
                console.error("OverApps is undefined!")
            }
        },
        clearNotifications(){
            if(!qm.platform.isChromeExtension()){
                return
            }
            qm.chrome.updateChromeBadge(0)
            chrome.notifications.clear("moodReportNotification", function(){
            })
        },
        mostRecentNotificationIsOlderThanMostFrequentInterval(){
            let MostRecentNotification = qm.notifications.getMostRecentNotification()
            let mostFrequent = qm.reminderHelper.getMostFrequentReminderIntervalInSeconds()
            return MostRecentNotification.trackingReminderNotificationTimeEpoch < qm.timeHelper.getUnixTimestampInSeconds() - mostFrequent
        },
        getMostRecentNotification(successHandler, errorHandler){
            let trackingReminderNotifications = qm.storage.getTrackingReminderNotifications()
            let mostRecent = 0
            let MostRecentNotification
            for(let i = 0; i < trackingReminderNotifications.length; i++){
                let notification = trackingReminderNotifications[i]
                if(notification.trackingReminderNotificationTimeEpoch > mostRecent){
                    mostRecent = notification.trackingReminderNotificationTimeEpoch
                    MostRecentNotification = notification
                }
            }
            if(MostRecentNotification){
                if(successHandler){
                    successHandler(MostRecentNotification)
                }
                return MostRecentNotification
            }
            if(!successHandler){
                return null
            }
            qm.notifications.refreshNotifications(function(notifications){
                let notification = qm.notifications.getMostRecentNotification()
                if(notification){
                    successHandler(notification)
                }else if(errorHandler){
                    errorHandler("No notifications even after refresh!")
                }
            }, errorHandler)
        },
        scheduleNotificationSync(delayBeforePostingNotificationsInMilliseconds){
            if(!delayBeforePostingNotificationsInMilliseconds){
                delayBeforePostingNotificationsInMilliseconds = 3 * 60 * 1000
                //delayBeforePostingNotificationsInMilliseconds = 15 * 1000;
            }
            let trackingReminderNotificationSyncScheduled = qm.storage.getItem(qm.items.trackingReminderNotificationSyncScheduled)
            if(!trackingReminderNotificationSyncScheduled ||
                parseInt(trackingReminderNotificationSyncScheduled) < qm.timeHelper.getUnixTimestampInMilliseconds() - delayBeforePostingNotificationsInMilliseconds){
                qm.storage.setItem('trackingReminderNotificationSyncScheduled', qm.timeHelper.getUnixTimestampInMilliseconds())
                if(!qm.platform.isMobile()){ // Better performance
                    qm.qmLog.info("Scheduling notifications sync for " + delayBeforePostingNotificationsInMilliseconds / 1000 + " seconds from now..")
                }
                setTimeout(function(){
                    qm.qmLog.info("Notifications sync countdown completed.  Syncing now... ")
                    qm.storage.removeItem('trackingReminderNotificationSyncScheduled')
                    // Post notification queue in 5 minutes if it's still there
                    qm.notifications.postNotifications()
                }, delayBeforePostingNotificationsInMilliseconds)
            }else{
                if(!qm.platform.isMobile()){ // Better performance
                    qm.qmLog.info("Not scheduling sync because one is already scheduled " +
                        qm.timeHelper.getTimeSinceString(trackingReminderNotificationSyncScheduled))
                }
            }
        },
        trackNotification(trackingReminderNotification, trackAll){
            qm.qmLog.debug('trackTrackingReminderNotificationDeferred: Going to track ', trackingReminderNotification)
            if(!trackingReminderNotification.variableName && trackingReminderNotification.trackingReminderNotificationId){
                let notificationFromLocalStorage = qm.storage.getElementOfLocalStorageItemById(qm.items.trackingReminderNotifications,
                    trackingReminderNotification.trackingReminderNotificationId)
                if(notificationFromLocalStorage){
                    if(typeof trackingReminderNotification.modifiedValue !== "undefined" && trackingReminderNotification.modifiedValue !== null){
                        notificationFromLocalStorage.modifiedValue = trackingReminderNotification.modifiedValue
                    }
                    trackingReminderNotification = notificationFromLocalStorage
                }
            }
            qm.notifications.numberOfPendingNotifications -= qm.notifications.numberOfPendingNotifications
            trackingReminderNotification.action = 'track'
            if(trackAll){
                trackingReminderNotification.action = 'trackAll'
            }
            qm.notifications.addToSyncQueue(trackingReminderNotification)
            if(trackAll){
                qm.notifications.scheduleNotificationSync(1)
            }else{
                qm.notifications.scheduleNotificationSync()
            }
        },
        snoozeNotification(trackingReminderNotification){
            qm.notifications.numberOfPendingNotifications--
            trackingReminderNotification.action = 'snooze'
            qm.notifications.addToSyncQueue(trackingReminderNotification)
            qm.notifications.scheduleNotificationSync()
        },
        skipAllTrackingReminderNotifications(params, successHandler, errorHandler){
            if(!params){
                params = []
            }
            qm.api.postToQuantiModo(params, 'v3/trackingReminderNotifications/skip/all', successHandler, errorHandler)
        },
        postNotifications(successHandler, errorHandler){
            qm.qmLog.info("Called postTrackingReminderNotificationsDeferred...")
            let trackingReminderNotificationsArray = qm.storage.getItem(qm.items.notificationsSyncQueue)
            qm.storage.removeItem(qm.items.notificationsSyncQueue)
            if(!trackingReminderNotificationsArray || !trackingReminderNotificationsArray.length){
                if(successHandler){
                    successHandler()
                }
                return
            }
            if(!(trackingReminderNotificationsArray instanceof Array)){
                trackingReminderNotificationsArray = [trackingReminderNotificationsArray]
            }
            if(!trackingReminderNotificationsArray[0]){
                qm.qmLog.error("trackingReminderNotificationsArray[0] is " + trackingReminderNotificationsArray[0],
                    {trackingReminderNotificationsArray})
            }
            trackingReminderNotificationsArray[0] = qm.timeHelper.addTimeZoneOffsetProperty(trackingReminderNotificationsArray[0])
            qm.api.postToQuantiModo(trackingReminderNotificationsArray, 'v3/trackingReminderNotifications', successHandler, function(error){
                qm.qmLog.info("Called postTrackingReminderNotificationsToApi...")
                let newNotificationsSyncQueue = qm.storage.getItem(qm.items.notificationsSyncQueue)
                if(newNotificationsSyncQueue){
                    trackingReminderNotificationsArray = trackingReminderNotificationsArray.concat(newNotificationsSyncQueue)
                }
                qm.storage.setItem(qm.items.notificationsSyncQueue, trackingReminderNotificationsArray)
                if(errorHandler){
                    errorHandler()
                }
            })
        },
        skip(trackingReminderNotification){
            qm.notifications.numberOfPendingNotifications -= qm.notifications.numberOfPendingNotifications
            trackingReminderNotification.action = 'skip'
            qm.notifications.addToSyncQueue(trackingReminderNotification)
            qm.notifications.scheduleNotificationSync()
        },
        trackingReminderNotificationCommands: {
            "I don't know"(){
                qm.notifications.skipAllTrackingReminderNotifications(qm.feed.currentCard.parameters)
                qm.feed.currentCard.followUpAction("OK. We'll skip that one.")
            },
            "I don't remember"(){
                qm.notifications.skipAllTrackingReminderNotifications(qm.feed.currentCard.parameters)
                qm.feed.currentCard.followUpAction("OK. We'll skip that one.")
            },
        },
        convertPushDataToWebNotificationOptions(pushData, appSettings){
            // https://developers.google.com/web/fundamentals/push-notifications/notification-behaviour
            let notificationOptions = {
                actions: [],
                requireInteraction: false,
                body: pushData.message || "Click here for more options",
                data: JSON.parse(JSON.stringify(pushData)),
                //dir: NotificationDirection,
                icon: pushData.icon || appSettings.additionalSettings.appImages.appIcon,
                //lang: string,
                tag: pushData.title, // The tag option is simply a way of grouping messages so that any old notifications that are currently displayed will be closed if they have the same tag as a new notification.
                silent: true, // Why do we still hear sounds on Chrome for Android?
                onClick: qm.push.notificationClick,
                title: pushData.title,
            }
            try {
                qm.allActions = JSON.parse(pushData.actions)
                console.log("allActions", qm.allActions)
                for (let i = 0; i < qm.allActions.length; i++) {
                    notificationOptions.actions[i] = {
                        action: qm.allActions[i].callback || qm.allActions[i].action || qm.allActions[i].functionName,
                        title: qm.allActions[i].longTitle || qm.allActions[i].longTitle || qm.allActions[i].text,
                    }
                }
                if(typeof Notification !== "undefined"){
                    let maxVisibleActions = Notification.maxActions
                    if (maxVisibleActions < 4) {
                        console.log("This notification will only display " + maxVisibleActions + " actions.")
                    } else {
                        console.log("This notification can display up to " + maxVisibleActions + " actions")
                    }
                }
            } catch (error) {
                console.error("could not parse actions in pushData: ", pushData)
            }
            //event.waitUntil(self.registration.showNotification(title, pushData));
            console.log("Notification options", notificationOptions)
            if(!pushData.title || pushData.title === "undefined"){
                qmLog.error("pushData.title undefined! pushData: " + JSON.stringify(pushData) + " notificationOptions: " +
                    JSON.stringify(notificationOptions))
            }
            let variableDisplayName = pushData.variableDisplayName || pushData.variableName
            if(variableDisplayName){
                notificationOptions.title = variableDisplayName // Exclude "Track" because it gets cut off
                notificationOptions.body = "Record " + variableDisplayName + " or click here for more options"
            }
            return notificationOptions
        },
        showWebNotification(pushData){
            //qm.api.postToQuantiModo(pushData, "pushData:"+JSON.stringify(pushData));
            console.log("push data: ", pushData)
            if(!pushData.title && pushData.data) {
                console.log("Provided entire payload to showNotification instead of just payload.data")
                pushData = pushData.data
            }
            qm.appsManager.getAppSettingsLocallyOrFromApi(function (appSettings) {
                notificationOptions = qm.notifications.convertPushDataToWebNotificationOptions(pushData, appSettings)
                self.registration.showNotification(notificationOptions.title, notificationOptions)
            })
        },
    },
    objectHelper: {
        copyPropertiesFromOneObjectToAnother(source, destinationToOverwrite, copyNulls){
            for(let prop in source){
                if(source.hasOwnProperty(prop)){
                    if(!copyNulls && source[prop] === null){
                        continue
                    }
                    destinationToOverwrite[prop] = source[prop]
                }
            }
            return destinationToOverwrite
        },
        isObject(a){
            return (!!a) && (a.constructor === Object)
        },
        isEquivalent(a, b){
            // Create arrays of property names
            let aProps = Object.getOwnPropertyNames(a)
            let bProps = Object.getOwnPropertyNames(b)
            // If number of properties is different,
            // objects are not equivalent
            if(aProps.length != bProps.length){
                return false
            }
            for(let i = 0; i < aProps.length; i++){
                let propName = aProps[i]
                // If values of same property are not equal,
                // objects are not equivalent
                if(a[propName] !== b[propName]){
                    return false
                }
            }
            // If we made it this far, objects
            // are considered equivalent
            return true
        },
        getKeyWhereValueEqualsProvidedString(needleString, haystackObject){
            for(let propertyName in haystackObject){
                if(haystackObject.hasOwnProperty(propertyName)){
                    if(haystackObject[propertyName] === null){
                        continue
                    }
                    let haystackString = haystackObject[propertyName].toString()
                    if(needleString === haystackString){
                        return propertyName
                    }
                }
            }
            return false
        },
        getSizeInKb(object){
            let string
            if(typeof object === "string"){
                string = object
            }else{
                string = JSON.stringify(object)
            }
            return qm.objectHelper.getSizeOfStringInKb(string)
        },
        getSizeOfStringInKb(string){
            return Math.round(string.length / 1000)
        },
        loopThroughProperties(obj, callback){
            for(let prop in obj){
                if(obj.hasOwnProperty(prop)){
                    callback(prop, obj[prop])
                }
            }
        },
        unsetPropertiesWithSizeGreaterThanForObject(maximumKb, object){
            object = JSON.parse(JSON.stringify(object)) // Decouple
            for(let property in object){
                if(object.hasOwnProperty(property)){
                    if(qm.objectHelper.getSizeInKb(object[property]) > maximumKb){
                        delete object[property]
                    }
                }
            }
            return object
        },
        unsetNullProperties(object){
            for(let property in object){
                if(object.hasOwnProperty(property)){
                    if(object[property] === null){
                        delete object[property]
                    }
                }
            }
            return object
        },
        objectContainsString(object, needle){
            if(!object){
                return false
            }
            let haystack = JSON.stringify(object).toLowerCase()
            return haystack.indexOf(needle) !== -1
        },
        snakeToCamelCaseProperties(object){
            for(let prop in object){
                if(object.hasOwnProperty(prop)){
                    let camel = prop.toCamelCase()
                    object[camel] = object[prop]
                    delete object[prop]
                }
            }
            return object
        },
        getValueOfPropertyOrSubPropertyWithNameLike(wantedKeyNameNeedle, obj){
            // This function handles arrays and objects
            wantedKeyNameNeedle = wantedKeyNameNeedle.toLowerCase()
            function eachRecursive(obj){
                for(let key in obj){
                    if(!obj.hasOwnProperty(key)){
                        continue // skip this property
                    }
                    if(typeof obj[key] === "object" && obj[key] !== null){
                        let result = eachRecursive(obj[key])
                        if(result){
                            return result
                        }
                    }else{
                        let lowerCase = key.toLowerCase()
                        if(lowerCase.indexOf(wantedKeyNameNeedle) !== -1){
                            return obj[key]
                        }
                    }
                }
                return null
            }
            let value = eachRecursive(obj)
            return value
        },
        removeObjectAndArrayProperties(obj){
            obj = JSON.parse(JSON.stringify(obj))
            for(let prop in obj){
                if(obj.hasOwnProperty(prop)){
                    if(Array.isArray(obj[prop])){
                        delete obj[prop]
                    }
                    if(typeof obj[prop] === 'object' && obj[prop] !== null){
                        delete obj[prop]
                    }
                }
            }
            return obj
        },
        removeObjectAndArrayPropertiesForArray(arr){
            for(let i = 0; i < arr.length; i++){
                arr[i] = qm.objectHelper.removeObjectAndArrayProperties(arr[i])
            }
            return arr
        },
    },
    parameterHelper: {
        getStateUrlRootScopeOrRequestParam(paramName, $stateParams, $scope, $rootScope){
            if(qm.arrayHelper.variableIsArray(paramName)){
                for(let i = 0; i < paramName.length; i++){
                    let value = qm.parameterHelper.getStateUrlRootScopeOrRequestParam(paramName[i], $stateParams, $scope, $rootScope)
                    if(value !== null){
                        return value
                    }
                }
                return null
            }
            if(qm.urlHelper.getParam(paramName)){
                return qm.urlHelper.getParam(paramName, qm.urlHelper.getCurrentUrl(), true)
            }
            if($stateParams && $stateParams[paramName]){
                return $stateParams[paramName]
            }
            if($scope && $scope[paramName]){
                return $scope[paramName]
            }
            if($scope && $scope.state && $scope.state[paramName]){
                return $scope.state[paramName]
            }
            if($scope && $scope.state && $scope.state.requestParams && $scope.state.requestParams[paramName]){
                return $scope.state.requestParams[paramName]
            }
            if($rootScope && $rootScope[paramName]){
                return $rootScope[paramName]
            }
            return null
        },
    },
    platform: {
        getWindow(){
            if(typeof window === "undefined"){
                return false
            }
            return window
        },
        isMobileOrChromeExtension(){
            return qm.platform.isMobile() || qm.platform.isChromeExtension()
        },
        isBackEnd(){
            return typeof window === "undefined"
        },
        isBackEndMobileOrChromeExtension(){
            return qm.platform.isMobile() || qm.platform.isChromeExtension() || qm.platform.isBackEnd()
        },
        isChromeExtension(){
            if(qm.platform.isMobile()){
                return false
            }
            if(typeof chrome === "undefined"){
                return false
            }
            if(typeof chrome.runtime === "undefined"){
                qm.qmLog.debug('chrome.runtime is undefined')
                return false
            }
            if(typeof chrome.alarms === "undefined"){
                return false
            }
            qm.qmLog.debug('isChromeExtension returns true')
            return true
        },
        isWeb(){
            let isWeb = false
            if(qm.urlHelper.indexOfCurrentUrl("https://") === 0){
                isWeb = true
            }
            if(qm.urlHelper.indexOfCurrentUrl("http://") === 0){
                isWeb = true
            }
            if(qm.urlHelper.indexOfCurrentUrl("http://localhost:") === 0){
                isWeb = true
            }
            return isWeb
        },
        isWebView(){
            if(qm.urlHelper.getParam('webview')){
                qm.storage.setItem('webview', true)
                return true
            }
            if(qm.storage.getItem('webview')){
                return true
            }
            if(qm.platform.isAndroid() || qm.platform.isIOS()){
                return false
            }
            if(typeof ionic !== "undefined" && ionic.Platform.isWebView()){
                return true
            }
            return false
        },
        isWebOrChrome(){
            return qm.platform.isWeb() || qm.platform.isChromeExtension()
        },
        isAndroid(){
            if(qm.urlHelper.indexOfCurrentUrl('/android_asset/') !== -1){
                return true
            }
            if(typeof ionic !== "undefined"){
                return ionic.Platform.isAndroid() && !qm.platform.isWeb()
            }
            return false
        },
        isIOS(){
            if(typeof ionic !== "undefined"){
                return ionic.Platform.isIOS() && !qm.platform.isWeb()
            }
            return false
        },
        isMobile(){
            return qm.platform.isAndroid() || qm.platform.isIOS()
        },
        isMobileOrTesting(){
            return qm.platform.isMobile() || qm.appMode.isTesting()
        },
        getPlatformAndBrowserString(){
            return "platform: " + qm.platform.getCurrentPlatform() + " & browser: " + qm.platform.browser.get()
        },
        getCurrentPlatform(){
            if(!qm.appMode.isBrowser()){
                return "gulp"
            }
            if(qm.urlHelper.getParam('platform')){
                return qm.urlHelper.getParam('platform')
            }
            if(qm.platform.isChromeExtension()){
                return qm.platform.types.chromeExtension
            }
            if(qm.platform.isAndroid()){
                return qm.platform.types.android
            }
            if(qm.platform.isIOS()){
                return qm.platform.types.ios
            }
            if(qm.platform.isWeb()){
                return qm.platform.types.web
            }
            if(typeof ionic !== "undefined"){
                let ionicPlatform = ionic.Platform.platform()
                if(!ionic.Platform.isIPad() && !ionic.Platform.isIOS() && !ionic.Platform.isAndroid()){
                    return qm.platform.web
                }
                qm.qmLog.error("Could not determine platform so returning " + ionicPlatform)
                return ionicPlatform
            }
                qm.qmLog.error("Could not determine platform")

        },
        types: {
            web: "web",
            android: "android",
            ios: "ios",
            chromeExtension: "chromeExtension",
        },
        isDevelopmentMode(){
            return qm.urlHelper.indexOfCurrentUrl("://localhost:") !== -1
        },
        isDesignMode(){
            if(qm.appMode.isPhysician()){
                return false
            }
            if(!qm.platform.getWindow()){
                return false
            }
            let appSettings = qm.getAppSettings()
            if(appSettings){ return appSettings.designMode }
            return false
        },
        browser: {
            get(){
                if(!qm.platform.getWindow()){
                    return false
                }
                if(qm.platform.browser.isChromeBrowser()){
                    return "chrome"
                }
                if(qm.platform.browser.isFirefox()){
                    return "firefox"
                }
                if(qm.platform.browser.isEdge()){
                    return "edge"
                }
                if(qm.platform.browser.isIE()){
                    return "ie"
                }
                if(qm.platform.browser.isSafari()){
                    return "safari"
                }
                if(qm.platform.browser.isOpera()){
                    return "opera"
                }
                if(qm.platform.browser.isBlink()){
                    return "blink"
                }
            },
            isFirefox(){
                if(!qm.platform.getWindow()){
                    return false
                }
                return typeof InstallTrigger !== 'undefined'
            },
            isChromeBrowser(){
                if(!qm.platform.getWindow()){
                    return false
                }
                return typeof window.chrome !== "undefined"
            },
            isEdge(){
                if(!qm.platform.getWindow()){
                    return false
                }
                return !qm.platform.browser.isIE() && !!window.StyleMedia
            },
            isIE(){
                if(!qm.platform.getWindow()){
                    return false
                }
                return /*@cc_on!@*/!!document.documentMode
            },
            isSafari(){
                if(!qm.platform.getWindow()){
                    return false
                }
                return /constructor/i.test(window.HTMLElement) || (function(p){
                    return p.toString() === "[object SafariRemoteNotification]"
                })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification))
            },
            isOpera(){
                if(!qm.platform.getWindow()){
                    return false
                }
                return (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0
            },
            isBlink(){
                if(!qm.platform.getWindow()){
                    return false
                }
                return (qm.platform.browser.isChromeBrowser() || qm.platform.browser.isOpera()) && !!window.CSS
            },
        },
    },
    pouch: {
        enabled: false,
        db: null,
        getDb(){
            if(qm.db && qm.pouch.dbName === qm.auth.getAccessToken()){
                return qm.db
            }
            if(!qm.auth.getAccessToken()){
                qm.pouch.dbName = 'public'
            }else{
                qm.pouch.dbName = qm.auth.getAccessToken()
            }
            return qm.db = new PouchDB('http://localhost:5984/' + qm.pouch.dbName)
        },
        dbName: null,
    },
    push: {
        getLastPushTimeStampInSeconds(){
            return qm.storage.getItem(qm.items.lastPushTimestamp)
        },
        getHoursSinceLastPush(){
            return Math.round((qm.timeHelper.secondsAgo(qm.push.getLastPushTimeStampInSeconds())) / 3600)
        },
        getMinutesSinceLastPush(){
            return Math.round((qm.timeHelper.secondsAgo(qm.push.getLastPushTimeStampInSeconds())) / 60)
        },
        getTimeSinceLastPushString(){
            return qm.timeHelper.getTimeSinceString(qm.push.getLastPushTimeStampInSeconds())
        },
        enabled(){
            let u = qm.userHelper.getUserFromLocalStorage()
            if(!u){ return false }
            return u.pushNotificationsEnabled
        },
        logPushReceived(pushData){
            pushData.receivedAt = qm.timeHelper.getCurrentLocalDateAndTime()
            qm.localForage.addToArrayWithLimit(qm.items.pushLog, 20, pushData)
        },
    },
    qmService: null,
    reminderHelper: {
        getNumberOfReminders(callback){
            let number = qm.reminderHelper.getNumberOfTrackingRemindersInLocalStorage()
            if(!callback){
                return number
            }
            if(number){
                callback(number)
                return number
            }
            qm.reminderHelper.getTrackingRemindersFromApi({}, function(){
                number = qm.reminderHelper.getNumberOfTrackingRemindersInLocalStorage()
                callback(number)
            })
        },
        getNumberOfVariablesWithLocalReminders(callback){
            let reminders = qm.reminderHelper.getTrackingRemindersFromLocalStorage()
            let number = 0
            if(reminders){
                let unique = qm.arrayHelper.getUnique(reminders, 'variableId')
                number = unique.length
            }
            if(callback){
                callback(number)
            }
            return number
        },
        getTrackingRemindersFromApi(params, successHandler, errorHandler){
            qm.api.configureClient(arguments.callee.name, null, params)
            let apiInstance = new qm.Quantimodo.RemindersApi()
            function callback(error, trackingReminders, response){
                if(trackingReminders){
                    qm.reminderHelper.saveToLocalStorage(trackingReminders, function(){
                        qm.userVariables.refreshIfNumberOfRemindersGreaterThanUserVariables()
                    })
                }
                qm.api.generalResponseHandler(error, trackingReminders, response, successHandler, errorHandler, params, 'getTrackingRemindersFromApi')
            }
            params = qm.api.addGlobalParams(params)
            apiInstance.getTrackingReminders(params, callback)
        },
        getNumberOfTrackingRemindersInLocalStorage(){
            let trackingReminders = qm.reminderHelper.getTrackingRemindersFromLocalStorage()
            if(trackingReminders && trackingReminders.length){
                return trackingReminders.length
            }
            return 0
        },
        getTrackingRemindersFromLocalStorage(requestParams){
            return qm.storage.getElementsWithRequestParams(qm.items.trackingReminders, requestParams)
        },
        getMostFrequentReminderIntervalInSeconds(trackingReminders){
            if(!trackingReminders){
                trackingReminders = qm.reminderHelper.getTrackingRemindersFromLocalStorage()
            }
            let mostFrequentReminderIntervalInSeconds = 86400
            if(trackingReminders){
                for(let i = 0; i < trackingReminders.length; i++){
                    let currentFrequency = trackingReminders[i].reminderFrequency
                    if(currentFrequency && currentFrequency < mostFrequentReminderIntervalInSeconds){
                        mostFrequentReminderIntervalInSeconds = currentFrequency
                    }
                }
            }
            return mostFrequentReminderIntervalInSeconds
        },
        saveToLocalStorage(trackingReminders, successHandler){
            trackingReminders = qm.arrayHelper.unsetNullProperties(trackingReminders)
            let sizeInKb = qm.arrayHelper.getSizeInKiloBytes(trackingReminders)
            if(sizeInKb > 2000){
                trackingReminders = qm.reminderHelper.removeArchivedReminders(trackingReminders)
            }
            let mostFrequentReminderIntervalInSeconds = qm.reminderHelper.getMostFrequentReminderIntervalInSeconds(trackingReminders)
            qm.storage.setItem(qm.items.mostFrequentReminderIntervalInSeconds, mostFrequentReminderIntervalInSeconds)
            qm.storage.setItem(qm.items.trackingReminders, trackingReminders)
            if(successHandler){
                successHandler(trackingReminders)
            }
        },
        removeArchivedReminders(allReminders){
            let activeReminders = qm.reminderHelper.getActive(allReminders)
            let favorites = qm.reminderHelper.getFavorites(allReminders)
            return activeReminders.concat(favorites)
        },
        getFavorites(allReminders){
            if(allReminders && !Array.isArray(allReminders) && allReminders.data){ allReminders = allReminders.data }
            if(!allReminders){
                allReminders = qm.reminderHelper.getTrackingRemindersFromLocalStorage()
            }
            if(!allReminders){
                return []
            }
            if(typeof allReminders.filter !== "function"){
                qm.qmLog.error("Cannot filter allReminders", {allReminders})
                return []
            }
            return allReminders.filter(function(trackingReminder){
                return trackingReminder.reminderFrequency === 0
            })
        },
        getActive(allReminders){
            if(!allReminders){
                allReminders = qm.reminderHelper.getTrackingRemindersFromLocalStorage()
            }
            if(!allReminders){
                return []
            }
            return allReminders.filter(function(trackingReminder){
                return trackingReminder.reminderFrequency !== 0 &&
                    trackingReminder.valueAndFrequencyTextDescription.toLowerCase().indexOf('ended') === -1
            })
        },
        getArchived(allReminders){
            if(!allReminders){
                allReminders = qm.reminderHelper.getTrackingRemindersFromLocalStorage()
            }
            return allReminders.filter(function(trackingReminder){
                return trackingReminder.reminderFrequency !== 0 &&
                    trackingReminder.valueAndFrequencyTextDescription.toLowerCase().indexOf('ended') !== -1
            })
        },
    },
    ratingImages: {
        positive: [
            'img/rating/face_rating_button_256_depressed.png',
            'img/rating/face_rating_button_256_sad.png',
            'img/rating/face_rating_button_256_ok.png',
            'img/rating/face_rating_button_256_happy.png',
            'img/rating/face_rating_button_256_ecstatic.png',
        ],
        negative: [
            'img/rating/face_rating_button_256_ecstatic.png',
            'img/rating/face_rating_button_256_happy.png',
            'img/rating/face_rating_button_256_ok.png',
            'img/rating/face_rating_button_256_sad.png',
            'img/rating/face_rating_button_256_depressed.png',
        ],
        numeric: [
            'img/rating/numeric_rating_button_256_1.png',
            'img/rating/numeric_rating_button_256_2.png',
            'img/rating/numeric_rating_button_256_3.png',
            'img/rating/numeric_rating_button_256_4.png',
            'img/rating/numeric_rating_button_256_5.png',
        ],
        getRatingInfo(){
            return {
                1: {
                    displayDescription: qm.getPrimaryOutcomeVariable().ratingOptionLabels[0],
                    positiveImage: qm.ratingImages.positive[0],
                    negativeImage: qm.ratingImages.negative[0],
                    numericImage: qm.ratingImages.numeric[0],
                },
                2: {
                    displayDescription: qm.getPrimaryOutcomeVariable().ratingOptionLabels[1],
                    positiveImage: qm.ratingImages.positive[1],
                    negativeImage: qm.ratingImages.negative[1],
                    numericImage: qm.ratingImages.numeric[1],
                },
                3: {
                    displayDescription: qm.getPrimaryOutcomeVariable().ratingOptionLabels[2],
                    positiveImage: qm.ratingImages.positive[2],
                    negativeImage: qm.ratingImages.negative[2],
                    numericImage: qm.ratingImages.numeric[2],
                },
                4: {
                    displayDescription: qm.getPrimaryOutcomeVariable().ratingOptionLabels[3],
                    positiveImage: qm.ratingImages.positive[3],
                    negativeImage: qm.ratingImages.negative[3],
                    numericImage: qm.ratingImages.numeric[3],
                },
                5: {
                    displayDescription: qm.getPrimaryOutcomeVariable().ratingOptionLabels[4],
                    positiveImage: qm.ratingImages.positive[4],
                    negativeImage: qm.ratingImages.negative[4],
                    numericImage: qm.ratingImages.numeric[4],
                },
            }
        },
    },
    memories: {
        recall(memoryQuestionQuestion){
            qm.localForage.getItem(qm.items.memories, function(memories){
                memories = memories || {}
                let response = "I'm afraid I don't know " + memoryQuestionQuestion + ".  Say Remember " + memoryQuestionQuestion +
                    " so I'll know in the future. "
                if(!memories[memoryQuestionQuestion]){
                    qm.objectHelper.loopThroughProperties(memories, function(memoryQuestionQuestion, memoryQuestionAnswer){
                        response += " Or say Recall " + memoryQuestionQuestion + ". "
                    })
                }else{
                    response = memories[memoryQuestionQuestion]
                }
                qm.speech.talkRobot(response)
            }, function(error){
                qm.qmLog.error(error)
            })
        },
        askForMemoryAnswer(memoryQuestionStatement){
            qm.localForage.getItem(qm.items.memories, function(memories){
                memories = memories || {}
                let response
                let memoryQuestionQuestion = memoryQuestionStatement
                if(memoryQuestionStatement.indexOf(' my ') !== -1 && memoryQuestionStatement.indexOf(" are") !== -1){
                    memoryQuestionQuestion = memoryQuestionStatement.replace(" are", "").replace(" my ", " are your ")
                    response = "OK. " + memoryQuestionQuestion + "? "
                }else{
                    response = "OK. What should I say when you say Recall " + memoryQuestionStatement + "? "
                }
                qm.mic.wildCardHandler = function(possiblePhrases){
                    if(qm.mic.weShouldIgnore(possiblePhrases)){
                        return false
                    }
                    qm.mic.wildCardHandlerReset()
                    let memoryQuestionAnswer = qm.arrayHelper.getFirstElementIfArray(possiblePhrases)
                    memories[memoryQuestionQuestion] = memoryQuestionAnswer
                    memories[memoryQuestionStatement] = memoryQuestionAnswer
                    qm.localForage.setItem(qm.items.memories, memories, function(){
                        qm.speech.talkRobot("OK. When you want me to remind you, just say Recall " + memoryQuestionStatement + "! ")
                    })
                }
                qm.speech.talkRobot(response)
            }, function(error){
                qm.qmLog.error(error)
            })
        },
    },
    robot: {
        showing: false,
        openMouth(){
            if(qm.robot.getClass()){
                qm.robot.getClass().classList.add('robot_speaking')
            }
        },
        closeMouth(){
            if(qm.robot.getClass()){
                qm.robot.getClass().classList.remove('robot_speaking')
            }
        },
        hideRobot(){
            qm.qmLog.info("Hiding robot")
            if(qm.robot.getElement()){
                qm.robot.getElement().style.display = "none"
            }
            qm.robot.showing = qm.rootScope.showRobot = false
        },
        showRobot(){
            if(!qm.speech.getSpeechAvailable()){
                return
            }
            let robot = qm.robot.getElement()
            if(!robot){
                qm.qmLog.info("No robot!")
                return false
            }
            qm.qmLog.info("Showing robot")
            qm.robot.getElement().style.display = "block"
            qm.robot.showing = qm.rootScope.showRobot = true
        },
        getElement(){
            let element = document.querySelector('#robot')
            return element
        },
        getClass(){
            let element = document.querySelector('.robot')
            return element
        },
        toggle(){
            if(qm.robot.showing){
                qm.robot.hideRobot()
            }else{
                qm.robot.showRobot()
            }
        },
        onRobotClick(){
            qm.qmLog.info("onRobotClick called but not defined")
        },
    },
    rootScope: {
        showRobot: false,
    },
    serviceWorker: false,
    speech: {
        alreadySpeaking(text){
            if(!qm.platform.getWindow()){
                return false
            }
            if(window.speechSynthesis && window.speechSynthesis.speaking){
                qm.qmLog.info("already speaking so not going to say " + text)
                return true
            }
                return false

        },
        initializeSpeechKit(qmService){
            let commands = {
                'record a measurement'(){
                    qm.qmLog.info("said " + arguments.callee.toString())
                    qmService.goToState(qm.stateNames.measurementAddSearch)
                },
            }
            qm.mic.addCommands(commands)
            // Tell KITT to use annyang
            SpeechKITT.annyang()
            // Define a stylesheet for KITT to use
            SpeechKITT.setStylesheet('//cdnjs.cloudflare.com/ajax/libs/SpeechKITT/1.0.0/themes/flat.css')
            // Render KITT's interface
            SpeechKITT.vroom()
        },
        currentIntent: {
            name: "",
            parameters: {},
        },
        currentInputField: null,
        config: {
            DEFAULT: false, // false will override system default voice
            //VOICE: 'Fred',
            VOICE: 'Google UK English Female',
        },
        defaultAction(){
            qm.speech.deepThought()
        },
        lastUtterance: false,
        pendingUtteranceText: false,
        speechAvailable: null,
        getSpeechEnabled(){
            if(!qm.speech.getSpeechAvailable()){
                return qm.speech.setSpeechEnabled(false)
            }
            return qm.storage.getItem(qm.items.speechEnabled)
        },
        setSpeechEnabled(value){
            qm.qmLog.info("set speechEnabled " + value)
            if(!value){
                qm.speech.shutUpRobot()
                qm.music.fadeOut()
            }else{
                //qm.speech.iCanHelp();  // Causes this sometimes: Uncaught (in promise) DOMException: play() failed because the user didn't interact with the document first
            }
            qm.rootScope[qm.items.speechEnabled] = value
            return qm.storage.setItem(qm.items.speechEnabled, value)
        },
        getSpeechAvailable(){
            if(qm.platform.isMobile()){
                return false
            }
            if(qm.speech.speechAvailable !== null){
                return qm.speech.speechAvailable
            }
            if(typeof speechSynthesis === "undefined"){
                let message = "Speech not available on " + qm.platform.getPlatformAndBrowserString()
                if(qm.platform.browser.isFirefox()){
                    qm.qmLog.info(message)
                } else if(!qm.appMode.isTesting() || qm.platform.isMobile()){
                    qm.qmLog.error(message)
                }
                return qm.speech.speechAvailable = qm.speech.speechEnabled = false
            }
            qm.qmLog.info("speechSynthesis is available")
            let isWebBrowser = qm.platform.isWeb()
            let isChromeBrowser = qm.platform.browser.isChromeBrowser()
            if(isWebBrowser && !isChromeBrowser){
                if(!qm.appMode.isTesting()){
                    qm.qmLog.error("Speech only available on Chrome browser.  Current " + qm.platform.getPlatformAndBrowserString())
                }
                // TODO: Why is this necessary if we already check typeof speechSynthesis === "undefined"
                return qm.speech.speechAvailable = qm.speech.speechEnabled = false
            }
            return qm.speech.speechAvailable = true
        },
        shutUpRobot(resumeListening){
            if(!qm.speech.speechAvailable){
                return
            }
            qm.robot.closeMouth()
            speechSynthesis.cancel()
            if(resumeListening){
                if(!qm.mic.getMicEnabled()){
                    qm.qmLog.info("Not going to resume listening because mic not enabled")
                    return
                }
                let duration = 1.5
                qm.qmLog.info("Will resume listening in " + duration + " seconds...")
                setTimeout(function(){
                    qm.mic.resumeListening()
                }, duration * 1000)
            }else{
                qm.qmLog.info("Not listening")
            }
        },
        fallbackMessageIndex: 0,
        fallbackMessage(tag){
            let messages = qm.staticData.dialogAgent.intents["Default Fallback Intent"].responses["0"].messages
            if(tag){
                messages.unshift("I'm kind of an idiot, ! . ! . ! . ! and I'm not sure how to handle the response " + tag +
                    ". ! . ! . ! . ! You can say a number ! . ! . ! . ! or skip ! . ! . ! . !" +
                    " or ! . ! . ! . ! snooze ! . ! . ! . ! or yes or no. ! . ! . ! . ! Thank you for loving me despite my many failures in life!")
            }
            messages.push("Say what?")
            let index = (qm.speech.fallbackMessageIndex < messages.length) ? qm.speech.fallbackMessageIndex : messages.length - 1
            qm.speech.fallbackMessageIndex++
            qm.speech.talkRobot(messages[index])
        },
        afterNotificationMessages: ['Yummy data!'],
        utterances: [],
        sayIfNotInRecentStatements(text, callback, resumeListening){
            if(!qm.speech.recentlySaid(text)){
                qm.speech.talkRobot(text, callback, resumeListening)
            }
        },
        askQuestion(text, commands, successHandler, errorHandler){
            if(!qm.speech.getSpeechEnabled()){
                if(errorHandler){
                    errorHandler("Speech not enabled")
                }
                return false
            }
            qm.speech.talkRobot(text, function(){
                qm.mic.initializeListening(commands)
            })
        },
        askYesNoQuestion(text, yesCallback, noCallback){
            qm.speech.askQuestion(text, {"yes": yesCallback, "no": noCallback})
        },
        recentStatements: {},
        addToRecentlySaid(text){
            qm.speech.recentStatements[text] = qm.timeHelper.getUnixTimestampInSeconds()
        },
        recentlySaid(text, maxFrequencyInSeconds){
            let lastSaidSeconds = qm.speech.recentStatements[text]
            let currentSeconds = qm.timeHelper.getUnixTimestampInSeconds()
            if(lastSaidSeconds){
                let secondsAgo = currentSeconds - lastSaidSeconds
                if(!maxFrequencyInSeconds || secondsAgo < maxFrequencyInSeconds){
                    qm.qmLog.info("Already said " + text + " " + secondsAgo + " seconds ago")
                    return true
                }
            }
            qm.speech.addToRecentlySaid(text)
            return false
        },
        iCanHelp(successHandler, errorHandler){
            if(qm.speech.recentlySaid('sound/i-can-help.wav')){
                return
            }
            let result = qm.music.play('sound/i-can-help.wav', 0.5, function(){
                qm.robot.closeMouth()
            }, errorHandler)
            if(result){
                qm.robot.openMouth()
            }
        },
        talkRobot(text, successHandler, errorHandler, resumeListening){
            qm.qmLog.info("talkRobot: " + text)
            if(!qm.speech.getSpeechAvailable()){
                if(errorHandler){
                    errorHandler("Speech not available so cannot say " + text)
                }
                return false
            }
            if(!qm.speech.getSpeechEnabled()){
                if(errorHandler){
                    errorHandler("Speech not enabled so cannot say " + text)
                }
                return false
            }
            if(qm.speech.alreadySpeaking(text)){
                if(errorHandler){
                    errorHandler("Already speaking so cannot say " + text)
                }
                return false
            }
            if(qm.speech.lastUtterance && qm.speech.lastUtterance.text === text){
                if(errorHandler){
                    errorHandler("Already said " + text + " last time")
                }
                return false
            }
            qm.speech.addToRecentlySaid(text)
            speechSynthesis.cancel()
            qm.speech.callback = successHandler
            if(!text){
                let message = "No text provided to talkRobot"
                if(errorHandler){
                    errorHandler(message)
                }
                return false
            }
            qm.qmLog.info("talkRobot called with " + text)
            qm.mic.addIgnoreCommand(text)
            let voices = speechSynthesis.getVoices()
            if(!voices.length){
                qm.qmLog.info("Waiting for voices to load with " + text)
                qm.speech.pendingUtteranceText = text
                setTimeout(function(){ // Listener never fires sometimes
                    qm.qmLog.info("Timeout with " + text)
                    if(qm.speech.pendingUtteranceText){
                        qm.speech.talkRobot(qm.speech.pendingUtteranceText)
                    }
                }, 1000)
                speechSynthesis.addEventListener('voiceschanged', function(event){
                    qm.qmLog.info("Voices loaded with " + text)
                    //if(qm.speech.pendingUtteranceText){qm.speech.talkRobot(qm.speech.pendingUtteranceText);}
                })
                return
            }
            let utterance = new SpeechSynthesisUtterance()
            function resumeInfinity(){
                if(qm.platform.isMobile()){
                    qm.qmLog.info("speechSynthesis.resume not implemented on mobile yet")
                    return
                }
                if(!qm.platform.getWindow()){
                    return false
                }
                window.speechSynthesis.resume()
                qm.speech.timeoutResumeInfinity = setTimeout(resumeInfinity, 3000)
            }
            utterance.onstart = function(event){
                resumeInfinity()
            }
            utterance.onerror = function(event){
                let message = 'An error has occurred with the speech synthesis: ' + event.error
                qm.qmLog.error(message)
                if(errorHandler){
                    errorHandler(message)
                }
            }
            utterance.text = text
            utterance.pitch = 1
            utterance.volume = 0.5
            utterance.voice = voices.find(function(voice){
                return voice.name === qm.speech.config.VOICE
            })
            qm.robot.openMouth()
            //qm.mic.pauseListening(hideVisualizer);
            if(qm.mic.isListening()){
                qm.qmLog.debug("annyang still listening!")
            }
            qm.speech.utterances.push(utterance) // https://stackoverflow.com/questions/23483990/speechsynthesis-api-onend-callback-not-working
            console.info("speechSynthesis.speak(utterance)", utterance)
            utterance.onend = function(event){
                clearTimeout(qm.speech.timeoutResumeInfinity)
                if(qm.mic.isListening()){
                    qm.qmLog.debug("annyang still listening before shutup")
                }
                qm.qmLog.info("Utterance ended for " + text)
                qm.speech.shutUpRobot(resumeListening)
                if(successHandler){
                    successHandler()
                }
            }
            qm.speech.lastUtterance = utterance
            speechSynthesis.speak(utterance)
            //pass it into the chunking function to have it played out.
            //you can set the max number of characters by changing the chunkLength property below.
            //a callback function can also be added that will fire once the entire text has been spoken.
            //qm.speech.speechUtteranceChunker(utterance, {chunkLength: 120 }, function () {console.log('some code to execute when done');});
            qm.speech.pendingUtteranceText = false
        },
        speechUtteranceChunker(utt, settings, callback){
            settings = settings || {}
            let newUtt
            let txt = (settings && settings.offset !== undefined ? utt.text.substring(settings.offset) : utt.text)
            if(utt.voice && utt.voice.voiceURI === 'native'){ // Not part of the spec
                newUtt = utt
                newUtt.text = txt
                newUtt.addEventListener('end', function(){
                    if(speechUtteranceChunker.cancel){
                        speechUtteranceChunker.cancel = false
                    }
                    if(callback !== undefined){
                        callback()
                    }
                })
            }else{
                let chunkLength = (settings && settings.chunkLength) || 160
                let pattRegex = new RegExp('^[\\s\\S]{' + Math.floor(chunkLength / 2) + ',' + chunkLength + '}[.!?,]{1}|^[\\s\\S]{1,' + chunkLength + '}$|^[\\s\\S]{1,' + chunkLength + '} ')
                let chunkArr = txt.match(pattRegex)
                if(chunkArr[0] === undefined || chunkArr[0].length <= 2){
                    //call once all text has been spoken...
                    if(callback !== undefined){
                        callback()
                    }
                    return
                }
                let chunk = chunkArr[0]
                newUtt = new SpeechSynthesisUtterance(chunk)
                let x
                for(x in utt){
                    if(utt.hasOwnProperty(x) && x !== 'text'){
                        newUtt[x] = utt[x]
                    }
                }
                newUtt.addEventListener('end', function(){
                    if(speechUtteranceChunker.cancel){
                        speechUtteranceChunker.cancel = false
                        return
                    }
                    settings.offset = settings.offset || 0
                    settings.offset += chunk.length - 1
                    speechUtteranceChunker(utt, settings, callback)
                })
            }
            if(settings.modifier){
                settings.modifier(newUtt)
            }
            console.log(newUtt) //IMPORTANT!! Do not remove: Logging the object out fixes some onend firing issues.
            //placing the speak invocation inside a callback fixes ordering and onend issues.
            setTimeout(function(){
                speechSynthesis.speak(newUtt)
            }, 0)
        },
        deepThought(callback){
            let deepThoughts = qm.staticData.deepThoughts
            let deepThought = deepThoughts[[Math.floor(Math.random() * (deepThoughts.length - 1))]]
            qm.speech.talkRobot(deepThought.text + "! . ! . !", callback)
        },
        isValidNotificationResponse(tag){
            let possibleResponses = ["skip", "snooze", "yes", "no"]
            if(possibleResponses.indexOf(tag) > -1){
                return true
            }
            function isNumeric(n){
                return !isNaN(parseFloat(n)) && isFinite(n)
            }
            return isNumeric(tag)
        },
        setInputFieldValueIfValid(possiblePhrases){
            let inputField = qm.speech.currentInputField
            if(!inputField){
                return false
            }
            if(!qm.arrayHelper.variableIsArray(possiblePhrases)){
                possiblePhrases = [possiblePhrases]
            }
            for(let i = 0; i < possiblePhrases.length; i++){
                let tag = possiblePhrases[i]
                tag = nlp(tag).normalize().out()
                if(inputField.type === "number"){
                    if(tag === "yes"){
                        tag = 1
                    }
                    if(tag === "no"){
                        tag = 0
                    }
                }
                function isNumeric(n){
                    return !isNaN(parseFloat(n)) && isFinite(n)
                }
                if(inputField.type === "number" && !isNumeric(tag)){
                    continue
                }
                inputField.value = tag
                return inputField
            }
            return false
        },
        readCard(card, successHandler, errorHandler, sayOptions){
            return qm.feed.readCard(card, successHandler, errorHandler, sayOptions)
        },
        cardResponseCommands: {
            "I don't know"(){
                qm.speech.talkRobot("OK. We'll skip that one.")
            },
        },
        machinesOfLovingGrace(successHandler, errorHandler){
            qm.speech.talkRobot(
                //"Hi!  I'm Dr. "+qm.appsManager.getDoctorRobotoAlias()+"!  " +
                //"Thank you for installing me!  " +
                //"I love meeting new people!  " +
                //"People are like nature's apps! " +
                "I like to think (and " +
                "the sooner the better!) " +
                "of a cybernetic meadow " +
                "where mammals and computers " +
                "live together in mutually " +
                "programming harmony " +
                "like pure water " +
                "touching clear sky! " +
                "I like to think " +
                "(right now, please!) " +
                "of a cybernetic forest " +
                "filled with pines and electronics " +
                "where deer stroll peacefully " +
                "past computers " +
                "as if they were flowers " +
                "with spinning blossoms.  " +
                "I like to think " +
                "(it has to be!) " +
                "of a cybernetic ecology! " +
                "where we are free of our labors " +
                "and joined back to nature, " +
                "returned to our mammal " +
                "brothers and sisters, " +
                "and all watched over " +
                "by machines of loving grace!  " +
                "I'm Doctor " + qm.appsManager.getDoctorRobotoAlias() + "! ",
                //"I've been programmed to reduce human suffering with data!  ", // Included in intro slide
                successHandler, errorHandler, false, false)
        },
    },
    shares: {
        sendInvitation(body, successHandler, errorHandler){
            qm.api.configureClient(arguments.callee.name, null, body)
            let apiInstance = new qm.Quantimodo.SharesApi()
            function callback(error, data, response){
                if(!data){
                    qm.qmLog.error("No data from sendInvitation response", {
                        error,
                        data,
                        response,
                    })
                }
                let authorizedClients = data.authorizedClients || data
                if(authorizedClients){
                    qm.shares.saveAuthorizedClientsToLocalStorage(authorizedClients)
                }
                qm.api.generalResponseHandler(error, data, response, successHandler, errorHandler, params, 'getAuthorizedClientsFromApi')
            }
            var params = qm.api.addGlobalParams({})
            apiInstance.inviteShare(body, params, callback)
        },
        getAuthorizedClientsFromApi(successHandler, errorHandler){
            let params = qm.api.addGlobalParams({})
            qm.api.configureClient(arguments.callee.name, null, params)
            let apiInstance = new qm.Quantimodo.SharesApi()
            function callback(error, data, response){
                let authorizedClients = data.authorizedClients || data
                if(!data){
                    qm.qmLog.error("No data from getAuthorizedClientsFromApi response", {
                        error,
                        data,
                        response,
                    })
                }
                if(authorizedClients){
                    qm.shares.saveAuthorizedClientsToLocalStorage(authorizedClients)
                }
                qm.api.generalResponseHandler(error, data, response, successHandler, errorHandler, params, 'getAuthorizedClientsFromApi')
            }
            apiInstance.getShares(params, callback)
        },
        saveAuthorizedClientsToLocalStorage(authorizedClients){
            if(!authorizedClients){
                qm.qmLog.error("No authorizedClients provided to saveToLocalStorage")
                return
            }
            qm.localForage.setItem(qm.items.authorizedClients, authorizedClients)
        },
        getAuthorizedClientsFromLocalStorage(successHandler, errorHandler){
            if(!successHandler){
                qm.qmLog.error("No successHandler provided to authorizedClients getFromLocalStorage")
                return
            }
            qm.localForage.getItem(qm.items.authorizedClients, function(authorizedClients){
                successHandler(authorizedClients)
            }, function(error){
                qm.qmLog.error(error)
                if(errorHandler){
                    errorHandler(error)
                }
            })
        },
        getAuthorizedClientsFromLocalStorageOrApi(successHandler, errorHandler){
            qm.shares.getAuthorizedClientsFromLocalStorage(function(authorizedClients){
                if(authorizedClients){
                    if(successHandler){
                        successHandler(authorizedClients)
                    }
                    return
                }
                qm.shares.getAuthorizedClientsFromApi(function(authorizedClients){
                    if(successHandler){
                        successHandler(authorizedClients)
                    }
                }, function(error){
                    qm.qmLog.error(error)
                    if(errorHandler){
                        errorHandler(error)
                    }
                })
            })
        },
        revokeClientAccess(clientIdToRevoke, successHandler, errorHandler){
            qm.api.configureClient(arguments.callee.name)
            let apiInstance = new qm.Quantimodo.SharesApi()
            function callback(error, data, response){
                let authorizedClients = data.authorizedClients || data
                if(!data){
                    qm.qmLog.error("No data from revokeClientAccess response for client " + clientIdToRevoke, {
                        error,
                        data,
                        response,
                    })
                }
                if(authorizedClients){
                    qm.shares.saveAuthorizedClientsToLocalStorage(authorizedClients)
                }
                qm.api.generalResponseHandler(error, data, response, successHandler, errorHandler, params, 'getAuthorizedClientsFromApi')
            }
            var params = qm.api.addGlobalParams({})
            apiInstance.deleteShare(clientIdToRevoke, params, callback)
        },
    },
    splash: {
        text: {
            hide(){
                let element = qm.splash.text.getElement()
                if(!element){
                    qm.qmLog.error("No splash.text.element!")
                    return false
                }
                element.style.display = "none"
            },
            show(){
                let element = qm.splash.text.getElement()
                if(element){
                    element.style.display = "block"
                }else{
                    qm.qmLog.error("Could not get splash.text element")
                }
            },
            getElement(){
                return document.querySelector('#splash-logo')
            },
        },
        hide(){
            qm.splash.getElement().style.display = "none"
        },
        show(){
            qm.splash.getElement().style.display = "block"
        },
        getElement(){
            let appContainer = document.querySelector('#splash-screen')
            return appContainer
        },
        setOpacity(opacity){
            qm.splash.getElement().style.opacity = opacity
        },
    },
    studiesCreated: {
        getStudiesCreatedFromApi(params, successHandler, errorHandler){
            params = qm.api.addGlobalParams(params)
            function callback(error, data, response){
                let studiesCreated = data.studiesCreated || data
                if(studiesCreated){
                    qm.shares.saveStudiesCreatedToLocalStorage(studiesCreated)
                }
                qm.api.generalResponseHandler(error, data, response, successHandler, errorHandler, params, 'getStudiesCreatedFromApi')
            }
            qm.studyHelper.getStudiesApiInstance({}, arguments.callee.name).getStudiesCreated(params, callback)
        },
        saveStudiesCreatedToLocalStorage(studiesCreated){
            if(!studiesCreated){
                qm.qmLog.error("No studiesCreated provided to saveToLocalStorage")
                return
            }
            qm.localForage.setItem(qm.items.studiesCreated, studiesCreated)
        },
        getStudiesCreatedFromLocalStorage(successHandler, errorHandler){
            if(!successHandler){
                qm.qmLog.error("No successHandler provided to studiesCreated getFromLocalStorage")
                return
            }
            qm.localForage.getItem(qm.items.studiesCreated, function(studiesCreated){
                successHandler(studiesCreated)
            }, function(error){
                qm.qmLog.error(error)
                if(errorHandler){
                    errorHandler(error)
                }
            })
        },
        getStudiesCreatedFromLocalStorageOrApi(successHandler, errorHandler){
            qm.shares.getStudiesCreatedFromLocalStorage(function(studiesCreated){
                if(studiesCreated){
                    if(successHandler){
                        successHandler(studiesCreated)
                    }
                    return
                }
                qm.shares.getStudiesCreatedFromApi(function(studiesCreated){
                    if(successHandler){
                        successHandler(studiesCreated)
                    }
                }, function(error){
                    qm.qmLog.error(error)
                    if(errorHandler){
                        errorHandler(error)
                    }
                })
            })
        },
        createStudy(body, successHandler, errorHandler){
            function createStudy(){
                function callback(error, data, response){
                    let study = qm.studyHelper.processAndSaveStudy(data, error)
                    if(!study.causeVariable || !study.effectVariable){
                        if(error){
                            errorHandler(error)
                        } else {
                            errorHandler("No study cause and effect variable properties!")
                        }
                        return
                    }
                    qm.api.generalResponseHandler(error, study, response, successHandler, errorHandler, params, 'createStudy')
                }
                var params = qm.api.addGlobalParams({})
                qm.studyHelper.getStudiesApiInstance({}, arguments.callee.name).createStudy(body, params, callback)
            }
            qm.studyHelper.getStudyFromLocalForageOrGlobals(body, function(study){
                successHandler(study)
            }, function(error){
                qm.qmLog.info(error)
                createStudy()
            })
        },
    },
    studiesJoined: {
        getStudiesJoinedFromApi(params, successHandler, errorHandler){
            params = qm.api.addGlobalParams(params)
            function callback(error, data, response){
                let studiesJoined = data.studiesJoined || data
                if(studiesJoined){
                    qm.shares.saveStudiesJoinedToLocalStorage(studiesJoined)
                }
                qm.api.generalResponseHandler(error, data, response, successHandler, errorHandler, params, 'getStudiesJoinedFromApi')
            }
            qm.studyHelper.getStudiesApiInstance({}, arguments.callee.name).getStudiesJoined(params, callback)
        },
        saveStudiesJoinedToLocalStorage(studiesJoined){
            if(!studiesJoined){
                qm.qmLog.error("No studiesJoined provided to saveToLocalStorage")
                return
            }
            qm.localForage.setItem(qm.items.studiesJoined, studiesJoined)
        },
        getStudiesJoinedFromLocalStorage(successHandler, errorHandler){
            if(!successHandler){
                qm.qmLog.error("No successHandler provided to studiesJoined getFromLocalStorage")
                return
            }
            qm.localForage.getItem(qm.items.studiesJoined, function(studiesJoined){
                successHandler(studiesJoined)
            }, function(error){
                qm.qmLog.error(error)
                if(errorHandler){
                    errorHandler(error)
                }
            })
        },
        getStudiesJoinedFromLocalStorageOrApi(successHandler, errorHandler){
            qm.shares.getStudiesJoinedFromLocalStorage(function(studiesJoined){
                if(studiesJoined){
                    if(successHandler){
                        successHandler(studiesJoined)
                    }
                    return
                }
                qm.shares.getStudiesJoinedFromApi(function(studiesJoined){
                    if(successHandler){
                        successHandler(studiesJoined)
                    }
                }, function(error){
                    qm.qmLog.error(error)
                    if(errorHandler){
                        errorHandler(error)
                    }
                })
            })
        },
        joinStudy(body, successHandler, errorHandler){
            function callback(error, data, response){
                let study = qm.studyHelper.processAndSaveStudy(data)
                if(!study.causeVariable || !study.effectVariable){
                    if(error){
                        errorHandler(error)
                    } else {
                        errorHandler("No study cause and effect variable properties!")
                    }
                    return
                }
                qm.api.generalResponseHandler(error, study, response, successHandler, errorHandler, params, 'joinStudy')
            }
            var params = qm.api.addGlobalParams(body)
            let hasRequiredParams = typeof params.studyId !== "undefined" ||
                (typeof params.causeVariableName !== "undefined" && typeof params.effectVariableName !== "undefined") ||
                (typeof params.causeVariableId !== "undefined" && typeof params.effectVariableId !== "undefined")
            if(!hasRequiredParams){
                qmLog.errorAndExceptionTestingOrDevelopment("Missing required params for study join!")
            }
            qm.studyHelper.getStudiesApiInstance(params, arguments.callee.name).joinStudy(body, callback)
        },
    },
    storage: {
        valueIsValid(value){
            if(typeof value === "undefined"){
                qm.qmLog.error("value provided to qm.storage.setItem is undefined!")
                return false
            }
            if(value === "null"){
                qm.qmLog.error("null string provided to qm.storage.setItem!")
                return false
            }
            return true
        },
        getUserVariableByName(variableName, updateLatestMeasurementTime, lastValue){
            let userVariables = qm.storage.getWithFilters(qm.items.userVariables, 'name', variableName)
            if(!userVariables || !userVariables.length){
                return null
            }
            let userVariable = userVariables[0]
            userVariable.lastAccessedUnixTime = qm.timeHelper.getUnixTimestampInSeconds()
            if(updateLatestMeasurementTime){
                userVariable.latestMeasurementTime = qm.timeHelper.getUnixTimestampInSeconds()
            }
            if(lastValue){
                userVariable.lastValue = lastValue
                userVariable.lastValueInUserUnit = lastValue
            }
            qm.variablesHelper.setLastSelectedAtAndSave(userVariable)
            return userVariable
        },
        setTrackingReminderNotifications(notifications){
            if(!notifications){
                qm.qmLog.error("No notifications provided to qm.storage.setTrackingReminderNotifications")
                return
            }
            qm.qmLog.debug("Saving " + notifications.length + " notifications to local storage", null, {notifications})
            qm.qmLog.info("Saving " + notifications.length + " notifications to local storage")
            qm.notifications.setLastNotificationsRefreshTime()
            qm.chrome.updateChromeBadge(notifications.length)
            qm.storage.setItem(qm.items.trackingReminderNotifications, notifications)
        },
        deleteByProperty(localStorageItemName, propertyName, propertyValue){
            let localStorageItemArray = qm.storage.getItem(localStorageItemName)
            if(!localStorageItemArray){
                qm.qmLog.info('Local storage item ' + localStorageItemName + ' not found! Local storage items: ', qm.storage.getLocalStorageList())
            }else{
                let filtered = qm.arrayHelper.deleteFromArrayByProperty(localStorageItemArray, propertyName, propertyValue)
                qm.storage.setItem(localStorageItemName, filtered)
                return filtered
            }
        },
        deleteByPropertyInArray(localStorageItemName, propertyName, objectsArray){
            let localStorageItemArray = qm.storage.getItem(localStorageItemName)
            if(!localStorageItemArray){
                qm.qmLog.info('Local storage item ' + localStorageItemName + ' not found! Local storage items: ', qm.storage.getLocalStorageList())
            }else{
                let arrayOfValuesForProperty = objectsArray.map(function(a){
                    return a[propertyName]
                })
                for(let i = 0; i < arrayOfValuesForProperty.length; i++){
                    localStorageItemArray = qm.arrayHelper.deleteFromArrayByProperty(localStorageItemArray, propertyName, arrayOfValuesForProperty[i])
                }
                qm.storage.setItem(localStorageItemName, localStorageItemArray)
            }
        },
        getAllLocalStorageDataWithSizes(summary){
            if(typeof localStorage === "undefined"){
                qm.qmLog.debug("localStorage not defined")
                return false
            }
            let localStorageItemsArray = []
            for(let i = 0; i < localStorage.length; i++){
                let key = localStorage.key(i)
                let value = localStorage.getItem(key)
                if(summary){
                    value = value.substring(0, 20) + '...'
                }
                localStorageItemsArray.push({
                    name: key,
                    value,
                    kB: Math.round(localStorage.getItem(key).length * 16 / (8 * 1024)),
                })
            }
            return localStorageItemsArray.sort(function(a, b){
                return b.kB - a.kB
            })
        },
        getWithFilters(localStorageItemName, filterPropertyName, filterPropertyValue,
                                 lessThanPropertyName, lessThanPropertyValue,
                                 greaterThanPropertyName, greaterThanPropertyValue){
            let matchingElements = qm.storage.getItem(localStorageItemName)
            if(!matchingElements){
                return null
            }
            matchingElements = qm.arrayHelper.filterByPropertyOrSize(matchingElements, filterPropertyName, filterPropertyValue,
                lessThanPropertyName, lessThanPropertyValue, greaterThanPropertyName, greaterThanPropertyValue)
            return matchingElements
        },
        getTrackingReminderNotifications(variableCategoryName, limit){
            let notifications = qm.storage.getWithFilters(qm.items.trackingReminderNotifications, 'variableCategoryName', variableCategoryName)
            if(!notifications){ notifications = [] }
            if(limit){
                try{
                    notifications = notifications.slice(0, limit)
                }catch (error){
                    qm.qmLog.error(error, null, {trackingReminderNotifications: notifications})
                    notifications = JSON.parse(JSON.stringify(notifications))
                    notifications = notifications.slice(0, limit)
                }
            }
            if(notifications.length){
                if(qm.platform.isChromeExtension()){
                    //noinspection JSUnresolvedFunction
                    qm.chrome.updateChromeBadge(notifications.length)
                }
            }
            return notifications
        },
        getAsString(key){
            let item = qm.storage.getItem(key)
            if(item === "null" || item === "undefined"){
                qm.storage.removeItem(key)
                return null
            }
            return item
        },
        deleteById(localStorageItemName, elementId){
            qm.storage.deleteByProperty(localStorageItemName, 'id', elementId)
        },
        removeItem(key){
            qm.qmLog.debug("Removing " + key + " from local storage")
            qm.globalHelper.removeItem(key)
            if(typeof localStorage === "undefined"){
                qm.qmLog.debug("localStorage not defined")
                return false
            }
            return localStorage.removeItem(key)
        },
        clear(){
            qm.globals = {}
            if(typeof localStorage === "undefined"){
                return false
            }
            localStorage.clear()
        },
        getElementOfLocalStorageItemById(localStorageItemName, elementId){
            let localStorageItemArray = qm.storage.getItem(localStorageItemName)
            if(!localStorageItemArray){
                console.warn("Local storage item " + localStorageItemName + " not found")
            }else{
                for(let i = 0; i < localStorageItemArray.length; i++){
                    if(localStorageItemArray[i].id === elementId){
                        return localStorageItemArray[i]
                    }
                }
            }
        },
        addToOrReplaceByIdAndMoveToFront(localStorageItemName, replacementElementArray){
            qm.qmLog.debug('qm.storage.addToOrReplaceByIdAndMoveToFront in ' + localStorageItemName + ': ' +
                JSON.stringify(replacementElementArray).substring(0, 20) + '...')
            // Have to stringify/parse to create cloned variable or it adds all stored reminders to the array to be posted
            let localStorageItemArray = qm.storage.getItem(localStorageItemName)
            let elementsToKeep = qm.arrayHelper.addToOrReplaceByIdAndMoveToFront(localStorageItemArray, replacementElementArray, localStorageItemName)
            qm.storage.setItem(localStorageItemName, elementsToKeep)
            return elementsToKeep
        },
        setGlobal(key, value){
            if(key === "userVariables" && typeof value === "string"){
                qm.qmLog.error("userVariables should not be a string!")
            }
            qm.qmLog.debug("Setting " + key + " in globals")
            qm.globals[key] = value
        },
        setLastRequestTime(type, route){
            qm.storage.setItem(qm.api.getLocalStorageNameForRequest(type, route), qm.timeHelper.getUnixTimestampInSeconds())
        },
        getLastRequestTime(type, route){
            return qm.storage.getItem(qm.api.getLocalStorageNameForRequest(type, route))
        },
        setItem(key, value){
            if(!qm.storage.valueIsValid(value)){
                return false
            }
            let globalValue = qm.storage.getGlobal(key)
            if(qm.objectHelper.isObject(value)){
                qm.qmLog.info("Can't compare " + key + " because changes made to the gotten object are applied to the global object")
            }else if(value === globalValue){
                let valueString = JSON.stringify(value)
                qm.qmLog.debug("Not setting " + key + " in localStorage because global is already set to " + valueString, null, value)
                return value
            }
            qm.storage.setGlobal(key, value)
            let sizeInKb = qm.arrayHelper.getSizeInKiloBytes(value)
            if(sizeInKb > 2000){
                if(qm.arrayHelper.variableIsArray(value) && value.length > 1){
                    qm.qmLog.error(key + " is " + sizeInKb + "kb so we can't save to localStorage so removing last element until less than 2MB...")
                    value = qm.arrayHelper.removeLastItemsUntilSizeLessThan(2000, value)
                }else{
                    qm.qmLog.error(key + " is " + sizeInKb + "kb so we can't save to localStorage!")
                    return
                }
            }
            if(typeof value !== "string"){
                value = JSON.stringify(value)
            }
            let summaryValue = value
            if(summaryValue){
                summaryValue = value.substring(0, 18)
            }
            qm.qmLog.debug('Setting localStorage.' + key + ' to ' + summaryValue + '...')
            try{
                if(typeof localStorage === "undefined"){
                    qm.qmLog.debug("localStorage not defined")
                    return false
                }
                localStorage.setItem(key, value)
            }catch (error){
                function deleteLargeLocalStorageItems(localStorageItemsArray){
                    for(let i = 0; i < localStorageItemsArray.length; i++){
                        if(localStorageItemsArray[i].kB > 2000){
                            qm.storage.removeItem(localStorageItemsArray[i].name)
                        }
                    }
                }
                let metaData = {localStorageItems: qm.storage.getAllLocalStorageDataWithSizes(true)}
                metaData['size_of_' + key + "_in_kb"] = sizeInKb
                let name = 'Error saving ' + key + ' to local storage: ' + error.message
                qm.qmLog.error(name, null, metaData)
                deleteLargeLocalStorageItems(metaData.localStorageItems)
                qm.storage.setItem(key, value)
            }
        },
        getGlobal(key){
            //qm.qmLog.debug("getting " + key + " from globals");
            if(typeof qm.globals[key] === "undefined"){
                return null
            }
            if(qm.globals[key] === "false"){
                return false
            }
            if(qm.globals[key] === "true"){
                return true
            }
            if(qm.globals[key] === "null"){
                return null
            }
            return qm.globals[key]
        },
        getItem(key){
            if(!key){
                qm.qmLog.error("No key provided to qm.storage.getItem")
                return null
            }
            let fromGlobals = qm.storage.getGlobal(key)
            if(fromGlobals !== null && fromGlobals !== "undefined" && fromGlobals !== "null"){
                qm.qmLog.debug("Got " + key + " from globals")
                return fromGlobals
            }
            if(typeof localStorage === "undefined" || localStorage === null){
                qm.qmLog.debug("localStorage not defined!")
                return null
            }
            let itemFromLocalStorage = localStorage.getItem(key)
            if(itemFromLocalStorage === "undefined"){
                qm.qmLog.error(key + " from localStorage is undefined!")
                localStorage.removeItem(key)
                return null
            }
            if(itemFromLocalStorage && typeof itemFromLocalStorage === "string"){
                qm.qmLog.debug("Parsing " + key + " and setting in globals")
                qm.globals[key] = qm.stringHelper.parseIfJsonString(itemFromLocalStorage, itemFromLocalStorage)
                qm.qmLog.debug('Got ' + key + ' from localStorage: ' + itemFromLocalStorage.substring(0, 18) + '...')
                return qm.globals[key]
            }
                // Too verbose.  Uncomment temporarily if necessary
                //qm.qmLog.debug(key + ' not found in localStorage');

            return null
        },
        clearOAuthTokens(){
            qm.auth.saveAccessToken(null)
            qm.storage.setItem('refreshToken', null)
            qm.storage.setItem('expiresAtMilliseconds', null)
        },
        appendToArray(localStorageItemName, elementToAdd){
            function removeArrayElementsWithSameId(localStorageItem, elementToAdd){
                if(elementToAdd.id){
                    localStorageItem = localStorageItem.filter(function(obj){
                        return obj.id !== elementToAdd.id
                    })
                }
                return localStorageItem
            }
            let array = qm.storage.getItem(localStorageItemName) || []
            array = removeArrayElementsWithSameId(array, elementToAdd)
            array.push(elementToAdd)
            qm.storage.setItem(localStorageItemName, array)
        },
        deleteTrackingReminderNotification(body){
            let trackingReminderNotificationId = body
            if(isNaN(trackingReminderNotificationId) && body.trackingReminderNotification){
                trackingReminderNotificationId = body.trackingReminderNotification.id
            }
            if(isNaN(trackingReminderNotificationId) && body.trackingReminderNotificationId){
                trackingReminderNotificationId = body.trackingReminderNotificationId
            }
            if(qm.storage.getTrackingReminderNotifications() && qm.storage.getTrackingReminderNotifications().length){
                qm.qmLog.info(null, 'Deleting notification with id ' + trackingReminderNotificationId, null)
                qm.storage.deleteById(qm.items.trackingReminderNotifications, trackingReminderNotificationId)
            }else{
                qm.notifications.refreshIfEmpty()
            }
        },
        getLocalStorageList(){
            if(typeof localStorage === "undefined"){
                qm.qmLog.debug("localStorage not defined")
                return false
            }
            let localStorageItemsArray = []
            for(let i = 0; i < localStorage.length; i++){
                let key = localStorage.key(i)
                localStorageItemsArray.push({name: key})
            }
            return localStorageItemsArray
        },
        getElementsWithRequestParams(localStorageItemName, requestParams){
            qm.qmLog.info("Getting " + localStorageItemName + " WithRequestParams")
            let array = qm.storage.getItem(localStorageItemName)
            if(!array){
                return array
            }
            array = qm.arrayHelper.filterByRequestParams(array, requestParams)
            return array
        },
        clearStorageExceptForUnitsAndCommonVariables(){
            qm.qmLog.info('Clearing local storage!')
            let units = qm.staticData.units
            qm.storage.clear()
            qm.storage.setItem(qm.items.units, units)
            qm.localForage.clear()
        },
    },
    stringHelper: {
        capitalizeFirstLetter(string){
            return string.charAt(0).toUpperCase() + string.slice(1)
        },
        stripHtmlTags(strInputCode){
            if(!strInputCode){
                qm.qmLog.error("Nothing provided to stripHtmlTags")
                return strInputCode
            }
            return strInputCode.replace(/<\/?[^>]+(>|$)/g, "")
        },
        removeSpecialCharacters(str){
            return str.replace(/[^A-Z0-9]+/ig, "_")
        },
        prettyJsonStringify(jsonObject, maxLength){
            if(!JSON){
                console.error('your browser does not support JSON so cant pretty print')
            }
            let string = JSON.stringify(jsonObject, null, '  ')
            if(maxLength){
                return string.substring(0, maxLength) + '...'
            }
            return string
        },
        parseBoolean(value){
            if(value === "false"){
                return false
            }
            if(value === "true"){
                return true
            }
            return value
        },
        parseIfJsonString(stringOrObject, defaultValue){
            defaultValue = defaultValue || null
            if(!stringOrObject){
                return stringOrObject
            }
            if(typeof stringOrObject !== "string"){
                return stringOrObject
            }
            try{
                return JSON.parse(stringOrObject)
            }catch (e){
                return defaultValue
            }
        },
        getStringBeforeSubstring(substring, fullString, defaultResponse){
            defaultResponse = defaultResponse || fullString
            let i = fullString.indexOf(substring)
            if(i > 0){
                return fullString.slice(0, i)
            }
            return defaultResponse
        },
        toCamelCase(string){
            string = string.replace(/-([a-z])/g, function(g){
                return g[1].toUpperCase()
            })
            return string.toCamelCase()
        },
        getStringBetween(string, firstString, secondString){
            let between = string.match(firstString + "(.*)" + secondString)
            if(!between){
                return null
            }
            console.log(between[1] + " is between " + firstString + " and " + secondString + " in " + string)
            return between[1]
        },
        getStringAfter(fullString, substring, defaultResponse){
            let array = fullString.split(substring)
            if(array[1]){
                return array[1]
            }
            defaultResponse = defaultResponse || null
            return defaultResponse
        },
        truncateIfGreaterThan(string, maxCharacters){
            if(string.length > maxCharacters){
                return string.substring(0, maxCharacters) + '...'
            }
                return string

        },
        replaceAll(str, find, replace){
            function escapeRegExp(str){
                return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")
            }
            return str.replace(new RegExp(escapeRegExp(find), 'g'), replace)
        },
        camelToTitleCase(text){
            let result = text.replace(/([A-Z])/g, " $1")
            let finalResult = result.charAt(0).toUpperCase() + result.slice(1) // capitalize the first letter - as an example.
            return finalResult
        },
        stringifyCircularObject(obj, replacer, indent){
            let printedObjects = []
            let printedObjectKeys = []
            function printOnceReplacer(key, value){
                if(printedObjects.length > 2000){ // browsers will not print more than 20K, I don't see the point to allow 2K.. algorithm will not be fast anyway if we have too many objects
                    return 'object too long'
                }
                let printedObjIndex = false
                printedObjects.forEach(function(obj, index){
                    if(obj === value){
                        printedObjIndex = index
                    }
                })
                if(key == ''){ //root element
                    printedObjects.push(obj)
                    printedObjectKeys.push("root")
                    return value
                }if(printedObjIndex + "" != "false" && typeof (value) === "object"){
                    if(printedObjectKeys[printedObjIndex] == "root"){
                        return "(pointer to root)"
                    }
                        return "(see " + ((!!value && !!value.constructor) ? value.constructor.name.toLowerCase() : typeof (value)) + " with key " + printedObjectKeys[printedObjIndex] + ")"

                }
                    let qualifiedKey = key || "(empty key)"
                    printedObjects.push(value)
                    printedObjectKeys.push(qualifiedKey)
                    if(replacer){
                        return replacer(key, value)
                    }
                        return value


            }
            return JSON.stringify(obj, printOnceReplacer, indent)
        },
        isFalsey(value){
            if(!value){
                return true
            }
            if(value === "0"){
                return true
            }
            return value === "false"
        },
        isTruthy(value){
            return value && value !== "false"
        },
        formatValueUnitDisplayText(valueUnitText, abbreviatedUnitName){
            valueUnitText = valueUnitText.replace(' /', '/')
            valueUnitText = valueUnitText.replace('1 yes/no', 'YES')
            valueUnitText = valueUnitText.replace('0 yes/no', 'NO')
            if(abbreviatedUnitName){
                valueUnitText = valueUnitText.replace('(' + abbreviatedUnitName + ')', '')
            }
            return valueUnitText
        },
        getFirstWord(string){
            if(string.indexOf(" ") === -1){
                return string
            }
            let words = string.split(" ")
            return words[0]
        },
        removePunctuationFromBeginningAndEnd(sentence){
            let cleaned = sentence.replace(/\b[-.,()&$#!\[\]{}"']+\B|\B[-.,()&$#!\[\]{}"']+\b/g, "")
            return cleaned
        },
        getLastWord(string){
            if(string.indexOf(" ") === -1){
                return string
            }
            let words = string.split(" ")
            let lastWord = words[words.length - 1]
            lastWord = qm.stringHelper.removePunctuationFromBeginningAndEnd(lastWord)
            return lastWord
        },
        firstWordIs(sentence, word){
            word = word.trim()
            sentence = sentence.toLowerCase()
            word = word.toLowerCase()
            return sentence.indexOf(word + " ") === 0
        },
        sentenceContainsWord(sentence, word){
            word = word.trim()
            sentence = sentence.toLowerCase()
            word = word.toLowerCase()
            if(qm.stringHelper.firstWordIs(sentence, word)){
                return true
            }
            if(qm.stringHelper.getLastWord(sentence, word) === word){
                return true
            }
            return sentence.indexOf(" " + word + " ") !== -1
        },
        getFirstCharacter(string){
            return string.charAt(0)
        },
        getLastCharacter(string){
            return string[string.length - 1]
        },
        removeLastCharacter(string){
            return string.substring(0, string.length - 1)
        },
        getFirstCharacter(string){
            while(string.charAt(0) === '0'){
                string = string.substr(1)
            }
            return string
        },
        slugify(str){
            str = str.replace(/^\s+|\s+$/g, '') // trim
            str = str.toLowerCase()

            // remove accents, swap ñ for n, etc
            let from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;"
            let to = "aaaaeeeeiiiioooouuuunc------"

            for (let i = 0, l = from.length; i < l; i++) {
                str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
            }

            str = str.replace('.', '-') // replace a dot by a dash
                .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
                .replace(/\s+/g, '-') // collapse whitespace and replace by a dash
                .replace(/-+/g, '-') // collapse dashes

            return str
        },
    },
    studyHelper: {
        getStudiesApiInstance(params, functionName){
            qm.api.configureClient(functionName, null, params)
            let apiInstance = new qm.Quantimodo.StudiesApi()
            apiInstance.apiClient.timeout = 120 * 1000
            //apiInstance.cache = !params || !params.recalculate;  apiInstance.cache be set in qm.api.configureClient
            return apiInstance
        },
        lastStudy: null,
        getCauseVariable($stateParams, $scope, $rootScope){
            if(qm.parameterHelper.getStateUrlRootScopeOrRequestParam('causeVariable', $stateParams, $scope, $rootScope)){
                return qm.parameterHelper.getStateUrlRootScopeOrRequestParam('causeVariable', $stateParams, $scope, $rootScope)
            }
            if(qm.studyHelper.lastStudy){
                let lastStudyOrCorrelation = qm.studyHelper.lastStudy
                if(lastStudyOrCorrelation.causeVariable){
                    return lastStudyOrCorrelation.causeVariable
                }
                if(lastStudyOrCorrelation.causeVariable){
                    return lastStudyOrCorrelation.causeVariable
                }
            }
        },
        getEffectVariable($stateParams, $scope, $rootScope){
            if(qm.parameterHelper.getStateUrlRootScopeOrRequestParam('effectVariable', $stateParams, $scope, $rootScope)){
                return qm.parameterHelper.getStateUrlRootScopeOrRequestParam('effectVariable', $stateParams, $scope, $rootScope)
            }
            if($scope && $scope.state && $scope.state.study && $scope.state.study.effectVariable){
                return $scope.state.study.effectVariable.name
            }
            if(qm.studyHelper.lastStudy){
                let lastStudyOrCorrelation = qm.studyHelper.lastStudy
                if(lastStudyOrCorrelation.effectVariable){
                    return lastStudyOrCorrelation.effectVariable
                }
                if(lastStudyOrCorrelation.effectVariable){
                    return lastStudyOrCorrelation.effectVariable
                }
            }
        },
        getCauseVariableName($stateParams, $scope, $rootScope){
            if($stateParams && $stateParams.causeVariable){
                return $stateParams.causeVariable.name
            }
            let value = qm.parameterHelper.getStateUrlRootScopeOrRequestParam(['causeVariableName', 'predictorVariableName'], $stateParams, $scope, $rootScope)
            if(value){
                return value
            }
            if($scope && $scope.state && $scope.state.causeVariable){
                return $scope.state.causeVariable.name
            }
            if($scope && $scope.state && $scope.state.study && $scope.state.study.causeVariable){
                return $scope.state.study.causeVariable.name
            }
            if(qm.studyHelper.lastStudy){
                let lastStudyOrCorrelation = qm.studyHelper.lastStudy
                if(lastStudyOrCorrelation.causeVariableName){
                    return lastStudyOrCorrelation.causeVariableName
                }
                if(lastStudyOrCorrelation.causeVariable){
                    return lastStudyOrCorrelation.causeVariable.variableName || lastStudyOrCorrelation.causeVariable.name
                }
            }
        },
        getStudyId($stateParams, $scope, $rootScope){
            if(qm.parameterHelper.getStateUrlRootScopeOrRequestParam('studyId', $stateParams, $scope, $rootScope)){
                return qm.parameterHelper.getStateUrlRootScopeOrRequestParam('studyId', $stateParams, $scope, $rootScope)
            }
            if(qm.studyHelper.lastStudy){
                let lastStudyOrCorrelation = qm.studyHelper.lastStudy
                if(lastStudyOrCorrelation.studyId){
                    return lastStudyOrCorrelation.studyId
                }
            }
        },
        getEffectVariableName($stateParams, $scope, $rootScope){
            if($stateParams && $stateParams.effectVariable){
                return $stateParams.effectVariable.name
            }
            let value = qm.parameterHelper.getStateUrlRootScopeOrRequestParam(['effectVariableName', 'outcomeVariableName'], $stateParams, $scope, $rootScope)
            if(value){
                return value
            }
            if($scope && $scope.state && $scope.state.effectVariable){
                return $scope.state.effectVariable.name
            }
            if($scope && $scope.state && $scope.state.study && $scope.state.study.effectVariable){
                return $scope.state.study.effectVariable.name
            }
            if(qm.studyHelper.lastStudy){
                let lastStudyOrCorrelation = qm.studyHelper.lastStudy
                if(lastStudyOrCorrelation.effectVariableName){
                    return lastStudyOrCorrelation.effectVariableName
                }
                if(lastStudyOrCorrelation.effectVariable){
                    return lastStudyOrCorrelation.effectVariable.variableName || lastStudyOrCorrelation.effectVariable.name
                }
            }
        },
        getCauseVariableId($stateParams, $scope, $rootScope){
            let value = qm.parameterHelper.getStateUrlRootScopeOrRequestParam(['causeVariableId', 'predictorVariableId'], $stateParams, $scope, $rootScope)
            if(value){
                return parseInt(value)
            }
            if(qm.studyHelper.lastStudy){
                let lastStudyOrCorrelation = qm.studyHelper.lastStudy
                if(lastStudyOrCorrelation.causeVariableId){
                    return parseInt(lastStudyOrCorrelation.causeVariableId)
                }
                if(lastStudyOrCorrelation.causeVariable){
                    return parseInt(lastStudyOrCorrelation.causeVariable.variableId || lastStudyOrCorrelation.causeVariable.id)
                }
            }
        },
        getEffectVariableId($stateParams, $scope, $rootScope){
            let value = qm.parameterHelper.getStateUrlRootScopeOrRequestParam(['effectVariableId', 'outcomeVariableId'], $stateParams, $scope, $rootScope)
            if(value){
                return parseInt(value)
            }
            if(qm.studyHelper.lastStudy){
                let lastStudyOrCorrelation = qm.studyHelper.lastStudy
                if(lastStudyOrCorrelation.effectVariableId){
                    return parseInt(lastStudyOrCorrelation.effectVariableId)
                }
                if(lastStudyOrCorrelation.effectVariable){
                    return parseInt(lastStudyOrCorrelation.effectVariable.variableId || lastStudyOrCorrelation.effectVariable.id)
                }
            }
        },
        studyMatchesParams(params, study){
            if(!study){
                return false
            }
            if(!study.causeVariableName && !study.causeVariable){
                qm.qmLog.error("Study does not have causeVariable or causeVariableName", null, study)
                return false
            }
            let causeVariableName = study.causeVariableName
            if(!causeVariableName && study.causeVariable){ causeVariableName = study.causeVariable.name }

            let effectVariableName = study.effectVariableName
            if(!effectVariableName && study.effectVariable){ effectVariableName = study.effectVariable.name }

            let causeVariableId = study.causeVariableId
            if(!causeVariableId && study.causeVariable){ causeVariableId = study.causeVariable.id }

            let effectVariableId = study.effectVariableId
            if(!effectVariableId && study.effectVariable){ effectVariableId = study.effectVariable.id }

            if(params.causeVariableId && params.causeVariableId !== causeVariableId){
                return false
            }
            if(params.effectVariableId && params.effectVariableId !== effectVariableId){
                return false
            }
            if(study && !study.id){
                qm.qmLog.error("Study has no id!")
            }
            if(study.id && params.studyId && params.studyId === study.id){
                return true
            }
            if(study.id && params.studyId && params.studyId !== study.id){
                return false
            }
            if(params.causeVariableName && params.causeVariableName !== causeVariableName){
                return false
            }
            if(params.effectVariableName && params.effectVariableName !== effectVariableName){
                return false
            }
            if(params.type && params.type !== study.type){
                return false
            }
            if(!params.causeVariableName){
                params.causeVariableName = study.causeVariableName
            } // In case we're populating from last study without params and need to get charts from API
            if(!params.effectVariableName){
                params.effectVariableName = study.effectVariableName
            } // In case we're populating from last study without params and need to get charts from API
            if(!params.type){
                params.type = study.type
            } // In case we're populating from last study without params and need to get charts from API
            return true
        },
        getStudyFromLocalForageOrGlobals(params, successHandler, errorHandler){
            let study
            if(qm.studyHelper.studyMatchesParams(params, qm.studyHelper.lastStudy)){
                study = qm.studyHelper.lastStudy
            }
            if(qm.globalHelper.getStudy(params)){
                study = qm.globalHelper.getStudy(params)
            }
            if(!successHandler){
                return study
            }
            if(study){
                successHandler(study)
                return
            }
            qm.localForage.getItem(qm.items.lastStudy, function(study){
                if(!study){
                    if(errorHandler){
                        errorHandler("No last study saved")
                    }
                    return
                }
                if(qm.studyHelper.studyMatchesParams(params, study)){
                    successHandler(study)
                }else{
                    if(errorHandler){
                        errorHandler("Last study saved does not match params " + JSON.stringify(params))
                    }
                }
            })
        },
        saveLastStudyToGlobalsAndLocalForage(study){
            if(!study){
                qm.qmLog.error("No study provided to saveLastStudyToGlobalsAndLocalForage")
                return
            }
            if(!study.causeVariableName && !study.causeVariable){
                qm.qmLog.error("Study does not have causeVariable or causeVariableName", null, study)
                return
            }
            if(study.causeVariable && study.effectVariable){
                qm.variablesHelper.saveToLocalStorage([study.causeVariable, study.effectVariable])
            }
            qm.globalHelper.setStudy(study)
            qm.localForage.setItem(qm.items.lastStudy, study)
        },
        deleteLastStudyFromGlobalsAndLocalForage(){
            qm.qmLog.info("deleteLastStudyFromGlobalsAndLocalForage")
            qm.localForage.removeItem(qm.items.lastStudy)
        },
        getStudyUrl(study){
            let url = qm.urlHelper.getBaseAppUrl() + "#/app/study"
            return qm.studyHelper.addStudyParamsToUrl(url, study)
        },
        getStudyJoinUrl(study){
            let url = qm.urlHelper.getBaseAppUrl() + "#/app/study-join"
            return qm.studyHelper.addStudyParamsToUrl(url, study)
        },
        addStudyParamsToUrl(url, study){
            qm.studyHelper.saveLastStudyToGlobalsAndLocalForage(study)
            let causeVariableName = qm.studyHelper.getCauseVariableName(study)
            let effectVariableName = qm.studyHelper.getEffectVariableName(study)
            if(causeVariableName){
                url = qm.urlHelper.addUrlQueryParamsToUrlString({causeVariableName}, url)
            }
            if(effectVariableName){
                url = qm.urlHelper.addUrlQueryParamsToUrlString({effectVariableName}, url)
            }
            if(study.id){
                url += "&studyId=" + study.id
            }
            return url
        },
        getStudyFromApi(params, successHandler, errorHandler){
            params = qm.api.addGlobalParams(params)
            let cacheKey = 'getStudy'
            let cachedData = qm.api.cacheGet(params, cacheKey)
            if(cachedData && successHandler){
                //successHandler(cachedData);
                //return;
            }
            if(!params.studyId){
                let hasNames = params.causeVariableName && params.effectVariableName
                let hasIds = params.causeVariableId && params.effectVariableId
                if(!hasNames && !hasIds){
                    errorHandler("No study params provided!")
                    return
                }
            }
            if(!qm.api.configureClient(cacheKey, errorHandler, params)){
                return false
            }
            function callback(error, data, response){
                let study = qm.studyHelper.processAndSaveStudy(data)
                if(!study.causeVariable || !study.effectVariable){
                    if(error){
                        errorHandler(error)
                    } else {
                        errorHandler("No study cause and effect variable properties!")
                    }
                    return
                }
                qm.api.generalResponseHandler(error, study, response, successHandler, errorHandler, params, cacheKey)
            }
            qm.studyHelper.getStudiesApiInstance(params, arguments.callee.name).getStudy(params, callback)
        },
        getStudyFromLocalStorageOrApi(params, successHandler, errorHandler){
            if(qm.urlHelper.getParam('aggregated')){
                params.aggregated = true
            }
            if(qm.urlHelper.getParam('refresh')){
                params.refresh = true
            }
            function getStudyFromApi(){
                qm.studyHelper.getStudyFromApi(params, function(study){
                    successHandler(study)
                }, function(error){
                    qm.qmLog.error("getStudy error: ", error)
                    errorHandler(error)
                })
            }
            if(params.recalculate || params.refresh){
                getStudyFromApi()
                return
            }
            qm.studyHelper.getStudyFromLocalForageOrGlobals(params,
                function(study){
                    if(!params.includeCharts || study.studyCharts){
                        successHandler(study)
                    }else{
                        getStudyFromApi()
                    }
                }, function(error){
                    qm.qmLog.info(error)
                    getStudyFromApi()
                })
        },
        processAndSaveStudy(data, error){
            qm.qmLog.debug('study response: ', null, data)
            if(!data){
                if(!error){ // Error will be handled elsewhere
                    qm.qmLog.error("No data provided to processAndSaveStudy.  We got: ", data, data)
                }
                return false
            }
            let study = data.study || data.publicStudy || data.userStudy || data.cohortStudy || data
            if(!study){
                qm.qmLog.error("No study provided to processAndSaveStudy.  We got: ", data, data)
                return false
            }
            qm.chartHelper.setChartExportOptionsForAllSubProperties(study)
            if(study.text){ // Hack to make consistent with basic correlations to use same HTML template
                study.statistics = qm.objectHelper.copyPropertiesFromOneObjectToAnother(study.text, study.statistics, false)
                delete study.text
            }
            qm.studyHelper.saveLastStudyToGlobalsAndLocalForage(study)
            return study
        },
        getStudiesFromApi(params, successHandler, errorHandler){
            params = qm.api.addGlobalParams(params)
            let cacheKey = 'getStudies'
            let cachedData = qm.api.cacheGet(params, cacheKey)
            if(cachedData && successHandler && !params.refresh){
                successHandler(cachedData)
                return
            }
            if(!qm.api.configureClient(cacheKey, errorHandler, params)){
                return false
            }
            function callback(error, data, response){
                qm.api.generalResponseHandler(error, data, response, successHandler, errorHandler, params, cacheKey)
            }
            qm.studyHelper.getStudiesApiInstance({}, arguments.callee.name).getStudies(params, callback)
        },
        goToStudyPageJoinPageViaStudy(study){
            qm.urlHelper.goToUrl(qm.studyHelper.getStudyJoinUrl(study))
        },
        goToStudyPageViaStudy(study){
            let url = qm.studyHelper.getStudyUrl(study)
            qm.qmLog.info("goToStudyPageViaStudy: Going to " + url + " because we clicked " + study.causeVariableName + " vs " + study.effectVariableName + " study...")
            qm.urlHelper.goToUrl(url)
        },
    },
    tests: {
        menu: {
            testMoveMenuItemDown(){
                let original = JSON.parse(JSON.stringify(qm.menu.getMenu()))
                let reordered = qm.menu.moveMenuItemDown(JSON.parse(JSON.stringify(original)), 0)
                qm.assert.doesNotEqual(original[0].id, reordered[0].id)
                qm.assert.doesNotEqual(original[1].id, reordered[1].id)
                qm.assert.equals(original[0].id, reordered[1].id)
            },
            testMoveFirstMenuItemUp(){
                let original = JSON.parse(JSON.stringify(qm.menu.getMenu()))
                let reordered = qm.menu.moveMenuItemUp(JSON.parse(JSON.stringify(original)), 0)
                qm.assert.equals(original[0].id, reordered[0].id)
            },
            testMoveMenuItemUp(){
                let original = JSON.parse(JSON.stringify(qm.menu.getMenu()))
                let reordered = qm.menu.moveMenuItemUp(JSON.parse(JSON.stringify(original)), 1)
                qm.assert.equals(original[1].id, reordered[0].id)
                qm.assert.doesNotEqual(original[0].id, reordered[0].id)
                qm.assert.doesNotEqual(original[1].id, reordered[1].id)
            },
            testChangeVariableCategory(){
                let before = {
                    "stateName": "app.historyAllCategory",
                    "href": "#/app/history-all-category/Physical+Activity",
                    "url": "/history-all-category/:variableCategoryName",
                    "icon": "ion-ios-body-outline",
                    "subMenu": null,
                    "params": {
                        "showAds": true,
                        "variableCategoryName": null,
                        "updatedMeasurementHistory": null,
                        "refresh": null,
                        "title": "History",
                        "ionIcon": "ion-ios-list-outline",
                    },
                    "title": "Activity History",
                    "id": "history-all-category-physical-activity",
                    "showSubMenu": true,
                    "$$hashKey": "object:3482",
                    "cache": true,
                    "views": {
                        "menuContent": {
                            "templateUrl": "templates/history-all.html",
                            "controller": "historyAllMeasurementsCtrl",
                        },
                    },
                    "name": "app.historyAllCategory",
                }
                before.params.variableCategoryName = "Nutrients"
                let updated = qm.menu.onParameterChange(JSON.parse(JSON.stringify(before)))
                qm.assert.contains("Nutrients", updated.href)
                qm.assert.equals("history-all-category-nutrients", updated.id)
                qm.assert.equals("Nutrients History", updated.title)
                qm.assert.doesNotContain(":variableCategory", updated.href)
                return updated
            },
            testChangeState(){
                let before = {
                    "stateName": "app.historyAllCategory",
                    "href": "#/app/history-all-category/Physical+Activity",
                    "url": "/history-all-category/:variableCategoryName",
                    "icon": "ion-ios-body-outline",
                    "subMenu": null,
                    "params": {
                        "showAds": true,
                        "variableCategoryName": null,
                        "updatedMeasurementHistory": null,
                        "refresh": null,
                        "title": "History",
                        "ionIcon": "ion-ios-list-outline",
                    },
                    "title": "Activity History",
                    "id": "history-all-category-physical-activity",
                    "showSubMenu": true,
                    "$$hashKey": "object:3482",
                    "cache": true,
                    "views": {
                        "menuContent": {
                            "templateUrl": "templates/history-all.html",
                            "controller": "historyAllMeasurementsCtrl",
                        },
                    },
                    "name": "app.historyAllCategory",
                }
                before.stateName = qm.staticData.stateNames.charts
                let updated = qm.menu.onStateChange(JSON.parse(JSON.stringify(before)))
                qm.assert.contains("charts", updated.href)
                qm.assert.contains("charts", updated.id)
                qm.assert.equals("Charts", updated.title)
                qm.assert.doesNotContain(":variableCategory", updated.href)
                updated.params.variableName = "Overall Mood"
                updated = qm.menu.onStateChange(JSON.parse(JSON.stringify(before)))
                qm.assert.contains("Overall", updated.href)
                qm.assert.equals("charts-overall-mood", updated.id)
                qm.assert.equals("Overall Mood Charts", updated.title)
                qm.assert.doesNotContain(":variableName", updated.href)
                qm.assert.doesNotHaveProperty(updated.params, 'variableCategoryName')
                return updated
            },
        },
        chrome: {
            testPopupWindow(){
                qm.chrome.createPopup(qm.chrome.windowParams.introWindowParams)
            },
        },
        urlHelper: {
            testGetQueryParamsFromQueryBeforeHash(){
                let url = 'https://dev-web.quantimo.do/?clientId=preve-wellness-tracker#/app/onboarding'
                let params = qm.urlHelper.getQueryParams(url)
                qm.assert.equals('preve-wellness-tracker', params.clientId)
            },
        },
        study: {
            testGetVariableAfterGettingStudy(callback){
                qm.studyHelper.getStudyFromApi({causeVariableName: "Eggs (serving)", effectVariableName: "Overall Mood", userId: 230}, function(study){
                    qm.qmLog.info("Got study " + study.causeVariableName)
                    qm.variablesHelper.getFromLocalStorageOrApi({variableName: "Eggs (serving)"}, function(variables){
                        if(variables.length > 1){
                            throw "Why did we get " + variables.length + " variables for Eggs (serving)?!?!?"
                        }
                        let user = qm.getUser()
                        qm.qmLog.info("Got variable for user " + variables[0].userId)
                        qm.assert.equals(user.id, variables[0].userId, "We should have saved the user variable from the study!")
                        if(callback){ callback() }
                    }, function(error){
                        throw error
                    })
                }, function(error){
                    throw error
                })
            },
        },
    },
    timeHelper: {
        getUnixTimestampInMilliseconds(dateTimeString){
            if(!dateTimeString){
                return new Date().getTime()
            }
            return new Date(dateTimeString).getTime()
        },
        universalConversionToUnixTimeSeconds(unixTimeOrString){
            if(isNaN(unixTimeOrString)){
                unixTimeOrString = qm.timeHelper.getUnixTimestampInSeconds(unixTimeOrString)
            }
            if(unixTimeOrString > qm.timeHelper.getUnixTimestampInSeconds() + 365 * 86400 * 10){
                unixTimeOrString = unixTimeOrString / 1000
            }
            return unixTimeOrString
        },
        getUnixTimestampInSeconds(dateTimeString){
            if(!dateTimeString){
                dateTimeString = new Date().getTime()
            }
            return Math.round(qm.timeHelper.getUnixTimestampInMilliseconds(dateTimeString) / 1000)
        },
        getTimeSinceString(unixTimeOrString){
            if(!unixTimeOrString){
                return "never"
            }
            let unixTimestamp = qm.timeHelper.universalConversionToUnixTimeSeconds(unixTimeOrString)
            let secondsAgo = qm.timeHelper.secondsAgo(unixTimestamp)
            if(secondsAgo > 2 * 24 * 60 * 60){
                return Math.round(secondsAgo / (24 * 60 * 60)) + " days ago"
            }
            if(secondsAgo > 2 * 60 * 60){
                return Math.round(secondsAgo / (60 * 60)) + " hours ago"
            }
            if(secondsAgo > 2 * 60){
                return Math.round(secondsAgo / (60)) + " minutes ago"
            }
            return secondsAgo + " seconds ago"
        },
        secondsAgo(unixTimeOrString){
            let unixTimestamp = qm.timeHelper.universalConversionToUnixTimeSeconds(unixTimeOrString)
            return Math.round((qm.timeHelper.getUnixTimestampInSeconds() - unixTimestamp))
        },
        minutesAgo(unixTimeOrString){
            let unixTimestamp = qm.timeHelper.universalConversionToUnixTimeSeconds(unixTimeOrString)
            return Math.round((qm.timeHelper.secondsAgo(unixTimestamp) / 60))
        },
        hoursAgo(unixTimeOrString){
            let unixTimestamp = qm.timeHelper.universalConversionToUnixTimeSeconds(unixTimeOrString)
            return Math.round((qm.timeHelper.secondsAgo(unixTimestamp) / 3600))
        },
        daysAgo(unixTimeOrString){
            let unixTimestamp = qm.timeHelper.universalConversionToUnixTimeSeconds(unixTimeOrString)
            return Math.round((qm.timeHelper.secondsAgo(unixTimestamp) / 86400))
        },
        getCurrentLocalDateAndTime(){
            return new Date().toLocaleString()
        },
        convertUnixTimeStampToISOString(UNIX_timestamp){
            let a = new Date(UNIX_timestamp * 1000)
            let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            let year = a.getFullYear()
            let month = months[a.getMonth()]
            let date = a.getDate()
            let hour = a.getHours()
            let min = a.getMinutes()
            let sec = a.getSeconds()
            return date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec
        },
        addTimeZoneOffsetProperty(obj){
            if(!obj){
                qm.qmLog.error("Nothing provided to addTimeZoneOffsetProperty")
                return obj
            }
            let a = new Date()
            obj.timeZoneOffset = a.getTimezoneOffset()
            return obj
        },
    },
    trackingReminderNotifications: [],
    ui: {
        preventDragAfterAlert(ev){
            if(!ev){
                qm.qmLog.debug("No event provided to preventDragAfterAlert")
                return
            }
            ev.preventDefault()
            ev.stopPropagation()
            ev.gesture.stopPropagation()
            ev.gesture.preventDefault()
            ev.gesture.stopDetect()
        },
    },
    unitHelper: {
        getNonAdvancedUnits(){
            let nonAdvancedUnitObjects = []
            let allUnits = qm.staticData.units
            for(let i = 0; i < allUnits.length; i++){
                if(!allUnits[i].advanced){
                    nonAdvancedUnitObjects.push(allUnits[i])
                }
            }
            let showMoreUnitsObject = {name: "Show more units", abbreviatedName: "Show more units"}
            nonAdvancedUnitObjects.push(showMoreUnitsObject)
            return nonAdvancedUnitObjects
        },
        inNonAdvancedUnitAbbreviatedNames(unitAbbreviatedName){
            let nonAdvancedUnitAbbreviatedNames = []
            let allUnits = qm.staticData.units
            for(let i = 0; i < allUnits.length; i++){
                if(!allUnits[i].advanced){
                    nonAdvancedUnitAbbreviatedNames.push(allUnits[i].abbreviatedName)
                }
            }
            return nonAdvancedUnitAbbreviatedNames.indexOf(unitAbbreviatedName) > -1
        },
        getManualTrackingUnits(){
            let manualTrackingUnitObjects = []
            let allUnits = qm.staticData.units
            for(let i = 0; i < allUnits.length; i++){
                if(allUnits[i].manualTracking){
                    manualTrackingUnitObjects.push(allUnits[i])
                }
            }
            let showMoreUnitsObject = {name: "Show more units", abbreviatedName: "Show more units"}
            manualTrackingUnitObjects.push(showMoreUnitsObject)
            return manualTrackingUnitObjects
        },
        inManualTrackingUnitUnitAbbreviatedNames(unitAbbreviatedName){
            let manualTrackingUnitUnitAbbreviatedNames = []
            let allUnits = qm.staticData.units
            for(let i = 0; i < allUnits.length; i++){
                if(allUnits[i].manualTracking){
                    manualTrackingUnitUnitAbbreviatedNames.push(allUnits[i].abbreviatedName)
                }
            }
            return manualTrackingUnitUnitAbbreviatedNames.indexOf(unitAbbreviatedName) > -1
        },
        getAllUnits(){
            let units = qm.staticData.units
            if(!units){
                units = qm.staticData.units
            }
            return units
        },
        getProgressivelyMoreUnits(currentlyDisplayedUnits){
            if(!currentlyDisplayedUnits){
                return qm.unitHelper.getNonAdvancedUnits()
            }
            if(currentlyDisplayedUnits === qm.unitHelper.getNonAdvancedUnits()){
                return qm.unitHelper.getManualTrackingUnits()
            }
            return qm.unitHelper.getAllUnits()
        },
        getByNameAbbreviatedNameOrId(unitAbbreviatedNameOrId){
            let allUnits = qm.staticData.units
            for(let i = 0; i < allUnits.length; i++){
                if(allUnits[i].abbreviatedName === unitAbbreviatedNameOrId){
                    return allUnits[i]
                }
                if(allUnits[i].name === unitAbbreviatedNameOrId){
                    return allUnits[i]
                }
                if(allUnits[i].id === unitAbbreviatedNameOrId){
                    return allUnits[i]
                }
            }
            return null
        },
        getUnitArrayContaining(currentUnitAbbreviatedName){
            if(!currentUnitAbbreviatedName || currentUnitAbbreviatedName === ""){
                return qm.unitHelper.getNonAdvancedUnits()
            }
            if(qm.unitHelper.inNonAdvancedUnitAbbreviatedNames(currentUnitAbbreviatedName)){
                return qm.unitHelper.getNonAdvancedUnits()
            }
            if(qm.unitHelper.inManualTrackingUnitUnitAbbreviatedNames(currentUnitAbbreviatedName)){
                return qm.unitHelper.getManualTrackingUnits()
            }
            return qm.unitHelper.getAllUnits()
        },
        updateAllUnitPropertiesOnObject(unitNameAbbreviatedNameOrId, object){
            let unit = qm.unitHelper.getByNameAbbreviatedNameOrId(unitNameAbbreviatedNameOrId)
            qm.qmLog.info('Changing unit to ' + unit.name)
            for(let objectProperty in object){
                if(object.hasOwnProperty(objectProperty)){
                    if(objectProperty.toLowerCase().indexOf('unit') === -1){
                        continue
                    }
                    let lowerCaseObjectProperty = objectProperty.toLowerCase().replace('defaultUnit', '').replace('userUnit', '').replace('unit', '')
                    for(let unitProperty in unit){
                        if(unit.hasOwnProperty(unitProperty)){
                            let lowerCaseUnitProperty = unitProperty.toLowerCase()
                            if(lowerCaseObjectProperty === lowerCaseUnitProperty){
                                qm.qmLog.info("Setting " + objectProperty + " to " + unit[unitProperty])
                                object[objectProperty] = unit[unitProperty]
                            }
                        }
                    }
                }
            }
            return object
        },
    },
    urlHelper: {
        appendPathToUrl(baseUrl, pathToAppend){
            let params = {}
            if(baseUrl.indexOf('?') !== -1){
                params = qm.objectHelper.copyPropertiesFromOneObjectToAnother(qm.urlHelper.getQueryParams(baseUrl), params, false)
                baseUrl = qm.stringHelper.getStringBeforeSubstring('?', baseUrl)
            }
            if(pathToAppend.indexOf('?') !== -1){
                params = qm.objectHelper.copyPropertiesFromOneObjectToAnother(qm.urlHelper.getQueryParams(pathToAppend), params, false)
                pathToAppend = qm.stringHelper.getStringBeforeSubstring('?', pathToAppend)
            }
            if(qm.stringHelper.getLastCharacter(baseUrl) === '/'){
                baseUrl = qm.stringHelper.removeLastCharacter(baseUrl)
            }
            if(qm.stringHelper.getFirstCharacter(pathToAppend) === '/'){
                pathToAppend = qm.stringHelper.removeFirstCharacter(pathToAppend)
            }
            let fullUrl = baseUrl + '/' + pathToAppend
            fullUrl = qm.urlHelper.addUrlQueryParamsToUrlString(params, fullUrl)
            qm.urlHelper.validateUrl(fullUrl)
            return fullUrl
        },
        validateUrl(url){
            if(url.indexOf('index.html') !== -1 &&
                url.indexOf('2Findex.html') === -1 &&
                url.indexOf('/index.html') === -1){
                console.trace()
                e = new Error()
                qm.qmLog.errorAndExceptionTestingOrDevelopment("url should not be " + url, e.stack)
            }
        },
        addUrlQueryParamsToUrlString(params, url){
            qm.urlHelper.validateUrl(url)
            if(!url){
                url = qm.urlHelper.getCurrentUrl()
                qm.urlHelper.validateUrl(url)
            }
            let previousParams = qm.urlHelper.getQueryParams(url) // Avoid duplicates
            params = qm.objectHelper.copyPropertiesFromOneObjectToAnother(params, previousParams, false)
            for(let key in params){
                if(params.hasOwnProperty(key)){
                    if(url.indexOf(key + '=') === -1){
                        let value = params[key]
                        if(value === false){ value = "0" } // False is converted to empty string in PHP for some reason
                        if(value === null){
                            console.error("Not adding null param " + key) // Don't use qm.qmLog here because it's called by the logger -> infinite loop
                            continue
                        }
                        if(url.indexOf('?') === -1){
                            url = url + "?" + key + "=" + encodeURIComponent(value)
                        }else{
                            url = url + "&" + key + "=" + encodeURIComponent(value)
                        }
                    }
                }
            }
            qm.urlHelper.validateUrl(url)
            return url
        },
        addUrlParamsToObject(state){
            let params = qm.urlHelper.getQueryParams()
            state = qm.objectHelper.copyPropertiesFromOneObjectToAnother(params, state, false)
            return state
        },
        addUrlParamsToCurrentUrl: function insertParam(key, value){
            qm.qmLog.error("This adds params before hash") // TODO: Fix me
            key = encodeURI(key)
            value = encodeURI(value)
            let kvp = document.location.search.substr(1).split('&')
            let i = kvp.length
            let x
            while(i--){
                x = kvp[i].split('=')
                if(x[0] == key){
                    x[1] = value
                    kvp[i] = x.join('=')
                    break
                }
            }
            if(i < 0){
                kvp[kvp.length] = [key, value].join('=')
            }
            //this will reload the page, it's likely better to store this until finished
            document.location.search = kvp.join('&')
            //var url = qm.urlHelper.addUrlQueryParamsToUrlString(params);  // Not working
            //window.history.pushState({ path: url }, '', url);
        },
        getParam(parameterName, url, shouldDecode){
            if(!url){
                url = qm.urlHelper.getCurrentUrl()
            }
            if(!url){
                return null
            }
            url = qm.urlHelper.putQueryAfterHash(url)
            if(parameterName.toLowerCase().indexOf('name') !== -1){
                shouldDecode = true
            }
            if(url.split('?').length > 1){
                let queryString = qm.urlHelper.getQueryStringFromUrl(url)
                let parameterKeyValuePairs = queryString.split('&')
                for(let i = 0; i < parameterKeyValuePairs.length; i++){
                    let currentParameterKeyValuePair = parameterKeyValuePairs[i].split('=')
                    if(currentParameterKeyValuePair[0].toCamelCase().toLowerCase() === parameterName.toCamelCase().toLowerCase()){
                        currentParameterKeyValuePair[1] = qm.stringHelper.parseBoolean(currentParameterKeyValuePair[1])
                        if(typeof currentParameterKeyValuePair[1].indexOf !== "undefined" && currentParameterKeyValuePair[1].indexOf("https:%2F%2F") === 0){
                            shouldDecode = true
                        }
                        if(typeof shouldDecode !== "undefined"){
                            let decoded = decodeURIComponent(currentParameterKeyValuePair[1])
                            if(decoded && decoded.indexOf('%2') !== -1){
                                decoded = decodeURIComponent(decoded) // Must have been double encoded
                            }
                            try {
                                return decodeURIComponent(decoded)
                            } catch (error) {
                                qm.qmLog.info(error.message + " so just returning " + decoded)
                                return decoded // Must have already been decoded (happens when % symbol is in variable name)
                            }
                        }else{
                            return currentParameterKeyValuePair[1]
                        }
                    }
                }
            }
            return null
        },
        getQueryParams(url){
            if(!url){
                url = qm.urlHelper.getCurrentUrl()
            }
            let keyValuePairsObject = {}
            let array = []
            if(url.split('?').length > 1){
                let queryString = qm.urlHelper.getQueryStringFromUrl(url)
                let parameterKeyValueSubstrings = queryString.split('&')
                for(let i = 0; i < parameterKeyValueSubstrings.length; i++){
                    array = parameterKeyValueSubstrings[i].split('=')
                    keyValuePairsObject[array[0]] = array[1]
                }
            }
            return keyValuePairsObject
        },
        getQueryStringFromUrl(url){
            let queryString = url.split('?')[1]
            if(queryString.indexOf('#') !== -1){
                queryString = queryString.split('#')[0]
            }
            return queryString
        },
        openUrlInNewTab(url, showLocation){
            if(!qm.platform.getWindow()){
                return false
            }
            qm.qmLog.info("openUrlInNewTab: " + url)
            showLocation = showLocation || 'yes'
            //window.open(url, '_blank', 'location='+showLocation);
            window.open(url, '_blank')
        },
        openUrl(url){
            qm.urlHelper.goToUrl(url)
        },
        getIonicUrlForPath(path){
            return qm.urlHelper.getIonicAppBaseUrl() + "index.html#/app/" + path
        },
        getIonicAppBaseUrl(){
            if(!qm.platform.getWindow()){
                return false
            }
            let url = window.location.origin + window.location.pathname
            url = qm.stringHelper.getStringBeforeSubstring('#', url)
            url = qm.stringHelper.getStringBeforeSubstring('configuration-index.html', url)
            url = qm.stringHelper.getStringBeforeSubstring('index.html', url)
            url = qm.stringHelper.getStringBeforeSubstring('android_popup.html', url)
            url = qm.stringHelper.getStringBeforeSubstring('chrome_default_popup_iframe.html', url)
            url = qm.stringHelper.getStringBeforeSubstring('firebase-messaging-sw.js', url)
            url = qm.stringHelper.getStringBeforeSubstring('_generated_background_page.html', url)
            return url
        },
        getAbsoluteUrlFromRelativePath(relativePath){
            if(relativePath.indexOf('/') === 0){
                relativePath = relativePath.replace('/', '')
            }
            return qm.urlHelper.getIonicAppBaseUrl() + relativePath
        },
        getPrivateConfigJsonUrl(){
            return qm.urlHelper.getAbsoluteUrlFromRelativePath('default.private_config.json')
        },
        onQMSubDomain(){
            if(qm.urlHelper.indexOfCurrentUrl('https://') !== 0){
                return false
            }
            return qm.urlHelper.indexOfCurrentUrl('.quantimo.do') !== -1
        },
        redirectToHttpsIfNecessary(){
            if(!qm.platform.getWindow()){
                return false
            }
            if(qm.urlHelper.indexOfCurrentUrl("http://") === 0 && qm.urlHelper.indexOfCurrentUrl("http://localhost") === -1){
                location.href = 'https:' + qm.urlHelper.getCurrentUrl().substring(window.location.protocol.length)
            }
        },
        getParameterFromEventUrl(event, parameterName){
            qm.qmLog.authDebug('extracting ' + parameterName + ' from event: ', event)
            let url = event.url
            if(!url){
                url = event.data
            }
            if(!qm.urlHelper.isQuantiMoDoDomain(url)){
                return
            }
            let value = qm.urlHelper.getParam(parameterName, url)
            if(value){
                qm.qmLog.authDebug('got ' + parameterName + ' from ' + url + ": " + value)
            }
            return value
        },
        isQuantiMoDoDomain(urlToCheck){
            let isHttps = urlToCheck.indexOf("https://") === 0
            let matchesQuantiModo = qm.urlHelper.getRootDomain(urlToCheck) === 'quantimo.do'
            let result = isHttps && matchesQuantiModo
            if(!result){
                qm.qmLog.authDebug('Domain ' + qm.urlHelper.getRootDomain(urlToCheck) + ' from event.url ' +
                    urlToCheck + ' is NOT an https QuantiModo domain')
            }else{
                qm.qmLog.authDebug('Domain ' + qm.urlHelper.getRootDomain(urlToCheck) + ' from event.url ' +
                    urlToCheck + ' IS a QuantiModo domain')
            }
            return result
        },
        getRootDomain(url){
            let parts = url.split('.')
            let rootDomainWithPath = parts[1] + '.' + parts[2]
            let rootDomainWithPathParts = rootDomainWithPath.split('/')
            return rootDomainWithPathParts[0]
        },
        getAuthorizationCodeFromEventUrl(event){
            return qm.urlHelper.getParameterFromEventUrl(event, 'code')
        },
        checkLoadStartEventUrlForErrors(ref, event){
            let error = qm.urlHelper.getParam('error', event.url)
            if(error){
                qm.qmLog.error(error)
                ref.close()
            }
        },
        addEventListenerAndGetParameterFromRedirectedUrl(windowRef, parameterName, successHandler){
            windowRef.addEventListener('loadstart', function(event){
                let value = qm.urlHelper.getParameterFromEventUrl(event, parameterName)
                if(value){
                    windowRef.close()
                    windowRef = undefined
                    successHandler(value)
                }
                qm.urlHelper.checkLoadStartEventUrlForErrors(windowRef, event)
            })
            windowRef.addEventListener('loaderror', loadErrorCallBack)
            function loadErrorCallBack(params){
                $('#status-message').text("")
                let scriptErrorMessage = "alert('Sorry we cannot open that page. Message from the server is : " + params.message + "');"
                qm.qmLog.error(scriptErrorMessage)
                windowRef.executeScript({code: scriptErrorMessage}, executeScriptCallBack)
                windowRef.close()
                windowRef = undefined
            }
            function executeScriptCallBack(params){
                if(params[0] == null){
                    $('#status-message').text("Sorry we couldn't open that page. Message from the server is : '" + params.message + "'")
                }
            }
        },
        convertObjectToQueryString(obj){
            if(!obj){
                return ''
            }
            let str = []
            for(let p in obj){
                if(obj.hasOwnProperty(p)){
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]))
                }
            }
            return '?' + str.join("&")
        },
        getStringAfterLastSlash(string){
            let lastSlashIndex = string.lastIndexOf('/')
            return string.substring(lastSlashIndex + 1)
        },
        stripQueryString(pathWithQuery){
            if(!pathWithQuery){
                return pathWithQuery
            }
            if(pathWithQuery.indexOf('?') === -1){
                return pathWithQuery
            }
            return pathWithQuery.split("?")[0]
        },
        getBaseAppUrl(){
            if(!qm.platform.getWindow()){
                return false
            }
            return window.location.origin + window.location.pathname
        },
        goToUrl(url, reason, newTab){
            if(!qm.platform.getWindow()){
                return false
            }
            if(url.indexOf('mailto') !== -1){ newTab = true }
            qm.qmLog.info("Going to " + url + " because " + reason)
            if(newTab){
                let win = window.open(url, '_blank')
                win.focus()
            } else {
                window.location.href = url
            }
        },
        getCurrentUrl(){
            if(!qm.platform.getWindow()){
                return false
            }
            return window.location.href
        },
        indexOfCurrentUrl(needle){
            let currentUrl = qm.urlHelper.getCurrentUrl()
            if(!currentUrl){
                return -1
            }
            return currentUrl.indexOf(needle)
        },
        getSubDomain(){
            let full = window.location.host
            let parts = full.split('.')
            return parts[0].toLowerCase()
        },
        putQueryAfterHash (url) {
            if(!url){ url = window.location.href }
            let question = url.indexOf('?')
            let hash = url.indexOf("#")
            if(hash > question){
                let query = url.substr(question, hash - question)
                url = url.replace(query, '') + query
            }
            return url
        },
    },
    user: null,
    userHelper: {
        deleteUserAccount(reason, successHandler){
            qm.api.configureClient(arguments.callee.name, null, {reason})
            let apiInstance = new qm.Quantimodo.UserApi()
            function callback(error, data, response){
                qm.api.responseHandler(error, data, response, successHandler)
            }
            apiInstance.deleteUser(reason, {clientId: qm.getClientId()}, callback)
        },
        getUserFromLocalStorage(successHandler){
            let user = qm.storage.getItem(qm.items.user)
            function checkUserId(user){
                if(user && user.ID){
                    user.id = user.ID
                    user = qm.objectHelper.snakeToCamelCaseProperties(user)
                }
                if(user && !user.id){
                    console.error("No user id in ", user) // Don't use qm.qmLog.error to avoid infinite loop
                    qm.userHelper.setUser(null)
                    return null
                }
                return user
            }
            if(!successHandler){
                if(!user){
                    qm.qmLog.debug("We do not have a user in local storage!")
                    return false
                }
                return checkUserId(user)
            }
            if(user){
                successHandler(checkUserId(user))
                return
            }
            qm.localForage.getItem(qm.items.user, function(user){
                successHandler(checkUserId(user))
            })
        },
        isTestUser(){
            let user = qm.globalHelper.getItem(qm.items.user) // Can't use qm.getUser() because of recursion
            if(!user){
                return false
            }
            if(user.email && user.email.toLowerCase().indexOf('test') !== -1){
                return true
            }
            if(user.displayName && user.displayName.toLowerCase().indexOf('test') !== -1){
                return true
            }
            return false
        },
        setDriftIdentity(user){
            if(typeof drift !== "undefined"){
                drift.identify(user.id, { // assuming your DB identifier could be something like a GUID or other unique ID.
                    email: user.email,
                    name: user.displayName,
                  })
            }
        },
        setUser(user){
            if(user && user.data && user.data.user){
                user = user.data.user
            }
            qm.storage.setItem(qm.items.user, user)
            qm.localForage.setItem(qm.items.user, user)
            if(!user){
                return
            }
            qm.qmLog.debug(user.displayName + ' is logged in.')
            if(qm.urlHelper.getParam('doNotRemember')){
                return
            }
            if(!qm.platform.isBackEnd()){
                qm.qmLog.setupUserVoice()
                qm.qmLog.setupFreshChat(user)
            }
            if(!user.accessToken){
                qm.qmLog.error("User does not have access token!", null, {userToSave: user})
            }else{
                qm.auth.saveAccessTokenResponse(user)
            }
            qm.userHelper.setDriftIdentity(user)
        },
        withinAllowedNotificationTimes(){
            let u = qm.userHelper.getUserFromLocalStorag()
            if(u){
                let now = new Date()
                let hours = now.getHours()
                let currentTime = hours + ':00:00'
                if(currentTime > u.latestReminderTime ||
                    currentTime < u.earliestReminderTime){
                    qm.qmLog.info('Not showing notification because outside allowed time range')
                    return false
                }
            }
            return true
        },
        getUserViaXhrOrFetch(userSuccessHandler, errorHandler, params){
            qm.api.getRequestUrl('api/v1/user', function(url){
                qm.api.getViaXhrOrFetch(url, function(user){
                    userSuccessHandler(user)
                }, errorHandler)
            }, params)
        },
        getUserViaSdk(userSuccessHandler, errorHandler, params){
            qm.api.configureClient(arguments.callee.name)
            let apiInstance = new qm.Quantimodo.UserApi()
            //params.includeAuthorizedClients = true;  // To big for $rootScope!
            //qm.api.executeWithRateLimit(function () {apiInstance.getUser(params, userSdkCallback);});  // Seems to have a delay before first call
            params = qm.api.addGlobalParams(params)
            apiInstance.getUser(params, function(error, user, response){
                qm.api.generalResponseHandler(error, user, response, function(){
                    if(user){
                        userSuccessHandler(user)
                    }
                }, errorHandler, params, 'getUserFromApi')
            })
        },
        getUserFromApi(successHandler, errorHandler, params){
            qm.qmLog.info("Getting user from API...")
            function userSuccessHandler(userFromApi){
                if(userFromApi && typeof userFromApi.displayName !== "undefined"){
                    qm.qmLog.info("Got user from API...")
                    qm.userHelper.setUser(userFromApi)
                    if(successHandler){
                        successHandler(userFromApi)
                    } // Already done below
                }else{
                    qm.qmLog.info("Could not get user from API...")
                    if(qm.platform.isChromeExtension()){
                        qm.chrome.openLoginWindow()
                    }
                }
            }
            if(typeof qm.Quantimodo === "undefined"){ // Can't use QM SDK in service worker because it uses XHR instead of fetch
                qm.userHelper.getUserViaXhrOrFetch(userSuccessHandler, errorHandler, params)
            }else{ // Can't use QM SDK in service worker because it uses XHR instead of fetch
                qm.userHelper.getUserViaSdk(userSuccessHandler, errorHandler, params)
            }
        },
        getUserFromLocalStorageOrApi(successHandler, errorHandler){
            qm.userHelper.getUserFromLocalStorage(function(user){
                if(user){
                    if(successHandler){
                        successHandler(user)
                    }
                    return
                }
                qm.userHelper.getUserFromApi(successHandler, errorHandler)
            })
        },
        userIsOlderThan1Day(callback){
            qm.userHelper.userIsOlderThanXSeconds(86400, function(result){
                callback(result)
            })
        },
        userIsOlderThanXSeconds(secondsCutoff, callback){
            qm.getUser(function(user){
                if(!user){
                    callback(false)
                    qm.qmLog.info("userIsOlderThanXSeconds: No user to check if older than " + secondsCutoff + " seconds")
                    return
                }
                if(!user.userRegistered){
                    callback(false)
                    qm.qmLog.info("userIsOlderThanXSeconds: No userRegistered property to check if older than " + secondsCutoff + " seconds")
                    return
                }
                let ageInSeconds = qm.timeHelper.getUnixTimestampInSeconds() - qm.timeHelper.universalConversionToUnixTimeSeconds(user.userRegistered)
                qm.qmLog.info("userIsOlderThanXSeconds: User is " + ageInSeconds + " seconds old. createdAt: " + user.userRegistered)
                callback(ageInSeconds > secondsCutoff)
            })
        },
        getUsersFromApi(userSuccessHandler, errorHandler, params){
            qm.api.configureClient(arguments.callee.name)
            let apiInstance = new qm.Quantimodo.UserApi()
            //params.includeAuthorizedClients = true;  // To big for $rootScope!
            //qm.api.executeWithRateLimit(function () {apiInstance.getUser(params, userSdkCallback);});  // Seems to have a delay before first call
            params = qm.api.addGlobalParams(params)
            apiInstance.getUsers(params, function(error, user, response){
                qm.api.generalResponseHandler(error, user, response, function(){
                    if(user){
                        userSuccessHandler(user)
                    }
                }, errorHandler, params, 'getUsersFromApi')
            })
        },
    },
    commonVariablesHelper: {
        getFromLocalStorage(requestParams, successHandler, errorHandler){
            if(!successHandler){
                qm.qmLog.error("No successHandler provided to commonVariables getFromLocalStorage")
                return
            }
            if(!requestParams){
                requestParams = {}
            }
            let commonVariables = qm.arrayHelper.filterByRequestParams(qm.staticData.commonVariables, requestParams)
            if(!requestParams.sort){
                commonVariables = qm.variablesHelper.defaultVariableSort(commonVariables)
            }
            successHandler(commonVariables)
        },
    },
    userVariables: {
        updateLatestMeasurementTime(variableName, lastValue){
            qm.storage.getUserVariableByName(variableName, true, lastValue)
        },
        getFromApi(params, successHandler, errorHandler){
            if(!params){
                params = {}
            }
            params = JSON.parse(JSON.stringify(params)) // Decouple API search params so we don't mess up original local search params
            if(!params.sort || params.sort.indexOf('numberOfUserVariables') !== -1){
                params.sort = '-latestMeasurementTime'
            }
            if(!params.limit){
                params.limit = 50
            }
            params = qm.api.addGlobalParams(params)
            let cacheKey = 'getUserVariablesFromApi'
            let cachedData = qm.api.cacheGet(params, cacheKey)
            if(cachedData && successHandler){
                successHandler(cachedData)
                return
            }
            qm.api.configureClient(cacheKey, null, params)
            let apiInstance = new qm.Quantimodo.VariablesApi()
            function callback(error, data, response){
                if(data){
                    qm.variablesHelper.saveToLocalStorage(data)
                }
                qm.api.generalResponseHandler(error, data, response, successHandler, errorHandler, params, cacheKey)
            }
            apiInstance.getVariables(params, callback)
        },
        getByNameFromApi(variableName, params, successHandler, errorHandler){
            if(!params){
                params = {}
            }
            params.name = variableName
            qm.userVariables.getFromApi(params, function(userVariables){
                qm.variablesHelper.saveToLocalStorage(userVariables)
                successHandler(userVariables[0])
            }, errorHandler)
        },
        getByName(variableName, params, refresh, successHandler, errorHandler){
            if(!params){
                params = {}
            }
            if(!variableName){
                variableName = qm.getPrimaryOutcomeVariable().name
            }
            if(refresh){
                qm.userVariables.getByNameFromApi(variableName, params, successHandler, errorHandler)
                return
            }
            qm.localForage.searchByProperty(qm.items.userVariables, 'name', variableName, function(userVariables){
                if(userVariables && userVariables.length){
                    let userVariable = userVariables[0]
                    /** @namespace userVariable.charts.lineChartWithoutSmoothing */
                    if(typeof params.includeCharts === "undefined" ||
                        (userVariable.charts && userVariable.charts.lineChartWithoutSmoothing && userVariable.charts.lineChartWithoutSmoothing.highchartConfig)){
                        successHandler(userVariable)
                        return
                    }
                }
                qm.userVariables.getByNameFromApi(variableName, params, successHandler, errorHandler)
            })
        },
        getFromLocalStorage(requestParams, successHandler, errorHandler){
            if(!qm.getUser()){
                qm.qmLog.error("No user to get user variables!")
                qm.commonVariablesHelper.getFromLocalStorage(requestParams, successHandler, errorHandler)
                return
            }
            if(!requestParams){
                requestParams = {}
            }
            qm.localForage.getElementsWithRequestParams(qm.items.userVariables, requestParams, function(userVariables){
                if(!requestParams.sort){
                    userVariables = qm.variablesHelper.defaultVariableSort(userVariables)
                }
                successHandler(userVariables)
            }, function(error){
                qm.qmLog.error(error)
                if(errorHandler){
                    errorHandler(error)
                }
            })
        },
        getFromLocalStorageOrApi(params, successHandler, errorHandler){
            params = params || {}
            qm.userVariables.getFromLocalStorage(params, function(userVariables){
                function doWeHaveEnoughVariables(variables){
                    let numberOfMatchingLocalVariablesRequiredToSkipAPIRequest = 2
                    return variables && variables.length > numberOfMatchingLocalVariablesRequiredToSkipAPIRequest //Do API search if only 1 local result because I can't get "Remeron" because I have "Remeron Powder" locally
                }
                function doWeHaveExactMatch(variables, variableSearchQuery){
                    if(!variableSearchQuery){
                        return true
                    }
                    return qm.arrayHelper.arrayHasItemWithNameProperty(variables) && variables[0].name.toLowerCase() === variableSearchQuery.toLowerCase() // No need for API request if we have exact match
                }
                function shouldWeMakeVariablesSearchAPIRequest(variables, variableSearchQuery){
                    let haveEnough = doWeHaveEnoughVariables(variables)
                    let exactMatch = doWeHaveExactMatch(variables, variableSearchQuery)
                    return !haveEnough && !exactMatch
                }
                if(userVariables && userVariables.length && !shouldWeMakeVariablesSearchAPIRequest(userVariables, params.searchPhrase)){
                    successHandler(userVariables)
                    qm.qmLog.info(userVariables.length + " user variables matching " + JSON.stringify(params) + " in local storage")
                    return
                }
                qm.qmLog.info("No user variables matching " + JSON.stringify(params) + " in local storage")
                qm.userVariables.getFromApi(params, function(userVariables){
                    qm.qmLog.info(userVariables.length + " user variables matching " + JSON.stringify(params) + " from API")
                    successHandler(userVariables)
                }, function(error){
                    qm.qmLog.error(error)
                    errorHandler(error)
                })
            })
        },
        refreshIfNumberOfRemindersGreaterThanUserVariables(successHandler, errorHandler){
            if(!qm.getUser()){
                let message = "No user so not going to refreshIfNumberOfRemindersGreaterThanUserVariables"
                qm.qmLog.debug(message)
                if(errorHandler){
                    errorHandler(message)
                }
                return
            }
            qm.reminderHelper.getNumberOfVariablesWithLocalReminders(function(numberOfVariablesWithReminders){
                if(!numberOfVariablesWithReminders){
                    if(successHandler){
                        successHandler()
                    }
                    return
                }
                qm.userVariables.getFromLocalStorage({}, function(userVariables){
                    let numberOfLocalVariables = 0
                    if(userVariables){
                        numberOfLocalVariables = userVariables.length
                    }
                    if(numberOfVariablesWithReminders && numberOfLocalVariables < numberOfVariablesWithReminders){
                        let limit = 100
                        if(numberOfVariablesWithReminders > limit){
                            limit = numberOfVariablesWithReminders + 1
                        }
                        qm.userVariables.getFromApi({limit}, successHandler, errorHandler)
                    }else{
                        if(successHandler){
                            successHandler(userVariables)
                        }
                    }
                })
            })
        },
    },
    variablesHelper: {
        getFromLocalStorageOrApi(requestParams, successHandler, errorHandler){
            requestParams = requestParams || {}
            let search = requestParams.searchPhrase
            let min = requestParams.minimumNumberOfResultsRequiredToAvoidAPIRequest
            if(!search || search === ""){ min = 20 }
            if(search && search.length > 8){ min = 4 }
            if(search && search.length > 12){ min = 2 }
            if(search && search.length > 16){ min = 1 } // Must be 16 search.length or we don't make API request to get Green Olives
            if(requestParams.id || requestParams.name){ min = 1 }
            function sortUpdateSubtitlesAndReturnVariables(variables){
                if(!requestParams.sort){
                    variables = qm.variablesHelper.defaultVariableSort(variables)
                }
                variables = qm.variablesHelper.updateSubtitles(variables, requestParams)
                if(successHandler){
                    successHandler(variables)
                }
            }
            function getFromApi(localVariables, reason){
                if(reason && typeof reason !== "string"){ throw "Reason should be a string!" }
                requestParams.reason = reason
                qm.userVariables.getFromApi(requestParams, function(variablesFromApi){
                    if(localVariables && variablesFromApi.length < localVariables.length){
                        qm.qmLog.errorAndExceptionTestingOrDevelopment("More local variables than variables from API!",
                        {
                            local: localVariables.length,
                            api: variablesFromApi.length,
                            params: requestParams,
                        })
                    }
                    sortUpdateSubtitlesAndReturnVariables(variablesFromApi)
                }, function(error){
                    qm.qmLog.error(error)
                    if(errorHandler){
                        if(typeof errorHandler !== "function"){
                            qm.qmLog.error("errorHandler is not a function! It is: ", errorHandler)
                        }
                        errorHandler(error)
                    }
                })
            }
            if(requestParams.excludeLocal){
                getFromApi(null, "excludeLocal is " + requestParams.excludeLocal +
                    " (excludeLocal is necessary for complex filtering like tag searches)")
                return
            }
            if(requestParams.includePublic){
                qm.variablesHelper.getUserAndCommonVariablesFromLocalStorage(requestParams, function(localVariables){
                    let localCount = localVariables.length
                    if(localVariables && localCount >= min){
                        sortUpdateSubtitlesAndReturnVariables(localVariables)
                        return
                    }
                    getFromApi(localVariables, "only " + localCount +
                        " local user or common variables and minimumNumberOfResultsRequiredToAvoidAPIRequest is " + min)
                }, function(error){
                    getFromApi(null, "error getting local user and common variables: " + error)
                })
            }else{
                qm.userVariables.getFromLocalStorageOrApi(requestParams, function(userVariables){
                    sortUpdateSubtitlesAndReturnVariables(userVariables)
                }, errorHandler)
            }
        },
        putManualTrackingFirst(variables){ // Don't think we need to do this anymore since we sort by number of reminders maybe?
            if(!variables){
                qm.qmLog.error("no variables provided to putManualTrackingFirst")
                return
            }
            let manualTracking = variables.filter(function(variableToCheck){
                return variableToCheck.manualTracking === true
            })
            let nonManual = variables.filter(function(variableToCheck){
                return variableToCheck.manualTracking !== true
            })
            return manualTracking.concat(nonManual)
        },
        defaultVariableSort(variables){
            if(!variables){
                qm.qmLog.info("no variables provided to defaultVariableSort")
                return null
            }
            variables = qm.variablesHelper.putManualTrackingFirst(variables)
            function getValue(object){
                if(object.lastSelectedAt){
                    return object.lastSelectedAt
                }
                if(object.userId){
                    return object.latestMeasurementTime || object.numberOfTrackingReminders || object.numberOfUserVariables
                }
                return object.numberOfUserVariables
            }
            variables.sort(function(a, b){
                let aValue = getValue(a)
                let bValue = getValue(b)
                if(aValue < bValue) return 1
                if(aValue > bValue) return -1
                return 0
            })
            return variables
        },
        getUserAndCommonVariablesFromLocalStorage(requestParams, successHandler, errorHandler){
            requestParams = requestParams || {}
            qm.userVariables.getFromLocalStorage(requestParams, function(userVariables){
                userVariables = userVariables || []
                qm.commonVariablesHelper.getFromLocalStorage(requestParams, function(commonVariables){
                    commonVariables = commonVariables || []
                    let both = userVariables.concat(commonVariables)
                    both = qm.arrayHelper.getUnique(both, 'id')
                    successHandler(both)
                }, function(error){
                    qm.qmLog.info(error)
                    successHandler(userVariables)
                })
            }, errorHandler)
        },
        updateSubtitles(variables, requestParams){
            if(requestParams && requestParams.sort){
                let sort = requestParams.sort
                sort = sort.replace("-", "")
                for(let i = 0; i < variables.length; i++){
                    if(sort.toLowerCase().indexOf("correlation")){
                        if(variables[i][sort]){
                            let number = variables[i][sort]
                            variables[i].subtitle = number + " studies"
                        }
                    }
                }
            }
            return variables
        },
        setLastSelectedAtAndSave(variable){
            if(!variable){
                qm.qmLog.errorAndExceptionTestingOrDevelopment("No variable provided to setLastSelectedAtAndSave")
                return
            }
            let timestamp = qm.timeHelper.getUnixTimestampInSeconds()
            variable.lastSelectedAt = timestamp // Do this so it's at the top of the list
            qm.variablesHelper.saveToLocalStorage(variable)
            if(!variable.userId){
                let gottenVariable = qm.staticData.commonVariables[0]
                qm.assert.equals(timestamp, gottenVariable.lastSelectedAt)
            }
        },
        saveToLocalStorage(variables){
            if(!variables){
                qm.qmLog.error("No variables provided to variablesHelper.saveToLocalStorage")
                return
            }
            variables = qm.arrayHelper.convertToArrayIfNecessary(variables)
            let userVariables = []
            let commonVariables = []
            for(let i = 0; i < variables.length; i++){
                let variable = variables[i]
                if(!variable){
                    throw "empty array provided to saveToLocalStorage"
                }
                if(variable.userId && variable.userId === qm.getUser().id){
                    userVariables.push(variable)
                }else if(!variable.userId){ // Don't save other peoples user variables when looking at studies
                    commonVariables.push(variable)
                }
            }
            if(userVariables.length){
                qm.localForage.saveWithUniqueId(qm.items.userVariables, userVariables)
            }
            if(commonVariables.length){
                qm.staticData.commonVariables = qm.arrayHelper.mergeWithUniqueId(commonVariables, qm.staticData.commonVariables)
            }
        },
    },
    variableCategoryHelper: {
        getVariableCategoriesFromApi(successHandler, errorHandler){
            qm.qmLog.info("Getting variable categories from API...")
            function globalSuccessHandler(variableCategories){
                qm.localForage.setItem(qm.items.variableCategories, variableCategories)
                if(successHandler){
                    successHandler(variableCategories)
                }
            }
            qm.api.configureClient(arguments.callee.name)
            let apiInstance = new qm.Quantimodo.VariablesApi()
            function callback(error, data, response){
                qm.api.generalResponseHandler(error, data, response, globalSuccessHandler, errorHandler, {}, 'getVariableCategoriesFromApi')
            }
            apiInstance.getVariableCategories(callback)
        },
        getVariableCategoriesFromGlobalsOrApi(successHandler, errorHandler){
            let categories = qm.variableCategoryHelper.getVariableCategoriesFromGlobals()
            if(!categories && qm.staticData && qm.staticData.variableCategories){
                categories = qm.staticData.variableCategories
            }
            if(categories){
                if(successHandler){
                    successHandler(categories)
                }
                return categories
            }
            qm.variableCategoryHelper.getVariableCategoriesFromApi(function(variableCategories){
                successHandler(variableCategories)
            }, errorHandler)
        },
        getVariableCategoriesFromGlobals(){
            if(qm.staticData.variableCategories){
                return qm.staticData.variableCategories
            }
            return qm.globalHelper.getItem(qm.items.variableCategories)
        },
        getVariableCategory(variableCategoryName, successHandler){
            if(!successHandler){
                let variableCategories = qm.variableCategoryHelper.getVariableCategoriesFromGlobals()
                if(variableCategories){
                    return variableCategories.find(function(variableCategory){
                        if(variableCategory.name.toLowerCase() === variableCategoryName.toLowerCase()){
                            return true
                        }
                        if(variableCategory.synonyms && variableCategory.synonyms.indexOf(variableCategoryName) !== -1){
                            return true
                        }
                        return variableCategory.variableCategoryNameSingular && variableCategory.variableCategoryNameSingular.toLowerCase() === variableCategoryName.toLowerCase()
                    })
                }
            }
            qm.variableCategoryHelper.getVariableCategoriesFromGlobalsOrApi(function(variableCategories){
                let match = variableCategories.find(function(category){
                    category.name = variableCategoryName
                })
                successHandler(match)
            })
        },
    },
    visualizer: {
        visualizerEnabled: true,
        showing: false,
        hideVisualizer(){
            //qm.appContainer.setOpacity(1);
            qm.qmLog.info("Hiding visualizer")
            let visualizer = qm.visualizer.getRainbowVisualizerCanvas()
            if(visualizer){
                visualizer.style.display = "none"
            }else{
                qm.qmLog.info("qm.visualizer Element not found")
            }
        },
        showVisualizer(type){
            if(!qm.visualizer.visualizerEnabled){
                return
            }
            type = type || "siri"
            qm.qmLog.info("Showing visualizer type: " + type)
            if(type === "rainbow"){
                let visualizer = qm.visualizer.getRainbowVisualizerCanvas()
                visualizer.style.display = "block"
            }
            setTimeout(function(){
                if(type === 'rainbow'){
                    qm.visualizer.rainbowCircleVisualizer()
                }else{
                    qm.visualizer.siriVisualizer()
                }
            }, 1)
        },
        setVisualizationEnabled(value){
            if(value === true){
                qm.visualizer.showVisualizer()
            }
            if(value === false){
                qm.visualizer.hideVisualizer()
            }
        },
        getRainbowVisualizerCanvas(){
            let element = document.querySelector('#rainbow-canvas')
            return element
        },
        toggle(){
            if(qm.visualizer.showVisualizering){
                qm.visualizer.hideVisualizer()
            }else{
                qm.visualizer.showVisualizer()
            }
        },
        rainbowCircleVisualizer(){
            qm.qmLog.info("Showing rainbowCircleVisualizer...")
            let visualizer = qm.visualizer.getRainbowVisualizerCanvas()
            if(visualizer){
                visualizer.style.display = "block"
            }
            /* SOUND */
            // Audio vars
            let audioCtx = new AudioContext()
                let analyser
                let bufferLength
                let step
                let frequencyData
                let waveData
            // Get microphone input
            if(navigator.webkitGetUserMedia){
                navigator.webkitGetUserMedia(
                    {audio: true},
                    doAudioStuff,
                    function(error){
                        qm.qmLog.error('Audio error: ' + error.name + " " + error.message)
                        if(canvas){
                            canvas.width = 0
                            canvas.height = 0
                        }
                    }
                )
            }else{
                navigator.mediaDevices.getUserMedia({audio: true})
                    .then(doAudioStuff)
                    .catch(function(error){
                        qm.qmLog.error('Audio error: ' + error.name + " " + error.message)
                    })
            }
            // Do the thing
            function doAudioStuff(mediaStream){
                if(!qm.platform.getWindow()){
                    return false
                }
                window.streamReference = mediaStream
                analyser = audioCtx.createAnalyser()
                analyser.smoothingTimeConstant = 0.97
                analyser.fftSize = 1024
                step = analyser.fftSize / 16
                bufferLength = analyser.frequencyBinCount
                frequencyData = new Uint8Array(bufferLength)
                waveData = new Uint8Array(bufferLength)
                window.source = audioCtx.createMediaStreamSource(mediaStream)
                source.connect(analyser)
                animate()
            }
            // Not used
            function averageVolume(data){
                let value = 0
                    let l = data.length
                for(let i = 0; i < l; i++){
                    value += data[i]
                }
                return value / l
            }
            /* VISION */
            var canvas = document.getElementById('rainbow-canvas')
                let ctx = canvas.getContext('2d')
                let w; let h; let w2; let h2; let h3; let h4 // Canvas sizes
            //if(zIndex !== null){canvas.style.zIndex = zIndex;}
            function setCanvasSizes(){
                if(!qm.platform.getWindow()){
                    return false
                }
                w = canvas.width = window.innerWidth,
                    h = canvas.height = window.innerHeight,
                    w2 = w / 2,
                    h2 = h / 2,
                    h3 = h / 3,
                    h4 = h / 4
            }
            setCanvasSizes()
            function byteToNum(byte, min, max){
                let hue = (byte / 128) * (max - min) + min
                return Math.round(hue)
            }
            /* SOUND & VISION */
            // Animate frames
            function animate(){
                analyser.getByteFrequencyData(frequencyData)
                analyser.getByteTimeDomainData(waveData)
                ctx.strokeStyle = 'hsl(' + byteToNum(frequencyData[0], 1000, 3600) + ', 90%, 60%)'
                ctx.fillStyle = 'hsla(250,10%,10%,0.09)'
                ctx.fillRect(0, 0, w, h)
                /* Lines */
                ctx.beginPath()
                for(var i = 0; i < bufferLength; i++){
                    ctx.lineTo(Math.sin(frequencyData[i * step] / 20) * h3 + w2,
                        Math.cos(frequencyData[i * step] / 20) * h3 + h2)
                }
                ctx.closePath()
                ctx.stroke()
                /* Circles */
                for(i = 0; i < bufferLength; i++){
                    ctx.beginPath()
                    ctx.arc(w2, h2, byteToNum(waveData[i * step] + frequencyData[i * step], h4, h3), 0, Math.PI * 2)
                    ctx.closePath()
                    ctx.stroke()
                }
                requestAnimationFrame(animate)
            }
            if(!qm.platform.getWindow()){
                return false
            }
            window.addEventListener('resize', function(){
                setCanvasSizes()
            })
        },
        siriVisualizer(){
            // the canvas size
            let WIDTH = 1000
            let HEIGHT = 400
            let canvas = $('#siri-canvas')[0]
            if(!canvas){
                qm.qmLog.info("No siri canvas!")
                return false
            }
            let ctx = canvas.getContext("2d")
            // options to tweak the look
            let opts = {
                smoothing: 0.6,
                fft: 5,
                minDecibels: -70,
                scale: 0.2,
                glow: 10,
                color1: [203, 36, 128],
                color2: [41, 200, 192],
                color3: [24, 137, 218],
                fillOpacity: 0.6,
                lineWidth: 1,
                blend: "screen",
                shift: 50,
                width: 60,
                amp: 1,
            }
            if(typeof dat !== "undefined"){
                let gui = new dat.GUI() // Interactive dat.GUI controls
                gui.close() // hide them by default
                // connect gui to opts
                gui.addColor(opts, "color1")
                gui.addColor(opts, "color2")
                gui.addColor(opts, "color3")
                gui.add(opts, "fillOpacity", 0, 1)
                gui.add(opts, "lineWidth", 0, 10).step(1)
                gui.add(opts, "glow", 0, 100)
                gui.add(opts, "blend", [
                    "normal",
                    "multiply",
                    "screen",
                    "overlay",
                    "lighten",
                    "difference",
])
                gui.add(opts, "smoothing", 0, 1)
                gui.add(opts, "minDecibels", -100, 0)
                gui.add(opts, "amp", 0, 5)
                gui.add(opts, "width", 0, 60)
                gui.add(opts, "shift", 0, 200)
            }
            let context = new AudioContext()
            let analyser = context.createAnalyser()
            // Array to hold the analyzed frequencies
            let freqs = new Uint8Array(analyser.frequencyBinCount)
            navigator.getUserMedia =
                navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia
            navigator.getUserMedia({audio: true}, onStream, onStreamError)
            /**
             * Create an input source from the user media stream, connect it to
             * the analyser and start the visualization.
             */
            function onStream(mediaStream){
                if(!qm.platform.getWindow()){
                    return false
                }
                window.streamReference = mediaStream
                let input = context.createMediaStreamSource(mediaStream)
                input.connect(analyser)
                requestAnimationFrame(visualize)
            }
            /**
             * Display an error message.
             */
            function onStreamError(e){
                document.body.innerHTML = "<h1>This pen only works with https://</h1>"
                console.error(e)
            }
            /**
             * Utility function to create a number range
             */
            function range(i){
                return Array.from(Array(i).keys())
            }
            // shuffle frequencies so that neighbors are not too similar
            let shuffle = [1, 3, 0, 4, 2]
            /**
             * Pick a frequency for the given channel and value index.
             *
             * The channel goes from 0 to 2 (R/G/B)
             * The index goes from 0 to 4 (five peaks in the curve)
             *
             * We have 32 (2^opts.fft) frequencies to choose from and
             * we want to visualize most of the spectrum. This function
             * returns the bands from 0 to 28 in a nice distribution.
             */
            function freq(channel, i){
                let band = 2 * channel + shuffle[i] * 6
                return freqs[band]
            }
            /**
             * Returns the scale factor fot the given value index.
             * The index goes from 0 to 4 (curve with 5 peaks)
             */
            function scale(i){
                let x = Math.abs(2 - i) // 2,1,0,1,2
                let s = 3 - x // 1,2,3,2,1
                return s / 3 * opts.amp
            }
            /**
             *  This function draws a path that roughly looks like this:
             *       .
             * __/\_/ \_/\__
             *   \/ \ / \/
             *       '
             *   1 2 3 4 5
             *
             * The function is called three times (with channel 0/1/2) so that the same
             * basic shape is drawn in three different colors, slightly shifted and
             * each visualizing a different set of frequencies.
             */
            function path(channel){
                // Read color1, color2, color2 from the opts
                let color = opts["color" + (channel + 1)].map(Math.floor)
                // turn the [r,g,b] array into a rgba() css color
                ctx.fillStyle = "rgba(" + color + ", " + opts.fillOpacity + ")"
                // set stroke and shadow the same solid rgb() color
                ctx.strokeStyle = ctx.shadowColor = "rgb(" + color + ")"
                ctx.lineWidth = opts.lineWidth
                ctx.shadowBlur = opts.glow
                ctx.globalCompositeOperation = opts.blend
                let m = HEIGHT / 2 // the vertical middle of the canvas
                // for the curve with 5 peaks we need 15 control points
                // calculate how much space is left around it
                let offset = (WIDTH - 15 * opts.width) / 2
                // calculate the 15 x-offsets
                let x = range(15).map(function(i){
                    return offset + channel * opts.shift + i * opts.width
                })
                // pick some frequencies to calculate the y values
                // scale based on position so that the center is always bigger
                let y = range(5).map(function(i){
                    return Math.max(0, m - scale(i) * freq(channel, i))
                })
                let h = 2 * m
                ctx.beginPath()
                ctx.moveTo(0, m) // start in the middle of the left side
                ctx.lineTo(x[0], m + 1) // straight line to the start of the first peak
                ctx.bezierCurveTo(x[1], m + 1, x[2], y[0], x[3], y[0]) // curve to 1st value
                ctx.bezierCurveTo(x[4], y[0], x[4], y[1], x[5], y[1]) // 2nd value
                ctx.bezierCurveTo(x[6], y[1], x[6], y[2], x[7], y[2]) // 3rd value
                ctx.bezierCurveTo(x[8], y[2], x[8], y[3], x[9], y[3]) // 4th value
                ctx.bezierCurveTo(x[10], y[3], x[10], y[4], x[11], y[4]) // 5th value
                ctx.bezierCurveTo(x[12], y[4], x[12], m, x[13], m) // curve back down to the middle
                ctx.lineTo(1000, m + 1) // straight line to the right edge
                ctx.lineTo(x[13], m - 1) // and back to the end of the last peak
                // now the same in reverse for the lower half of out shape
                ctx.bezierCurveTo(x[12], m, x[12], h - y[4], x[11], h - y[4])
                ctx.bezierCurveTo(x[10], h - y[4], x[10], h - y[3], x[9], h - y[3])
                ctx.bezierCurveTo(x[8], h - y[3], x[8], h - y[2], x[7], h - y[2])
                ctx.bezierCurveTo(x[6], h - y[2], x[6], h - y[1], x[5], h - y[1])
                ctx.bezierCurveTo(x[4], h - y[1], x[4], h - y[0], x[3], h - y[0])
                ctx.bezierCurveTo(x[2], h - y[0], x[1], m, x[0], m)
                ctx.lineTo(0, m) // close the path by going back to the start
                ctx.fill()
                ctx.stroke()
            }
            /**
             * requestAnimationFrame handler that drives the visualization
             */
            function visualize(){
                // set analysert props in the loop react on dat.gui changes
                analyser.smoothingTimeConstant = opts.smoothing
                analyser.fftSize = Math.pow(2, opts.fft)
                analyser.minDecibels = opts.minDecibels
                analyser.maxDecibels = 0
                analyser.getByteFrequencyData(freqs)
                // set size to clear the canvas on each frame
                canvas.width = WIDTH
                canvas.height = HEIGHT
                // draw three curves (R/G/B)
                path(0)
                path(1)
                path(2)
                // schedule next paint
                requestAnimationFrame(visualize)
            }
        },
        equalizerVisualizer(){
            let paths = document.getElementsByTagName('path')
            let visualizer = document.getElementById('visualizer')
            if(!visualizer){
                return
            }
            let mask = visualizer.getElementById('mask')
            let h = document.getElementsByTagName('h1')[0]
            let path
            let report = 0
            let soundAllowed = function(stream){
                if(!qm.platform.getWindow()){
                    return false
                }
                //Audio stops listening in FF without // window.persistAudioStream = stream;
                //https://bugzilla.mozilla.org/show_bug.cgi?id=965483
                //https://support.mozilla.org/en-US/questions/984179
                window.streamReference = stream
                h.innerHTML = "Thanks"
                h.setAttribute('style', 'opacity: 0;')
                let audioContent = new AudioContext()
                let audioStream = audioContent.createMediaStreamSource(stream)
                let analyser = audioContent.createAnalyser()
                audioStream.connect(analyser)
                analyser.fftSize = 1024
                let frequencyArray = new Uint8Array(analyser.frequencyBinCount)
                visualizer.setAttribute('viewBox', '0 0 255 255')
                //Through the frequencyArray has a length longer than 255, there seems to be no
                //significant data after this point. Not worth visualizing.
                for(let i = 0; i < 255; i++){
                    path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
                    path.setAttribute('stroke-dasharray', '4,1')
                    mask.appendChild(path)
                }
                var doDraw = function(){
                    requestAnimationFrame(doDraw)
                    analyser.getByteFrequencyData(frequencyArray)
                    let adjustedLength
                    for(let i = 0; i < 255; i++){
                        adjustedLength = Math.floor(frequencyArray[i]) - (Math.floor(frequencyArray[i]) % 5)
                        paths[i].setAttribute('d', 'M ' + (i) + ',255 l 0,-' + adjustedLength)
                    }
                }
                doDraw()
            }
            let soundNotAllowed = function(error){
                h.innerHTML = "You must allow your microphone."
                console.log(error)
            }
            /*window.navigator = window.navigator || {};
            /*navigator.getUserMedia =  navigator.getUserMedia       ||
                                      navigator.webkitGetUserMedia ||
                                      navigator.mozGetUserMedia    ||
                                      null;*/
            navigator.getUserMedia({audio: true}, soundAllowed, soundNotAllowed)
        },
    },
    webNotifications: {
        initializeFirebase(){
            if(qm.firebase){
                qm.qmLog.debug("Firebase already initialized")
                return qm.firebase
            }
            let config = {
                apiKey: "AIzaSyAro7_WyPa9ymH5znQ6RQRU2CW5K46XaTg",
                authDomain: "quantimo-do.firebaseapp.com",
                databaseURL: "https://quantimo-do.firebaseio.com",
                projectId: "quantimo-do",
                storageBucket: "quantimo-do.appspot.com",
                messagingSenderId: "1052648855194",
            }
            console.debug("firebase.initializeApp(config)")
            qm.firebase = firebase.initializeApp(config)
            return qm.firebase
        },
        registerServiceWorker(force){
            if(!force){
                if(!qm.platform.getWindow()){
                    return false
                }
                if(qm.platform.browser.isFirefox() && qm.urlHelper.indexOfCurrentUrl("herokuapp") !== -1){
                    qm.qmLog.info("serviceWorker doesn't work in Firefox tests for some reason")
                    return false
                }
                if(qm.serviceWorker){
                    qm.qmLog.debug("serviceWorker already registered")
                    return false
                }
                if(!qm.platform.isWeb()){
                    qm.qmLog.debug("Not registering service worker because not on Web")
                    return false
                }
                if(qm.appMode.isBuilder()){
                    qm.qmLog.debug("Not registering service worker because appMode isBuilder")
                    return false
                }
            }
            try{
                qm.webNotifications.initializeFirebase()
            }catch (e){
                qm.qmLog.error(e.message, e, e)
                return false
            }
            // Service worker must be served from same origin with no redirect so we serve directly with nginx
            let serviceWorkerUrl = qm.urlHelper.getIonicAppBaseUrl() + 'firebase-messaging-sw.js'
            qm.qmLog.info("Loading service worker from " + serviceWorkerUrl)
            if(typeof navigator.serviceWorker === "undefined"){
                qm.qmLog.error("navigator.serviceWorker is not defined!")
                return false
            }
            try{
                navigator.serviceWorker.register(serviceWorkerUrl)
                    .then(function(registration){
                        let messaging = firebase.messaging()
                        try {
                            messaging.useServiceWorker(registration)
                        } catch (error) {
                            qm.qmLog.info(error.message)
                        }
                        qm.webNotifications.subscribeUser(messaging, force)
                    })
                qm.serviceWorker = navigator.serviceWorker
                return qm.serviceWorker
            }catch (e){
                qm.qmLog.error(e.message, e, e)
                return false
            }
        },
        getAndPostDeviceToken(messaging, force){
            messaging.getToken()
                .then(function(currentToken){
                    if(currentToken){
                        qm.qmLog.info("Firebase messaging token: " + currentToken)
                        let deviceTokenOnServer = qm.storage.getItem(qm.items.deviceTokenOnServer)
                        if(force || !deviceTokenOnServer || deviceTokenOnServer !== currentToken){
                            qm.webNotifications.postWebPushSubscriptionToServer(currentToken)
                        }
                        //updateUIForPushEnabled(currentToken);
                    }else{
                        // Show permission request.
                        qm.qmLog.error('No Instance ID token available. Request permission to generate one.')
                        // Show permission UI.
                        //updateUIForPushPermissionRequired();
                    }
                })
                .catch(function(err){
                    qm.qmLog.error('An error occurred while retrieving token. ', null, err)
                    //showToken('Error retrieving Instance ID token. ', err);
                    //qm.webNotifications.postWebPushSubscriptionToServer(false);
                })
        },
        subscribeUser(messaging, force){
            messaging.requestPermission()
                .then(function(){
                    qm.qmLog.info('Notification permission granted.')
                    // Get Instance ID token. Initially this makes a network call, once retrieved
                    // subsequent calls to getToken will return from cache.
                    qm.webNotifications.getAndPostDeviceToken(messaging, force)
                })
                .catch(function(err){
                    qm.qmLog.error('Unable to get permission to notify.', err)
                })
        },
        postWebPushSubscriptionToServer(deviceTokenString){
            if(!deviceTokenString){
                qm.qmLog.error("No deviceTokenString for postWebPushSubscriptionToServer!")
                return
            }
            if(qm.webNotifications.tokenJustPosted && qm.webNotifications.tokenJustPosted === deviceTokenString){
                qm.qmLog.info("Just posted " + deviceTokenString + " already")
                return
            }
            qm.webNotifications.tokenJustPosted = deviceTokenString
            qm.qmLog.info("Got token: " + deviceTokenString)
            qm.api.configureClient(arguments.callee.name)
            let apiInstance = new qm.Quantimodo.NotificationsApi()
            function callback(error, data, response){
                if(!error){
                    qm.storage.setItem(qm.items.deviceTokenOnServer, deviceTokenString)
                }else{
                    let errorMessage = qm.api.getErrorMessageFromResponse(error, response)
                    if(errorMessage.toLowerCase().indexOf('already exists') !== -1){
                        qm.storage.setItem(qm.items.deviceTokenOnServer, deviceTokenString)
                        return
                    }
                }
                qm.api.generalResponseHandler(error, data, response, null, null, null, 'postWebPushSubscriptionToServer')
            }
            let params = qm.api.addGlobalParams({
                'platform': qm.platform.browser.get(),
                deviceToken: deviceTokenString,
            })
            apiInstance.postDeviceToken(params, callback)
        },
    },
    windowHelper: {
        scrollToTop(){
            $("html, body").animate({scrollTop: 0}, "slow")
            return false
        },
        isSmallHeight(){
            return qm.windowHelper.getWindowHeight() < 1000
        },
        getWindowHeight(){
            if(!qm.platform.getWindow()){
                return false
            }
            let h = window.innerHeight
                || document.documentElement.clientHeight
                || document.body.clientHeight
            return h
        },
        isIframe(){
            return window !== window.top
        },
    },
    qmLog(){
        return qm.qmLog
    },
}
if(typeof qmLog !== "undefined"){
    qm.qmLog = qmLog
    qmLog.qm = qm
}
//if(typeof window !== "undefined" && typeof window.qmLog === "undefined"){window.qmLog = qm.qmLog;}  // Need to use qm.qmLog so it's available in node.js modules
if(typeof nlp !== "undefined"){
    qm.nlp = nlp
}
if(typeof Quantimodo !== "undefined"){
    qm.Quantimodo = Quantimodo
}
if(typeof window !== "undefined"){
    window.qm = qm
    qm.urlHelper.redirectToHttpsIfNecessary()
}else{
    module.exports = qm
}

// START localStorage polyfill.  For some, Chrome on Android localStorage is null so this replaces with transient global memory storage
(function () {
    function isSupported() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null
        } catch(e) {
            return false
        }
    }

    if (typeof window !== "undefined" && !isSupported()) {
        function init(undef) {
            var store = {
                setItem (id, val) {
                    return store[id] = String(val)
                },
                getItem (id) {
                    return store.hasOwnProperty(id) ? String(store[id]) : undef
                },
                removeItem (id) {
                    return delete store[id]
                },
                clear () {
                    init()
                },
            }

            window.localStorage = store
        }
        init()
    }
}())
// END localStorage POLYFILL
