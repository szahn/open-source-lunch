import Promise from "bluebird";

export default () => new Promise((resolve, reject)=>{
    if (!('geolocation' in navigator)){
        reject();
        return;
    }

    navigator.geolocation.getCurrentPosition((pos)=>{        
        const {coords} = pos;
        resolve({lat: coords.latitude, lon: coords.longitude});
    }, (err)=>{
        reject(err);
    }, {
        enableHighAccuracy: false
    });
});