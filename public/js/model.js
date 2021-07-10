export {Model};


const Model = {
    geoCodeAPIURL: '/geoLocation',
    tollRequesURL: '/tollCalculate',
    possibleRoutesURL: '/getAllRoutes?',
    // Given an address, 
    // returns its latitude and longitude
    data: {
        sourceLocation: null,
        destinationLocation: null, 
        tollRoutes: new Map(),
        possibleRoutes: null, 
        vehicleClass: null,
        departureDateTime : null, 
    },
    load: function(formData){
        let sourceLoacation = this.getGeoCode(formData.sourceAddress);
        let destinationLocation = this.getGeoCode(formData.destinationAddress);
        Promise.all([sourceLoacation, destinationLocation]).then(values =>{
            this.data.sourceLocation = values[0].results[0];
            this.data.destinationLocation = values[1].results[0];
            this.data.vehicleClass = formData.vehicleClass || 'A'; 
            this.data.departureDateTime = formData.departureDateTime;
            fetch(this.possibleRoutesURL,{
                headers :{
                    'source': `place_id:${this.data.sourceLocation.place_id}`, 
                    'destination': `place_id:${this.data.destinationLocation.place_id}`, 
                }
            })
            .then(response =>{
                return response.json()
            }).then(data =>{
                this.data.possibleRoutes = data; 
                console.log(this.data.possibleRoutes);
                window.dispatchEvent(new CustomEvent('modelUpdated'));
            })
            
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
        // Need to get toll pricing for all routes and push to data model
        let body;
        let promises = []; 
        this.data.possibleRoutes.routes.forEach(route => {
            body = {
                'polyline': route.overview_polyline.points,
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
            promises.push(fetch(this.tollRequesURL, {
                method: 'POST', 
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(body),
            }).then(response =>{
                return response.json();
            }))
        });
        Promise.all(promises).then(tollRoutes =>{
            let i = 0;
            tollRoutes.forEach(tollRoute =>{
                this.data.tollRoutes.set(tollRoute.match.geometry, tollRoute.match);
                i += 1; 
            })
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
        return Array.from(this.data.tollRoutes.values());
    },
    getVehicleClass: function(){
        return this.data.vehicleClass;
    },
    getRoutesByPrice: function(){
        return Array.from(this.data.tollRoutes.values()).sort(comparePrice);
    },
    getRoutesByDuration: function(){
        return Array.from(this.data.tollRoutes.values()).sort(compareDuration);
    },
    getRoutesByDistance: function(){
        return Array.from(this.data.tollRoutes.values()).sort(compareDistance);
    }
}


function comparePrice(a,b){
    return a.maxChargeInCents - b.maxChargeInCents; 
}
function compareDuration(a,b){
    return a.duration - b.duration;
}
function compareDistance(a,b){
    return a.distance - b.distance; 
}
