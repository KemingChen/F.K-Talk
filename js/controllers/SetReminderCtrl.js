app.controller('SetReminderCtrl', function($scope, $stateParams, FKManager, GoogleAPI){
	FKManager.checkLogin();
	console.log("SetReminderCtrl");
	$scope.chooseTime = [];

	addTime("一分鐘", 1*60);
	addTime("十五分鍾", 15*60);
	addTime("半小時", 30*60);
	addTime("一小時", 60*60);
	addTime("三小時", 3*60*60);
	addTime("五小時", 5*60*60);
	addTime("十二小時", 12*60*60);
	addTime("一天", 24*60*60);

	function addTime(tag, value){
		$scope.chooseTime.push({
			tag: tag,
			value: value,
		});
	}
});