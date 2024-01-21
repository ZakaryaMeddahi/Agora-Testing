/* eslint-disable react/prop-types */
import AgoraRTC from 'agora-rtc-sdk-ng';
import { AIDenoiserExtension } from 'agora-extension-ai-denoiser';
import mic from '../../assets/mic.svg';
import micOff from '../../assets/mic-off.svg';
import Cast from '../../assets/Cast.svg';
import EndCall from '../../assets/EndCall.svg';
import videocam from '../../assets/videocam.svg';
import noise from '../../assets/noise.svg'
import videoCamOff from '../../assets/videocam_off.svg';
// import moreOption from '../assets/moreOption.svg';
import { useState } from 'react';
import './ControlPanel.css'

function ControlPanel({
  clientRef,
  localVideoRef,
  localCameraTrackRef,
  localScreenTrackRef,
  localAudioTrackRef,
}) {
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [Mic, setMic] = useState(mic);
  const [Cam, setCam] = useState(videocam);

  return (
    <div className="panel">
      <div>
        <img 
          src={noise} 
          alt="icon about remove noise"
          onClick={async () => {
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
          }} 
        />
        </div>
        <div>
          <img 
            src={Cam}
            alt="icon of video cam"  
            onClick={async () => {
              if (localCameraTrackRef.current.muted) {
                setCam(videocam);
                localCameraTrackRef.current.setMuted(false);
              } else {
                setCam(videoCamOff);
                localCameraTrackRef.current.setMuted(true);
              }
            }} 
          />
        </div>
        <div>
          <img 
            src={Mic} 
            alt="icon of mic"  
            onClick={async () => {
              if (localAudioTrackRef.current.muted) {
                console.log("On");
                setMic(mic);
                await localAudioTrackRef.current.setMuted(false);
              } else {
                console.log("Off");
                setMic(micOff);
                await localAudioTrackRef.current.setMuted(true);
              }
            }} 
          />
      </div>
      <div>
        <img 
          src={Cast} 
          alt="icon of share screen"  
          onClick={async () => {
            if (!isScreenSharing) {
              setIsScreenSharing(true);
              const screenTrack = await AgoraRTC.createScreenVideoTrack();
              await clientRef.current.unpublish([localCameraTrackRef.current]);
              localCameraTrackRef.current.close();
              localCameraTrackRef.current = null;
              localScreenTrackRef.current = screenTrack;
              localScreenTrackRef.current.play(localVideoRef.current);
              await clientRef.current.publish([screenTrack]);
            } else {
              setIsScreenSharing(false);
              await clientRef.current.unpublish([localScreenTrackRef.current]);
              localScreenTrackRef.current.close();
              localScreenTrackRef.current = null;
              const cameraTrack = await AgoraRTC.createCameraVideoTrack();
              localCameraTrackRef.current = cameraTrack;
              localCameraTrackRef.current.play(localVideoRef.current);
              await clientRef.current.publish([cameraTrack]);
            }
          }}
        />
      </div>
      <div style={{backgroundColor: '#E55454'}}>
        <img 
          src={EndCall} 
          alt="icon of end the call" 
          onClick={() => {
            localCameraTrackRef.current?.close();
            localCameraTrackRef.current = null;
            localScreenTrackRef.current?.close();
            localScreenTrackRef.current = null;
            localAudioTrackRef.current?.close();
            localAudioTrackRef.current = null;
            clientRef.current.leave();
          }} 
        />
        </div>
    </div>
  );
}
export default ControlPanel;
