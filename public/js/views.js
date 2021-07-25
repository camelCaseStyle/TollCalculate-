export {Views};
import {Util} from "./util.js";

const Views = {
    MainContentView: function(data){
        applyTemplate('main-content', 'main-content-template', {routes:data});
    },
    AboutContentView: function(data){
        applyTemplate('main-content', 'about-content-template', {routes:data});
    },
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
        $(document).ready(function() {
            $('.ui.dropdown').dropdown();
        });
        $('.message .close')
        .on('click', function() {
          $(this)
            .closest('.message')
            .transition('fade');
        });
    },
    DetailedView: function(detailedData){
        console.log(detailedData.tollsCharged)
        applyTemplate('detailed-data', 'detailed-data-template', {tollsCharged:detailedData.tollsCharged});
        const map = new google.maps.Map(document.getElementById("map"), {
          zoom: 12
        });
        let tollsCharged = detailedData.tollsCharged;
        tollsCharged.forEach((toll,j) =>{
            toll.gantryVisits.forEach((gantry, i) =>{
                console.log(i, j)
                const marker = new google.maps.Marker({
                    position: {lat: gantry.gantry.latitude, lng: gantry.gantry.longitude},
                    map,
                    label: `${j+i+1}`,
                });
                marker.addListener("click", () => {
                    new google.maps.InfoWindow({
                        content: `${gantry.gantry.gantryName}, ${gantry.gantry.gantryRef}`,
                    }).open({
                      anchor: marker,
                      map,
                      shouldFocus: false,
                    });
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