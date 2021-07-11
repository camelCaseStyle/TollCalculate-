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
        applyTemplate('detailed-data', 'detailed-data-template', {route:detailedData});
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