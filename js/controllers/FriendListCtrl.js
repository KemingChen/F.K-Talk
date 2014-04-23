app.controller('FriendListCtrl', function($scope, HostManager, $window){
	HostManager.checkLogin();
	$scope.filterFriends = [];
	$scope.search = "";
	// test
	var friends = [
		{
			name: "陳科銘",
			phone: "0961276368",
			photo: "images/NoPhoto.jpg",
			mail: "believe75467@gmail.com"
		},
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

	$scope.filter = function(key){
		$scope.filterFriends = [];
		angular.forEach(friends, function(obj){
			if(key == "" || obj.name.match(key) !== null || obj.phone.match(key) !== null){
				$scope.filterFriends.push(obj);
			}
		});
	};

	$scope.moveTo = function(phone){
		$window.location = "#/FInfo/" + phone;
	};
});