/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react';

function Video({ user }) {
  const videoRef = useRef(null);

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
      className="video-circle"
      ref={videoRef}
      autoPlay
      playsInline
    />
  );
}
export default Video;
