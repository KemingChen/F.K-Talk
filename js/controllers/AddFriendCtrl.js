app.controller('AddFriendCtrl', function($scope, $window, HostManager, FriendManager){
	HostManager.checkLogin();

	$scope.inputSaver = function(key, value){
		$scope[key] = value;
	}

	$scope.add = function(){
		FriendManager.add($scope.phone);
		$window.history.back();
	}
});