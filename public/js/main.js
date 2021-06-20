import {Model} from './model.js' 


Model.getGeoCode("27 Merinda Avenue, Baulkham Hills",false);
Model.getGeoCode("Darling Quarter, Sydney",true);

window.addEventListener('geoCodeUpdated', ()=>{
    Model.getTollPricing('A', new Date().toISOString()); 
})

window.addEventListener('costUpdated', ()=>{
    console.log()
})