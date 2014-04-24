app.controller('FriendInfoCtrl', function($scope, $stateParams, $window, HostManager, FriendManager){
	HostManager.checkLogin();
	var phone = $stateParams.phone;
	$scope.friend = {};
	var FM = FriendManager.register();

	$scope.init = function(){
		angular.forEach(FM.friends, function(obj){
			console.log(obj.phone);
			if(obj.phone == phone){
				$scope.friend = obj;
			}
		});
	};

	$scope.back = function(){
		$window.history.back();
	}
});