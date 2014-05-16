app.controller('AddFriendCtrl', function($scope, $rootScope, $window, FKManager, ServerAPI, Notification){
	FKManager.checkLogin();
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
});