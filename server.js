const Constants = require('./Constants.js');
require('dotenv').config()
const axios = require('axios').default;
const express = require('express');
const app = express(); 
app.listen(process.env.PORT, ()=> console.log('Server is running'));
app.use(express.static('public'));
app.use(express.json());




//ROUTES//

// Get the geocode for a given location
app.post('/geoLocation', (request, response)=>{
    axios.get(Constants.geoCodeAPIURL+`key=AIzaSyALUiYReYJjr6VgTxzfYgw7IDeMFX7KU-w&address=${request.body.address}`)
    .then(function(res){
        response.send(res.data)
    }).catch(error =>{
        console.log(error)
    })
    
})
// Get the routes and cost for the routes 
// Routes is in the body of the request
app.post('/tollCalculate', (request, response)=>{
    axios.post(Constants.tollRequesURL,request.body,{
        headers:{
            'Content-Type':'application/json',
            Authorization: `apikey pPPPcmFo0knYMcgKnY68PTeI6lOFi8LBWn5C`
        }
    }).then(res =>{
        response.send(res.data);
    }).catch(error =>{
        console.log(error);
    })
})