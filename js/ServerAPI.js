app.factory('ServerAPI', function($http, $rootScope, Notification, FKManager, $window, $timeout) {
	function toRequest(action, data, useToken){
		var info = $rootScope.info;
		var api = info.server + action;
		console.log("use api: " + api + ", DATA: " + toLog(data, 300));
		
		if(useToken && typeof data === "object"){
			data.token = info.token;
		}

		return $http({
			method: 'POST',
			url: api,
			data: data,
			timeout: info.timeout,
		});
	}

	function toLog(log, length){
		if(typeof log === "object")
			log = JSON.stringify(log);
		return  log.length >= length ? log.substr(0, length) + "..." : log;
	}

	function isError(respnose){
		console.log("RESPONSE: " + JSON.stringify(respnose));
		return typeof respnose.error === "string" || typeof respnose.errorMsg === "string";
	}

	function showNetworkError(message, callback){
		Notification.confirm(message, function(action){
			console.log("confirm get button " + action + ";");
			if(action == 2){
				callback();
			}
		}, "網路不穩", "No,Yes");
	}

	function doNothing(respnose, status){
		if(!isError(respnose)){
			console.log("Respnose Do Nothing!!!");
		}
	}

	function login(loginForm){
		console.log(JSON.stringify(loginForm));
		var http = toRequest("/login", loginForm);

		http.success(function(respnose, status) {
			$rootScope.hideLoading();

			console.log("SUCCESS: " + toLog(respnose, 300));
			if(!isError(respnose)){
				FKManager.setHost({
					type: loginForm.type,
					arg: loginForm.arg,
				});
				$rootScope.saveToInfo(respnose);
				$rootScope.onLoginSuccess(respnose);
			}
			else{
				Notification.alert(respnose.error, function(){
					FKManager.setHost({});
					$rootScope.testLogin();
				}, "Error", "確定");
			}
		});
		http.error(function(data, status){
			$rootScope.showLoading("網路不穩, Login Retry...");
			$timeout(function(){
				login(loginForm);
			}, 1000);
		});
	}

	function checkIsMember(data, callback){
		var http = toRequest("/checkIsMember", data);
		http.success(function(respnose, status) {
			callback(respnose.result);
		});
		http.error(function(data, status){
			showNetworkError("請問要再試一次嗎?", function(){
				checkIsMember(data, callback);
			});
		});
	}

	function signup(form){
		var http = toRequest("/signup", form);
		http.success(function(respnose, status) {
			$rootScope.hideLoading();

			if(!isError(respnose)){
				FKManager.setHost({
					type: form.type,
					arg: form.arg,
				});
				$rootScope.testLogin();
			}
			else{
				Notification.alert(respnose.error, null, "發生錯誤", "朕知道了");
			}
		});
		http.error(function(data, status){
			showNetworkError("註冊失敗 \n請問要再試一次嗎?", function(){
				signup(form);
			});
		});
	}

	function bind(data){
		var http = toRequest("/bind", data, true);
		http.success(function(respnose, status) {
			if(isError(respnose)){
				Notification.alert(respnose.error, null, "發生錯誤", "朕知道了");
			}
		});
		http.error(function(data, status){
			$timeout(function(){
				bind(data);
			}, 1000);
		});
	}

	function setting(form){
		var http = toRequest("/setting", form, true);
		http.success(function(respnose, status) {
			$rootScope.hideLoading();

			if(!isError(respnose)){
				$rootScope.saveToInfo({
					photo: form.photo,
					name: form.name, 
					mail: form.mail,
				});
				$window.location = "#/tab/FList";
			}
			else{
				Notification.alert(respnose.error, null, "發生錯誤", "朕知道了");
			}
		});
		http.error(function(data, status){
			$rootScope.hideLoading();

			showNetworkError("儲存失敗 \n請問要再試一次嗎?", function(){
				$rootScope.showLoading("Retry...");
				setting(form);
			});
		});
	}

	function addFriend(type, arg){
		addFriends(type, [arg]);
	}

	function addFriends(type, args){
		var http = toRequest("/addFriends", {
			type: type,
			args: args,
		}, true);
		http.success(doNothing);
		http.error(function(data, status){
			showNetworkError("加入朋友失敗 \n請問要再試一次嗎?", function(){
				addFriends(type, args);
			});
		});
	}

	function delFriend(phone){
		var http = toRequest("/delFriend", {phone: phone}, true);
		http.success(doNothing);
		http.error(function(data, status){
			var friends = FKManager.friends;
			showNetworkError("刪除" + friends[phone].name + "失敗 \n請問要再試一次嗎?", function(){
				delFriend(phone);
			});
		});
	}

	function listFriends(){
		var http = toRequest("/listFriends", {}, true);
		http.success(doNothing);
		http.error(function(data, status){
			showNetworkError("載入朋友列表失敗 \n請問要再試一次嗎?", function(){
				listFriends();
			});
		});
	}

	function listCounter(){
		var http = toRequest("/listCounter", {}, true);
		http.success(doNothing);
		http.error(function(data, status){
			$timeout(function(){
				listCounter()
			}, 500);
		});
	}

	function sendMsg(phone, message){
		var http = toRequest("/sendMsg", {
			phone: phone,
			message: message.replace(/"/g, "&#&"),
		}, true);
		http.success(doNothing);
		http.error(function(data, status){
			$timeout(function(){
				sendMsg(phone, message);
			}, 500);
		});
	}

	function readMsg(phone, hasReadMsgId){
		var http = toRequest("/readMsg", {
			phone: phone,
			hasReadMsgId: hasReadMsgId,
		}, true);
		http.success(doNothing);
		http.error(function(data, status){
			$timeout(function(){
				readMsg(phone, hasReadMsgId)
			}, 500);
		});
	}
	
	function listMsg(phone){
		var http = toRequest("/listMsg", {
			phone: phone,
		}, true);
		http.success(doNothing);
		http.error(function(data, status){
			showNetworkError("同步朋友訊息失敗 \n請問要再試一次嗎?", function(){
				listMsg(phone);
			});
		});
	}

	return {
		login: login,
		checkIsMember: checkIsMember,
		signup: signup,
		bind: bind,
		setting: setting,
		addFriend: addFriend,
		addFriends: addFriends,
		listFriends: listFriends,
		delFriend: delFriend,
		listCounter: listCounter,
		sendMsg: sendMsg,
		readMsg: readMsg,
		listMsg: listMsg,
	};
});