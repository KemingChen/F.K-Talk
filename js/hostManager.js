app.factory('HostManager', function($window, $rootScope, $http, Notification) {
	if (!$window.localStorage['host'])
		$window.localStorage['host'] = "{}";

	function setHost(host) {
		console.log("TOKEN: " + host.token);
		$window.localStorage['host'] = JSON.stringify(host);
	};

	function getHost() {
		return JSON.parse($window.localStorage['host']);
	};

	function checkLogin(){
		// setHost({});
		var host = getHost();
		console.log("HOST: " + JSON.stringify(host));
		if(host.token === undefined){
			$window.location = "#/login";
		}
	};

	function clean(){
		setHost({});
	};

	function login(loginForm, alertCallback){
		var info = $rootScope.info;
		var api = info.server + "/login";
		var host = getHost();
		loginForm.gcmRegId = host.gcmRegId;
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
				Notification.alert(respnose.log, alertCallback, "Error", "確定");
			}
			else{
				respnose.password = loginForm.password;
				setHost(respnose);
				$window.location = "#/tab/FList";
			}
		});
		http.error(function(data, status) {
			respnose = data || "Request failed";
			console.log("FAIL: " + JSON.stringify(respnose));
			Notification.alert(respnose, null, "不明錯誤", "朕知道了");
		});
	};
	return {
		setHost: setHost,
		getHost: getHost,
		checkLogin: checkLogin,
		clean: clean,
		login: login,
	};
});