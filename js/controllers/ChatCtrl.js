app.controller('ChatCtrl', function($scope, $stateParams, $window, HostManager, FriendManager, Notification){
	// HostManager.checkLogin();
	var phone = $stateParams.phone;
	$scope.friend = FriendManager.friends[phone];

    $scope.predicate = '-messageId';
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

	$scope.toTypeMessage = function(){
		Notification.prompt("", function(answer){
			if (answer.buttonIndex === 1) {
            	// 取消
	        }
	        else {
	            // 送出
	            var message = answer.input1;
				if(message.trim() != ""){
					FriendManager.sendMsg($scope.friend.phone, message);
				}
	        }
			
		}, "輸入訊息", "取消,送出", "...");
	}
});