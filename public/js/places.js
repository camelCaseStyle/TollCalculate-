

let defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(-33.8902, 151.1759),
    new google.maps.LatLng(-33.8474, 151.2631));

let inputs = document.getElementsByClassName('address');
let searchBoxes = [];  
for(let i = 0; i< inputs.length; i++){
    searchBoxes.push(new google.maps.places.SearchBox(inputs[i], {
        bounds: defaultBounds
    }));
}

// Listen for the event fired when the user selects a prediction and retrieve
// more details for that place.
searchBoxes.forEach(searchBox =>{
    searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        let markers = [];
        if (places.length == 0) {
          return;
        }
        // Clear out the old markers.
        markers.forEach((marker) => {
          marker.setMap(null);
        });
        markers = [];
        // For each place, get the icon, name and location.
        const bounds = new google.maps.LatLngBounds();
        places.forEach((place) => {
          if (!place.geometry || !place.geometry.location) {
            console.log("Returned place contains no geometry");
            return;
          }
          const icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25),
          };
          // Create a marker for each place.
          markers.push(
            new google.maps.Marker({
              icon,
              title: place.name,
              position: place.geometry.location,
            })
          );
      
          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
      });
})