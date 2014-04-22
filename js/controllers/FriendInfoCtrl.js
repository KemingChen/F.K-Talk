app.controller('FriendInfoCtrl', function($scope, $stateParams){
	var uid = $stateParams.uid;
	$scope.friend = {
		"name": "陳英一",
		"phone": "0912345678",
		"photo": "images/NoPhoto.jpg",
		"email": "EnglishOne@gmail.com"
	}
});