app.controller('AddFriendCtrl', function($scope, $window, FKManager, ServerAPI){
	FKManager.checkLogin();

	$scope.inputSaver = function(key, value){
		$scope[key] = value;
	}

	$scope.add = function(){
		ServerAPI.addFriend($scope.phone);
		$window.history.back();
	}
});