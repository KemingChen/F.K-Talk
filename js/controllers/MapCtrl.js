app.controller('MapCtrl', function($scope, $rootScope, $stateParams, Geolocation, FKManager){
	var phone = $stateParams.phone;
	var friend = FKManager.friends[phone];
	var latitude = $stateParams.latitude;
	var longitude = $stateParams.longitude;

	var mapOptions = {
		zoom: 13,
		disableDefaultUI: true
	};

	$scope.isSelf = phone == $rootScope.info.phone;
	$scope.distance = {text: ""};
	$scope.duration = {duration: ""};
	$scope.title = "地圖";

	$scope.init = function(){
		console.log("IsSelf: " + $scope.isSelf);
		if($scope.isSelf){
			var origin = new google.maps.LatLng(latitude, longitude);
			mapOptions.center = origin;
			var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
			var marker = new MarkerWithLabel({
				position: mapOptions.center,
				labelContent: "我",
				labelAnchor: new google.maps.Point(30, 0),
				labelClass: "labels",
				labelStyle: {opacity: 0.75}
			});
			marker.setMap(map);
		}
		else{
			Geolocation.getCurrentPosition(function(position) {
				console.log("Self Position: " + JSON.stringify(position));
				var directionsService = new google.maps.DirectionsService();

				var origin = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				var destination = new google.maps.LatLng(latitude, longitude);
				
				mapOptions.center = origin;
				var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
				
				var directionsDisplay = new google.maps.DirectionsRenderer({
					markerOptions: {
						visible:false
					},
					map: map,
				});
				var request = {
					origin: origin,
					destination: destination,
					travelMode: google.maps.TravelMode.WALKING
				};
				directionsService.route(request, function(result, status) {
					console.log(JSON.stringify(status));
					if (status == google.maps.DirectionsStatus.OK) {
						console.log(JSON.stringify(result));
						var leg = result.routes[0].legs[0];
						directionsDisplay.setDirections(result);
						$scope.distance.text = leg.distance.text;
						$scope.duration.text = leg.duration.text;
						$scope.$apply();

						var destinationMarker = new MarkerWithLabel({
							position: new google.maps.LatLng(leg.end_location.k, leg.end_location.A),
							labelContent: friend ? friend.name : "???",
							labelAnchor: new google.maps.Point(30, 0),
							labelClass: "labels"
						});
						var originMarker = new MarkerWithLabel({
							position: new google.maps.LatLng(leg.start_location.k, leg.start_location.A),
							labelContent: "我",
							labelAnchor: new google.maps.Point(30, 0),
							labelClass: "labels"
						});
						originMarker.setMap(map);
						destinationMarker.setMap(map);
						directionsDisplay.setMap(map);
					}
				});
			});
		}
	}
});
