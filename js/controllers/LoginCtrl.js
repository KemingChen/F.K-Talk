app.controller('LoginCtrl', function($scope, $rootScope, Notification, ServerAPI, $window){
	var loginType = $rootScope.info.loginType;
	
	$scope.loginForm = {};
	$scope.LoginType = loginType;

	$scope.register = function(){
		$window.location = "#/setting";
	};

	$scope.loginFormSaver = function(key, value){
		$scope.loginForm[key] = value;
	}

	function checkInput(){
		var log = "";
		if($scope.loginForm.phone == "")
			log += "Please type Phone Number!!!";
		else if($scope.loginForm.password == "")
			log += "Please type Password!!!";
		if(log == "")
			return true;
		console.log(log);
		Notification.alert(log, null, "Alert", "確定");
		return false;
	}

	$scope.LoginAction = function(type){
		switch(type){
			case loginType.FKTalk:
				console.log("Login With FKTalk");
				$window.location = "#/fkLogin";
				break;
			case loginType.Facebook:
				console.log("Login With Facebook");
				$rootScope.showLoading("Login...");
				openFB.login('email', function(fbToken){
					ServerAPI.login({
						type: type,
						arg: fbToken,
						gcmRegId: $rootScope.info.gcmRegId;
					});
				}, function(error){
					Notification.alert('Facebook login failed: ' + error.error_description, null, "Alert", "確定");
				});
				break;
			case loginType.Google:
				console.log("Login With Google");
				break;
			case loginType.Register:
				console.log("Login With Register");
				break;
			default:
				console.log("Unknown");
		}
	}

	$scope.doFKLogin = function(){
		if(!checkInput())
			return;
		$rootScope.showLoading("Login...");
		ServerAPI.login({
			type: loginType.FKTalk,
			arg: $scope.loginForm,
			gcmRegId: $rootScope.info.gcmRegId;
		});
	};
});