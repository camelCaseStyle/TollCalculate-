// API KEY FOR TOLL API -> pPPPcmFo0knYMcgKnY68PTeI6lOFi8LBWn5C
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
        }
    },
    getGeoCode : function(address, isDestination){
        let location = {
            'address':address
        }
        fetch(this.geoCodeAPIURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(location)
        })
        .then(res => res.json())
        .then(data=>{
            if(isDestination){
                this.data.destinationLocation = data.results[0].geometry.location;
                let event  = new CustomEvent('geoCodeUpdated');
                window.dispatchEvent(event);
            }else{
                this.data.sourceLocation = data.results[0].geometry.location;
            }
            
        })
    },
    getTollPricing: function(vehicleClass, departureTime){
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
            "vehicleClass": vehicleClass,
            "vehicleClassByMotorway": {
              "LCT": vehicleClass,
              "CCT": vehicleClass,
              "ED": vehicleClass,
              "M2": vehicleClass,
              "M5": vehicleClass,
              "M7": vehicleClass,
              "SHB": vehicleClass,
              "SHT": vehicleClass,
              "M4": vehicleClass
            },
            "excludeToll": false,
            "includeSteps": false,
            "departureTime": departureTime
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
            this.data.tollRoutes = data; 
            let event  = new CustomEvent('costUpdated');
            console.log(this.data.tollRoutes)
            window.dispatchEvent(event);
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