app.factory('MQTTActions', function($rootScope, FriendManager, DBManager) {
	function addMsg(data){
		var freinds = FriendManager.friends;

		var messageId = data.messageId;
		var sender = data.sender;
		var receiver = data.receiver;
		var message = data.message;
		var timestamp = data.timestamp;
		DBManager.addMsg(messageId, sender, receiver, message, timestamp, function(){
			var selfPhone = $rootScope.info.selfPhone;
			var key = "";
			if(selfPhone != sender)
				key = sender;
			if(selfPhone != receiver)
				key = receiver;
			if(key != ""){
				friends[key].chats[messageId] = data;
			}
		});
	}

	function listFriend(data){
		var freinds = FriendManager.friends;

		var friendArr = data.friendArr;
		for(var i in friends){
			delete friends[i];
		}
		for(var i in friendArr){
			var friend = friendArr[i];
			freinds[friend.phone] = friend;
		}
	}

	function deleteFriend(data){
		var freinds = FriendManager.friends;

		var phone = data.phone;
		if(freinds[phone] != undefined){
			delete freinds[phone];
		}
	}

	function updateFriend(data){
		var freinds = FriendManager.friends;

		var phone = data.phone;
		var photo = data.photo;
		var email = data.email;
		var timestamp = data.timestamp;
		var hasReadMsgId = data.hasReadMsgId;
		freinds[phone] = data;
	}

	function hasRead(data){
		var freinds = FriendManager.friends;

		var phone = data.phone;
		var hasReadMsgId = data.readTime;
		if(freinds[phone] != undefined && freinds[phone].hasReadMsgId < hasReadMsgId){
			var mid = HostManager.getHasReadMsgId(phone);
			if(hasReadMsgId > mid){
				freinds[phone].hasReadMsgId = hasReadMsgId;
				HostManager.setHasReadMsgId(phone, hasReadMsgId);
			}
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