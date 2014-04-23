app.controller('SettingCtrl', function($scope, HostManager){
	$scope.host = HostManager.getHost();
	console.log($scope.host);
	$scope.password = "";

	// test input
	$scope.host.name = "陳科銘";
	$scope.host.mail = "believe75467@gmail.com";
	$scope.host.gcmRegId = "12345";

	$scope.save = function(){
		if(!checkInput())
			return;
		var info = $rootScope.info;
		var api = info.server + "/signup";
		var data = $scope.host;
		console.log("use api: " + api);
		var http = $http({
			method: 'POST',
			url: api,
			data: data,
			timeout: info.timeout,
		});
		http.success(function(respnose, status) {
			//respnose = data;
			console.log(respnose);
		});
		http.error(function(data, status) {
			respnose = data || "Request failed";
			console.log(respnose);
			Notification.alert(respnose, null, "不明錯誤", "朕知道了");
		});
	};

	function checkInput(){
		var log = "";
		if($scope.host.name == "")
			log += "Please type Your Name!!!";
		else if($scope.host.mail == "")
			log += "Please type Your Mail!!!";
		else if($scope.host.password == $scope.password)
			log += "Your password is not the same as before";
		if(log == "")
			return true;
		console.log(log);
		Notification.alert(log, null, "Alert", "確定");
		return false;
	}
});