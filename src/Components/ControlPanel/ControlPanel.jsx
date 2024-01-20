/* eslint-disable react/prop-types */
import AgoraRTC from 'agora-rtc-sdk-ng';
import { AIDenoiserExtension } from 'agora-extension-ai-denoiser';
import { useState } from 'react';

function ControlPanel({
  clientRef,
  localVideoRef,
  localCameraTrackRef,
  localScreenTrackRef,
  localAudioTrackRef,
}) {
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  return (
    <div
      className="panel"
      style={{
        display: 'flex',
        position: 'fixed',
        left: '100px',
        bottom: '50px',
        gap: '20px',
      }}
    >
      <button
        className="btn"
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
      >
        remove noise
      </button>
      <button
        className="btn"
        style={{ display: isScreenSharing ? 'none' : 'block' }}
        onClick={async () => {
          if (localCameraTrackRef.current.muted) {
            localCameraTrackRef.current.setMuted(false);
          } else {
            localCameraTrackRef.current.setMuted(true);
          }
        }}
      >
        camera
      </button>
      <button
        className="btn"
        onClick={async () => {
          if (localAudioTrackRef.current.muted) {
            await localAudioTrackRef.current.setMuted(false);
          } else {
            await localAudioTrackRef.current.setMuted(true);
          }
        }}
      >
        mic
      </button>
      <button
        className="btn"
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
      >
        screen
      </button>
      <button
        className="btn"
        onClick={() => {
          localCameraTrackRef.current?.close();
          localCameraTrackRef.current = null;
          localScreenTrackRef.current?.close();
          localScreenTrackRef.current = null;
          localAudioTrackRef.current?.close();
          localAudioTrackRef.current = null;
          clientRef.current.leave();
        }}
      >
        leave
      </button>
    </div>
  );
}
export default ControlPanel;
