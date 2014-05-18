app.controller('FriendListCtrl', function($scope, FKManager, $window, ServerAPI){
	FKManager.checkLogin();
	
	FKManager.registerCallback(function(){
		console.log("search: " + $scope.search + ";");
		$scope.filter($scope.search);
		$scope.$apply();
	});

	var friends = FKManager.friends;

	if(friends.length > 0){
		ServerAPI.listCounter();
	}

	$scope.search = "";
	$scope.leftButtons = [{
		type: 'button-positive',
		content: "<i class='icon ion-plus-round'></i>",
		tap: function(){
			$window.location = "#/add";
		},
	}];

	$scope.rightButtons = [{
		type: 'button-positive',
		content: "<i class='icon ion-refresh'></i>",
		tap: function(){
			ServerAPI.listFriends();
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

	$scope.showCounter = function(friend){
		return friend.counter && friend.counter != 0;
	}
});