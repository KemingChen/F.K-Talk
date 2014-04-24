app.controller('LoginCtrl', function($scope, $rootScope, $http, Notification, HostManager, $window){
	$scope.loginForm = {
		phone: "0961276368",
		password: "12345",
		photo: "images/NoPhoto.jpg",
	};

	$scope.login = function(){
		if(!checkInput())
			return;
		var info = $rootScope.info;
		var api = info.server + "/login";
		var host = HostManager.getHost();
		$scope.loginForm.gcmRegId = host.gcmRegId;
		var data = $scope.loginForm;
		console.log("use api: " + api + ", DATA: " + JSON.stringify(data));
		var http = $http({
			method: 'POST',
			url: api,
			data: data,
			timeout: info.timeout,
		});
		http.success(function(respnose, status) {
			console.log("SUCCESS: " + JSON.stringify(respnose));
			if(respnose.token === undefined){
				Notification.alert(respnose.log, alertCallback, "Error", "確定");
			}
			else{
				HostManager.setHost(respnose);
				$window.location = "#/tab/FList";
			}
		});
		http.error(function(data, status) {
			respnose = data || "Request failed";
			console.log("FAIL: " + JSON.stringify(respnose));
			Notification.alert(respnose, null, "不明錯誤", "朕知道了");
		});

		function alertCallback(){
			$scope.loginForm = {
				phone: "",
				password: "",
			};
		};
	};

	$scope.register = function(){
		if(!checkInput())
			return;
		var host = HostManager.getHost();
		$scope.loginForm.gcmRegId = host.gcmRegId;
		HostManager.setHost($scope.loginForm);
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