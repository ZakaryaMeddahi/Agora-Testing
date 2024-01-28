/* eslint-disable react/prop-types */
import { useContext, useState } from 'react';
import videocam from '../../../assets/videocam.svg';
import videoCamOff from '../../../assets/videocam_off.svg';
import { StreamingContext } from '../../../App';

function CameraButton() {
  console.log(StreamingContext);
  const value = useContext(StreamingContext);
  const { localCameraTrackRef, state } = value;
  const [Cam, setCam] = useState(videocam);

  const handleCamera = () => {
    if (localCameraTrackRef.current.muted) {
      setCam(videocam);
      localCameraTrackRef.current.setMuted(false);
    } else {
      setCam(videoCamOff);
      localCameraTrackRef.current.setMuted(true);
    }
  };

  return (
    <div style={{ display: state.isScreenSharing ? 'none' : 'grid' }}>
      <img src={Cam} alt="video cam icon" onClick={handleCamera} />
    </div>
  );
}
export default CameraButton;
