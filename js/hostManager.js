app.factory('HostManager', function($window, $rootScope, $http, Notification, $ionicLoading) {
	function init(key){
		if (!$window.localStorage[key])
			$window.localStorage[key] = "{}";
	}

	function setHost(host) {
		$window.localStorage['host'] = JSON.stringify(host);
	};

	function getHost() {
		init("host");
		return JSON.parse($window.localStorage['host']);
	};

	function initPhone(key){
		if (!$window.localStorage[key])
			$window.localStorage[key] = "{}";
	}

	function getChats(friend, callback){
        var maxSenderMsgId = -1;
        var phone = friend.phone;
		initPhone(phone);
        var res = JSON.parse($window.localStorage[phone]);
        // console.log(JSON.stringify(res));
        // console.log(phone + ", chats length: " + res.rows.length);
        console.log("hasReadMsgId: "+ friend.hasReadMsgId);
        if(friend != undefined){
            if(friend.chats === undefined)
                friend.chats = {};
            for (var i in res) {
                var chat = res[i];
                console.log(JSON.stringify(chat));
                var messageId = chat.messageId;
                friend.chats[messageId] = chat;
                setChat(friend, chat);
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

	function setChat(friend, chat){
		// console.log("hasReadMsgId: " + friends[friendPhone].hasReadMsgId + ", chat: " + JSON.stringify(chat) + ", friendPhone: " + friendPhone);
		var isRead = friend.phone == chat.receiver && chat.messageId <= friend.hasReadMsgId;
		console.log(chat.messageId + " isRead = " + isRead);
		chat.isRead = isRead;
	}

	function checkLogin(){
		var host = getHost();

		// console.log("HOST: " + JSON.stringify(host));
		if(host.token === undefined){
			$window.location = "#/login";
		}
	};

	function login(loginForm, onFail){
		var info = $rootScope.info;
		var api = info.server + "/login";
		loginForm.gcmRegId = info.gcmRegId;
		var data = loginForm;
		console.log("use api: " + api);// + ", DATA: " + JSON.stringify(data));
		var http = $http({
			method: 'POST',
			url: api,
			data: data,
			timeout: info.timeout,
		});
		http.success(function(respnose, status) {
			$rootScope.loading.hide();
			console.log("SUCCESS: " + respnose.length);
			if(respnose.token === undefined){
				Notification.alert(respnose.errorMsg, null, "Error", "確定");
			}
			else{
				respnose.password = loginForm.password;
				setHost(respnose);
                $rootScope.info.token = respnose.token;
                $rootScope.info.SP = respnose.phone;
				$rootScope.onLoginSuccess(respnose.phone);
			}
		});
		http.error(function(data, status) {
			$rootScope.loading = $ionicLoading.show({
		        content: "網路不穩, Login Retry...",
		        animation: 'fade-in',
		        showBackdrop: true,
		        maxWidth: 200,
		        showDelay: 0,
		    });
		    login(loginForm, onFail);
		});
	};

	function saveSetting(form){
		var info = $rootScope.info;
		var api = info.server + "/setting";
		var data = form;
		console.log("use api: " + api);// + ", DATA: " + JSON.stringify(data));
		var http = $http({
			method: 'POST',
			url: api,
			data: data,
			timeout: info.timeout,
		});
		http.success(function(respnose, status) {
			if(respnose.token === undefined){
				console.log("SUCCESS: " + respnose.name);
				respnose.password = form.password;
				setHost(respnose);
                $rootScope.info.token = respnose.token;
                $rootScope.info.SP = respnose.phone;
				$window.location = "#/tab/FList";
			}
			else{
				console.log("Fail: " + respnose.errorMsg);
				Notification.alert(respnose.errorMsg, null, "發生錯誤", "朕知道了");
			}
		});
		http.error(function(data, status) {
			var message = "儲存失敗 \n請問要再試一次嗎?";
		    Notification.confirm(message, function(action){
		    	console.log("confirm get button " + action + ";");
		    	if(action == 2){
		    		saveSetting(form);
		    	}
		    }, "網路不穩", "No,Yes");
		});
	}

	function register(form){
		var info = $rootScope.info;
		var api = info.server + "/signup";
		var data = form;
		console.log("use api: " + api);// + ", DATA: " + JSON.stringify(data));
		var http = $http({
			method: 'POST',
			url: api,
			data: data,
			timeout: info.timeout,
		});
		http.success(function(respnose, status) {
			if(respnose.token === undefined){
				respnose.password = loginForm.password;
				setHost(respnose);
                $rootScope.info.token = respnose.token;
                $rootScope.info.SP = respnose.phone;
				$rootScope.onLoginSuccess(respnose.phone);
			}
			else{
				console.log("Fail: " + respnose.errorMsg);
				Notification.alert(respnose.errorMsg, null, "發生錯誤", "朕知道了");
			}
		});
		http.error(function(data, status) {
			var message = "儲存失敗 \n請問要再試一次嗎?";
		    Notification.confirm(message, function(action){
		    	console.log("confirm get button " + action + ";");
		    	if(action == 2){
		    		register(form);
		    	}
		    }, "網路不穩", "No,Yes");
		});
	}

	function clean(){
		$window.localStorage.clear();
	}

	return {
		setHost: setHost,
		getHost: getHost,
		checkLogin: checkLogin,
		login: login,
		saveSetting: saveSetting,
		register: register,

		getChats: getChats,
		saveChats: saveChats,
		setChat: setChat,

		clean: clean,
	};
});