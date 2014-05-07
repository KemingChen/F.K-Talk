app.factory('FriendManager', function($http, $rootScope, Notification, HostManager, $window, $filter) {
	$rootScope.info = {
        server: "http://140.124.181.7:8888",
        timeout: 15000,
        gcmSenderId: '389225011519',
        gcmRegId: '',
        SP: '',
        token: '',
    };
    var scopeCallback = null;
	var info = $rootScope.info;
	var friends = {};

	function addFriend(phone){
		var api = info.server + "/addFriend";
		var data = {
			sp: info.SP,
			token: info.token,
			phone: phone,
		};
		console.log("use api: " + api + ", DATA: " + JSON.stringify(data));
		var http = $http({
			method: 'POST',
			url: api,
			data: data,
			timeout: info.timeout,
		});
		http.success(function(respnose, status) {
			console.log("SUCCESS: " + JSON.stringify(respnose));
		});
		http.error(function(data, status) {
			var message = "加入朋友失敗 \n請問要再試一次嗎?";
		    Notification.confirm(message, function(action){
		    	console.log("confirm get button " + action.buttonIndex + ";");
		    	if(action.buttonIndex == 2){
		    		addFriend(phone);
		    	}
		    }, "網路不穩", "No,Yes");
		});
	}

	function delFriend(phone){
		var api = info.server + "/delFriend";
		var data = {
			sp: info.SP,
			token: info.token,
			phone: phone,
		};
		console.log("use api: " + api + ", DATA: " + JSON.stringify(data));
		var http = $http({
			method: 'POST',
			url: api,
			data: data,
			timeout: info.timeout,
		});
		http.success(function(respnose, status) {
			console.log("SUCCESS: " + JSON.stringify(respnose));
		});
		http.error(function(data, status) {
			var message = "刪除" + friends[phone].name + "失敗 \n請問要再試一次嗎?";
		    Notification.confirm(message, function(action){
		    	console.log("confirm get button " + action.buttonIndex + ";");
		    	if(action.buttonIndex == 2){
		    		delFriend(phone);
		    	}
		    	else{
		    		friends[phone].show = true;
		    		notifyScope();
		    	}
		    }, "網路不穩", "No,Yes");
		});
	}

	function listFriend(){
		var api = info.server + "/listFriend";
		var data = {
			sp: info.SP,
			token: info.token,
		};
		console.log("use api: " + api + ", DATA: " + JSON.stringify(data));
		var http = $http({
			method: 'POST',
			url: api,
			data: data,
			timeout: info.timeout,
		});
		http.success(function(respnose, status) {
			console.log("SUCCESS: " + JSON.stringify(respnose));
		});
		http.error(function(data, status) {
			var message = "載入朋友列表失敗 \n請問要再試一次嗎?";
		    Notification.confirm(message, function(action){
		    	console.log("confirm get button " + JSON.stringify(action) + ";");
		    	if(action.buttonIndex == 2){
		    		listFriend();
		    	}
		    }, "網路不穩", "No,Yes");
		});
	}

	function listCounter(){
		var api = info.server + "/listCounter";
		var data = {
			sp: info.SP,
			token: info.token,
		};
		console.log("use api: " + api + ", DATA: " + JSON.stringify(data));
		var http = $http({
			method: 'POST',
			url: api,
			data: data,
			timeout: info.timeout,
		});
		http.success(function(respnose, status) {
			console.log("SUCCESS: " + JSON.stringify(respnose));
		});
		http.error(function(data, status) {
			var message = "載入未讀訊息失敗 \n請問要再試一次嗎?";
		    Notification.confirm(message, function(action){
		    	console.log("confirm get button " + JSON.stringify(action) + ";");
		    	if(action.buttonIndex == 2){
		    		listCounter();
		    	}
		    }, "網路不穩", "No,Yes");
		});
	}

	function sendMsg(phone, message){
		var api = info.server + "/sendMsg";
		var data = {
			sp: info.SP,
			token: info.token,
			phone: phone,
			message: message,
		};
		console.log("use api: " + api + ", DATA: " + JSON.stringify(data));
		var http = $http({
			method: 'POST',
			url: api,
			data: data,
			timeout: info.timeout,
		});
		http.success(function(respnose, status) {
			console.log("SUCCESS: " + JSON.stringify(respnose));
			if(respnose.errorMsg == "token error"){
				HostManager.clean();
				Notification.alert("認證 Token 過期", HostManager.checkLogin, "錯誤", "朕知道了");
			}
			if(respnose.errorMsg != undefined){
				Notification.alert(respnose.errorMsg, null, "so sad ~~", "朕知道了");
			}
		});
		http.error(function(data, status) {
			var message = "傳送訊息失敗 \n請問要再試一次嗎?";
		    Notification.confirm(message, function(action){
		    	console.log("confirm get button " + JSON.stringify(action) + ";");
		    	if(action.buttonIndex == 2){
		    		sendMsg(phone, message);
		    	}
		    }, "網路不穩", "No,Yes");
		});
	}

	function readMsg(phone, hasReadMsgId){
		var api = info.server + "/readMsg";
		var data = {
			sp: info.SP,
			token: info.token,
			phone: phone,
			hasReadMsgId: hasReadMsgId,
		};
		console.log("use api: " + api + ", DATA: " + JSON.stringify(data));
		var http = $http({
			method: 'POST',
			url: api,
			data: data,
			timeout: info.timeout,
		});
		http.success(function(respnose, status) {
			console.log("SUCCESS: " + JSON.stringify(respnose));
		});
		http.error(function(data, status) {
			readMsg(phone);
		});
	}
	
	function listMsg(phone){
		var api = info.server + "/listMsg";
		var data = {
			sp: info.SP,
			token: info.token,
			phone: phone,
		};
		console.log("use api: " + api + ", DATA: " + JSON.stringify(data));
		var http = $http({
			method: 'POST',
			url: api,
			data: data,
			timeout: info.timeout,
		});
		http.success(function(respnose, status) {
			console.log("SUCCESS: " + JSON.stringify(respnose));
		});
		http.error(function(data, status) {
			message = "同步朋友訊息失敗 \n請問要再試一次嗎?";
		    Notification.confirm(message, function(action){
		    	console.log("confirm get button " + JSON.stringify(action) + ";");
		    	if(action.buttonIndex == 2){
		    		listMsg(phone);
		    	}
		    }, "網路不穩", "No,Yes");
		});
	}

	function cleanFriends(){
		for(var i in friends){
			console.log("delete i: " + i + ", in FriendManager");
			delete friends[i];
		}
	}

	function getFriends(callback){
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
		addFriend: addFriend,
		delFriend: delFriend,
		listFriend: listFriend,
		listCounter: listCounter,
		sendMsg: sendMsg,
		readMsg: readMsg,
		listMsg: listMsg,
		friends: friends,
		getFriends: getFriends,
		cleanFriends: cleanFriends,
		notifyScope: notifyScope,
	};
});