app.factory('MQTTActions', function($window, $rootScope, ServerAPI, FKManager) {
	function addMsg(data){
		var friends = ServerAPI.friends;

		var phone = data.phone;
		var chat = data.Msg;
		var messageId = chat.messageId;
		var sender = chat.sender;
		var receiver = chat.receiver;
		var message = chat.message;
		var timestamp = chat.timestamp;
		console.log(JSON.stringify([messageId, sender, receiver, message, timestamp]));

		var friend = friends[phone];
		if(friend){
			console.log("SP: " + phone);
			if(friend.chats === undefined)
				friend.chats = {};
			HostManager.setChat(friend, chat);
			friend.chats[messageId] = chat;
			HostManager.saveChats(phone, friend.chats, function(){
				if(phone == sender && ($window.location.href.match("#/Chat/" + sender) != null)){
					var hasReadMsgId = friends[sender].hasReadMsgId;
					if(hasReadMsgId < messageId){
						console.log("Send Read Msg: " + messageId + ", to " + sender);
						ServerAPI.readMsg(sender, messageId);
						friends[sender].hasReadMsgId = messageId;
					}
				}
				if(phone == sender && $window.location.href.match("#/tab/FList") != null){
					friend.counter++;
				}
				ServerAPI.notifyScope();
			});
		}
	}

	function listMsg(data){
		var friends = ServerAPI.friends;

		var phone = data.phone;
		var msgs = data.Msgs;
		var maxSenderMsgId = -1;

		var friend = friends[phone];
		if(friend === undefined)
			return;

		friend.chats = {};
		for(var i in msgs){
			var chat = msgs[i];
			// console.log(JSON.stringify(chat));
			var messageId = chat.messageId;
			var sender = chat.sender;
			var receiver = chat.receiver;
			var message = chat.message;
			chat.timestamp = (new Date(chat.timestamp)).getTime();
			var timestamp = chat.timestamp;
			HostManager.setChat(friend, chat);
			friend.chats[messageId] = chat;
			if(chat.sender == phone && messageId > maxSenderMsgId)
				maxSenderMsgId = messageId;
		}

		ServerAPI.notifyScope();
		HostManager.saveChats(phone, friend.chats, function(){
			if($window.location.href.match("#/Chat/" + phone) != null){
				var hasReadMsgId = friends[phone].hasReadMsgId;
				if(hasReadMsgId < maxSenderMsgId){
					console.log("Send Read Msg: " + maxSenderMsgId + ", to " + phone);
					ServerAPI.readMsg(phone, maxSenderMsgId);
					friend.hasReadMsgId = maxSenderMsgId;
				}
			}
		});
	}

	function listFriend(data){
		var friends = ServerAPI.friends;

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
		ServerAPI.listCounter();
		ServerAPI.notifyScope();
	}

	function deleteFriend(data){
		var friends = ServerAPI.friends;

		var phone = data.phone;
		if(friends[phone] !== undefined){
			console.log("SUCCESS delete " + phone);
			delete friends[phone];
			ServerAPI.notifyScope();
		}
	}

	function updateFriend(data){
		console.log("MQTT updateFriend");

		var phone = data.phone;
		console.log(phone);
		ServerAPI.friends[phone] = data;
		ServerAPI.friends[phone].show = true;
		ServerAPI.notifyScope();
	}

	function hasRead(data){
		var friends = ServerAPI.friends;

		var phone = data.phone;
		var hasReadMsgId = data.hasReadMsgId;

		var mid = friends[phone].hasReadMsgId;
		console.log('mid: ' + mid);
		if(friends[phone] !== undefined && mid < hasReadMsgId){
			friends[phone].hasReadMsgId = hasReadMsgId;
			for(var i in friends[phone].chats){
				var chat = friends[phone].chats[i];
				HostManager.setChat(friends[phone], chat, "isRead");
			}
			friends[phone].counter = 0;
			ServerAPI.notifyScope();
		}
	}

	function updateCounter(data){
		var friends = ServerAPI.friends;
		var update = false;

		for(var i in data){
			var phone = data[i].phone;
			var counter = data[i].counter;

			if(friends[phone] !== undefined){
				friends[phone].counter = counter;
				update = true;
			}
		}

		if(update && ($window.location.href.match("#/tab/FList") != null)){
			ServerAPI.notifyScope();
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
		updateCounter: updateCounter,
		error: error,
	}
});