/* eslint-disable react/prop-types */
import AgoraRTC from 'agora-rtc-sdk-ng';
import { AIDenoiserExtension } from 'agora-extension-ai-denoiser';
import noise from '../../../assets/noise.svg';
import { useContext } from 'react';
import { StreamingContext } from '../../../App';

function NoiseButton() {
  const value = useContext(StreamingContext);
  const { localAudioTrackRef } = value;

  const handleNoiseSuppression = async () => {
    let denoiser = new AIDenoiserExtension({
      assetsPath: '/node_modules/agora-extension-ai-denoiser/external/',
    });

    if (!denoiser.checkCompatibility()) {
      // The extension might not be supported in the current browser. You can stop executing further code logic
      console.error('Does not support AI Denoiser!');
    }

    AgoraRTC.registerExtensions([denoiser]);
    denoiser.onloaderror = (e) => {
      console.error(e);
      processor = null;
    };
    let processor = denoiser.createProcessor();

    localAudioTrackRef.current
      .pipe(processor)
      .pipe(localAudioTrackRef.current.processorDestination);
    await processor.enable();
  };

  return (
    <div>
      <img
        src={noise}
        alt="remove noise icon"
        onClick={handleNoiseSuppression}
      />
    </div>
  );
}
export default NoiseButton;
