import React from 'react';
import GeoLocator from './services/geoLocator';
import LocationComponent from './components/locationComponent';
import RegionsComponent from './components/regionsComponent';
import RegionsLocator from './services/regionsLocator';
import GithubUserSearch from './services/githubUserSearch';
import GitHubUsersComponent from './components/githubUsersComponent';
import SpinnerComponent from './components/spinnerComponent';
import TernaryComponent from './components/ternaryComponent';

const styles = {
    headerRowStyle: {background: "#eee"},
    headerStyle:{padding: 10},
    regionRowStyle: {padding:10, fontSize: "1.2em"},
    userRowStyle: { padding: 10},
    footerStyle: {marginTop: 20},
    navContainerStyle: {display: "inline-block", width: "100%"}    
}

const Header = () => <div>
    <h1 style={styles.headerStyle}>Open Source Lunch</h1>
</div>;

const ActivityLabel = (props)=> <span>{props.label} <SpinnerComponent size={1}/></span>;

const RegionsNav = (props) => <div>
    
    <TernaryComponent 
        condition={props.cords} 
        trueState={()=><LocationComponent cords={props.cords}/>}
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
</div>

const GitHubUserPagination = (props) => <div className="clearfix" style={styles.navContainerStyle}>
    <ul className="pagination">
        <li className={props.page > 0 ? null : "disabled"}><a onClick={props.onPrevPageClicked} href="#">Prev</a></li>
        {_.range(0, Math.ceil(props.totalCount / 100)).map((page) => 
            <li onClick={() => props.onPageClicked(page)} key={page} className={page === props.page ? "active" : null}><a href="#">{1 +page}</a></li>)}
        <li className={props.page === Math.ceil(props.totalCount / 100) ? "disabled" : null}><a onClick={props.onNextPageClicked} href="#">Next</a></li>
    </ul>
</div>;

const GitHubUsersNav = (props) => <div>
    <TernaryComponent 
        condition={props.region}
        trueState={()=><h3>{props.totalCount} Open Source Contributers in {props.region.city}</h3>}/>
    <TernaryComponent 
        condition={props.users}
        trueState={()=><div>
            <GitHubUsersComponent users={props.users}/>
            <TernaryComponent 
                condition={props.totalCount > 100}
                trueState={() => <GitHubUserPagination 
                    page={props.page} 
                    totalCount={props.totalCount} 
                    onPageClicked={props.onPageClicked}
                    onPrevPageClicked={props.onPrevPageClicked}
                    onNextPageClicked={props.onNextPageClicked}/>}/>            
        </div>}
        falseState={()=><div><span className="alert alert-warning">No users available. Please select a city.</span></div>}/>
</div>

const Footer = () => <div>
    <p>Created by <a href="http://stuartzahn.net" target="_blank">Stuart Zahn</a> in React and VSCode.</p>
</div>

const GitHubRibbon = () => <a href="https://github.com/you">
    <img style={{position: "absolute", top: 0, right: 0, border: 0}} 
        src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67" 
        alt="Fork me on GitHub" 
        data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"/>
</a>;

const ErrorAlert = (props)=> <div className="alert alert-danger" role="alert">
    <button type="button" className="close" aria-label="Close" onClick={props.onCloseClick}>
        <span aria-hidden="true">&times;</span>
    </button>
    {props.errorMessage}
</div>;

export default class App extends React.Component{

    constructor(){
        super();
        this.state = {
            cords: null,
            regions: null,
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
    }

    componentWillMount(){
        this.getLocation();
    }

    componentWillUpdate(nextProps, nextState){
        if (nextState.cords && nextState.cords !== this.state.cords){
            this.getRegions(nextState.cords);
        }

        if (nextState.region && nextState.region !== this.state.region){
            this.getUsers(nextState.region, nextState.userPageIndex);
        }
        else if (nextState.userPageIndex >= 0 && nextState.userPageIndex !== this.state.userPageIndex){
            this.getUsers(nextState.region, nextState.userPageIndex);            
        }
    }

    getRegions(cords){
        const {maxRegions, maxRegionDistanceMiles} = this.state;
        RegionsLocator(cords.lat, cords.lon, maxRegions, maxRegionDistanceMiles).then((regions)=>{
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

    onPageClicked(userPageIndex){
        this.setState({ userPageIndex });
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

    render(){
        const {cords, region, regions, maxRegions, maxRegionDistanceMiles, users, errorMessage, totalUsers, userPageIndex} = this.state;

        return <div className="container-fluid">
            <div className="row" style={styles.headerRowStyle}>
                <div className="col-lg-12">
                    <Header/>
                </div>
            </div>

            <div className="row" style={styles.regionRowStyle}>
                <div className="col-lg-12">
                    <div className="well">
                        <p>Contribute to open source by buying lunch for a local coder. Select a nearby US city to view GitHub developers nearby and show your support for them by buying them lunch.</p>
                    </div>
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
                    <GitHubUsersNav 
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
        </div>;
    }
}
