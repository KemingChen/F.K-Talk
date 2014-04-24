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
        gcmSenderId: '389225011519',
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

/*
gcmSenderId: 389225011519
Server Public Key: AIzaSyBsf4l9d4mpSaT2QH9ybpRd6GccU-367RU

Keming Token
    APA91bHMkZ7f1PyaO2CB29nUyZJll7_hw1l1eYulQdkAfgWlMhv_8oSmbOd9YH1F3ln00YEajZVN_1d30MWV-o-VJL_KA1vW44FYMwx8DvZpu2P-fFKuwOaaf_fSZq14qvP17qCcPxrVLdYbxA-nbWDu2RWTjl4L-g

Flex Token
    

*/