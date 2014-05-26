app.controller('SetReminderCtrl', function($scope, $rootScope, $stateParams, FKManager, GoogleAPI, $window, Notification){
	console.log("SetReminderCtrl");
	FKManager.checkLogin();

	var phone = $stateParams.phone;
	var messageId = $stateParams.messageId;
	var periodTime = 1*60*60;
	var friend = FKManager.friends[phone];
	var chat = friend.chats[messageId];

	$scope.chooseTime = [];
	$scope.afterTime;
	$scope.data = {
		title: chat.sender == phone ? friend.name + " 提醒您 ~ \n" + chat.message: "您曾經與 " + friend.name + "提及 ~ \n" + chat.message,
		message: chat.message,
	};

	addTime("一分鐘(For Test)", 1*60);
	addTime("半小時", 30*60);
	addTime("一小時", 60*60);
	addTime("三小時", 3*60*60);
	addTime("一天", 24*60*60);
	$scope.afterTime = $scope.chooseTime[0];

	function addTime(tag, value){
		$scope.chooseTime.push({
			tag: tag,
			value: value,
		});
	}

	$scope.addGoogleEvent = function(){
		$rootScope.showLoading("設定中...");
		var now = new Date().getTime();
		var data = {
			title: $scope.data.title,
			message: $scope.data.message,
			startTime: new Date(now + $scope.afterTime.value * 1000),
			endTime: new Date(now + ($scope.afterTime.value + periodTime) * 1000),
		};
		GoogleAPI.login(function(fbToken){
			GoogleAPI.addEvent(data, function(){
				Notification.alert("提醒成功新增!!!", function(){
					$rootScope.hideLoading();
					$window.history.back();
				}, "溫馨提示", "確定");
			});
		});
	}
});