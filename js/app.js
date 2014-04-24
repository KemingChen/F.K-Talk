var app = angular.module("FKTalk", ['ionic', 'PhoneGap']);

app.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	    .state('tab', {
	        url: "/tab",
	        abstract: true,
	        templateUrl: "templates/tab.html"
	    })
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
        })
        .state('setting', {
            url: '/setting',
            templateUrl: 'templates/setting.html',
            controller: 'SettingCtrl'
        })
        .state('tab.FList', {
            url: '/FList',
            views: {
                'tab-friendList': {
                    templateUrl: 'templates/friendList.html',
                    controller: 'FriendListCtrl'
                }
            }
        })
        .state('FInfo', {
            url: '/FInfo/:phone',
            templateUrl: 'templates/friendInfo.html',
            controller: 'FriendInfoCtrl'
        })
        .state('tab.RList', {
            url: '/RList',
            views: {
                'tab-recentList': {
                    templateUrl: 'templates/recentList.html',
                    controller: 'RecentListCtrl'
                }
            }
        })
        .state('Chat', {
            url: '/Chat/:phone',
            templateUrl: 'templates/chat.html',
            controller: 'ChatCtrl'
        });

    $urlRouterProvider.otherwise("/tab/FList");
});

app.run(function($rootScope, HostManager, $window, PushNotificationsFactory) {
    console.log("FKTalk");
    $rootScope.info = {
        server: "http://192.168.1.101:8888",
        timeout: 5000,
        gcmSenderId: '325215294371',
    };
    
    PushNotificationsFactory($rootScope.info.gcmSenderId, function(token, type) {
        var host = HostManager.getHost();
        host.token = token;
        console.log(token);
        if (type == "GCM")
            host.type = 0;
        else if (type == "APNS")
            host.type = 1;
        HostManager.setHost(host);
    });
});