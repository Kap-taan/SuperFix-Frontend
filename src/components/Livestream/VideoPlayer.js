import React, { useEffect, useRef } from "react";

const VideoContainer = ({ user }) => {

    const ref = useRef();

    useEffect(() => {
        user.videoTrack.play(ref.current)
    }, [])

    return (
        <div>
            <div ref={ref} style={{ height: '30rem', width: '40rem' }}>

            </div>
        </div>
    )
}

export default VideoContainer