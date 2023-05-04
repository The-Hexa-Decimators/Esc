function initMap() {
	// Set the default map center to the user's location
	if (navigator.geolocation) {
	  navigator.geolocation.getCurrentPosition(function(position) {
		var userLocation = {
		  lat: position.coords.latitude,
		  lng: position.coords.longitude
		};
		var map = new google.maps.Map(document.getElementById("map"), {
		  center: userLocation,
		  zoom: 10,
		  mapTypeId: "roadmap",
		});
  
		// Create the Autocomplete input field and restrict to cities
		autocomplete = new google.maps.places.Autocomplete(
		  document.getElementById("location"),
		  {
			types: ["(cities)"],
		  }
		);
		// When the user selects a city, update the map center and search for escape rooms
		autocomplete.addListener("place_changed", function() {
		  var place = autocomplete.getPlace();
		  if (place.geometry) {
			map.setCenter(place.geometry.location);
			map.setZoom(13);
			var location = place.formatted_address;
			$.ajax({
			  url: "escape_rooms/",
			  data: { location: location },
			  success: function(data) {
				var escapeRooms = "";
				var markers = [];
				for (var i = 0; i < data.length; i++) {
				  var escapeRoom = data[i].location + " " + location;
				  var name = data[i].name;
				  var rating = data[i].rating;
				  var phone = data[i].phone;
				  var url = data[i].url;
				  console.log(escapeRoom);
				  var geocoder = new google.maps.Geocoder();
				  geocoder.geocode({ address: escapeRoom }, function(
					results,
					status
				  ) {
					if (status === "OK") {
					  var marker = new google.maps.Marker({
						map: map,
						position: results[0].geometry.location,
						title: name,
					  });
					  markers.push(marker);
					  var infoWindow = new google.maps.InfoWindow({
						  content: '<div><strong>' + name + '</strong><br>' +
								   'Rating: ' +  rating + '<br>' +
								   'Address: ' + escapeRoom + '<br>' +
								   'Phone:' + phone + '<br>' +
								   '<a href="' + url + '" target="_blank">' + url + '</a></div>'
					  });
					  marker.addListener("click", function() {
						infoWindow.open(map, marker);
					  });
					} else {
					  alert(
						"Geocode was not successful for the following reason: " +
						  status
					  );
					}
				  });
				}
				$("#escape-rooms").html(escapeRooms);
			  },
			});
		  } else {
			alert("No details available for input: '" + place.name + "'");
		  }
		});
	  });
	} else {
	  var map = new google.maps.Map(document.getElementById("map"), {
		center: { lat: 37.7749, lng: -122.4194 }, // Default center if geolocation not supported
		zoom: 13,
		mapTypeId: "roadmap",
	  });
	}
  }
  window.initMap = initMap;