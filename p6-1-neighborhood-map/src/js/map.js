/* Display the map view by using Google map API
 * Support the markers manipulation functions
* */

(function(window, ko) {

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
    isGoogleMapLoad: isGoogleMapLoad,

    // Private
    _focusAndActiveMarker: _focusAndActiveMarker,
    _showPlaceInfo: _showPlaceInfo,
    _setStreetView: _setStreetView,

    // Variable
    currentMarkers: {},
    currentActiveMarker: null,
    infowindow: null
  };

  window.initMap = initMap;
  window.handleMapError = handleMapError;

  /**
   * @description Initialize google map
   */
  function initMap() {
    mapControl.map = new google.maps.Map(document.getElementById('map'), {
      center: window.userLocation,
      zoom: 14
    });
    mapControl.bounds = new google.maps.LatLngBounds();
  }

  /**
  * @description Add marker to map
  * @param {string} id
  * @param {object} location (lat, lng)
  * @param {string} content, show on infowindow
  * */
  function addMaker(id, location, props) {
    if (this.currentMarkers.hasOwnProperty(id))
      return;

    var self = this;
    var myLatlng = new google.maps.LatLng(location.lat, location.lng);
    var marker = new google.maps.Marker({
      map: self.map,
      position: myLatlng
    });
    self.bounds.extend(myLatlng);

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
      else if (category.indexOf('hotel') >= 0) {
        marker.setIcon('./images/hotel.png');
      }
      else if (category.indexOf('hospital') >= 0 ||
            category.indexOf('drugstore') >= 0) {
        marker.setIcon('./images/hospital.png');
      }
      else if (category.indexOf('school') >= 0 ||
            category.indexOf('university') >= 0 ||
            category.indexOf('college') >= 0) {
        marker.setIcon('./images/school.png');
      }
    }

    marker.props = props;
    marker.addListener('click', function() {
      window.vm.activePlace(props.id);
      self._focusAndActiveMarker(marker);
      $('.list-view').animate({
          scrollTop: $("#place-"+props.id).offset().top
      }, 2000);
    });

    self.currentMarkers[id] = marker;
  }

  /**
   * @description Set Map center
   * @param {float} lat
   * @param {float} lng
   */
  function setCenter(lat, lng) {
    if (!isGoogleMapLoad()) {
      self.center = center;
      return;
    }
    var center = new google.maps.LatLng(lat, lng);
    this.map.setCenter(center);
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

    if (weatherInfo) {
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
    if (!mapControl.isGoogleMapLoad())
      return;

    var self = this;
    // Hide all
    for(var placeId in self.currentMarkers) {
      self.currentMarkers[placeId].setVisible(false);
    }

    // Show only places filtered
    places.forEach(function(places) {
      if (self.currentMarkers.hasOwnProperty(places.id()))
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

  /*
   * @description Handle load google map error
   */
  function handleMapError() {
    alert('Google Map cannot be load！');
  }

  /*
   * @description Check google map has been loaded
   */
  function isGoogleMapLoad() {
    return typeof google !== 'undefined';
  }

})(window, ko);
