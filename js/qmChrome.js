/** @namespace window.qmLog */
/** @namespace window.qm */
function multiplyScreenHeight(factor){
    if(typeof screen === "undefined"){
        return false
    }
    return parseInt(factor * screen.height)
}
function multiplyScreenWidth(factor){
    if(typeof screen === "undefined"){
        return false
    }
    return parseInt(factor * screen.height)
}
window.qm.chrome = {
    allowFocusing: false,
    debugEnabled: true,
    chromeDebug(){
        function checkAlarm(){
            chrome.alarms.getAll(function(alarms){
                console.log("all alarms", alarms)
            })
        }
        if(qm.chrome.debugEnabled){
            checkAlarm()
            chrome.windows.getLastFocused(function(window){
                console.log("last focused", window)
            })
            chrome.windows.getAll(function(windows){
                console.log("all windows", windows)
            })
            chrome.windows.getCurrent(function(window){
                console.log("current window", window)
            })
        }
    },
    checkTimePastNotificationsAndExistingPopupAndShowPopupIfNecessary(alarm){
        if(!qm.platform.isChromeExtension()){
            return
        }
        window.qmLog.debug('showNotificationOrPopupForAlarm alarm: ', null, alarm)
        if(!qm.userHelper.withinAllowedNotificationTimes()){
            return false
        }
        if(qm.notifications.getNumberInGlobalsOrLocalStorage()){
            qm.chrome.createSmallInboxNotification()
        }else{
            qm.notifications.refreshAndShowPopupIfNecessary()
        }
    },
    createSmallInboxNotification(){
        let notificationId = "inbox"
        // eslint-disable-next-line no-unused-vars
        chrome.notifications.create(notificationId, qm.chrome.windowParams.inboxNotificationParams, function(id){
        })
    },
    createSmallNotificationAndOpenInboxInBackground(){
        qm.chrome.createSmallInboxNotification()
        let windowParams = qm.chrome.windowParams.fullInboxWindowParams
        windowParams.focused = false
        qm.chrome.openOrFocusChromePopupWindow(windowParams)
    },
    createPopup(windowParams){
        function createPopup(windowParams){
            windowParams.url = qm.api.addGlobalParams(windowParams.url)
            qmLog.info("creating popup window", null, windowParams)
            chrome.windows.create(windowParams, function(chromeWindow){
                qm.storage.setItem('chromeWindowId', chromeWindow.id)
                let focused = (qm.chrome.allowFocusing) ? windowParams.focused : false
                chrome.windows.update(chromeWindow.id, {focused})
            })
        }
        if(windowParams.url.indexOf('.quantimo.do') !== -1 || windowParams.url.indexOf('popup.html') !== -1){
            qm.urlHelper.validateUrl(windowParams.url)
            createPopup(windowParams)
        }else{
            qm.client.getClientWebsiteUrl(function(fullWebsiteUrl){
                //windowParams.url = fullWebsiteUrl + windowParams.url;
                windowParams.url = qm.urlHelper.appendPathToUrl(fullWebsiteUrl, windowParams.url)
                createPopup(windowParams)
            })
        }
    },
    canShowChromePopups(){
        if(typeof chrome === "undefined" || typeof chrome.windows === "undefined" || typeof chrome.windows.create === "undefined"){
            qmLog.info("Cannot show chrome popups")
            return false
        }
        if(qm.getUser() && !qm.getUser().pushNotificationsEnabled){
            qmLog.info("User has disabled notifications")
            return false
        }
        return true
    },
    getChromeManifest(){
        if(qm.platform.isChromeExtension()){
            return chrome.runtime.getManifest()
        }
    },
    getWindowByIdAndFocusOrCreateNewPopup(chromeWindowId, windowParams){
        chrome.windows.get(chromeWindowId, function(chromeWindow){
            if(!chrome.runtime.lastError && chromeWindow){
                if(windowParams.focused){
                    window.qmLog.info('qm.chrome.openOrFocusChromePopupWindow: Window already open. Focusing...', windowParams)
                    chrome.windows.update(chromeWindowId, {focused: qm.chrome.allowFocusing})
                }else{
                    window.qmLog.info('qm.chrome.openOrFocusChromePopupWindow: Window already open. NOT focusing...', windowParams)
                }
            }else{
                window.qmLog.info('qm.chrome.openOrFocusChromePopupWindow: Window NOT already open. Creating one...', windowParams)
                qm.chrome.createPopup(windowParams)
            }
        })
    },
    createPopupIfNoWindowIdInLocalStorage(windowParams){
        window.qmLog.info('qm.chrome.openOrFocusChromePopupWindow checking if a window is already open.  new window params: ', null, windowParams)
        let chromeWindowId = parseInt(qm.storage.getItem(qm.items.chromeWindowId), null)
        if(!chromeWindowId){
            window.qmLog.info('qm.chrome.openOrFocusChromePopupWindow: No window id from localStorage. Creating one...', windowParams)
            qm.chrome.createPopup(windowParams)
            return false
        }
        window.qmLog.info('qm.chrome.openOrFocusChromePopupWindow: window id from localStorage: ' + chromeWindowId, windowParams)
        return chromeWindowId
    },
    getCurrentWindowAndFocusOrCreateNewPopup(windowParams){
        chrome.windows.getCurrent(function(window){
            console.log("current window", window)
            if(window && window.type === "popup"){
                chrome.windows.update(window.id, {focused: qm.chrome.allowFocusing})
            }else{
                qm.chrome.createPopup(windowParams)
            }
        })
    },
    getAllWindowsFocusOrCreateNewPopup(windowParams){
        qm.userHelper.getUserFromLocalStorageOrApi(function(user){
            if(!user.pushNotificationsEnabled){
                qmLog.pushDebug("Not showing chrome popup because notifications are disabled")
                return
            }
            console.log("getAllWindowsFocusOrCreateNewPopup")
            chrome.windows.getAll(function(windows){
                for(let i = 0; i < windows.length; i++){
                    let window = windows[i]
                    console.log("current window", window)
                    if(window.type === "popup"){
                        console.log("Focusing existing popup", window)
                        chrome.windows.update(window.id, {focused: qm.chrome.allowFocusing})
                        return
                    }
                }
                qm.chrome.createPopup(windowParams)
            })
        })
    },
    handleNotificationClick(notificationId){
        window.qmLog.debug('onClicked: notificationId:' + notificationId)
        let focusWindow = true
        if(!qm.platform.isChromeExtension()){
            return
        }
        if(!notificationId){
            notificationId = null
        }
        qm.chrome.updateChromeBadge(0)
        qmLog.info("notificationId: " + notificationId)
        /**
         * @return {boolean}
         */
        function IsJsonString(str){
            try{
                JSON.parse(str)
            }catch (exception){
                return false
            }
            return true
        }
        if(notificationId === "moodReportNotification"){
            qm.chrome.openOrFocusChromePopupWindow(qm.chrome.windowParams.facesWindowParams)
        }else if(notificationId === "signin"){
            qm.chrome.openLoginWindow()
        }else if(notificationId && IsJsonString(notificationId)){
            qm.chrome.openMeasurementAddWindow(focusWindow, notificationId)
        }else{
            qm.chrome.openFullInbox(focusWindow, notificationId)
        }
        if(notificationId){
            chrome.notifications.clear(notificationId)
        }
    },
    initialize(){
        console.info("Initializing a chrome extension...")
        qm.qmLog.logLevel = "debug"
        //return;
        chrome.notifications.onClicked.addListener(function(notificationId){ // Called when the notification is clicked
            qm.chrome.handleNotificationClick(notificationId)
        })
        /** @namespace chrome.extension.onMessage */
        // eslint-disable-next-line no-unused-vars
        chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
            // Handles extension-specific requests that come in, such as a request to upload a new measurement
            window.qmLog.debug('Received request: ' + request.message, null)
            if(request.message === "uploadMeasurements"){
                qm.api.postMeasurements(request.payload, null)
            }
        })
        chrome.runtime.onInstalled.addListener(function(){ // Called when the extension is installed
            qm.chrome.scheduleGenericChromeExtensionNotification()
            if(!localStorage.getItem(qm.items.introSeen)){
                qm.chrome.openIntroWindowPopup()
            }
        })
        chrome.alarms.onAlarm.addListener(function(alarm){ // Called when an alarm goes off (we only have one)
            qmLog.info('onAlarm Listener heard this alarm ', null, alarm)
            qm.userHelper.getUserFromLocalStorageOrApi(function(){
                qm.notifications.refreshIfEmptyOrStale(qm.chrome.showRatingOrInboxPopup())
            })
        })
        qm.userHelper.getUserFromLocalStorageOrApi(function(){
            qm.chrome.showRatingOrInboxPopup()
        }, function(){
            qm.chrome.showSignInNotification()
        })
    },
    openIntroWindowPopup(){
        qm.storage.setItem('introSeen', true)
        qm.chrome.createPopup(qm.chrome.windowParams.introWindowParams)
    },
    openOrFocusChromePopupWindow(windowParams){
        //qm.chrome.chromeDebug();
        if(!window.qm.chrome.canShowChromePopups()){
            return
        }
        // var chromeWindowId = qm.chrome.createPopupIfNoWindowIdInLocalStorage(windowParams);
        // if(!chromeWindowId){return;}
        //qm.chrome.getCurrentWindowAndFocusOrCreateNewPopup(windowParams);
        qm.chrome.getAllWindowsFocusOrCreateNewPopup(windowParams)
        //qm.chrome.getWindowByIdAndFocusOrCreateNewPopup(chromeWindowId, windowParams);
    },
    openFullInbox(focusWindow, notificationId){
        let windowParams = qm.chrome.windowParams.fullInboxWindowParams
        if(focusWindow){
            windowParams.focused = true
        }
        qm.chrome.openOrFocusChromePopupWindow(qm.chrome.windowParams.fullInboxWindowParams)
        console.error('notificationId is not a json object and is not moodReportNotification. Opening Reminder Inbox', notificationId)
    },
    openLoginWindow(){
        let windowParams = {
            type: 'panel',
            top: multiplyScreenHeight(0.2),
            left: multiplyScreenWidth(0.4),
            width: 450,
            height: 750,
            focused: qm.chrome.allowFocusing,
        }
        windowParams.url = "https://web.quantimo.do/#/app/login?clientId=" + qm.getClientId()
        windowParams.focused = true
        qm.chrome.openOrFocusChromePopupWindow(windowParams)
    },
    openMeasurementAddWindow(focusWindow, notificationId){
        let windowParams = qm.chrome.windowParams.fullInboxWindowParams
        if(focusWindow){
            windowParams.focused = true
        }
        qm.chrome.windowParams.fullInboxWindowParams.url = "index.html#/app/measurement-add/?trackingReminderObject=" + notificationId
        qm.chrome.openOrFocusChromePopupWindow(qm.chrome.windowParams.fullInboxWindowParams)
    },
    scheduleGenericChromeExtensionNotification(){
        let intervalInMinutes = parseInt(qm.storage.getItem(qm.items.notificationInterval) || "60")
        qmLog.info('scheduleGenericChromeExtensionNotification: Reminder notification interval is ' + intervalInMinutes + ' minutes')
        let alarmInfo = {periodInMinutes: intervalInMinutes}
        qmLog.info('scheduleGenericChromeExtensionNotification: clear genericTrackingReminderNotificationAlarm')
        chrome.alarms.clear("genericTrackingReminderNotificationAlarm")
        qmLog.info('scheduleGenericChromeExtensionNotification: create genericTrackingReminderNotificationAlarm', null, alarmInfo)
        chrome.alarms.create("genericTrackingReminderNotificationAlarm", alarmInfo)
        qmLog.info('Alarm set, every ' + intervalInMinutes + ' minutes')
    },
    scheduleChromeExtensionNotificationWithTrackingReminder(trackingReminder){
        let alarmInfo = {}
        alarmInfo.when = trackingReminder.nextReminderTimeEpochSeconds * 1000
        alarmInfo.periodInMinutes = trackingReminder.reminderFrequency / 60
        let alarmName = qm.chrome.createChromeAlarmNameFromTrackingReminder(trackingReminder)
        alarmName = JSON.stringify(alarmName)
        chrome.alarms.getAll(function(alarms){
            let hasAlarm = alarms.some(function(oneAlarm){
                return oneAlarm.name === alarmName
            })
            if(hasAlarm){
                qmLog.info(null, 'Already have an alarm for ' + alarmName, null)
            }
            if(!hasAlarm){
                chrome.alarms.create(alarmName, alarmInfo)
                qmLog.info(null, 'Created alarm for alarmName ' + alarmName, null, alarmInfo)
            }
        })
    },
    createChromeAlarmNameFromTrackingReminder(trackingReminder){
        return {
            trackingReminderId: trackingReminder.id,
            variableName: trackingReminder.variableName,
            defaultValue: trackingReminder.defaultValue,
            unitAbbreviatedName: trackingReminder.unitAbbreviatedName,
            periodInMinutes: trackingReminder.reminderFrequency / 60,
            reminderStartTime: trackingReminder.reminderStartTime,
            startTrackingDate: trackingReminder.startTrackingDate,
            variableCategoryName: trackingReminder.variableCategoryName,
            valence: trackingReminder.valence,
            reminderEndTime: trackingReminder.reminderEndTime,
        }
    },
    showRatingOrInboxPopup(){
        qm.userHelper.getUserFromLocalStorageOrApi(function(user){
            if(!user.pushNotificationsEnabled){
                qmLog.pushDebug("Not showing chrome popup because notifications are disabled")
                return
            }
            qm.notifications.refreshIfEmptyOrStale(function(){
                if(!qm.notifications.getNumberInGlobalsOrLocalStorage()){
                    qmLog.info("No notifications not opening popup")
                    return false
                }
                // if(qm.getUser().combineNotifications){
                //     qm.chrome.createSmallInboxNotification();
                //     return;
                // }
                window.trackingReminderNotification = window.qm.notifications.getMostRecentRatingNotificationNotInSyncQueue()
                if(window.trackingReminderNotification){
                    qm.chrome.showRatingPopup(window.trackingReminderNotification)
                }else if(qm.storage.getItem(qm.items.useSmallInbox)){
                    qmLog.info("No rating notifications so opening compactInboxWindow popup")
                    qm.chrome.openOrFocusChromePopupWindow(qm.chrome.windowParams.compactInboxWindowParams)
                }else if(qm.notifications.getNumberInGlobalsOrLocalStorage()){
                    qmLog.info("Got an alarm so checkTimePastNotificationsAndExistingPopupAndShowPopupIfNecessary(alarm)")
                    qm.chrome.createSmallInboxNotification()
                }
            }, function(err){
                qmLog.error("Not showing popup because of notification refresh error: " + err)
            })
        })
    },
    showRatingPopup(trackingReminderNotification){
        qmLog.info("Opening rating notification popup")
        let getChromeRatingNotificationParams = function(trackingReminderNotification){
            if(!trackingReminderNotification){
                trackingReminderNotification = qm.notifications.getMostRecentRatingNotificationNotInSyncQueue()
            }
            return {
                url: qm.notifications.getRatingNotificationPath(trackingReminderNotification),
                type: 'panel',
                top: screen.height - 150,
                left: screen.width - 380,
                width: 390,
                height: 110,
                focused: qm.chrome.allowFocusing,
            }
        }
        if(trackingReminderNotification){
            window.trackingReminderNotification = trackingReminderNotification
        }else{
            window.trackingReminderNotification = qm.notifications.getMostRecentRatingNotificationNotInSyncQueue()
        }
        if(window.trackingReminderNotification){
            // eslint-disable-next-line no-unused-vars
            qm.getClientId(function(clientId){
                qm.chrome.openOrFocusChromePopupWindow(getChromeRatingNotificationParams(window.trackingReminderNotification))
            })
        }
        window.qm.chrome.updateChromeBadge(0)
    },
    showSignInNotification(){
        if(!qm.platform.isChromeExtension()){
            return
        }
        let notificationId = 'signin'
        // eslint-disable-next-line no-unused-vars
        chrome.notifications.create(notificationId, qm.chrome.windowParams.signInNotificationParams, function(id){
        })
    },
    updateChromeBadge(numberOfNotifications){
        let text = ""
        if(qm.platform.isChromeExtension() && typeof chrome.browserAction !== "undefined"){
            if(numberOfNotifications){
                text = numberOfNotifications.toString()
            }
            if(numberOfNotifications > 9){
                text = "?"
            }
            chrome.browserAction.setBadgeText({text})
        }
    },
}
if(typeof screen !== "undefined"){
    qm.chrome.windowParams = {
        introWindowParams: {
            url: "index.html#/app/intro",
            type: 'panel',
            top: multiplyScreenHeight(0.2),
            left: multiplyScreenWidth(0.4),
            width: 450,
            height: 750,
            focused: qm.chrome.allowFocusing,
        },
        facesWindowParams: {
            url: "android_popup.html",
            type: 'panel',
            top: screen.height - 150,
            left: screen.width - 380,
            width: 390,
            height: 110,
            focused: qm.chrome.allowFocusing,
        },
        fullInboxWindowParams: {
            url: "index.html#/app/reminders-inbox",
            type: 'panel',
            top: screen.height - 800,
            left: screen.width - 455,
            width: 450,
            height: 750,
        },
        compactInboxWindowParams: {
            url: "index.html#/app/reminders-inbox-compact",
            type: 'panel',
            top: screen.height - 360 - 30,
            left: screen.width - 350,
            width: 350,
            height: 360,
        },
        inboxNotificationParams: {
            type: "basic",
            title: "How are you?",
            message: "Click to open reminder inbox",
            iconUrl: "img/icons/icon_700.png",
            priority: 2,
        },
        signInNotificationParams: {
            type: "basic",
            title: "How are you?",
            message: "Click to sign in and record a measurement",
            iconUrl: "img/icons/icon_700.png",
            priority: 2,
        },
    }
}
if(qm.platform.isChromeExtension()){
    qm.chrome.initialize()
} else {
    console.debug("Not a chrome extension")
}
