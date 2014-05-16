app.controller('LoginCtrl', function($scope, $rootScope, Notification, ServerAPI, $window, $stateParams, FacebookAPI){
	var fkLoginType = $rootScope.info.loginType;
	var phone = $stateParams.phone;

	$scope.form = {};
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
			arg: $scope.form,
			gcmRegId: $rootScope.info.gcmRegId,
		});

		function checkInput(){
			var log = "";
			if($scope.form.phone.trim() == "")
				log += "Please type Phone Number!!!";
			else if($scope.form.password.trim() == "")
				log += "Please type Password!!!";
			if(log == "")
				return true;
			console.log(log);
			Notification.alert(log, null, "Alert", "確定");
			return false;
		}
	}

	$scope.toBind = function(){
		if($scope.form.phone && $scope.form.phone.length == 10){
			$window.location = "#/regBind/" + $scope.form.phone;
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
		$window.location = "#/regInputInfo/" + phone;
	}

	$scope.initInputInfo = function(){
		$scope.title = "基本資料";
		$scope.rightBtn = undefined;
		$scope.submit = "註冊";
		$scope.form = {
			type: fkLoginType.FKTalk,
			photo: "images/NoPhoto.jpg",
			phone: phone,
		};
	}

	$scope.doFKSignup = function(){
		if(!checkInput())
			return;
		$rootScope.showLoading("註冊中...");
		ServerAPI.signup($scope.form);

		function checkInput(){
			var log = "";
			if($scope.form.name.trim() == "")
				log += "Please type Name!!!";
			else if($scope.form.mail.trim() == "")
				log += "Please type Email!!!";
			else if($scope.form.arg.trim() == "")
				log += "Please type Password!!!";
			else if($scope.form.password != $scope.form.arg)
				log += "Password is Not Same!!!";
			if(log == "")
				return true;
			console.log(log);
			Notification.alert(log, null, "Alert", "確定");
			return false;
		}
	}
});