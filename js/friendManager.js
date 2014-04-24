app.factory('FriendManager', function($http, $rootScope, Notification, HostManager, $window) {
	var info = $rootScope.info;
	var FM = {
		friends: [],
		chats: {},
	}
	var callbacks = [];

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
				var message = "已成功新增: " + respnose.name;
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

	function listMsg(phone, callback){
		var host = HostManager.getHost();
		var api = info.server + "/listMsg";
		var data = {
			token: host.token,
			phone: phone,
			timestamp: 0,
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
				FM.chats[phone] = respnose;
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
			callbacks.push(callback);
		return FM;
	}

	return {
		add: add,
		list: list,
		register: register,
		sendMsg: sendMsg,
		readMsg: readMsg,
		listMsg: listMsg,
	};
});