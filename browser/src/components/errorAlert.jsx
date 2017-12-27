import React from 'react';

export default (props) => <div className="alert alert-danger" role="alert">
    <button type="button" className="close" aria-label="Close" onClick={props.onCloseClick}>
        <span aria-hidden="true">&times;</span>
    </button>
    {props.errorMessage}
</div>;