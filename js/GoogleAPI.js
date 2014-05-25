app.factory('GoogleAPI', function($window, $rootScope, Notification, $http) {
	var GoogleCalenderID = undefined;

	function getAddressBook(callback) {
		gapi.client.load('drive', 'v2', function() {
			var list = gapi.client.drive.files.list({
				q: 'title="friends.csv"',
			});
			var addressBook = 'friends.csv';
			list.execute(function(resp) {
				console.log(JSON.stringify(resp));
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

	function me(callback){
		gapi.client.load('oauth2', 'v2', function() {
			gapi.client.oauth2.userinfo.v2.me.get({
				fields: "email,id,name,picture",
			}).execute(function(resp){
				if(!isError(resp)){
					console.log(JSON.stringify(resp));
					if(callback){
						callback(resp);
					}
				}
			});
		});
	}

	function getCalenderID(callback){
		if(GoogleCalenderID){
			if(callback)
				callback(GoogleCalenderID);
			return;
		}
		gapi.client.load('calendar', 'v3', function() {
			gapi.client.calendar.calendarList.list({
				minAccessRole: "writer",
			}).execute(function(resp){
				if(!isError(resp)){
					GoogleCalenderID = resp.items[0].id;
					if(callback){
						callback(resp.items[0].id);
					}
					return;
				}
			});
		});
	}

	function addEvent(callback){
		getCalenderID(function(calenderID){
			
		});
		/*
						calendarId: calenderID,
						resource: {
							summary: friend.name + '的生日',
							location: '請記得發送祝福',
							start: {
								dateTime: startDate,
								timeZone: "Asia/Taipei"
							},
							end: {
								dateTime: endDate,
								timeZone: "Asia/Taipei"
							},
							recurrence: ["RRULE:FREQ=YEARLY"],
							reminders: {
								useDefault: false,
								overrides: [{
									method: 'popup',
									minutes: 1440
								}]
							}
						}*/
	}

	function isError(resp){
		if(typeof resp.error != "undefined"){
			console.log(JSON.stringify(resp.error));
			return true;
		}
		return false;
	}

	function isLogin(){
		return gapi.auth.getToken() ? true : false;
	}

	return{
		getAddressBook: getAddressBook,
		login: login,
		me: me,
	}
});