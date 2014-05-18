app.controller('LoginCtrl', function($scope, $rootScope, Notification, ServerAPI, $window, $stateParams, FacebookAPI, $timeout){
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
			ServerAPI.checkIsMember($scope.form, function(isMember){
				if(isMember){
					Notification.alert("此電話號碼已被註冊", null, "Alert", "確定");
				}
				else{
					$window.location = "#/regBind/" + $scope.form.phone;
				}
			});
		}
		else{
			Notification.alert("電話號碼長度不對", null, "Alert", "確定");
		}
	}

	function registerWithFacebook(){
		console.log("Register With Facebook");
		$rootScope.showLoading("註冊中...");
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

	function checkInputInfo(){
		var log = "";
		if(!$scope.form.name || $scope.form.name.trim() == "")
			log += "Please type Name!!!";
		else if(!$scope.form.mail || $scope.form.mail.trim() == "")
			log += "Please type Email!!!";
		else if(!$scope.form.arg || $scope.form.arg.trim() == "")
			log += "Please type Password!!!";
		else if(!$scope.form.password || $scope.form.password != $scope.form.arg)
			log += "Password is Not Same!!!";
		if(log == "")
			return true;
		console.log(log);
		Notification.alert(log, null, "Alert", "確定");
		return false;
	}

	function doFKSignup(){
		if(!checkInputInfo())
			return;
		$rootScope.showLoading("註冊中...");
		ServerAPI.signup($scope.form);
	}

	function doFKSetting(){
		if(!checkInputInfo())
			return;
		$rootScope.showLoading("儲存中...");
		console.log(JSON.stringify($scope.form));
		ServerAPI.setting($scope.form);
	}

	$scope.initInputInfo = function(){
		$scope.title = "基本資料";

		if(phone){
			$scope.submit = {
				title: "註冊",
				click: doFKSignup,
			};

			$scope.form = {
				type: fkLoginType.FKTalk,
				photo: "images/NoPhoto.jpg",
				phone: phone,
			};
		}
		else{
			var info = $rootScope.info;
			$scope.submit = {
				title: "儲存",
				click: doFKSetting,
			};

			$scope.form = {
				type: fkLoginType.FKTalk,
				photo: info.photo,
				phone: info.phone,
				name: info.name,
				mail: info.mail,
			};
		}
	}

	$scope.select = function(){
		var option = {
			quality: 50, 
			destinationType: navigator.camera.DestinationType.FILE_URI,
			sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY 
		};
		navigator.camera.getPicture(success, 
			function error(message){
			alert('get picture failed'); 
		}, option);
		function success(imageURI){
			console.log(imageURI);
			$scope.$apply(function () {
				var img = document.createElement("img");
				img.src = imageURI;

				var cvs = document.createElement('canvas');
				var value = 60;
				cvs.width = value;
				cvs.height = value;
				var show = function() {
					var ctx = cvs.getContext("2d");
					ctx.scale(value / img.naturalWidth, value / img.naturalHeight);
					ctx.drawImage(img, 0, 0);
					console.log(cvs.toDataURL("image/jpeg", 10));
					$scope.form.photo = cvs.toDataURL("image/jpeg", 10);
				}
				$timeout(show, 500);
			});
		}
	}
});