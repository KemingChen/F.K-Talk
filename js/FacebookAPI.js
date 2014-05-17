app.factory('FacebookAPI', function($window, $rootScope, Notification) {
	function errorHandle(res){
		$rootScope.hideLoading();
		console.log(JSON.stringify(res));
		Notification.alert('Facebook Failed: ' + res.error, null, "Alert", "確定");
	}

	function init(){
		openFB.init($rootScope.info.FBAppId);
	}

	function login(callback){
		openFB.login('user_about_me,user_birthday,user_friends,email', function(fbToken){
			if(callback)
				callback(fbToken);
		}, errorHandle);
	}

	function me(callback){
		openFB.api({
			method: 'GET',
			path: '/me',
			params: {
				fields: "id,name,email",
			},
			success: function(res){
				if(callback)
					callback(res);
			},
			error: errorHandle
		});
	}

	function picture(userId, callback){
		openFB.api({
			method: 'GET',
			path: '/' + userId + "/picture",
			params: {
				width: 100, 
				height: 100,
				redirect: 0,
			},
			success: function(res){
				if(typeof res.error != "undefined"){
					errorHandle(res);
				}
				else if(callback && res.data.url){
					callback(res.data.url);
				}
			},
			error: errorHandle
		});
	}

	function friends(callback){
		openFB.api({
			method: 'GET',
			path: '/me/friends',
			params: {},
			success: function(res){
				$rootScope.hideLoading();
				
				if(typeof res.error != "undefined"){
					errorHandle(res);
				}
				else if(callback && res.data){
					callback(res.data);
				}
			},
			error: errorHandle
		});
	}

	return{
		init: init,
		login: login,
		me: me,
		picture: picture,
		friends: friends,
	};
});