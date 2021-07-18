export {Views};
import {Util} from "./util.js";

const Views = {
    TollRoadsView : function(data){
        let routes = data.map(route =>{
            return {
                polyline: route.geometry,
                summary : route.summary, 
                price : route.maxChargeInCents/100,
                distance: Util.getPrettyDistance(route.distance),
                duration: Util.getPrettyTime(route.duration), 
            }
        })
        applyTemplate('toll-results', 'toll-results-template', {routes:routes});
    },
    LoadingView: function(){
        applyTemplate('toll-results', 'toll-results-loading-template');
    }, 
    TollSortView: function(){
        applyTemplate('filter-options', 'filter-options-template');
    },
    DetailedView: function(detailedData){
        console.log(detailedData.tollsCharged)
        applyTemplate('detailed-data', 'detailed-data-template', {route:detailedData});
        const sydney = { lat:  -33.865143, lng: 151.209900};
        // The map, centered at Uluru
        const map = new google.maps.Map(document.getElementById("map"), {
          zoom: 12
        });
        let tollsCharged = detailedData.tollsCharged;
        tollsCharged.forEach(toll =>{
            toll.gantryVisits.forEach(gantry =>{
                new google.maps.Marker({
                    position: {lat: gantry.gantry.latitude, lng: gantry.gantry.longitude},
                    map,
                    title: gantry.gantry.gantryRef,
                  });
            })
        })
        let decodedPath =  google.maps.geometry.encoding.decodePath(detailedData.geometry);

        const route = new google.maps.Polyline({
            path: decodedPath,
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
            icons: [
                {
                    'icon':{
                        path:google.maps.SymbolPath.CIRCLE 
                    },
                    'offset': '0%'
                },
                {
                    'icon': {
                        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    },
                    'offset': '100%'
                },

            ]
        });
        route.setMap(map);
        let latLngBounds = new google.maps.LatLngBounds(
            decodedPath[0],
            decodedPath[decodedPath.length -1]
        )
        map.fitBounds(latLngBounds);

    },
    ErrorView: function(){
        applyTemplate('toll-results', 'error-template', {error:true});
    }
}
function applyTemplate (targetId, templateId, data){
    let target = document.getElementById(targetId);
    let template = Handlebars.compile(document.getElementById(templateId).textContent);
    target.innerHTML = template(data);
 }