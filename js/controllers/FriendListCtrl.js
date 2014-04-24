app.controller('FriendListCtrl', function($scope, HostManager, $window, FriendManager, $rootScope){
	HostManager.checkLogin();
    FriendManager.list();
	var FM = FriendManager.register(function(){
		$scope.filterFriends = FM.friends;
	});

	$scope.leftButtons = [{
		type: 'button-positive',
		content: "<i class='icon ion-plus'></i>",
		tap: function(){
			$window.location = "#/add";
		},
	}];

	$scope.filter = function(key){
		$scope.filterFriends = [];
		angular.forEach(FM.friends, function(obj){
			if(key == "" || obj.name.match(key) !== null || obj.phone.match(key) !== null){
				$scope.filterFriends.push(obj);
			}
		});
	};

	$scope.moveTo = function(phone){
		$window.location = "#/FInfo/" + phone;
	};
});