export {Views};

const Views = {
    TollRoadsView : function(data){
        applyTemplate('toll-results', 'toll-results-template', {routes:data});
    }
}
function applyTemplate (targetId, templateId, data){
    let target = document.getElementById(targetId);
    let template = Handlebars.compile(document.getElementById(templateId).textContent);
    target.innerHTML = template(data);
 }