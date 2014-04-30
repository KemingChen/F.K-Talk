angular.module('PhoneGap', []).factory('PhoneGap', function ($q, $rootScope, $window) {
    var deferred = $q.defer();

    $window.ionic.Platform.ready(function(){
          console.log("PhoneGap is ready!");
          $rootScope.$apply(deferred.resolve);
    });
    
    return {
        ready: function (resolve, reject, notify) {
            return deferred.promise.then(resolve, reject, notify);
        }
    };
}).run(function (PhoneGap) {});

angular.module('PhoneGap').factory('Notification', function ($q, $window, PhoneGap) {
    return {
        alert: function (message, alertCallback, title, buttonName) {
            PhoneGap.ready(function () {
                $window.navigator.notification.alert(message, alertCallback, title, buttonName);
            });
        },
        confirm: function (message, confirmCallback, title, buttonLabels) {
            PhoneGap.ready(function () {
                $window.navigator.notification.confirm(message, confirmCallback, title, buttonLabels);
            });
        },
        prompt: function (message, promptCallback, title, buttonLabels, defaultText) {
            PhoneGap.ready(function () {
                $window.navigator.notification.prompt(message, promptCallback, title, buttonLabels, defaultText);
            });
        },
        beep: function (times) {
            PhoneGap.ready(function () {
                $window.navigator.notification.beep(times);
            });
        },
        vibrate: function (milliseconds) {
            PhoneGap.ready(function () {
                $window.navigator.notification.vibrate(milliseconds);
            });
        },
        status: function (title, message){
            PhoneGap.ready(function () {
                $window.plugins.statusBarNotification.notify(title, message);
            });
        }
    };
});

angular.module('PhoneGap').factory('Contacts', function ($q, $window, PhoneGap) {
    return {
        find: function(contactFields, contactSuccess, contactError, contactFindOptions) {
            PhoneGap.ready(function () {
                $window.navigator.contacts.find(contactFields, contactSuccess, contactError, contactFindOptions);
            });
        }
    };
});

angular.module('PhoneGap').factory('BusyIndicator', function ($q, $window, PhoneGap) {
    var busyIndicator = null;
    var getBusyIndicator = function() {
        if (busyIndicator == null)
            busyIndicator = new WL.BusyIndicator('載入中', {text : 'Loading...'});
        return busyIndicator;
    };
    return {
        show: function() {
            PhoneGap.ready(function () {
                getBusyIndicator().show();
            });
        },
        hide: function() {
            PhoneGap.ready(function () {
                getBusyIndicator().hide();
            });
        }
    };
});

angular.module('PhoneGap').factory('PushNotificationsFactory', function ($rootScope, $log, PhoneGap, Notification) {
    var pushNotificationsFactory = function () {
        PhoneGap.ready(function () {
            console.log(JSON.stringify($rootScope.info));
            var pushNotification;
            var gcmSenderId = $rootScope.info.gcmSenderId;

            /* Setup and register device */
            console.log("gcmSenderId=>" + gcmSenderId);
            // Check if phonegap and plugins are loaded
            if (typeof(window.plugins) === 'undefined') {
                $log.error('PhoneGap plugins not found. Push notifications not initialized.');
                return false;
            }

            // Initialize push notifications
            pushNotification = window.plugins.pushNotification;
            if (typeof(pushNotification) === 'undefined') {
                $log.error('Push plugin not found. Push notifications not initialized.');
                return false;
            }

            // run on the chrome
            if(typeof(device) == "undefined"){
                console.log("run on the chrome");
                $rootScope.testLogin();
                return false;
            }

            var gcmSuccessHandler = function (result) {
                $log.info(
                    'Successfully registered with GCM push server. ' +
                        'Waiting for device registration ID via notification. ' +
                        'Registration result:', result
                );
            };

            var apnsSuccessHandler = function (deviceToken) {
                $log.info('Successfully registered with APNS push server. Device token:', deviceToken);
                $rootScope.successGetGCMRegId(deviceToken, 'APNS');
            };

            var genericErrorHandler = function (error) {
                $log.error('Error registering with push server:', error);
                // Notification.alert("未開啟網路!!!", closeApp, "不明錯誤", "朕知道了");

                // function closeApp(){
                //     navigator.app.exitApp();
                // }
            };
            // Register device with push server
            if (device.platform === 'Android') {
                pushNotification.register(gcmSuccessHandler, genericErrorHandler, {
                    'senderID': gcmSenderId,
                    'ecb': 'onNotificationGCM'
                });
            } else if (device.platform === 'iOS') {
                pushNotification.register(apnsSuccessHandler, genericErrorHandler, {
                    'badge': 'true',
                    'sound': 'true',
                    'alert': 'true',
                    'ecb': 'onNotificationAPN'
                });
            }

            /* Bind notification functions to window (called by phonegapPush plugin) */

            // iOS notification received
            window.onNotificationAPN = function (notification) {
                $log.info('APNS push notification received:', notification);
                $rootScope.$broadcast('phonegapPush.notification', {
                    data: notification.alert,
                    provider: 'APNS'
                });
            };

            // Android notification received
            window.onNotificationGCM = function (notification) {
                switch (notification.event) {
                    case 'registered':
                        if (notification.regid.length > 0) {
                            $log.info('Got GCM device registration ID:', notification.regid);
                            $rootScope.successGetGCMRegId(notification.regid, 'GCM');
                        } else {
                            $log.error('Error registering with GCM push server: No device registration ID received.');
                        }
                        break;

                    case 'message':
                        $log.info('GCM push notification received (only payload forwarded):', notification);
                        console.log("PUSH: " + JSON.stringify(notification.payload));
                        break;

                    case 'error':
                        $log.error('Error while receiving GCM push notification:', notification);
                        break;

                    default:
                        $log.error('Unknown GCM push notification received:', notification);
                        break;
                }
            };
        });
        return true;
    };
    return pushNotificationsFactory;
});