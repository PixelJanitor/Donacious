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
    }, {
      featureType: 'roads',
      elementType: 'labels',
      stylers: [ { visibility: 'off' } ]
    }, {
      featureType: "water",
      elementType: "labels",
      stylers: [
        { visibility: "off" },
        { color: "#484a80" }
      ]
    }, {
      featureType: "water",
      stylers: [
        { color: "#7dbbd8" }
      ]
    }, {
      featureType: "road",
      stylers: [
        { color: "#ffffff" }
      ]
    }, {
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
    }
  ];

  var mapOptions = {
    zoom: 10,
    disableDefaultUI: true,
    mapTypeId: MAPTYPE_ID // google.maps.MapTypeId.ROADMAP
  };

  Map = new google.maps.Map($("#map-container")[0], mapOptions);
  Map.geocoder = new google.maps.Geocoder();
  Map.defaultAddress = 'Columbus, OH';
  $('#location').attr('placeholder', Map.defaultAddress);

  // styles
  var mapType = new google.maps.StyledMapType(mapStyleOptions, {name: "Derek's Style" });
  Map.mapTypes.set(MAPTYPE_ID, mapType);

  Map.gotoDefaultLocation = function() {
    Map.findAddress(Map.defaultAddress, function(){});
  }

  // geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
      Map.setCenter(pos);
      Map.setZoom(13);
    }, function() {
      Map.gotoDefaultLocation();
    });
  } else {
    // Browser doesn't support Geolocation
    Map.gotoDefaultLocation();
  }

  Map.findAddress = function(address, hollaback) {
    this.geocoder.geocode({address: address}, function(results, status) {
      var found = false;
      if (status == google.maps.GeocoderStatus.OK) {
        Map.fitBounds(results[0].geometry.viewport);
        Map.setZoom(Map.zoom + 1);
        $('#location').val('').attr('placeholder', address);
        found = true;
      } else {
        console.log("Failed to find ", address, status, results);
      }
      hollaback(found);
    });
  }

  Map.addMarker = function(position) {
    return new google.maps.Marker({
      position: position,
      map: Map,
      title: 'Example Pin'
      /* icon: this.pinImages[pinName], */
    });
  };

  $('#search').on('submit', function(e) {
    e.preventDefault();
    var address = $('#location').val();
    Map.findAddress(address, function(found) {});
  });

  google.maps.event.addListener(Map, 'click', function(e) {
    Map.addMarker(e.latLng);
  });

});

