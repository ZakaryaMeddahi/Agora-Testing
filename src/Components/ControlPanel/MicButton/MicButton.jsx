/* eslint-disable react/prop-types */
import { useContext, useState } from 'react';
import mic from '../../../assets/mic.svg';
import micOff from '../../../assets/mic-off.svg';
import { StreamingContext } from '../../../App';

function MicButton() {
  const value = useContext(StreamingContext);
  const { localAudioTrackRef } = value;
  const [Mic, setMic] = useState(mic);

  const handleMicrophone = async () => {
    if (localAudioTrackRef.current.muted) {
      console.log('On');
      setMic(mic);
      await localAudioTrackRef.current.setMuted(false);
    } else {
      console.log('Off');
      setMic(micOff);
      await localAudioTrackRef.current.setMuted(true);
    }
  };

  return (
    <div>
      <img src={Mic} alt="mic icon" onClick={handleMicrophone} />
    </div>
  );
}
export default MicButton;
