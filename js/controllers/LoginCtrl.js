app.controller('LoginCtrl', function($scope, $rootScope, $http, Notification, HostManager, $window){
	$scope.loginForm = {
		phone: "",
		password: "",
	};

	$scope.login = function(){
		if(!checkInput())
			return;
		HostManager.login($scope.loginForm, alertCallback);

		function alertCallback(){
			$scope.loginForm = {
				phone: "",
				password: "",
			};
		}
	};

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
});