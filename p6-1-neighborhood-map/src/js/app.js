/* Fetching Data from foursquare and display the Listivew
 * Using Knockout.js to control state change
* */

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
    var category = data.categories[0] ? data.categories[0].name : '';
    this.category = ko.observable(category);
  }

  /* @description ListView AppViewModel
  *  @constructor
  * */
  function AppViewModel() {
    var self = this;
    self.status = ko.observable('Loading...');
    self.places = ko.observableArray([]);
    self.toggleMenu = function() {
      if (self.displayMenu())
        self.displayMenu(false);
      else
        self.displayMenu(true);
      //$('.toggle-list').animate({ left: 0 }, 220);
      //sidebar.sidebar('toggle');
    };
    self.displayMenu = ko.observable(true);

    // Control and active the user select
    self.activePlace = ko.observable('');
    self.showPlace = function(place) {
      self.activePlace(place.id());
      mapControl.focusToMarkerById(place.id());
    };

    // Serach view filter
    self.filterInput = ko.observable('');
    self.categoryInput = ko.observable('');
    self.filter = function() {};
    // If user query then return query set by string matching,
    // Else return all places.
    self.filteredPlaces = ko.computed(function () {

      var query = self.filterInput().toLowerCase().trim();
      var categoryQuery = self.categoryInput().toLowerCase().trim();

      if(query || categoryQuery) {
        // Filter
        var _filteredPlaces = self.places().filter(function (place) {
          return (query && place.name().toLowerCase().indexOf(query) >= 0) ||
            (categoryQuery && place.category().toLowerCase().indexOf(categoryQuery) >= 0);
        });

        // Check _filteredPlaces is not null or undefined
        _filteredPlaces = _filteredPlaces ? _filteredPlaces : [];

        // Map filter
        mapControl.filterMarkers(_filteredPlaces);

        return _filteredPlaces;
      } else {
        mapControl.filterMarkers(self.places());

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
    function _onCurrentPositionCallBack(position) {
      var userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var dataAPI = FOURSQUAR_SEARCH_API + '&ll='+ userLocation.lat + ',' +  userLocation.lng + '';
      fetchData(dataAPI, _onFetchCallBack);
    }

    /*
    * @description FetchData callback function
    * @param {object} data
    * */
    function _onFetchCallBack(data) {
      // No data or error occurs...
      if (!data)  {
        self.status('Unable to connect to Foursquare...');
        return;
      }
      else if (!data.response || !data.response.venues ||
               data.response.venues.length === 0) {
        self.status('Sorry, Foursquare has no your neighborhood data...');
        return;
      }

      var venues = data.response.venues;
      var mappedPlaces = $.map(venues, function(item) {
        // Check google map status
        if (mapControl.isGoogleMapLoad()) {
          mapControl.addMaker(item.id, item.location, item);
        }
        else {
          setTimeout(function() {
            if (mapControl.isGoogleMapLoad())
              mapControl.addMaker(item.id, item.location, item);
          }, 1000);
        }

        return new Place(item);
      });

      if (mapControl.map)
        mapControl.map.fitBounds(mapControl.bounds);
      else
        setTimeout(function() {
          mapControl.map.fitBounds(mapControl.bounds);
        }, 1000);

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
      if (!data) {
        data = [];
      }
      cb(data);
    // Error Handle...
    }).fail(function(response) {
      cb(null);
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

  // Animated transitions custom binfing for Sidebar
  ko.bindingHandlers.sidebarVisible = {
    init: function(element, valueAccessor) {
      var value = valueAccessor();
      // Initially set the element to be instantly visible/hidden depending on the value
      $(element).toggle(ko.unwrap(value));
    },
    update: function(element, valueAccessor) {
      var value = valueAccessor();
      ko.unwrap(value) ? $(element).animate({ left: 0 }) : $(element).animate({ left: '-240px' });
    }
  };

  // Animated transitions custom binfing for hamberger icon
  ko.bindingHandlers.slideIcon = {
    init: function(element, valueAccessor) {
      var value = valueAccessor();
      // Initially set the element to be instantly visible/hidden depending on the value
      $(element).toggle(ko.unwrap(value));
    },
    update: function(element, valueAccessor) {
      var value = valueAccessor();
      ko.unwrap(value) ? $(element).animate({ left: '240px' }) : $(element).animate({ left: 0 });
    }
  };

  window.fetchData = fetchData;
  window.vm = new AppViewModel();
  ko.applyBindings(vm);

})(window, ko);
