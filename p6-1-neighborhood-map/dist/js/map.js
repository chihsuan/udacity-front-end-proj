!function(e){function n(e,n){n=n?n:{},mapControl.map=new google.maps.Map(document.getElementById(e),n)}function t(e,n,t){var r=this,o=new google.maps.LatLng(n.lat,n.lng),a=new google.maps.Marker({map:r.map,position:o});if(t.categories&&t.categories.length>0){var i=t.categories[0].name.toLowerCase();i.indexOf("food")>=0||i.indexOf("restaurant")>=0?a.setIcon("./images/food.jpg"):(i.indexOf("shop")>=0||i.indexOf("store")>=0)&&a.setIcon("./images/shop.png")}a.props=t,a.addListener("click",function(){r._focusAndActiveMarker(a)}),r.currentMarkers[e]=a}function r(e,n){this.map.setCenter(new google.maps.LatLng(e,n))}function o(e){this._focusAndActiveMarker(this.currentMarkers[e])}function a(n){var t=this,r=n.getPosition();t.map.panTo(r),t.map.setZoom(18),t.currentActiveMarker&&t.currentActiveMarker.setAnimation(null),n.setAnimation(google.maps.Animation.BOUNCE),t.currentActiveMarker&&t.currentActiveMarker.setIcon(),n.setIcon("http://maps.google.com/mapfiles/ms/icons/green-dot.png"),t._setStreetView(r),t.currentActiveMarker=n,t.infowindow&&t.infowindow.close();var o=p+"&lat="+r.lat()+"&lon="+r.lng();e.fetchData(o,function(e){t._showPlaceInfo(e)})}function i(e){var n=this,t=n.currentActiveMarker.props,r=t.categories[0]?t.categories[0].name:"no-category",o=t.contact.hasOwnProperty("phone")?t.contact.phone:"no-phone",a="<h4>"+t.name+"</h4><p>Category："+r+"<br>Contact phone："+o+"<br></p>";"error"!==e&&(a+="<h4>Weather</h4>",a+="<p>Temp："+e.main.temp+"<br>Humidity："+e.main.humidity+"<br>Pressure："+e.main.pressure+"<br></p>"),n.infowindow=new google.maps.InfoWindow({content:a}),n.infowindow.open(n.map,n.currentActiveMarker)}function s(e){var n=this;for(var t in n.currentMarkers)n.currentMarkers[t].setVisible(!1);e.forEach(function(e){n.currentMarkers[e.id()].setVisible(!0)})}function c(e){var n=new google.maps.StreetViewPanorama(document.getElementById("pano"),{position:{lat:e.lat(),lng:e.lng()},linksControl:!1,enableCloseButton:!1,panControl:!1});this.map.setStreetView(n)}var p="http://api.openweathermap.org/data/2.5/weather?appid=880bffc84e2e5b4832fadb69743c082e";e.mapControl={initMap:n,addMaker:t,setCenter:r,focusToMarkerById:o,filterMarkers:s,_focusAndActiveMarker:a,_showPlaceInfo:i,_setStreetView:c,currentMarkers:{},currentActiveMarker:null,infowindow:null},mapControl.initMap("map",{center:{lat:23.6,lng:120.3},zoom:14})}(window);