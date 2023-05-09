const MARKER_PATH = "https://developers.google.com/maps/documentation/javascript/images/marker_green";
var previousSearches = ["Pomona, CA, USA"];

function initMap() {
	// Set the default map center to Cal Poly Pomona
	var cpPomona = { lat: 34.0575, lng: -117.8217 };
	var map = new google.maps.Map(document.getElementById("map"), {
	  center: cpPomona,
	  zoom: 15,
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
		map.setZoom(12);
		var location = place.formatted_address;
		$.ajax({
		  url: "escape_rooms/",
		  data: { location: location },
		  success: function(data) {
			console.log(data);
			 // Generate the HTML cards for the escape rooms
  			var escapeRoomsHTML = displayEscapeRooms(data);
  			// Add the HTML to the #escape-rooms element
  			$("#escape-rooms").html(escapeRoomsHTML);
  			// Add markers to the map for each escape room
			var escapeRooms = "";
			var markers = [];
			for (var i = 0; i < data.length; i++) {
			  var escapeRoom = data[i].location;
			  var name = data[i].name;
			  var rating = data[i].rating;
			  var phone = data[i].display_phone;
			  var image_url = data[i].image_url;
			  var url = data[i].url;
			  var geocoder = new google.maps.Geocoder();
			  geocodeAndPlaceMarker(geocoder, map, markers, escapeRoom, name, rating, phone, url, escapeRooms);
			}
			$("#escape-rooms").html(escapeRooms);
  
		  },
		});
	  } else {
		alert("No details available for input: '" + place.name + "'");
	  }
	});
  }
  
  function geocodeAndPlaceMarker(geocoder, map, markers, address, name, rating, phone, url) {
	geocoder.geocode({ address: address }, function(results, status) {
	  if (status === "OK") {
		var location = results[0].geometry.location;
		var marker = new google.maps.Marker({
		  map: map,
		  position: location
		});
		map.setCenter(location);
		markers.push(marker);
		var infoWindow = new google.maps.InfoWindow();
		var contentString = "<div class='info-window'>" +
							"<h4>" + name + "</h4>" +
							"<p>Rating: " + rating + "</p>" +
							"<p>Address: " + address + "</p>" +
							"<p>Phone: " + phone + "</p>" +
							"<p><a href='" + url + "' target='_blank'>Website</a></p>" +
							"</div>";
		google.maps.event.addListener(marker, "click", function() {
		  infoWindow.setContent(contentString);
		  infoWindow.open(map, marker);
		});
	  } else {
		alert("Geocode was not successful for the following reason: " + status);
	  }
	});
  }
  

  function displayEscapeRooms(escapeRooms) {
    var resultsDiv = $("#results");
    resultsDiv.empty();
    escapeRooms.forEach(function(room) {
        var card = $("<div>");
        card.addClass("card");
        var cardBody = $("<div>");
        cardBody.addClass("card-body");
        var image = document.createElement("img");
        image.src = room.image_url;
        image.alt = room.name;
        image.classList.add("card-img");
        var title = $("<h5>");
        title.addClass("card-title");
        title.text(room.name);
        var rating = $("<p>");
        rating.addClass("card-text");
        rating.text("Rating: " + room.rating);
        var address = $("<p>");
        address.addClass("card-text");
        address.text("Address: " + room.location);
        var url = $("<a>");
        url.addClass("card-link");
        url.attr("href", room.url);
        url.attr("target", "_blank");
        url.text("Website");
        cardBody.append(image, title, rating, address, url);
        card.append(cardBody);
        resultsDiv.append(card);
    });
}


  window.initMap = initMap;
  