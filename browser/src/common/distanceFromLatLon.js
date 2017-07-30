import degreeToRadians from "./degreeToRadians";
import milesFromKilometers from "./milesFromKilometers";

export default (lat1,lon1,lat2,lon2) => {
  var R = 6371; // Radius of the earth in km
  var dLat = degreeToRadians(lat2-lat1);  // deg2rad below
  var dLon = degreeToRadians(lon2-lon1); 
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(degreeToRadians(lat1)) * Math.cos(degreeToRadians(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var km = R * c; // Distance in km
  var miles = Math.round(milesFromKilometers(km));
  
  return {
      km: km,
      miles: miles
  };
}
