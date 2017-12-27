import distanceFromLatLon from "../common/distanceFromLatLon";
import _ from 'lodash';

let cities;

export default (lat2, lon2, limitBy, maxMiles, orderBy) => $.get("./data/usacitiespop.json").then((res)=>{
    const json = JSON.parse(res);
    var regions = [];
    
    for (const item of json){
        const [city, region, popInt, lat1, lon1] = item;
        const distMiles = distanceFromLatLon(lat1, lon1, lat2, lon2).miles; 

        if (distMiles > maxMiles) continue;
        
        regions.push({
            city: _.capitalize(city),
            region, 
            popInt, 
            distMiles});
    };

    var sortKey = (['popInt', 'distMiles'])[orderBy];

    switch (orderBy){
        case 0:{
            return _.take(_.reverse(_.sortBy(regions, sortKey)), limitBy);
        }
        case 1:{
            return _.take(_.sortBy(regions, sortKey), limitBy);
        }
    }
});
