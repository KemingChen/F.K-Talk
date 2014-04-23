app.factory('HostManager', function($window) {
	if (!$window.localStorage['host'])
		$window.localStorage['host'] = "{}";

	function setHost(host) {
		$window.localStorage['host'] = JSON.stringify(host);
	};

	function getHost() {
		return JSON.parse($window.localStorage['host']);
	};

	function checkLogin(){
		// setHost({});
		var host = getHost();
		if(host.token === undefined){
			$window.location = "#/login";
		}
	};
	return {
		setHost: setHost,
		getHost: getHost,
		checkLogin: checkLogin,
	};
});