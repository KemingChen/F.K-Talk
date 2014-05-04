app.factory('MQTTActions', function($window, $rootScope, FriendManager, DBManager, HostManager) {
	function addMsg(data){
		var friends = FriendManager.friends;

		var messageId = data.messageId;
		var sender = data.sender;
		var receiver = data.receiver;
		var message = data.message;
		var timestamp = data.timestamp;
		console.log(JSON.stringify([messageId, sender, receiver, message, timestamp]));

		var selfPhone = $rootScope.info.SP;
		var key = "";
		if(selfPhone != sender)
			key = sender;
		if(selfPhone != receiver)
			key = receiver;
		// DBManager.addMsg(messageId, sender, receiver, message, timestamp, function(){
		if(key != ""){
			console.log("SP: " + key);
			if(friends[key].chats === undefined)
				friends[key].chats = {};
			HostManager.setChatHasRead(friends[key], data);
			friends[key].chats[messageId] = data;
			HostManager.saveChats(key, friends[key].chats, function(){
					FriendManager.notifyScope();
					if(selfPhone != sender && ($window.location.href.match("#/Chat/" + sender) != null)){
						var hasReadMsgId = friends[sender].hasReadMsgId;
						if(hasReadMsgId < messageId){
							console.log("Send Read Msg: " + messageId + ", to " + sender);
							FriendManager.readMsg(sender, messageId);
							friends[sender].hasReadMsgId = messageId;
						}
					}
			});
		}
	}

	function listMsg(data){
		var friends = FriendManager.friends;

		var selfPhone = $rootScope.info.SP;
		var key = "";
		var maxSenderMsgId = -1;

		for(var i in data){
			var chat = data[i];
			console.log(JSON.stringify(chat));
			var messageId = chat.messageId;
			var sender = chat.sender;
			var receiver = chat.receiver;
			var message = chat.message;
			chat.timestamp = (new Date(chat.timestamp)).getTime();
			var timestamp = chat.timestamp;
			if(key == ""){
				if(selfPhone != sender)
					key = sender;
				if(selfPhone != receiver)
					key = receiver;
				console.log("key: " + key);
				friends[key].chats = {};
			}

			if(key && key != ""){
				HostManager.setChatHasRead(friends[key], chat);
				friends[key].chats[messageId] = chat;
				if(chat.sender == key && messageId > maxSenderMsgId)
                    maxSenderMsgId = messageId;
			}
			else{
				break;
			}
		}
		if(key && key != ""){
			var sender = key;
			FriendManager.notifyScope();
			HostManager.saveChats(key, friends[key].chats, function(){
				if($window.location.href.match("#/Chat/" + sender) != null){
					var hasReadMsgId = friends[sender].hasReadMsgId;
					if(hasReadMsgId < maxSenderMsgId){
						console.log("Send Read Msg: " + maxSenderMsgId + ", to " + sender);
						FriendManager.readMsg(sender, maxSenderMsgId);
						friends[sender].hasReadMsgId = maxSenderMsgId;
					}
				}
			});
		}
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
		listMsg: listMsg,
		listFriend: listFriend,
		deleteFriend: deleteFriend,
		updateFriend: updateFriend,
		hasRead: hasRead,
		error: error,
	}
});