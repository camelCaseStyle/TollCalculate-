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
        this.getGeoCode(formData.sourceAddress)
        .then(response =>{
            console.log(response)
            this.data.sourceLocation = response.results[0].geometry.location;
        })

        this.data.vehicleClass = formData.vehicleClass; 
        this.data.departureDateTime = formData.departureDateTime;

        this.getGeoCode(formData.destinationAddress)
        .then(response =>{
            this.data.destinationLocation = response.results[0].geometry.location;
            window.dispatchEvent(new CustomEvent('modelUpdated'));
        })
        

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
        this.data.tollRoutes.routes.forEach(route =>{
            console.log(route.summary )
        })
    }
}
