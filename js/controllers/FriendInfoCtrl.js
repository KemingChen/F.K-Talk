app.controller('FriendInfoCtrl', function($scope, $stateParams, $window, HostManager, FriendManager){
	HostManager.checkLogin();
	var phone = $stateParams.phone;
	$scope.friend = FriendManager.friends[phone];

	$scope.rightButtons = [{
		type: 'button-positive',
		content: "刪除此好友",
		tap: function(){
			// FriendManager.friends[phone].show = false;
			FriendManager.delFriend(phone);
			$window.location = "#/tab/FList";
		},
	}];

	$scope.back = function(){
		$window.history.back();
	}
});