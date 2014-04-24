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
        .state('add', {
            url: '/add',
            templateUrl: 'templates/addFriend.html',
            controller: 'AddFriendCtrl'
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

app.run(function($rootScope, HostManager, $window, PushNotificationsFactory, $ionicLoading) {
    console.log("FKTalk v1.0");
    $rootScope.info = {
        server: "http://192.168.1.101:8888",
        timeout: 5000,
        gcmSenderId: '389225011519',
    };
    
    var loading = $ionicLoading.show({
        content: "與 GCM 連線中...",
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0,
    });
    loading.hide();
    
    PushNotificationsFactory($rootScope.info.gcmSenderId, function(token, type) {
        loading.hide();
        console.log("GET gcmRegId");
        var host = HostManager.getHost();
        host.gcmRegId = token;
        console.log("SUCCESS: gcmRegId=> " + token);
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
    APA91bHMZ1pclzpZ0i3ZsjghZN0el1ic3J0PkyN69lIKCiqHjtAdlTi5bPo-eDJjkFfnaF4fhcoKDO4K4fewv1lxX2C-0L8Z8e7HvHme8gpQbHpFyXcdeFdogMSqKInQSZTAKZ6nEmOGSIin_63TU2U6orsJNcRJxA
Flex Token
    

*/