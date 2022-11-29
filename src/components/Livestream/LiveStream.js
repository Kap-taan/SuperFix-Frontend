import React, { useEffect, useState } from "react";
import AgoraRTC from 'agora-rtc-sdk-ng'
import classes from './Livestream.module.css';
import VideoContainer from "./VideoPlayer";
import { useNavigate, useParams } from "react-router-dom";

const APP_ID = '89d5df717bdf46a3a673653db00fadfe'

const client = AgoraRTC.createClient({
    mode: 'rtc',
    codec: 'vp8'
})

const LiveStream = ({ type, id }) => {

    let CHANNEL;
    const { idd } = useParams();
    if (type === 'mechanic') {
        CHANNEL = id
    } else if (type === 'client') {
        CHANNEL = idd;
    }

    console.log(CHANNEL)

    const [users, setUsers] = useState([]);
    const [tracks, setTracks] = useState([]);

    const navigate = useNavigate();

    console.log(type);

    const handleUserJoined = async (user, mediaType) => {
        await client.subscribe(user, mediaType);

        if (mediaType === 'video') {
            setUsers((prevUsers) => [...prevUsers, user])
        }

        if (mediaType === 'audio') {
            // user.audioTrack.play()
        }
    }

    const handleUserLeft = (user) => {
        setUsers((prevUsers) => {
            return prevUsers.filter(u => u.uid !== user.uid);
        })
    }

    useEffect(() => {
        client.on('user-published', handleUserJoined)
        client.on('user-left', handleUserLeft)

        console.log('i m m m')

        if (type === 'client') {
            console.log('I m ehere')
            client.join(APP_ID, CHANNEL, null, null)
                .then((uid) =>
                    // Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(), uid])
                    client.publish([])
                )
        } else {
            client.join(APP_ID, CHANNEL, null, null)
                .then((uid) =>
                    Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(), uid])
                )
                .then(([tracks, uid]) => {
                    const [audioTrack, videoTrack] = tracks;
                    setTracks(tracks);
                    // setUsers((prevUsers) => [...prevUsers, {
                    //     uid,
                    //     videoTrack
                    // }])
                    client.publish(tracks);
                })
        }

        return () => {
            for (let localTrack of tracks) {
                localTrack.stop();
                localTrack.close()
            }
            client.off('user-published', handleUserJoined)
            client.off('user-left', handleUserLeft)
            client.unpublish(tracks).then(() => client.leave())
        }



    }, [])

    const clickHandler = () => {
        navigate('/client/dashboard')
    }

    return (
        <>
            {type === 'client' && <div className={classes.livestream}>
                {type === 'client' && users && users.map((user) => (
                    <>
                        <VideoContainer key={user.uid} user={user} />
                    </>
                ))}
                <button onClick={clickHandler}>Go Back</button>
            </div>}
        </>
    )
}

export default LiveStream