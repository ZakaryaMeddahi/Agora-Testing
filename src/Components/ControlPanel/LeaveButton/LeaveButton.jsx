/* eslint-disable react/prop-types */
import EndCall from '../../../assets/EndCall.svg';

function LeaveButton({
  localCameraTrackRef,
  localScreenTrackRef,
  localAudioTrackRef,
  clientRef,
}) {
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
