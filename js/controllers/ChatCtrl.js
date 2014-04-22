app.controller('ChatCtrl', function($scope){
	$scope.friend = {
		name: "Alex",
		photo: "images/0987103180.jpg",
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
	}
});