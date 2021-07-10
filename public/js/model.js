export {Model};


const Model = {
    geoCodeAPIURL: '/geoLocation',
    tollRequesURL: '/tollCalculate',
    // Given an address, 
    // returns its latitude and longitude
    data: {
        sourceLocation: {
            lat: null,
            lng: null
        },
        destinationLocation:{
            lat: null, lng:null 
        },
        tollRoutes: {
            routes:null
        },
        vehicleClass: null,
        departureDateTime : null, 
    },
    load: function(formData){
        let sourceLoacation = this.getGeoCode(formData.sourceAddress);
        let destinationLocation = this.getGeoCode(formData.destinationAddress);
        Promise.all([sourceLoacation, destinationLocation]).then(values =>{
            this.data.sourceLocation = values[0].results[0].geometry.location;
            this.data.destinationLocation = values[1].results[0].geometry.location;
            this.data.vehicleClass = formData.vehicleClass || 'A'; 
            this.data.departureDateTime = formData.departureDateTime;
            window.dispatchEvent(new CustomEvent('modelUpdated'));
        });

    },
    getGeoCode : function(address){
        let location = {
            'address':address
        }
        return fetch(this.geoCodeAPIURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(location)
        }).then(response => response.json())
    },
    getTollPricing: function(){
        
        let body = {
            "origin": {
              "lat": this.data.sourceLocation.lat, 
              "lng": this.data.sourceLocation.lng,  
              "name": "string"
            },
            "destination": {
              "lat": this.data.destinationLocation.lat,
              "lng": this.data.destinationLocation.lng,
              "name": "string"
            },
            "vehicleClass": this.data.vehicleClass,
            "vehicleClassByMotorway": {
              "LCT": this.data.vehicleClass,
              "CCT": this.data.vehicleClass,
              "ED": this.data.vehicleClass,
              "M2": this.data.vehicleClass,
              "M5": this.data.vehicleClass,
              "M7": this.data.vehicleClass,
              "SHB": this.data.vehicleClass,
              "SHT": this.data.vehicleClass,
              "M4": this.data.vehicleClass
            },
            "excludeToll": false,
            "includeSteps": false,
            "departureTime": this.data.departureDateTime
          }
          console.log(body)
        fetch(this.tollRequesURL, {
            method: 'POST', 
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(body),
        }).then(response =>{
            return response.json();
        }).then(data =>{
            this.data.tollRoutes = data.routes; 
            console.log(this.data.tollRoutes)
            window.dispatchEvent(new CustomEvent('tollPricesUpdated'));
        })
    },
    getLocationLat : function(){
        return this.data.location.lat; 
    }, 
    getLocationLong: function(){
        return this.location.lng; 
    },
    getRoutes: function(){
        console.log(this.data.tollRoutes)
        return this.data.tollRoutes;
    },
    getVehicleClass: function(){
        return this.data.vehicleClass;
    },
    getRoutesByPrice: function(){
        return this.data.tollRoutes.sort(comparePrice);
    },
    getRoutesByDuration: function(){
        return this.data.tollRoutes.sort(compareDuration);
    },
    getRoutesByDistance: function(){
        return this.data.tollRoutes.sort(compareDistance);
    }
}


function comparePrice(a,b){
    return b.maxChargeInCents - a.maxChargeInCents; 
}
function compareDuration(a,b){
    return b.duration - a.duration;
}
function compareDistance(a,b){
    return b.distance - a.distance; 
}
