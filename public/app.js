// MapBox config
//==========================================

L.mapbox.accessToken = 'pk.eyJ1Ijoibmlja3BhcGF5aWFubmFraXMiLCJhIjoiY2lndmd6cWY3MHBvbHc3bTVxNWZjemdwcyJ9.KU2_Pibjpd4fuj6YvE76Gg';

var map = L.mapbox.map('map', 'mapbox.dark');



//Generate a map ID
//==========================================

var mapId = location.hash.replace(/^#/, '');

// If not set generate a new one
if (!mapId) {
  mapId = (Math.random() + 1).toString(36).substring(2, 12);
  location.hash = mapId;
}



// Unique User ID generator
//==========================================

var genUUID = function() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === 'function') {
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}



// Assign user a unique ID
//==========================================

var user_id = localStorage.getItem('user_id');

if (!user_id) {
    user_id = genUUID();
    localStorage.setItem('user_id', user_id);
}



// Helper function to add a marker to the map
//==========================================

var addMarker = function(lat, lon) {

  var marker = L.marker([lat, lon], {
    icon: L.mapbox.marker.icon({
        'marker-color': '#f86767'
    })
  });

  marker.addTo(map);
};



// Firebase config
//==========================================

var markerRef = new Firebase('https://shining-heat-5760.firebaseio.com/maps/' + mapId);
//var markerRef = ref.set('user_id');
markerRef.set({'user_id': user_id});



// Location grab
//==========================================

if (navigator.geolocation) {

    document.getElementById('message').innerHTML = 'Finding your location...';

    var watchId = navigator.geolocation.watchPosition(function(position) {

        var lat = position.coords.latitude;
        var lon = position.coords.longitude;

        addMarker(lat,lon);

        // Pass user's initial position to Firebase
        markerRef.child(user_id).set({
            coords: {
                latitude: lat,
                longitude: lon
            }
        });

        // When a child is added, place a marker on the screen
        markerRef.on('child_added', function(childSnapshot) {
          console.log(childSnapshot);
        });

        //when a child's properties change, update the markers position

        //when a child is removed, deleta data associated with it
          //delete marker

        //Send position data to Firebase


        document.getElementById('message').innerHTML = '';

    }, function(error) {

        switch (error.code) {
            case error.PERMISSION_DENIED:
                document.getElementById('message').innerHTML = 'User denied the request for geolocation. Please enable geolocation and try again.';
                break;
            case error.POSITION_UNAVAILABLE:
                document.getElementById('message').innerHTML = 'Position information is currently unavailable. Please try again.';
                break;
            case error.TIMEOUT:
                document.getElementById('message').innerHTML = 'The request to get user position data timed out. Please try again.';
                break;
            case error.UNKNOWN_ERROR:
                document.getElementById('message').innerHTML = 'An unknown error occured. Please try again.';
                break;
        }

    });

} else {
    document.getElementById('message').innerHTML = 'Oops! geolocation appears to be disabled.  Please enable it and try again.';
}
