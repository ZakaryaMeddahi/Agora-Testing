/* eslint-disable react/prop-types */
// import moreOption from '../assets/moreOption.svg';
import './ControlPanel.css';
import NoiseButton from './NoiseButton/NoiseButton';
import CameraButton from './CameraButton/CameraButton';
import LeaveButton from './LeaveButton/LeaveButton';
import MicButton from './MicButton/MicButton';
import ScreenButton from './ScreenButton/ScreenButton';

function ControlPanel() {
  return (
    <div className="panel">
      <NoiseButton />

      <CameraButton />

      <MicButton />

      <ScreenButton />

      <LeaveButton />
    </div>
  );
}
export default ControlPanel;
