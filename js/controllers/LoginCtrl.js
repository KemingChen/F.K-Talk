app.controller('LoginCtrl', function($scope, $rootScope, Notification, ServerAPI, $window, $stateParams, FacebookAPI){
	var fkLoginType = $rootScope.info.loginType;
	var phone = $stateParams.phone;

	$scope.loginForm = {};
	$scope.loginType = fkLoginType;
	$scope.loginActions = {};
	$scope.loginActions[fkLoginType.Facebook] = loginWithFacebook;
	$scope.loginActions[fkLoginType.Google] = loginWithGoogle;
	$scope.loginActions[fkLoginType.FKTalk] = loginWithFKTalk;
	$scope.loginActions[fkLoginType.Register] = loginWithRegister;
	$scope.registerActions = {};
	$scope.registerActions[fkLoginType.Facebook] = registerWithFacebook;
	$scope.registerActions[fkLoginType.FKTalk] = registerWithFKTalk;


	function loginWithFacebook(){
		console.log("Login With Facebook");
		//$rootScope.showLoading("Login...");
		FacebookAPI.login(function(fbToken){
			ServerAPI.login({
				type: fkLoginType.Facebook,
				arg: fbToken,
				gcmRegId: $rootScope.info.gcmRegId,
			});
		});
	}

	function loginWithGoogle(){
		console.log("Login With Google");
	}

	function loginWithFKTalk(){
		console.log("Login With FKTalk");
		$window.location = "#/fkLogin";
	}

	function loginWithRegister(){
		console.log("Login With Register");
		$window.location = "#/regInputPhone";
	}

	$scope.doFKLogin = function(){
		if(!checkInput())
			return;
		$rootScope.showLoading("Login...");
		ServerAPI.login({
			type: fkLoginType.FKTalk,
			arg: $scope.loginForm,
			gcmRegId: $rootScope.info.gcmRegId,
		});
	}

	$scope.toBind = function(){
		if($scope.loginForm.phone && $scope.loginForm.phone.length == 10){
			$window.location = "#/regBind/" + $scope.loginForm.phone;
		}
		else{
			Notification.alert("電話號碼長度不對", null, "Alert", "確定");
		}
	}

	function registerWithFacebook(){
		console.log("Register With Facebook");
		FacebookAPI.login(function(){
			FacebookAPI.me(function(data){
				FacebookAPI.picture(data.id, function(photo){
					//photo, phone, name, mail, type, arg{password | FBID | googleID}
					console.log(JSON.stringify(data));
					console.log(photo);
					ServerAPI.signup({
						photo: photo ? photo : "images/NoPhoto.jpg",
						phone: phone,
						name: data.name,
						mail: data.email ? data.email : "FK" + phone + "@fktalk.csie.ntut.edu.tw",
						type: fkLoginType.Facebook,
						arg: data.id,
					});
				});
			});
		});
	}

	function registerWithFKTalk(){
		console.log("Register With FKTalk");
	}
});
/*
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
*/