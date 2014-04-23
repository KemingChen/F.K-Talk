app.controller('ChatCtrl', function($scope, $stateParams, $window){
	var phone = $stateParams.phone;

	// test 
	$scope.friend = {
		name: "謝宗廷",
		phone: "0987103180",
		photo: "images/NoPhoto.jpg",
		mail: "gary62107@gmail.com",
		read: 2,
		chats: [
			{
				timestamp: 1,
				message: "Hello",
				self: false,
				read: false,
			},
			{
				timestamp: 2,
				message: "Hello",
				self: true,
				read: false,
			},
			{
				timestamp: 3,
				message: "今天高家嗎?",
				self: false,
				read: false,
			},
			{
				timestamp: 4,
				message: "好呀!?",
				self: true,
				read: false,
			}
		]
	};
	// test end

	$scope.back = function(){
		$window.history.back();
	}
});