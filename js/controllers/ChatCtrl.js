app.controller('ChatCtrl', function($scope, $ionicScrollDelegate, $stateParams, $window, FKManager, ServerAPI, Notification, $timeout, Geolocation){
	FKManager.checkLogin();
	var phone = $stateParams.phone;

	FKManager.registerCallback(function(){
		console.log("ChatCtrl Scope Apply");
		$scope.$apply();
		$timeout($ionicScrollDelegate.scrollBottom, 500);
	});

	var friends = FKManager.friends;
	$scope.waitSendingLocation = false;
	$scope.friend = FKManager.friends[phone];
	// DBManager.listMsg(phone, function(maxSenderMsgId){
	if(!$scope.friend.chats){
		console.log("Read " + $scope.friend.phone + " in localDB");
		FKManager.getChats($scope.friend, function(maxSenderMsgId){
			var hasReadMsgId = $scope.friend.hasReadMsgId;
			console.log("hasReadMsgId: " + hasReadMsgId + ", maxSenderMsgId: " + maxSenderMsgId);
			if(hasReadMsgId < maxSenderMsgId){
				// 表示有未讀訊息
				console.log("Send Read Msg: " + maxSenderMsgId + ", to " + phone);
				ServerAPI.readMsg(phone, maxSenderMsgId);
				$scope.friend.hasReadMsgId = maxSenderMsgId;
			}
		});
	}

    $scope.predicate = '-messageId';
    $scope.reverse = false;

	$scope.back = function(){
		$window.history.back();
	}

	$scope.inputSaver = function(key, value){
		console.log("INPUT: " + value);
		$scope[key] = value;
	}

	$scope.scrollBottom = function(){
		$ionicScrollDelegate.scrollBottom();
	}

	$scope.send = function(){
		var message = $scope.message;
		ServerAPI.sendMsg(phone, message);
		document.getElementById("message").value = "";
	}

	$scope.listMsg = function(){
		ServerAPI.listMsg(phone);
	}

	$scope.clickMessage = function(chat){
		if(chat.type){
			console.log("Click Message Type: " + chat.type);
			switch(chat.type){
				case 1://Map
					var phone = chat.sender;
					var latitude = chat.data.latitude;
					var longitude = chat.data.longitude;
					$window.location = "#/Map/" + phone + "/" + latitude + "/" + longitude;
					break;
			}
		}
	}

	$scope.toTypeMessage = function(){
		console.log("Type Message!!!");
		Notification.prompt('Chat With ' + $scope.friend.name,
			function(answer){
				console.log(JSON.stringify(answer));
				if (answer.buttonIndex === 1) {
					// 取消
				}
				else {
					// 送出
					var message = answer.input1;
					if(message.trim() != ""){
						ServerAPI.sendMsg($scope.friend.phone, message);
					}
				}
			},
			'輸入訊息',
			['取消','送出']
		);
	}

	$scope.toSendLocation = function(){
		console.log("Sending Location...");
		var message = "確定要將您的位置傳送給 " + $scope.friend.name;
        Notification.confirm(message, function(action){
            console.log("confirm get button " + action + ";");
            if(action == 2){
                $scope.waitSendingLocation = true;
				$timeout(function(){
					$scope.waitSendingLocation = false;
				}, 1000);
				Geolocation.getCurrentPosition(function(position) {
					var latitude = position.coords.latitude;
					var longitude = position.coords.longitude;
					codeLatLng(latitude, longitude, function(address){
						MessageObj = {
			    			type: 1,// type == 1 -> Map
			    			data: {
			    				latitude: latitude,
			    				longitude: longitude,
			    			},
			    			message: address,
			    		}
			    		ServerAPI.sendMsg($scope.friend.phone, JSON.stringify(MessageObj));
					});
		    	});
            }
        }, "傳送位置", "No,Yes");
	}

	function codeLatLng(lat, lng, callback) {
		var latlng = new google.maps.LatLng(lat, lng);
		(new google.maps.Geocoder()).geocode({'latLng': latlng}, function(results, status) {
			var address;
			console.log(JSON.stringify(status));
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[1]) {
					console.log(JSON.stringify(results));
					address = results[1].formatted_address;
				} else {
					address = "不知名的位置";
					console.log('No results found');
				}
			} else {
				address = "Get Geocoder Fail";
				console.log('Geocoder failed due to: ' + status);
			}
			if(callback){
				callback(address);
			}
		});
	}
});