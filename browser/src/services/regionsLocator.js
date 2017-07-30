import distanceFromLatLon from "../common/distanceFromLatLon";
import _ from 'lodash';

let cities;

export default (lat2, lon2, limitBy, maxMiles) => $.get("./data/usacitiespop.json").then((res)=>{
    const regions = res.map((item)=>{
        const [city, region, popInt, lat1, lon1] = item;
        const distMiles = distanceFromLatLon(lat1, lon1, lat2, lon2).miles; 

        return (distMiles < maxMiles) ?  {
            city: _.capitalize(city),
            region, 
            popInt, 
            distMiles} : null
    });

    return _.take(
        _.reverse(
        _.sortBy(
        _.compact(regions), 'popInt')), limitBy);
});
