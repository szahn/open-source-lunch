import React from 'react';
import SpinnerComponent from './spinnerComponent';

export default (props)=> <span>{props.label} <SpinnerComponent size={1}/></span>;