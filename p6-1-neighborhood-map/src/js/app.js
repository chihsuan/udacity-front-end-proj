(function(window, ko) {

  var FOURSQUAR_SEARCH_API = 'https://api.foursquare.com/v2/venues/search?' +
      'oauth_token=EACTJOEC3DFI4G4FHBQILJ1WVA1ZASBOIE4E5SKCO04ACVBC&v=20160323';

  /*
  * @description Repersent Place
  * @constructor
  * */
  function Place(data) {
    this.id = ko.observable(data.id);
    this.name = ko.observable(data.name);
    this.contact = ko.observable(data.contact);
    this.location = ko.observable(data.location);
    this.categories = ko.observable(data.categories);
  }

  /* @description ListView AppViewModel
  *  @constructor
  * */
  function AppViewModel() {
    var self = this;
    self.status = ko.observable('Loading...');
    self.places = ko.observableArray([]);

    // Control and active the user select
    self.activePlace = ko.observable('');
    self.showPlace = function(place) {
      self.activePlace(place.id());
      mapControl.focusToMarkerById(place.id());
    };

    // Serach view filter
    self.filterInput = ko.observable('');
    self.filter = function() {};
    // If user query then return query set by string matching,
    // Else return all places.
    self.filteredPlaces = ko.computed(function () {

      var query = self.filterInput().toLowerCase().trim();

      if(query) {
        // Filter
        var _filteredPlaces = self.places().filter(function (place) {
          return place.name().toLowerCase().indexOf(query) >= 0;
        });

        // Check _filteredPlaces is not null or undefined
        _filteredPlaces = _filteredPlaces ? _filteredPlaces : [];

        // Map filter
        mapControl.filterMarkers(_filteredPlaces);

        return _filteredPlaces;
      } else {
        return self.places();
      }
    });

    // Get data from localstorage first
    window.getLocalStorage('neighborhood-map', _onFetchCallBack);

    // If brower support geolocation, get user location, then update data
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(_onCurrentPositionCallBack, _handleLocationError);
    } else {
      _useDefaultLocation(_onCurrentPositionCallBack);
    }

    /*
    * @description GetCurrentPosition callback function
    * @param {object} locaiton
    * */
    function _onCurrentPositionCallBack(location) {
      var lat = location.coords.latitude;
      var lng = location.coords.longitude;
      var dataAPI = FOURSQUAR_SEARCH_API + '&ll='+ lat + ',' +  lng + '';
      mapControl.setCenter(lat, lng);
      fetchData(dataAPI, _onFetchCallBack);
    }

    /*
    * @description FetchData callback function
    * @param {object} data
    * */
    function _onFetchCallBack(data) {
      // No data or error occurs...
      if (!data) {
        self.status('Sorry, Foursquare has no your neighborhood data...');
        return;
      } else if (data === 'error') {
        self.status('Unable to connect to Foursquare...');
        return;
      }

      var venues = data.response.venues;
      var mappedPlaces = $.map(venues, function(item) {
        mapControl.addMaker(item.id, item.location, item);
        return new Place(item);
      });

      self.places(mappedPlaces);
      self.status('Not Found...');
      window.saveToLocalStorage('neighborhood-map', data);
    }

    /*
    * @description Handle Location Error from HTML5 geo API
    * @param {object} error
    * */
    function _handleLocationError(error) {
      if (!error.PERMISSION_DENIED) {
        alert('Get current position fail！');
      }
      _useDefaultLocation(_onCurrentPositionCallBack);
    }
  }

  /* @description Fetch data from foursquare
   * @param {string} dataAPI
   */
  function fetchData(dataAPI, cb) {
    // Fetch data
    $.getJSON(dataAPI, function(data) {
      cb(data);
    // Error Handle...
    }).fail(function(response) {
      cb('error');
    });
  }

  function _useDefaultLocation(cb) {
    // User New York position
    cb({
      coords: {
        latitude: 40.7053111,
        longitude: -74.258188
    }});
  }

  ko.applyBindings(new AppViewModel());

  /* Sidebar setting */
  var sidebar = $('.ui.sidebar')
    .sidebar('setting', 'transition', 'overlay')
    .sidebar('setting', 'dimPage', false)
    .sidebar('setting', 'closable', false);

  /* Toggle sidebar when toggle-list div onclick  */
  $('#toggle-list').on('click', function() {
    var self = $(this);
    var newLeft = self.css('left') === '0px' ? '240px' : 0;

    self.animate({ left: newLeft }, 220);
    sidebar.sidebar('toggle');
  });

  window.fetchData = fetchData;
})(window, ko);
