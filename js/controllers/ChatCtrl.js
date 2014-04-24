app.controller('ChatCtrl', function($scope, $stateParams, $rootScope, $window, HostManager, FriendManager, $timeout){
	HostManager.checkLogin();
	var phone = $stateParams.phone;
	var FM = FriendManager.register(function(){
		$scope.chats = FM.chats[phone];
		FriendManager.readMsg(phone);
	});
	angular.forEach(FM.friends, function(obj){
		console.log(obj.phone);
		if(obj.phone == phone){
			$scope.friend = obj;

			FriendManager.listMsg($scope.friend, phone, function(){
				$scope.chats = FM.chats[phone];
				FriendManager.readMsg(phone);
			});

			getFriendRead();
			function getFriendRead(){
				$timeout(function(){
			    	FriendManager.getFriendRead($scope.friend, phone);
			    	getFriendRead();
			    }, 1000);
			}
		}
	});
	$scope.chats = [];
    $scope.predicate = '-timestamp';
    $scope.reverse = false;



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
		if(chat.phone == $scope.friend.phone)
			return false;
		// console.log(chat.timestamp);
		// console.log($scope.friend.readTime);
		return chat.timestamp <= $scope.friend.readTime;
	}
});