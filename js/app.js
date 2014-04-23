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
            url: '/FInfo/:uid',
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
            url: '/Chat/:uid',
            templateUrl: 'templates/chat.html',
            controller: 'ChatCtrl'
        });

    $urlRouterProvider.otherwise("/tab/FList");
});

app.run(function($rootScope, HostManager, $window) {
    console.log("FKTalk");
    $rootScope.info = {
        server: "http://127.0.0.1:8888",
        timeout: 5000,
    };
});

app.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        var img = document.createElement("img");
                        img.src = loadEvent.target.result;

                        var cvs = document.createElement('canvas');
                        var value = 60;
                        cvs.width = value;
                        cvs.height = value;

                        var ctx = cvs.getContext("2d");
                        ctx.scale(value / img.naturalWidth, value / img.naturalHeight);
                        ctx.drawImage(img, 0, 0);

                        scope.fileread = cvs.toDataURL("image/jpeg", 10);
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);