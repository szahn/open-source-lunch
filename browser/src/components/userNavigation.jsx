import React from 'react';
import TernaryComponent from './ternaryComponent';
import UserPagination from './userPagination';
import GitHubUsersComponent from './githubUsersComponent';

export default (props) => <div className="container-fluid">
    <div className="row col-lg-12">
        <TernaryComponent 
            condition={props.region}
            trueState={()=><p>{props.totalCount} Open Source Contributers in {props.region.city}</p>}
            falseState={()=><span className="alert alert-warning">Please select a city.</span>}/>
    </div>
    <div className="row col-lg-12">
        <TernaryComponent 
            condition={props.users}
            trueState={()=><div>
                <GitHubUsersComponent users={props.users}/>
                <TernaryComponent 
                    condition={props.totalCount > 100}
                    trueState={() => <UserPagination 
                        page={props.page} 
                        totalCount={props.totalCount} 
                        onPageClicked={props.onPageClicked}
                        onPrevPageClicked={props.onPrevPageClicked}
                        onNextPageClicked={props.onNextPageClicked}/>}/>            
            </div>}
            falseState={()=><span className="alert alert-warning">No users available.</span>}/>
    </div>
</div>