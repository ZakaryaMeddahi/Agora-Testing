/* eslint-disable react/prop-types */
import { useContext } from 'react';
import EndCall from '../../../assets/EndCall.svg';
import { StreamingContext } from '../../../App';

function LeaveButton() {
  const value = useContext(StreamingContext);
  const {
    localCameraTrackRef,
    localScreenTrackRef,
    localAudioTrackRef,
    clientRef,
  } = value;

  const endCall = async () => {
    localCameraTrackRef.current?.close();
    localCameraTrackRef.current = null;
    localScreenTrackRef.current?.close();
    localScreenTrackRef.current = null;
    localAudioTrackRef.current?.close();
    localAudioTrackRef.current = null;
    clientRef.current.leave();
  };

  return (
    <div style={{ backgroundColor: '#E55454' }}>
      <img src={EndCall} alt="end the call icon" onClick={endCall} />
    </div>
  );
}
export default LeaveButton;
