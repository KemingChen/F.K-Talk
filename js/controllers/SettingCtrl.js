app.controller('SettingCtrl', function($scope, HostManager, $rootScope, $http, $window, Notification, $timeout){
	$scope.host = HostManager.getHost();
	console.log(JSON.stringify($scope.host));

	// test input
	$scope.host.name = "陳科銘";
	$scope.host.mail = "believe75467@gmail.com";
	$scope.host.gcmRegId = "12345";
	// test end

	$scope.save = function(){
		if(!checkInput())
			return;
		var info = $rootScope.info;
		var api = info.server + "/signup";
		var data = $scope.host;
		console.log("use api: " + api);
		console.log(JSON.stringify(data));
		var http = $http({
			method: 'POST',
			url: api,
			data: data,
			timeout: info.timeout,
		});
		http.success(function(respnose, status) {
			//respnose = data;
			console.log(respnose);
			HostManager.setHost(respnose);
			$window.location = "#/tab/Flist";
		});
		http.error(function(data, status) {
			respnose = data || "Request failed";
			console.log(respnose);
			Notification.alert(respnose, null, "不明錯誤", "朕知道了");
		});
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
		console.log($scope.password);
		console.log($scope.host.password);
		var log = "";
		if($scope.host.name == "")
			log += "Please type Your Name!!!";
		else if($scope.host.mail == "")
			log += "Please type Your Mail!!!";
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
});