!function(e,o){function t(e){this.id=o.observable(e.id),this.name=o.observable(e.name),this.contact=o.observable(e.contact),this.location=o.observable(e.location),this.categories=o.observable(e.categories)}function a(){function a(e){var o=e.coords.latitude,t=e.coords.longitude,a=i+"&ll="+o+","+t;mapControl.setCenter(o,t),r(a,s)}function s(o){if(!o)return void l.status("Sorry, Foursquare has no your neighborhood data...");if("error"===o)return void l.status("Unable to connect to Foursquare...");var a=o.response.venues,r=$.map(a,function(e){return mapControl.addMaker(e.id,e.location,e),new t(e)});l.places(r),l.status("Not Found..."),e.saveToLocalStorage("neighborhood-map",o)}function c(e){e.PERMISSION_DENIED||alert("Get current position fail！"),n(a)}var l=this;l.status=o.observable("Loading..."),l.places=o.observableArray([]),l.activePlace=o.observable(""),l.showPlace=function(e){l.activePlace(e.id()),mapControl.focusToMarkerById(e.id())},l.filterInput=o.observable(""),l.filter=function(){},l.filteredPlaces=o.computed(function(){var e=l.filterInput().toLowerCase().trim();if(e){var o=l.places().filter(function(o){return o.name().toLowerCase().indexOf(e)>=0});return o=o?o:[],mapControl.filterMarkers(o),o}return l.places()}),e.getLocalStorage("neighborhood-map",s),navigator.geolocation?navigator.geolocation.getCurrentPosition(a,c):n(a)}function r(e,o){$.getJSON(e,function(e){o(e)}).fail(function(){o("error")})}function n(e){e({coords:{latitude:40.7053111,longitude:-74.258188}})}var i="https://api.foursquare.com/v2/venues/search?oauth_token=EACTJOEC3DFI4G4FHBQILJ1WVA1ZASBOIE4E5SKCO04ACVBC&v=20160323";o.applyBindings(new a);var s=$(".ui.sidebar").sidebar("setting","transition","overlay").sidebar("setting","dimPage",!1).sidebar("setting","closable",!1);$("#toggle-list").on("click",function(){var e=$(this),o="0px"===e.css("left")?"240px":0;e.animate({left:o},220),s.sidebar("toggle")}),e.fetchData=r}(window,ko);