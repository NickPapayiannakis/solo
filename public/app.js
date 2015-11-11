// MapBox configuration
//==========================================

L.mapbox.accessToken = '<your access token here>';
var map = L.mapbox.map('map', 'mapbox.streets')
    .setView([40, -74.50], 9);


// Firebase
//==========================================

var fbase = new Firebase("https://noticeme.heroku.firebaseio.com/");

