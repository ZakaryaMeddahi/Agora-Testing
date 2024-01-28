/* eslint-disable react/prop-types */
import AgoraRTC from 'agora-rtc-sdk-ng';
import Cast from '../../../assets/Cast.svg';
import { useContext } from 'react';
import { StreamingContext } from '../../../App';

function ScreenButton() {
  const value = useContext(StreamingContext);
  const {
    localVideoRef,
    localCameraTrackRef,
    localScreenTrackRef,
    clientRef,
    isScreenSharing,
    setIsScreenSharing,
  } = value;

  const handleScreenSharing = async () => {
    if (!isScreenSharing) {
      const screenTrack = await AgoraRTC.createScreenVideoTrack();
      await clientRef.current.unpublish([localCameraTrackRef.current]);
      setIsScreenSharing(true);
      localCameraTrackRef.current.close();
      localCameraTrackRef.current = null;
      localScreenTrackRef.current = screenTrack;
      localScreenTrackRef.current.play(localVideoRef.current);
      await clientRef.current.publish([screenTrack]);
    } else {
      await clientRef.current.unpublish([localScreenTrackRef.current]);
      setIsScreenSharing(false);
      localScreenTrackRef.current.close();
      localScreenTrackRef.current = null;
      const cameraTrack = await AgoraRTC.createCameraVideoTrack({});
      localCameraTrackRef.current = cameraTrack;
      localCameraTrackRef.current.play(localVideoRef.current);
      await clientRef.current.publish([cameraTrack]);
    }
  };

  return (
    <div>
      <img src={Cast} alt="screen sharing icon" onClick={handleScreenSharing} />
    </div>
  );
}
export default ScreenButton;
