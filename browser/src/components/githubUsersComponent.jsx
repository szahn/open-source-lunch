const styles = {
    listStyle: {
        display:"inline", 
        listStyle: "none",
        padding: 0,
        width: "100%",
        overflow:"hidden"
    },

    listItemStyle: {
        display: "inline",
        margin: 2,
        float:"left"
    },

    containerStyle:{

    },

    userContainerStyle: {
        height: "auto",
        display: "inline-block",
        padding: 4,
        margin: 0,
        fontSize: "1.2em",

        minWidth: 120,        
        maxWidth: 120,        
        width: 120,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"

    }
};

const GitHubUserLink = (props)=> <li style={styles.listItemStyle}>
    <a href={`https://github.com/${props.user.name}`} target="_blank">
        <div style={styles.userContainerStyle} className="user-list-item" alt={props.user.name}>
            <div style={{background: `url(${props.user.imageUrl}.png&size=40)`, borderRadius: "50%", width:40, height:40, display: "inline-block", verticalAlign: "middle", margin: 2}}/>
            {props.user.name}
        </div>
    </a>
</li>;

export default (props)=> <div style={styles.containerStyle}>
    <p>Most popular users with at least 1 repository and follower:</p>
    <ul style={styles.listStyle}>
        {props.users.map((user)=> <GitHubUserLink key={user.name} user={user}/>)}
    </ul>
</div>