app.controller('SettingCtrl', function($scope, $rootScope, ServerAPI, FacebookAPI, FKManager, GoogleAPI){
	$scope.logout = function(){
		FKManager.clean();
		navigator.app.exitApp();
	};

	$scope.FBBind = function(){
		$rootScope.showLoading("綁定中...");
		FacebookAPI.login(function(FBToken){
			FacebookAPI.me(function(data){
				ServerAPI.bind($rootScope.info.loginType.Facebook, data.id, function(){
					$scope.$apply();
				});
			});
		});
	}

	$scope.isFBBind = function(){
		return $rootScope.info.FBID;
	}

	$scope.GoogleBind = function(){
		$rootScope.showLoading("綁定中...");
		GoogleAPI.login(function(FBToken){
			GoogleAPI.me(function(data){
				ServerAPI.bind($rootScope.info.loginType.Google, data.id, function(){
					$scope.$apply();
				});
			});
		});
	}

	$scope.isGoogleBind = function(){
		return $rootScope.info.googleID;
	}
});