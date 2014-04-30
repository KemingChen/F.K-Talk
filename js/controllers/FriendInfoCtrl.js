app.controller('FriendInfoCtrl', function($scope, $stateParams, $window, HostManager, FriendManager){
	HostManager.checkLogin();
	var phone = $stateParams.phone;
	$scope.friend = FriendManager.friends[phone];

	$scope.back = function(){
		$window.history.back();
	}
});