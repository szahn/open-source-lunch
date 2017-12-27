import React from 'react';
import TernaryComponent from './ternaryComponent';
import ActivityLabel from './activityLabel';
import RegionsComponent from './regionsComponent';

export default (props) => <div>

<TernaryComponent 
    condition={props.cords} 
    trueState={()=>null}
    falseState={()=><ActivityLabel label="Finding your location..."/>}/>

<TernaryComponent 
    condition={props.regions}
    trueState={()=><RegionsComponent 
        regions={props.regions} 
        regionLimitCount={props.maxRegions} 
        maxMiles={props.maxRegionDistanceMiles}
        onRegionClicked={props.onRegionClicked}
        region={props.region}/>}
    falseState={()=><TernaryComponent
        condition={props.cords}
        trueState={()=><ActivityLabel label="Finding nearby cities..."/>}
    />}/>
</div>;