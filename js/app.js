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
            views: {
                'login': {
                    templateUrl: 'templates/login.html',
                    controller: 'LoginCtrl'
                }
            }
        })
        .state('setting', {
            url: '/setting',
            views: {
                'setting': {
                    templateUrl: 'templates/setting.html',
                    controller: 'SettingCtrl'
                }
            }
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
        .state('tab.Finfo', {
            url: '/Finfo',
            views: {
                'tab-friendInfo': {
                    templateUrl: 'templates/friendInfo.html',
                    controller: 'FriendInfoCtrl'
                }
            }
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
            url: '/Chat/:uid',
            views: {
                'chat': {
                    templateUrl: 'templates/chat.html',
                    controller: 'ChatCtrl'
                }
            }
        });

    $urlRouterProvider.otherwise("/login");
});

app.run(function() {
    console.log("FKTalk")
});