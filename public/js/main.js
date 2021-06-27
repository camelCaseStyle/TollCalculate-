import {Model} from './model.js' 

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
        departureTime = new Date(); 
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