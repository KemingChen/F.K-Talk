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
		console.log("HOST: " + JSON.stringify(host));
		if(host.token === undefined){
			$window.location = "#/login";
		}
	};

	function clean(){
		setHost({});
	}
	return {
		setHost: setHost,
		getHost: getHost,
		checkLogin: checkLogin,
		clean: clean,
	};
});