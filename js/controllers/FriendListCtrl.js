app.controller('FriendListCtrl', function($scope, HostManager, $window, FriendManager, $rootScope){
	HostManager.checkLogin();
	
	var friends = FriendManager.getFriends(function(){
		console.log("search: " + $scope.search + ";");
		$scope.filter($scope.search);
		$scope.$apply();
	});
	$scope.search = "";
	$scope.leftButtons = [{
		type: 'button-positive',
		content: "新增朋友",
		tap: function(){
			$window.location = "#/add";
		},
	}];

	$scope.rightButtons = [{
		type: 'button-positive',
		content: "重新整理",
		tap: function(){
			FriendManager.cleanFriends();
			FriendManager.listFriend();
		},
	}];

	$scope.filter = function(key){
		$scope.search = key;
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