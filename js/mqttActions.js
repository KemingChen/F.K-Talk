app.factory('MQTTActions', function($rootScope, FriendManager, DBManager) {
	function addMsg(data){
		var friends = FriendManager.friends;

		var messageId = data.messageId;
		var sender = data.sender;
		var receiver = data.receiver;
		var message = data.message;
		var timestamp = data.timestamp;
		DBManager.addMsg(messageId, sender, receiver, message, timestamp, function(){
			var selfPhone = $rootScope.info.SP;
			var key = "";
			if(selfPhone != sender)
				key = sender;
			if(selfPhone != receiver)
				key = receiver;
			if(key != ""){
				if(friends[key].chats === undefined)
					friends[key].chats = {};
				friends[key].chats[messageId] = data;
			}
		});
	}

	function listFriend(data){
		var friends = FriendManager.friends;

		var friendArr = data;
		for(var i in friends){
			console.log("delete i: " + i);
			delete friends[i];
		}
		for(var i in friendArr){
			var friend = friendArr[i];
			console.log("add " + i + ": " + friend.phone);
			friend.show = true;
			friends[friend.phone] = friend;
		}
		FriendManager.notifyScope();
	}

	function deleteFriend(data){
		var friends = FriendManager.friends;

		var phone = data.phone;
		if(friends[phone] != undefined){
			console.log("SUCCESS delete " + phone);
			delete friends[phone];
			FriendManager.notifyScope();
		}
	}

	function updateFriend(data){
		console.log("MQTT updateFriend");

		var phone = data.phone;
		console.log(phone);
		FriendManager.friends[phone] = data;
		FriendManager.friends[phone].show = true;
		FriendManager.notifyScope();
	}

	function hasRead(data){
		var friends = FriendManager.friends;

		var phone = data.phone;
		var hasReadMsgId = data.hasReadMsgId;

		var mid = friends[phone].hasReadMsgId;
		console.log('mid: ' + mid);
		if(friends[phone] != undefined && mid < hasReadMsgId){
			friends[phone].hasReadMsgId = hasReadMsgId;
			for(var i in friends[phone].chats){
				var chat = friends[phone].chats[i];
				FriendManager.setChatHasRead(phone, chat);
			}
			FriendManager.notifyScope();
		}
	}

	function error(data){
		Notification.alert(data, null, "出了一點問題唷~~", "朕知道了");
	}

	return {
		addMsg: addMsg,
		listFriend: listFriend,
		deleteFriend: deleteFriend,
		updateFriend: updateFriend,
		hasRead: hasRead,
		error: error,
	}
});