/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';

function Video({ user }) {
  const videoRef = useRef(null);
  const [isScreenFull, setIsScreenFull] = useState(false);

  useEffect(() => {
    if (user.videoTrack) {
      console.log('****************');
      user.videoTrack.play(videoRef.current);
    }

    console.log(user);

    // if (user.audioTrack) {
    //   console.log('****************');
    //   user.audioTrack.play();
    // }

    return () => {
      if (user.videoTrack) {
        user.videoTrack.stop();
      }

      // if (user.audioTrack) {
      //   user.audioTrack.stop();
      // }
    };
  });

  return (
    <video
      className="video remote-video"
      ref={videoRef}
      autoPlay
      playsInline
      style={{
        width: isScreenFull ? '1000px' : '500px',
        height: isScreenFull ? '600px' : '300px',
      }}
      onClick={() => setIsScreenFull(!isScreenFull)}
    />
  );
}
export default Video;
