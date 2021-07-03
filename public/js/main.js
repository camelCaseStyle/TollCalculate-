import {Model} from './model.js' 
import {Views} from './views.js'
import {Util} from './util.js'

window.onload = (event)=>{
    console.log('window loaded');
    bindings(); 
}

function bindings(){
    let findTollButton = document.getElementById('find-toll');
    if(findTollButton){
        findTollButton.addEventListener('submit', calculateToll);
    }
}

function calculateToll(event){
    event.preventDefault(); 
    let sourceAddress = this.elements['source-address'].value;
    let destinationAddress = this.elements['destination-address'].value;
    let departureTime = this.elements['departure-time'].value; 
    let departureDate = this.elements['departure-date'].value; 
    let vehicleClass = this.elements['vehicle-class'].value; 
    if(!departureDate){
        let date  = new Date();
        departureDate = date.getFullYear()+'/'+date.getMonth()+'/'+date.getDay(); 
    } else if(!departureTime){
        departureTime = new Date().toTimeString(); 
    }
    let departureDateTime = new Date(departureDate.replace(/-/g, "/") + ' '+ departureTime).toISOString(); 
    let formData = {
        sourceAddress:sourceAddress, 
        destinationAddress: destinationAddress, 
        departureDateTime: departureDateTime,
        vehicleClass: vehicleClass
    }
    Model.load(formData);
}

// pre: Desintation address and source address both loaded 
// post: calculates the toll 
window.addEventListener('modelUpdated', (event)=>{
    Views.LoadingView();
    Model.getTollPricing();
})

window.addEventListener('tollPricesUpdated', (event)=>{
    let allRoutes = Model.getRoutes(); 
    let routes = allRoutes.map(route =>{
        return {
            summary : route.summary, 
            price : route.maxChargeInCents/100,
            vehicleClass: Model.getVehicleClass(),
            distance: Util.getPrettyDistance(route.distance),
            duration: Util.getPrettyTime(route.duration), 
        }
    })
    console.log(routes)
    Views.TollRoadsView(routes);
})