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
		.state('tab.setting', {
			url: '/setting',
			views: {
				'tab-setting': {
					templateUrl: 'templates/setting.html',
					controller: 'SettingCtrl'
				}
			}
		})
		.state('FInfo', {
			url: '/FInfo/:phone',
			templateUrl: 'templates/friendInfo.html',
			controller: 'FriendInfoCtrl'
		})
		.state('Map', {
			url: '/Map/:phone/:latitude/:longitude',
			templateUrl: 'templates/map.html',
			controller: 'MapCtrl'
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

	// $urlRouterProvider.otherwise("/Map/0961276368/25.043032/121.535208");
});

app.run(function($rootScope, FMManager, $window, PushNotificationsFactory, $ionicLoading, MQTTActions, ServerAPI, PhoneGap) {
	var version = "FKTalk v2.0";
	console.log(version);
	$rootScope.info = {
		server: "http://140.124.181.7:8888",
		timeout: 15000,
		gcmSenderId: '389225011519',
	};
	
	$rootScope.saveToInfo = function(data){
		for(i in data){
			$rootScope.info[i] = data[i];
		}
	}

	$rootScope.showLoading = function(message){
		$rootScope.loading = $ionicLoading.show({
			content: message,
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0,
		});
	}

	$rootScope.testLogin = function(){
		$rootScope.loading.hide();

		var host = HostManager.getHost();
		if(host.token != undefined && host.token != ""){
			$rootScope.showLoading("Auto Login...");

			var loginForm = {
				phone: host.phone,
				password: host.password,
				gcmRegId: $rootScope.info.gcmRegId,
			};
			console.log(loginForm);
			HostManager.login(loginForm);
		}
		else{
			$window.location = "#/login";
		}
	}

	$rootScope.onLoginSuccess = function(response){
		FriendManager.listFriend();
		PhoneGap.ready(function(){
            var clientId = "FK" + response.phone;
            var topic = response.token;
			$window.plugins.MQTTPlugin.CONNECT(angular.noop, angular.noop, clientId, topic);
		});
		$window.location = "#/tab/FList";
	}

	$rootScope.successGetGCMRegId = function(gcmRegId){
		console.log("SUCCESS: GET gcmRegId=>" + gcmRegId);
		$rootScope.info.gcmRegId = gcmRegId;

		$rootScope.testLogin();
	};

	$rootScope.showLoading(version);
	PushNotificationsFactory();

	$window.receiveMessage = function(payload) {
		var message = payload.length < 2000 ? payload : payload.length;
		console.log('SUCCESS FROM MQTT: ' + message);
		var res = JSON.parse(payload);
		if(!res || !res.action || !res.data)
			return;
		MQTTActions[res.action](res.data);
	};
});

app.filter('orderObjectBy', function(){
	return function(input, attribute){
		if (!angular.isObject(input)) return input;

		var array = [];
		for(var objectKey in input){
			array.push(input[objectKey]);
		}

		array.sort(function(a, b){
			a = parseInt(a[attribute]);
			b = parseInt(b[attribute]);
			return a - b;
		});
		return array;
	}
});