import React, { useState } from "react";
import classes from './Home.module.css';
import LiveStream from "./LiveStream";

const Home = ({ type }) => {

    const [joined, setJoined] = useState(false);


    return (
        <div className={classes.home}>
            <h1>Virtual Call</h1>
            {!joined && <button onClick={() => setJoined(true)}>Join Room</button>}
            {joined && <LiveStream type={type} />}
        </div>
    )
}

export default Home;