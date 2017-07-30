export default (props) => props.condition 
    ? props.trueState ? props.trueState() : null 
    : props.falseState ? props.falseState() : null;   