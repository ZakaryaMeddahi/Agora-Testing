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
    state,
    updateSharing,
  } = value;

  const handleScreenSharing = async () => {
    if (!state.isScreenSharing) {
      const screenTrack = await AgoraRTC.createScreenVideoTrack();
      await clientRef.current.unpublish([localCameraTrackRef.current]);
      // dispatch({ type: UPDATE_SHARING, payload: { isSharing: true } });
      updateSharing(true);
      localCameraTrackRef.current.close();
      localCameraTrackRef.current = null;
      localScreenTrackRef.current = screenTrack;
      localScreenTrackRef.current.play(localVideoRef.current);
      await clientRef.current.publish([screenTrack]);
    } else {
      await clientRef.current.unpublish([localScreenTrackRef.current]);
      // dispatch({ type: UPDATE_SHARING, payload: { isSharing: false } });
      updateSharing(false);
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
