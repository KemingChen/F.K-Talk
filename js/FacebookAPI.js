app.factory('FacebookAPI', function($window, $rootScope, Notification) {
	function init(){
		openFB.init($rootScope.info.FBAppId);
	}

	function login(callback){
		openFB.login('user_about_me,user_birthday,user_friends,email', function(fbToken){
			if(callback)
				callback(fbToken);
		}, function(error){
			Notification.alert('Facebook login failed: ' + error.error_description, null, "Alert", "確定");
		});
	}

	function me(callback){
		openFB.api(
		{
			method: 'GET',
			path: '/me',
			params: {
				fields: "id,name,email",
			},
			success: function(res){
				if(callback)
					callback(res);
			},
			error: function(res){
				Notification.alert('Facebook Get Me: ' + error.error_description, null, "Alert", "確定");
			}
		});
	}
});