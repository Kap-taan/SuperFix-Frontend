import React from 'react';
import classes from './NotFound.module.css';

const NotFound = () => {
    return (
        <div className={classes.error}>
            <h2>Page Not Found 404</h2>
            <a href="/"><button>Go Back to Home</button></a>
        </div>
    )
}

export default NotFound;