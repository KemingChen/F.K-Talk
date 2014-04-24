app.controller('ChatCtrl', function($scope, $stateParams, $window, HostManager, FriendManager){
	HostManager.checkLogin();
	var phone = $stateParams.phone;
	var FM = FriendManager.register();
	FriendManager.listMsg(phone, function(){
		$scope.chats = FM.chats[phone];
		$scope.$apply();
	});
	angular.forEach(FM.friends, function(obj){
		console.log(obj.phone);
		if(obj.phone == phone){
			$scope.friend = obj;
		}
	});
	$scope.chats = [];
    $scope.predicate = '-timestamp';
    $scope.reverse = true;

	$scope.back = function(){
		$window.history.back();
	}

	$scope.inputSaver = function(key, value){
		console.log("INPUT: " + value);
		$scope[key] = value;
	}

	$scope.send = function(){
		var message = $scope.message;
		FriendManager.sendMsg(phone, message);
		document.getElementById("message").value = "";
	}

	$scope.isRead = function(chat){
		return true;
	}
});