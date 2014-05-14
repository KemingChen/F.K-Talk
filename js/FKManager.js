app.factory('FKManager', function($window, $rootScope) {
	var scopeCallback = null;
	var friends = {};

	function init(key){
		if (!$window.localStorage[key])
			$window.localStorage[key] = "{}";
	}

	function parseLocalStorage(key){
		return JSON.parse($window.localStorage[key]);
	}

	function setHost(host) {
		$window.localStorage['host'] = JSON.stringify(host);
	}

	function getHost() {
		init("host");
		return parseLocalStorage("host");
	}

	function getChats(friend, callback){
		var maxSenderMsgId = -1;
		if(friend != undefined){

			var phone = friend.phone;
			init(phone);
			var res = parseLocalStorage(phone);
			console.log("hasReadMsgId: "+ friend.hasReadMsgId);

			if(typeof friend.chats !== "object")
				friend.chats = {};
			for (var i in res) {
				var chat = res[i];
				var messageId = chat.messageId;
				console.log(JSON.stringify(chat));

				friend.chats[messageId] = chat;
				setIsRead(friend, chat);
				if(chat.sender == phone && messageId > maxSenderMsgId)
					maxSenderMsgId = messageId;
			}
		}
		callback(maxSenderMsgId);
	}

	function saveChats(phone, chats, callback){
		$window.localStorage[phone] = JSON.stringify(chats);
		callback();
	}

	function setIsRead(friend, chat){
		var isRead = friend.phone == chat.receiver && chat.messageId <= friend.hasReadMsgId;
		// console.log(chat.messageId + " isRead = " + isRead);
		chat.isRead = isRead;
	}

	function initMessage(chat){
		var result = chat.message.match(/{&#&type&#&:(\d+),&#&data&#&:({.*}),&#&message&#&:&#&(.*)&#&}/);
		if(result != null){
			chat.type = JSON.parse(result[1]);
			chat.data = JSON.parse(result[2].replace(/&#&/g, '"'));
			chat.message = result[3];
			console.log("Chat: " + JSON.stringify(chat));
		}
	}

	function checkLogin(){
		var info = $rootScope.info;

		if(!info.token || info.token.length == 0){
			$window.location = "#/login";
		}
	}

	function clean(){
		$window.localStorage.clear();
		for(var i in friends){
			console.log("delete i: " + i + ", in FriendManager");
			delete friends[i];
		}
	}

	function registerCallback(callback){
		if(callback)
			scopeCallback = callback;
		else
			scopeCallback = null;
		return friends;
	}

	function notifyScope(){
		if(scopeCallback){
			console.log("Apply Scope Callback");
			scopeCallback();
		}
	}

	return {
		setHost: setHost,
		getHost: getHost,
		getChats: getChats,
		saveChats: saveChats,
		setIsRead: setIsRead,
		initMessage: initMessage,
		checkLogin: checkLogin,
		clean: clean,
		registerCallback: registerCallback,
		notifyScope: notifyScope,
	}
});