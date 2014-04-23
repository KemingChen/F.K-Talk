app.controller('FriendInfoCtrl', function($scope, $stateParams, $window, HostManager){
	HostManager.checkLogin();
	var phone = $stateParams.phone;
	$scope.friend = {};

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

	$scope.init = function(){
		angular.forEach(friends, function(obj){
			console.log(obj.phone);
			if(obj.phone == phone){
				$scope.friend = obj;
			}
		});
	};

	$scope.back = function(){
		$window.history.back();
	}
});