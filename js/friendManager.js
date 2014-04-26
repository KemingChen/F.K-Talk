app.factory('FriendManager', function($http, $rootScope, Notification, HostManager, $window, $filter) {
	var info = $rootScope.info;
	var FM = {
		friends: [],
		chats: {},
	}
	var callbacks = [];
	var pushCallback = [];

    $rootScope.$on('NewMessage', function(event, res) {
        console.log("NewMessage: " + JSON.stringify(res));
        console.log("Target: " + res.phone);

        if(FM.friends.length == 0){
        	pushCallback.push(moveTo);
        }
        else{
        	moveTo();
        }
        function moveTo(){
        	for(i in FM.friends){
	        	var friend = FM.friends[i];
	        	// console.log(friend.name);
	    		if(friend.phone == res.phone){
	    			// console.log($window.location.href);
	    			if($window.location.href.match("#/Chat/" + friend.phone) != null){
	    				listMsg(friend, friend.phone, callbacks[0]);
	    			}
					else if($window.location.href.match("#/Chat/") == null)
	    				$window.location = "#/Chat/" + friend.phone;
	    			break;
	    		}
	    	}
        }
    });

    $rootScope.$on('Read', function(event, res) {
        console.log("Read: " + JSON.stringify(res));

        if(FM.friends.length == 0){
        	pushCallback.push(moveTo);
        }
        else{
        	moveTo();
        }
        function moveTo(){
        	for(i in FM.friends){
	        	var friend = FM.friends[i];
	        	console.log(friend.name);
	    		if(friend.name == res.name){
	    			// console.log($window.location.href);
	    			if($window.location.href.match("#/Chat/" + friend.phone) != null){
	    				friend.readTime = res.timestamp;
	    				callbacks[0]();
	    			}
	    			break;
	    		}
	    	}
        }
    });

	function add(phone){
		var host = HostManager.getHost();
		var api = info.server + "/addFriend";
		var data = {
			token: host.token,
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
			if(respnose.errorMsg != undefined){
				var message = "已成功新增: " + phone;
				Notification.alert(message, null, "恭喜", "朕知道了");
			}
			else{
				var message = "查無此會員: " + phone;
				Notification.alert(message, null, "so sad ~~", "朕知道了");
			}
		});
		http.error(function(data, status) {
			respnose = data || "Request failed";
			console.log("FAIL: " + JSON.stringify(respnose));
			Notification.alert(respnose, null, "不明錯誤", "朕知道了");
		});
	}

	function list(){
		var host = HostManager.getHost();
		var api = info.server + "/listFriend";
		var data = {
			token: host.token,
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
				Notification.alert(respnose, HostManager.checkLogin, "不明錯誤", "朕知道了");
			}
			else{
				FM.friends = respnose;
				for(i in callbacks)
					callbacks[i]();
				while(pushCallback.length != 0){
					pushCallback.pop()();
				}
			}
		});
		http.error(function(data, status) {
			respnose = data || "Request failed";
			console.log("FAIL: " + JSON.stringify(respnose));
			Notification.alert(respnose, null, "不明錯誤", "朕知道了");
		});
	}

	function sendMsg(phone, message){
		var host = HostManager.getHost();
		var api = info.server + "/sendMsg";
		var data = {
			token: host.token,
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
				Notification.alert(respnose, HostManager.checkLogin, "不明錯誤", "朕知道了");
			}
			if(respnose.errorMsg != undefined){
				Notification.alert(respnose.errorMsg, null, "so sad ~~", "朕知道了");
			}
			else{
				FM.chats[phone].push({
					phone: host.phone,
					message: message,
					timestamp: respnose.timestamp,
				});
			}
		});
		http.error(function(data, status) {
			respnose = data || "Request failed";
			console.log("FAIL: " + JSON.stringify(respnose));
			Notification.alert(respnose, null, "不明錯誤", "朕知道了");
		});
	}

	function readMsg(phone){
		var host = HostManager.getHost();
		var api = info.server + "/readMsg";
		var data = {
			token: host.token,
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
			respnose = data || "Request failed";
			console.log("FAIL: " + JSON.stringify(respnose));
			Notification.alert(respnose, null, "不明錯誤", "朕知道了");
		});
	}

	function listMsg(friend, phone, callback){
		var host = HostManager.getHost();
		var api = info.server + "/listMsg";
		var data = {
			token: host.token,
			phone: phone,
			timestamp: friend.listTime ? friend.listTime : 0,
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
			if(respnose.errorMsg === undefined){
				if(respnose.length != 0){
					friend.listTime = $filter('orderBy')(respnose, "-timestamp", false)[0].timestamp;
					console.log(friend.listTime);
				}
				if(FM.chats[phone] === undefined)
					FM.chats[phone] = [];
				for(mid in respnose){
					FM.chats[phone][mid] = respnose[mid];
				}
				if(callback)
					callback();
			}
			else{
				Notification.alert(respnose.errorMsg, null, "so sad ~~", "朕知道了");
			}
		});
		http.error(function(data, status) {
			respnose = data || "Request failed";
			console.log("FAIL: " + JSON.stringify(respnose));
			Notification.alert(respnose, null, "不明錯誤", "朕知道了");
		});
	}

	function register(callback){
		if(callback)
			callbacks = [callback];
		return FM;
	}

	function getFriendRead(friend, phone){
		var host = HostManager.getHost();
		var api = info.server + "/getFriendRead";
		var data = {
			token: host.token,
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
			friend.readTime = respnose.readTime;
		});
		http.error(function(data, status) {
			respnose = data || "Request failed";
			console.log("FAIL: " + JSON.stringify(respnose));
			Notification.alert(respnose, null, "不明錯誤", "朕知道了");
		});
	}

	return {
		add: add,
		list: list,
		register: register,
		sendMsg: sendMsg,
		readMsg: readMsg,
		listMsg: listMsg,
		getFriendRead: getFriendRead,
	};
});