app.factory('GoogleAPI', function($window, $rootScope, Notification, $http) {
	function getAddressBook(callback) {
		gapi.client.load('drive', 'v2', function() {
			var list = gapi.client.drive.files.list();
			var addressBook = 'friends.csv';
			list.execute(function(resp) {
				for (var i = 0; i < resp.items.length; i++) {
					console.log((i + 1) + ": " + resp.items[i].title);
					if (resp.items[i].title == addressBook){
						$http.get(resp.items[i].webContentLink).success(function(data, status, headers, config) {
							var lines = data.split('\r\n');
							var datas = [];
							for (var i = 1, max = lines.length; i < max; i++) {
								var friendItems = lines[i].split(',');
								var friend = {
		    							name: friendItems[0],
		    							phone: friendItems[1],
		    							mail: friendItems[2],
		    							birthday: friendItems[3]
		    					};
		    					datas.push(friend);
							}
		    				callback(datas);
						});
						return;
					}
				}
				Notification.alert("存取" + addressBook + "失敗", null, '警告', '確定');
			});
		});
	}
	
	function login(callback) {
		var googleToken = gapi.auth.getToken();
		if(googleToken){
			callback(googleToken);
		}
		else{
			var oAuth = liquid.helper.oauth;
			oAuth.authorize(function(uriLocation) {
				if(oAuth.authCode){
					oAuth.saveRefreshToken({ 
						auth_code: oAuth.authCode
					}, function() {
						liquid.helper.oauth.getAccessToken(function(tokenObj){
							googleToken = tokenObj.access_token;
							console.log('Access Token >> ' + googleToken);
							gapi.auth.setToken({
								access_token: googleToken,
							});
							callback(googleToken);
						});
					});
				}
			});
		}
	}

	return{
		getAddressBook: getAddressBook,
		login: login,
	}
});