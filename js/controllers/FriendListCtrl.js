app.controller('FriendListCtrl', function($scope, HostManager, $window, FriendManager, $rootScope){
	HostManager.checkLogin();
	var friends = FriendManager.friends;

	$scope.leftButtons = [{
		type: 'button-positive',
		content: "新增朋友",
		tap: function(){
			$window.location = "#/add";
		},
	}];

	$scope.filter = function(key){
		$scope.filterFriends = [];
		angular.forEach(friends, function(obj){
			if(key == "" || obj.name.match(key) !== null || obj.phone.match(key) !== null){
				$scope.filterFriends.push(obj);
			}
		});
	};

	$scope.moveTo = function(phone){
		$window.location = "#/FInfo/" + phone;
	};
});