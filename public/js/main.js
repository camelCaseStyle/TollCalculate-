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
    let sortPrice = document.getElementById('sort-price');
    let sortDistance = document.getElementById('sort-distance');
    let sortDuration = document.getElementById('sort-duration')
    if(sortPrice) sortPrice.addEventListener('click', sortRoutes);
    if(sortDistance) sortDistance.addEventListener('click', sortRoutes);
    if(sortDuration) sortDuration.addEventListener('click', sortRoutes);
    let tollCards = document.getElementsByClassName('item');
    if(tollCards){
        for(let i = 0; i < tollCards.length; i++){
            tollCards[i].addEventListener('click', showDetailedView)
        }
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
    Views.TollSortView();
    Views.TollRoadsView(Model.getRoutes());
    Util.pageAnimations(); 
    bindings(); 
})

function sortRoutes(){ 
    switch(this.id){
        case 'sort-price':
            Views.TollRoadsView(Model.getRoutesByPrice());
            break; 
        case 'sort-distance':
            Views.TollRoadsView(Model.getRoutesByDistance());
            break; 
        case 'sort-duration':
            Views.TollRoadsView(Model.getRoutesByDuration());
            break; 
    }
}

function showDetailedView(){
    console.log(Model.getTollRouteByGeometry(this.dataset.polyline))
}