app.controller('RecentListCtrl', function($scope, HostManager, $window){
	HostManager.checkLogin();

	// test
	$scope.recentFriends = [
		{
			name: "謝宗廷",
			phone: "0987103180",
			photo: "images/NoPhoto.jpg",
			mail: "gary62107@gmail.com"
		},
		{
			name: "陳英一",
			phone: "0912345678",
			photo: "images/NoPhoto.jpg",
			email: "EnglishOne@gmail.com"
		}
	];
	// test end

	$scope.moveTo = function(phone){
		$window.location = "#/Chat/" + phone;
	};
});