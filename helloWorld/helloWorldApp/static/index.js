function initMap() {
	// Set the default map center to Cal Poly Pomona
	var cpPomona = { lat: 34.0575, lng: -117.8217 };
	var map = new google.maps.Map(document.getElementById("map"), {
	  center: cpPomona,
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
		loadImages(place.geometry.location.lat(), place.geometry.location.lng(), location);
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
	// Load escape room images for Cal Poly Pomona
	loadImages(cpPomona.lat, cpPomona.lng, "Cal Poly Pomona");
  }
  
  function geocodeAndPlaceMarker(geocoder, map, markers, escapeRoom, name, rating, phone, url, escapeRooms) {
	geocoder.geocode({ address: escapeRoom}, function(results, status) {
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
		console.log(escapeRoom);
		marker.addListener("click", function() {
		  infoWindow.open(map, marker);
		});
	  } else {
		alert("Geocode was not successful for the following reason: " + status);
	  }
	});
  }  
  function loadImages(lat, lng, location) {
	fetch(`escape_rooms/?latitude=${lat}&longitude=${lng}&location=${location}`)
	  .then(response => response.json())
	  .then(data => {
		const imageUrls = data.map(item => item.image_url);
		const swiperWrapper = document.querySelector('.swiper-wrapper');
		swiperWrapper.innerHTML = '';
		imageUrls.forEach(imageUrl => {
		  const slide = document.createElement('div');
		  slide.classList.add('swiper-slide');
		  const image = document.createElement('img');
		  image.src = imageUrl;
		  slide.appendChild(image);
		  swiperWrapper.appendChild(slide);
		});
		new Swiper(".mySwiper", {
		  pagination: {
			el: ".swiper-pagination",
			clickable: true,
			renderBullet: function (index, className) {
			  return '<span class="' + className + '">' + (index + 1) + "</span>";
			},
		  },
		});
	  });
  }
  window.initMap = initMap;
  