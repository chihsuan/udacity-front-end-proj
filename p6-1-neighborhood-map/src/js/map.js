(function(window) {

  // Open Weather API
  var WEATHER_API = 'http://api.openweathermap.org/data/2.5/weather?appid=880bffc84e2e5b4832fadb69743c082e';

  // Map Controller
  window.mapControl = {
    // Public
    initMap: initMap,
    addMaker: addMaker,
    setCenter: setCenter,
    focusToMarkerById: focusToMarkerById,
    filterMarkers: filterMarkers,

    // Private
    _focusAndActiveMarker: _focusAndActiveMarker,
    _showPlaceInfo: _showPlaceInfo,
    _setStreetView: _setStreetView,

    // Variable
    currentMarkers: {},
    currentActiveMarker: null,
    infowindow: null
  };

  // Initilize the map
  mapControl.initMap('map', { center: { lat: 23.6, lng: 120.3 }, zoom: 14 });

  /**
   * @description Initialize google map
   * @param {string} id
   * @param {object} option, see google map option...
   */
  function initMap(id, option) {
    option = option ? option : {};
    mapControl.map = new google.maps.Map(document.getElementById(id), option);
  }

  /**
  * @description Add marker to map
  * @param {string} id
  * @param {object} location (lat, lng)
  * @param {string} content, show on infowindow
  * */
  function addMaker(id, location, props) {
    var self = this;
    var myLatlng = new google.maps.LatLng(location.lat, location.lng);
    var marker = new google.maps.Marker({
      map: self.map,
      position: myLatlng
    });

    // If has & match specific category, then style the marker
    if (props.categories && props.categories.length > 0) {
      var category = props.categories[0].name.toLowerCase();

      if (category.indexOf('food') >= 0 ||
         category.indexOf('restaurant') >= 0) {
        marker.setIcon('./images/food.jpg');
      }
      else if (category.indexOf('shop') >= 0 ||
          category.indexOf('store') >= 0) {
        marker.setIcon('./images/shop.png');
      }
    }

    marker.props = props;
    marker.addListener('click', function() {
      self._focusAndActiveMarker(marker);
    });

    self.currentMarkers[id] = marker;
  }

  /**
   * @description Set Map center
   * @param {float} lat
   * @param {float} lng
   */
  function setCenter(lat, lng) {
    this.map.setCenter(new google.maps.LatLng(lat, lng));
  }

  /**
   * @description Focus to specific marker by the ID
   * @param {string} placeId
   */
  function focusToMarkerById(placeId) {
    this._focusAndActiveMarker(this.currentMarkers[placeId]);
  }

  /*
  * @description Focus to marker and open the infoWindow
  * @param {object} marker
  * */
  function _focusAndActiveMarker(marker) {
    var self = this;
    var position = marker.getPosition();

    // Pan To marker
    self.map.panTo(position);
    self.map.setZoom(18);

    // Set Animation
    if (self.currentActiveMarker) {
      self.currentActiveMarker.setAnimation(null);
    }
    marker.setAnimation(google.maps.Animation.BOUNCE);

    // Change Color
    if (self.currentActiveMarker)
      self.currentActiveMarker.setIcon();

    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');

    // Set StreatView
    self._setStreetView(position);
    self.currentActiveMarker = marker;

    // Close current infoWindow
    if (self.infowindow) {
      self.infowindow.close();
    }

    // Open info window
    var dataAPI = WEATHER_API + '&lat=' + position.lat() +
      '&lon=' + position.lng();
    window.fetchData(dataAPI, function(data) { self._showPlaceInfo(data); });
  }

  function _showPlaceInfo(weatherInfo) {
    var self = this;
    var props = self.currentActiveMarker.props;
    var category = props.categories[0] ? props.categories[0].name : 'no-category';
    var phone = props.contact.hasOwnProperty('phone') ? props.contact.phone : 'no-phone';

    var content = '<h4>' + props.name + '</h4><p>' +
      'Category：' + category + '<br>' +
      'Contact phone：' + phone + '<br></p>';

    if (weatherInfo !== 'error') {
      content += '<h4>Weather</h4>';
      content += '<p>Temp：' + weatherInfo.main.temp + '<br>' +
      'Humidity：' + weatherInfo.main.humidity + '<br>' +
      'Pressure：' + weatherInfo.main.pressure + '<br>' + '</p>';
    }

    self.infowindow = new google.maps.InfoWindow({
      content: content
    });

    self.infowindow.open(self.map, self.currentActiveMarker);
  }

  /* @description Show only the input places
   * @param {array} markers
   */
  function filterMarkers(places) {
    var self = this;
    // Hide all
    for(var placeId in self.currentMarkers) {
      self.currentMarkers[placeId].setVisible(false);
    }

    // Show only places filtered
    places.forEach(function(places) {
      self.currentMarkers[places.id()].setVisible(true);
    });
  }

  /* @description Set streetView
   * @param {object} position
   */
  function _setStreetView(position) {
    var panorama = new google.maps.StreetViewPanorama(
      document.getElementById('pano'), {
        position: {
          lat: position.lat(),
          lng: position.lng()
        },
        linksControl: false,
        enableCloseButton: false,
        panControl: false
    });
    this.map.setStreetView(panorama);
  }

})(window);
