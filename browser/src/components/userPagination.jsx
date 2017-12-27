import React from 'react';

const styles = {
    navContainerStyle: {display: "inline-block", width: "100%"}    
};

const upperBoundPageCount = (total) => Math.ceil(total / 100);

export default (props) => <div className="clearfix" style={styles.navContainerStyle}>
    <ul className="pagination">
        <li className={props.page > 0 ? null : "disabled"}><a onClick={props.onPrevPageClicked} href="#">Prev</a></li>
        {_.range(0, upperBoundPageCount(props.totalCount)).map(page => 
            <li onClick={(e) => props.onPageClicked(page, e)} key={page} className={page === props.page ? "active" : null}><a href="#">{1 +page}</a></li>)}
        <li className={props.page === Math.ceil(props.totalCount / 100) ? "disabled" : null}><a onClick={props.onNextPageClicked} href="#">Next</a></li>
    </ul>
</div>