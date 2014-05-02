app.factory('HostManager', function($window, $rootScope, $http, Notification) {
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
			$window.localStorage[key] = "{mid:0}";
	}

	function getHasReadMsgId(phone){
		initPhone(phone);
		return JSON.parse($window.localStorage[phone]).mid;
	}

	function setHasReadMsgId(phone, mid){
		$window.localStorage[key] = JSON.stringify({mid:mid});
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
		console.log("use api: " + api + ", DATA: " + JSON.stringify(data));
		var http = $http({
			method: 'POST',
			url: api,
			data: data,
			timeout: info.timeout,
		});
		http.success(function(respnose, status) {
			console.log("SUCCESS: " + JSON.stringify(respnose));
			if(respnose.token === undefined){
				Notification.alert(respnose.log, onFail, "Error", "確定");
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
			var message = "登入失敗 \n請問要再試一次嗎?";
		    Notification.confirm(message, function(action){
		    	console.log("confirm get button " + action + ";");
		    	if(action == 2){
		    		login(loginForm, onFail);
		    	}
		    }, "網路不穩", "No,Yes");
		});
	};

	function saveSetting(form){
		var info = $rootScope.info;
		var api = info.server + "/setting";
		var data = form;
		console.log("use api: " + api + ", DATA: " + JSON.stringify(data));
		var http = $http({
			method: 'POST',
			url: api,
			data: data,
			timeout: info.timeout,
		});
		http.success(function(respnose, status) {
			try{
				JSON.parse(respnose);
				console.log("SUCCESS: " + JSON.stringify(respnose));
				HostManager.setHost(respnose);
				$window.location = "#/tab/Flist";
			}
			catch(err){
				console.log("Fail: " + respnose);
				Notification.alert(respnose, null, "發生錯誤", "朕知道了");
			}
		});
		http.error(function(data, status) {
			var message = "儲存失敗 \n請問要再試一次嗎?";
		    Notification.confirm(message, function(action){
		    	console.log("confirm get button " + action + ";");
		    	if(action == 2){
		    		login(loginForm, onFail);
		    	}
		    }, "網路不穩", "No,Yes");
		});
	}

	function register(form){
		var info = $rootScope.info;
		var api = info.server + "/signup";
		var data = form;
		console.log("use api: " + api + ", DATA: " + JSON.stringify(data));
		var http = $http({
			method: 'POST',
			url: api,
			data: data,
			timeout: info.timeout,
		});
		http.success(function(respnose, status) {
			try{
				JSON.parse(respnose);
				console.log("SUCCESS: " + JSON.stringify(respnose));
				HostManager.setHost(respnose);
				$window.location = "#/tab/Flist";
			}
			catch(err){
				console.log("Fail: " + respnose);
				Notification.alert(respnose, null, "發生錯誤", "朕知道了");
			}
		});
		http.error(function(data, status) {
			var message = "儲存失敗 \n請問要再試一次嗎?";
		    Notification.confirm(message, function(action){
		    	console.log("confirm get button " + action + ";");
		    	if(action == 2){
		    		login(loginForm, onFail);
		    	}
		    }, "網路不穩", "No,Yes");
		});
	}
	return {
		setHost: setHost,
		getHost: getHost,
		checkLogin: checkLogin,
		login: login,
		saveSetting: saveSetting,
		register: register,
		getHasReadMsgId: getHasReadMsgId,
		setHasReadMsgId: setHasReadMsgId,
	};
});