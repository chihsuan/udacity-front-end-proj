!function(e){function t(e,t){t=t?t:{},mapControl.map=new google.maps.Map(document.getElementById(e),t)}function n(t,n,r){if(!this.currentMarkers.hasOwnProperty(t)){var o=this,a=new google.maps.LatLng(n.lat,n.lng),i=new google.maps.Marker({map:o.map,position:a});if(r.categories&&r.categories.length>0){var s=r.categories[0].name.toLowerCase();s.indexOf("food")>=0||s.indexOf("restaurant")>=0?i.setIcon("./images/food.jpg"):(s.indexOf("shop")>=0||s.indexOf("store")>=0)&&i.setIcon("./images/shop.png")}i.props=r,i.addListener("click",function(){e.vm.activePlace(r.id),o._focusAndActiveMarker(i),$("#list-view").animate({scrollTop:$("#place-"+r.id).offset().top},2e3)}),o.currentMarkers[t]=i}}function r(e,t){this.map.setCenter(new google.maps.LatLng(e,t))}function o(e){this._focusAndActiveMarker(this.currentMarkers[e])}function a(t){var n=this,r=t.getPosition();n.map.panTo(r),n.map.setZoom(18),n.currentActiveMarker&&n.currentActiveMarker.setAnimation(null),t.setAnimation(google.maps.Animation.BOUNCE),n.currentActiveMarker&&n.currentActiveMarker.setIcon(),t.setIcon("http://maps.google.com/mapfiles/ms/icons/green-dot.png"),n._setStreetView(r),n.currentActiveMarker=t,n.infowindow&&n.infowindow.close();var o=p+"&lat="+r.lat()+"&lon="+r.lng();e.fetchData(o,function(e){n._showPlaceInfo(e)})}function i(e){var t=this,n=t.currentActiveMarker.props,r=n.categories[0]?n.categories[0].name:"no-category",o=n.contact.hasOwnProperty("phone")?n.contact.phone:"no-phone",a="<h4>"+n.name+"</h4><p>Category："+r+"<br>Contact phone："+o+"<br></p>";"error"!==e&&(a+="<h4>Weather</h4>",a+="<p>Temp："+e.main.temp+"<br>Humidity："+e.main.humidity+"<br>Pressure："+e.main.pressure+"<br></p>"),t.infowindow=new google.maps.InfoWindow({content:a}),t.infowindow.open(t.map,t.currentActiveMarker)}function s(e){var t=this;for(var n in t.currentMarkers)t.currentMarkers[n].setVisible(!1);e.forEach(function(e){t.currentMarkers[e.id()].setVisible(!0)})}function c(e){var t=new google.maps.StreetViewPanorama(document.getElementById("pano"),{position:{lat:e.lat(),lng:e.lng()},linksControl:!1,enableCloseButton:!1,panControl:!1});this.map.setStreetView(t)}var p="http://api.openweathermap.org/data/2.5/weather?appid=880bffc84e2e5b4832fadb69743c082e";e.mapControl={initMap:t,addMaker:n,setCenter:r,focusToMarkerById:o,filterMarkers:s,_focusAndActiveMarker:a,_showPlaceInfo:i,_setStreetView:c,currentMarkers:{},currentActiveMarker:null,infowindow:null},mapControl.initMap("map",{center:{lat:23.6,lng:120.3},zoom:14})}(window,ko);