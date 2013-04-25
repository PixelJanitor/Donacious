// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require_tree .

$(function() {
  var MAPTYPE_ID = 'derek_style';
  var mapStyleOptions = [
    {
      featureType: 'all',
      elementType: 'labels',
      stylers: [ { visibility: 'simplified' }]
    },
    {
      featureType: 'roads',
      elementType: 'labels',
      stylers: [ { visibility: 'off' } ]
    }
  ];

  var mapOptions = {
    center: new google.maps.LatLng(-34.397, 150.644),
    zoom: 10,
    disableDefaultUI: true,
    mapTypeId: MAPTYPE_ID // google.maps.MapTypeId.ROADMAP
  };

  Map = new google.maps.Map($("#map-container")[0], mapOptions);
  Map.geocoder = new google.maps.Geocoder();
  var mapType = new google.maps.StyledMapType(mapStyleOptions, {name: "Derek's Style" });
  Map.mapTypes.set(MAPTYPE_ID, mapType);

  Map.findAddress = function(address, hollaback) {
    this.geocoder.geocode({address: address}, function(results, status) {
      var found = false;
      if (status == google.maps.GeocoderStatus.OK) {
        Map.fitBounds(results[0].geometry.viewport);
        found = true;
      }
      hollaback(found);
    });
  }

  Map.findAddress('Columbus, OH', function(){});

  $('#search').on('submit', function(e) {
    e.preventDefault();
    var address = $('#location').val();
    Map.findAddress(address, function(found) {
      console.log('Found: ', found);
    });
  });

});
