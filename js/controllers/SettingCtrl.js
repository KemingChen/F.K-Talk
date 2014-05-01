app.controller('SettingCtrl', function($scope, HostManager, $rootScope, $http, $window, Notification, $timeout){
	$scope.isRegister = $rootScope.info.selfPhone == "";
	if($scope.isRegister){
		$scope.host = {
			photo: "images/NoPhoto.jpg",
			phone: "",
			name: "",
			mail: "",
			password: "",
			gcmRegId: $rootScope.info.gcmRegId,
		};
	}
	else{
		$scope.host = HostManager.getHost();
	}
	
	console.log(JSON.stringify($scope.host));

	$scope.save = function(){
		if(!checkInput())
			return;
		if($scope.isRegister)
			HostManager.register($scope.host);
		else
			HostManager.saveSetting($scope.host);
	};

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
	                $scope.host.photo = cvs.toDataURL("image/jpeg", 10);
				}
				$timeout(show, 500);
            });
		}
	}

	function checkInput(){
		var log = "";
		if($scope.host.name.trim() == "")
			log += "Please type Your Name!!!";
		else if($scope.host.mail.trim() == "")
			log += "Please type Your Mail!!!";
		else if($scope.host.password.trim() == "")
			log += "Please type Your Password!!!";
		else if($scope.host.password != $scope.password)
			log += "Your password is not the same as before";
		if(log == "")
			return true;
		console.log(log);
		Notification.alert(log, null, "Alert", "確定");
		return false;
	}

	$scope.hostSaver = function(key, value){
		$scope.host[key] = value;
	}

	$scope.inputSaver = function(key, value){
		$scope[key] = value;
	}

	$scope.logout = function(){
		HostManager.clean();
	}
});