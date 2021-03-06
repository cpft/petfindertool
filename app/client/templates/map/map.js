var lat;
var long;
var filter = {};
var mapInstance;
var pets = {};

/*****************************************************************************/
/* Home: Event Handlers */
/*****************************************************************************/
Template.map.events({
});

/*****************************************************************************/
/* Home: Helpers */
/*****************************************************************************/
Template.map.helpers({
    mapOptions: function() {
      if (GoogleMaps.loaded()) {
        return {
          center: new google.maps.LatLng(lat, long),
			zoom: 12
        };
      }
    }
});

/*****************************************************************************/
/* Home: Lifecycle Hooks */
/*****************************************************************************/
Template.map.onCreated(function () {
});
	
renderMap = function (filter) {
  petsCollection = Pets.find(filter);
  for (var petKey in pets) {
  	 pets[petKey].setMap(null);
  }
  pets = {};
  petsCollection.forEach(function(document){
	  var iconImage;
	  if(document.postType==0) {
	  	iconImage = "http://chart.apis.google.com/chart?cht=d&chdp=mapsapi&chl=pin%27i%5c%27%5bL%27-2%27f%5chv%27a%5c%5dh%5c%5do%5cFF1100%27fC%5c000000%27tC%5c000000%27eC%5cLauto%27f%5c&ext=.png";
	  } else {
	  	iconImage = "http://chart.apis.google.com/chart?cht=d&chdp=mapsapi&chl=pin%27i%5c%27%5bF%27-2%27f%5chv%27a%5c%5dh%5c%5do%5c009900%27fC%5c000000%27tC%5c000000%27eC%5cLauto%27f%5c&ext=.png";
	  }
        var marker = new google.maps.Marker({
          draggable: false,
          animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(document.lat, document.lng),
          map: mapInstance.instance,
          id: document._id,
		icon: iconImage
        });
  	  petVal = Pets.findOne({"_id": document._id});
	  var petInfo = "<img class=image-thumbnail src="+petVal.imageUrl+"/><br>";
	  petInfo += "<b>"
	  if(petVal.postType == 0) {
		  petInfo += "Lost ";
	  } else {
		  petInfo += "Found ";
	  }
	  if(petVal.petType == 0) {
	  	petInfo += "Dog "
	  } else if(petVal.petType == 1){
	  	petInfo += "Cat "
	  } else {
	  	petInfo += "Pet Animal "
	  }
	  petInfo += "on " + petVal.petSpotted;
	  petInfo += "</b>";
	  petInfo += "<br> Name: " 
	  if(petVal.petName) {
		petInfo += petVal.petName;
  	  } else {
		  petInfo += "Unknown";
  	  }
  	  petInfo +=  "<br>" + 	petVal.petSize + " " + petVal.petColor + " " + petVal.petBreed + " " + petVal.petGender + " " + petVal.petAge + " at <br>";
	  petInfo += petVal.petLocation + "<br>";
	  petInfo += petVal.details + "<br>";
	  petInfo += "Reported by " + petVal.finderName + ": " + petVal.email;
  	  var info = new google.maps.InfoWindow({
  	        content: petInfo
  	  });


  	  google.maps.event.addListener(marker, 'click', function() {
  	      info.open(marker.getMap(), marker);
  	  });

        pets[document._id] = marker;

  });
}

Template.map.onRendered(function () {
    GoogleMaps.ready('map', function(map) {
  	  mapInstance = map;
  	  renderMap(filter);
    });
});

Template.map.onDestroyed(function () {
});

Meteor.startup(function(){
	lat = 13.068091;
	long = 80.2256504;
	GoogleMaps.load({
		libraries: 'places'
	});
	
	//   if(navigator.geolocation) {
	//   // navigator.geolocation.getCurrentPosition(function(pos) {
	// 	  // lat = pos.coords.latitude;
	// 	  // long = pos.coords.longitude;
	// 	  lat = 13.047857;
	// 	  long = 80.0685802;
	// 	  console.log(lat);
	// 	  console.log(long);
	// 	  GoogleMaps.load({
	// 	libraries: 'places'
	// });
	//   });
	//   } else {
	//   lat = 13.047857;
	//   long = 80.0685802;
	//   GoogleMaps.load({
	// 	libraries: 'places'
	// });
	//   }
});
