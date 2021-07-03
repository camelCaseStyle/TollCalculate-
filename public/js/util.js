export {Util}
const Util ={
    getPrettyTime: function(timeInSeconds){
        let seconds = parseInt(timeInSeconds, 10);
        let minutes = seconds/60;
        let hours; 
        if(minutes > 60){
            hours = minutes/60; 
        }
        if(hours){
            return `${Number.parseFloat(hours).toFixed(0)} h ${Number.parseFloat(minutes).toFixed(0)} m`;
        }else{
            return `${Number.parseFloat(minutes).toFixed(0)} min`;
        }
    },
    getPrettyDistance: function(distanceInMeters){
        let meters = parseInt(distanceInMeters, 10);
        return `${Number.parseFloat(meters/1000).toFixed(2)} KM`; 
    }
}