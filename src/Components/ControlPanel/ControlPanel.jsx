/* eslint-disable react/prop-types */
// import moreOption from '../assets/moreOption.svg';
import './ControlPanel.css';
import NoiseButton from './NoiseButton/NoiseButton';
import CameraButton from './CameraButton/CameraButton';
import LeaveButton from './LeaveButton/LeaveButton';
import MicButton from './MicButton/MicButton';
import ScreenButton from './ScreenButton/ScreenButton';

function ControlPanel({
  clientRef,
  localVideoRef,
  localCameraTrackRef,
  localScreenTrackRef,
  localAudioTrackRef,
  isScreenSharing,
  setIsScreenSharing,
}) {
  return (
    <div className="panel">
      <NoiseButton localAudioTrackRef={localAudioTrackRef} />

      <CameraButton
        localCameraTrackRef={localCameraTrackRef}
        isScreenSharing={isScreenSharing}
      />

      <MicButton localAudioTrackRef={localAudioTrackRef} />

      <ScreenButton
        localVideoRef={localVideoRef}
        localCameraTrackRef={localCameraTrackRef}
        localScreenTrackRef={localScreenTrackRef}
        clientRef={clientRef}
        isScreenSharing={isScreenSharing}
        setIsScreenSharing={setIsScreenSharing}
      />

      <LeaveButton
        localCameraTrackRef={localCameraTrackRef}
        localScreenTrackRef={localScreenTrackRef}
        localAudioTrackRef={localAudioTrackRef}
        clientRef={clientRef}
      />
    </div>
  );
}
export default ControlPanel;
