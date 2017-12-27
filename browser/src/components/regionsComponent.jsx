import React from 'react';
import TernaryComponent from './ternaryComponent';

const styles = {
    listStyle: {
        display:"inline", 
        listStyle: "none",
        padding: 0
    },

    listItemStyle: {
        display: "inline",
        margin: 2
    }
};

const RegionListItem = (props) => <li style={styles.listItemStyle}>
    <TernaryComponent
        condition={props.activeRegion && props.activeRegion.city === props.region.city}
        trueState={()=><button className="btn btn-default active">{props.region.city}, {props.region.region}</button>}
        falseState={()=><a className="btn btn-default btn-compact" 
            onClick={() => props.onRegionClicked(props.region)} 
            href="#">{props.region.city}, {props.region.region}</a>}/>
</li>;

export default (props)=> <div>
    <p>Top <span className="badge badge-info">{Math.min(props.regionLimitCount, props.regions.length)}</span> largest cities within <span className="badge badge-info">{props.maxMiles}</span> miles of you:</p> 
    <ul style={styles.listStyle}>
        {props.regions.map((region, i)=> <RegionListItem 
            key={i} 
            region={region} 
            onRegionClicked={props.onRegionClicked} 
            activeRegion={props.region}/>)}
    </ul>
</div>;