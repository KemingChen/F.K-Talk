app.controller('AddFriendCtrl', function($scope, $rootScope, $window, FKManager, ServerAPI, Notification, FacebookAPI, GoogleAPI){
	// FKManager.checkLogin();
	var fkLoginType = $rootScope.info.loginType;

	$scope.form = {};

	$scope.addWithFKTalk = function(){
		var phone = $scope.form.phone;
		console.log(phone);
		if(phone && phone.length == 10){
			ServerAPI.addFriend(fkLoginType.FKTalk, phone);
			$window.history.back();
		}
		else{
			Notification.alert("電話號碼長度不對", null, "Alert", "確定");
		}
	}

	$scope.addWithFacebook = function(){
		$rootScope.showLoading("Import with Facebook...");
		FacebookAPI.login(function(fbToken){
			FacebookAPI.friends(function(friendList){
				var args = [];
				for(var i in friendList){
					args.push(friendList[i].id);
				}
				console.log(JSON.stringify(args));
				if(args.length > 0){
					ServerAPI.addFriends(fkLoginType.Facebook, args);
				}
				else{
					$rootScope.hideLoading();
				}
				$window.history.back();
			});
		});
	}

	$scope.addWithGoogle = function(){
		GoogleAPI.login(function(googleToken){
			GoogleAPI.getAddressBook(function(datas){
				var args = [];
				for(var i in datas){
					args.push(datas[i].phone);
				}
				console.log(JSON.stringify(args));
				if(args.length > 0){
					ServerAPI.addFriends(fkLoginType.FKTalk, args);
				}
				else{
					$rootScope.hideLoading();
				}
				$window.history.back();
			});
		});
	}
});