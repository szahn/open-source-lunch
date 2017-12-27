import React from 'react';
import GeoLocator from './services/geoLocator';
import Header from './components/header';
import UserNavigation from './components/userNavigation';
import Footer from './components/footer';
import GitHubRibbon from './components/githubRibbon';
import RegionsNav from './components/regionsNav';
import RegionSearchForm from './components/regionSearchForm';
import TernaryComponent from './components/ternaryComponent';
import ErrorAlert from './components/errorAlert';
import RegionsLocator from './services/regionsLocator';
import GithubUserSearch from './services/githubUserSearch';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import _ from 'underscore';

const styles = {
    headerRowStyle: {background: "#eee"},
    regionRowStyle: {padding:10, fontSize: "1.2em"},
    userRowStyle: { padding: 10, background: '#eee'},
};

export default class App extends React.Component{

    constructor(){
        super();
        this.state = {
            cords: null,
            regions: null,
            orderBy: 0,
            maxRegions: 10,
            maxRegionDistanceMiles: 300,
            region: null,
            users: null,
            userPageIndex: 0,
            totalUsers:  null,
            errorMessage: null
        };

        this.onRegionClickedLocal = this.onRegionClicked.bind(this);
        this.onCloseErrorAlertClickedLocal = this.onCloseErrorAlertClicked.bind(this);
        this.onPageClickedLocal = this.onPageClicked.bind(this);
        this.onPrevPageClickedLocal = this.onPrevPageClicked.bind(this);
        this.onNextPageClickedLocal = this.onNextPageClicked.bind(this);
        this.maxRegionsChangedLocal = _.throttle(this.maxRegionsChanged.bind(this), 100);
        this.maxRegionDistanceMilesChangedLocal = _.throttle(this.maxRegionDistanceMilesChanged.bind(this), 100);
        this.orderByChangedLocal = this.orderByChanged.bind(this);
    }

    componentWillMount(){
        this.getLocation();
    }

    componentWillUpdate(nextProps, nextState){
        if (nextState.cords && nextState.cords !== this.state.cords 
            || nextState.maxRegions !== this.state.maxRegions 
            || nextState.maxRegionDistanceMiles !== this.state.maxRegionDistanceMiles
            || nextState.orderBy !== this.state.orderBy ){
            this.getRegions(nextState.maxRegions, nextState.maxRegionDistanceMiles, nextState.cords, nextState.orderBy);
        }

        if (nextState.region && nextState.region !== this.state.region){
            this.getUsers(nextState.region, nextState.userPageIndex);
        }
        else if (nextState.userPageIndex >= 0 && nextState.userPageIndex !== this.state.userPageIndex){
            this.getUsers(nextState.region, nextState.userPageIndex);            
        }
    }

    getRegions(maxRegions, maxRegionDistanceMiles, cords, orderBy){
        RegionsLocator(cords.lat, cords.lon, maxRegions, maxRegionDistanceMiles, orderBy).then((regions)=>{
            this.setState({ regions });
        }).catch((err)=>{
            this.setState({
                errorMessage: `Failed to get regions. HTTP ${err.status}: ${err.statusText}. ${err.responseText ? err.responseText : ""}`
            })
        });
    }

    getLocation(){
        GeoLocator().then((cords)=>{
            this.setState({ cords });
        });
    }

    getUsers(region, pageIndex){
        GithubUserSearch(region, pageIndex).then((searchResults)=>{
            this.setState({
                errorMessage: null,
                users: searchResults.users,
                totalUsers: searchResults.total
            });
        }).catch((err)=>{
            this.setState({
                errorMessage: `Failed to get regions. HTTP ${err.status}: ${err.statusText}. ${err.responseText ? err.responseText : ""}`
            })
        });
    }

    onRegionClicked(region) {
        this.setState({ region, userPageIndex: 0 });
    }

    onCloseErrorAlertClicked(){
        this.setState({
            errorMessage: null
        });
    }

    onPageClicked(userPageIndex, e){
        e.stopPropagation();
        e.preventDefault();
        this.setState({ userPageIndex });
        return false;
    }

    onPrevPageClicked(){
        this.setState((state)=> {
            return {userPageIndex: state.userPageIndex - 1};
        });
    }

    onNextPageClicked(){
        this.setState((state)=> {
            return {userPageIndex: 1 + state.userPageIndex};
        });
    }

    maxRegionsChanged(e){
        var value = parseInt(e.target.value, 10);
        if (!value) return;        
        this.setState({maxRegions: value});
    }

    maxRegionDistanceMilesChanged(e){
        var value = parseInt(e.target.value, 10);
        if (!value) return;        
        
        this.setState({maxRegionDistanceMiles: value});
    }

    orderByChanged(e){
        var value = parseInt(e.target.value, 10);       
        this.setState({orderBy: value});
    }

    render(){
        const {cords, region, regions, maxRegions, maxRegionDistanceMiles, users, errorMessage, totalUsers, userPageIndex} = this.state;

        return <Router>
            <div> 
                <div className="container-fluid">
                    <div className="row" style={styles.headerRowStyle}>
                        <div className="col-lg-12">
                            <Header/>
                        </div>
                    </div>
                </div>

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12">
                            <p>Contribute to open source by buying lunch for a local coder.</p>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-4">
                            <p>1. Choose a local city.</p>
                        </div>
                        <div className="col-lg-4">
                            <p>2. Pick &amp; Research a Github user</p>
                        </div>
                        <div className="col-lg-4">
                            <p>3. Hang out over lunch or coffee.</p>
                        </div>
                    </div>

                </div>

                <div className="container-fluid">
                    <div className="row" style={styles.regionRowStyle}>
                        <div className="col-lg-12">
                            <RegionSearchForm 
                                onMaxRegionsChanged={this.maxRegionsChangedLocal} 
                                maxRegions={maxRegions} 
                                onMaxRegionDistanceMilesChanged={this.maxRegionDistanceMilesChangedLocal}
                                maxRegionDistanceMiles={maxRegionDistanceMiles}
                                orderBy={this.state.orderBy}
                                onOrderByChanged={this.orderByChangedLocal}/>
                            <RegionsNav
                                cords={cords} 
                                region={region} 
                                regions={regions} 
                                onRegionClicked={this.onRegionClickedLocal} 
                                maxRegions={maxRegions} 
                                maxRegionDistanceMiles={maxRegionDistanceMiles}/>
                        </div>
                    </div>
                    
                    <div className="row" style={styles.userRowStyle}>
                        <div className="col-lg-12">
                            <TernaryComponent 
                                condition={errorMessage} 
                                trueState={()=><ErrorAlert errorMessage={errorMessage} onCloseClick={this.onCloseErrorAlertClickedLocal}/>}/>
                            <UserNavigation 
                                totalCount={totalUsers} 
                                region={region} 
                                users={users} 
                                page={userPageIndex}
                                onPageClicked={this.onPageClickedLocal}
                                onPrevPageClicked={this.onPrevPageClickedLocal}
                                onNextPageClicked={this.onNextPageClickedLocal}/>
                        </div>
                    </div>

                    <div className="row" style={styles.footerStyle}>
                        <div className="col-lg-12">
                            <Footer/>
                        </div>
                    </div>
                <GitHubRibbon/>
            </div>
            </div>
        </Router>;
    }
}
