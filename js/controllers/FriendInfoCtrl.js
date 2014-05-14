app.controller('FriendInfoCtrl', function($scope, $stateParams, $window, FKManager, ServerAPI){
	FKManager.checkLogin();
	var phone = $stateParams.phone;
	$scope.friend = ServerAPI.friends[phone];

	$scope.rightButtons = [{
		type: 'button-positive',
		content: "刪除此好友",
		tap: function(){
			// ServerAPI.friends[phone].show = false;
			ServerAPI.delFriend(phone);
			$window.location = "#/tab/FList";
		},
	}];

	$scope.back = function(){
		$window.history.back();
	}
});