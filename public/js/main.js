import {Model} from './model.js' 
import {Views} from './views.js'


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
    console.log(vehicleClass)
    if(!departureDate){
        departureDate = new Date(); 
    } else if(!departureTime){
        departureTime = new Date().getTime(); 
    }
    
    let departureDateTime = new Date(departureDate + ' '+ departureTime).toISOString(); 
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
    Model.getTollPricing();
})

window.addEventListener('tollPricesUpdated', (event)=>{
    let allRoutes = Model.getRoutes(); 
    let routes = allRoutes.map(route =>{
        return {
            summary : route.summary, 
            price : route.maxChargeInCents/100,
            vehicleClass: Model.getVehicleClass()
        }
    })
    console.log(routes)
    Views.TollRoadsView(routes);
})


// function initAutocomplete() {
//     address1Field = document.querySelector("#source-address");
//     address2Field = document.querySelector("#destination-address");

//     // Create the autocomplete object, restricting the search predictions to
//     // addresses in the US and Canada.
//     autocomplete = new google.maps.places.Autocomplete(address1Field, {
//       fields: ["address_components", "geometry"],
//       types: ["address"],
//     });
//     address1Field.focus();
//     // When the user selects an address from the drop-down, populate the
//     // address fields in the form.
//     autocomplete.addListener("place_changed", fillInAddress);
//   }