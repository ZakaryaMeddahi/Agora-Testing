import './App.css';
import { useEffect, useRef, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import VideosList from './Components/VideosList/VideosList';
import ControlPanel from './Components/ControlPanel/ControlPanel';

const options = {
  appId: import.meta.env.VITE_APP_ID,
  channel: 'test',
  token: null,
};

function App() {
  const clientRef = useRef();
  const localVideoRef = useRef();
  const localCameraTrackRef = useRef();
  const localScreenTrackRef = useRef();
  const localAudioTrackRef = useRef();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const joinChannel = async () => {
      try {
        const client = AgoraRTC.createClient({ codec: 'vp8', mode: 'rtc' });
        clientRef.current = client;
        await client.join(options.appId, options.channel, options.token);
        const localVideoTrack = await AgoraRTC.createCameraVideoTrack();
        const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        localCameraTrackRef.current = localVideoTrack;
        localAudioTrackRef.current = localAudioTrack;
        localVideoTrack.play(localVideoRef.current);
        await clientRef.current.publish([localAudioTrack, localVideoTrack]);
      } catch (error) {
        console.error(error);
      }
    };

    const listen = () => {
      clientRef.current.on('user-published', async (user, mediaType) => {
        await clientRef.current.subscribe(user, mediaType);

        if (mediaType === 'video') {
          setUsers((users) => {
            const prevUsers = users.filter((u) => u.uid !== user.uid);
            const newUsers = [...prevUsers, user];
            return newUsers;
          });
        }

        if (mediaType === 'audio') {
          user.audioTrack.play();
        }
      });

      clientRef.current.on('user-unpublished', (user) => {
        console.log(user.uid + 'has unpublished from the channel');
      });

      clientRef.current.on('user-left', (user) => {
        console.log(user.uid + 'has left the channel');
        setUsers((users) => {
          const newUsers = users.filter((u) => u.uid !== user.uid);
          return newUsers;
        });
      });
    };
    joinChannel();
    listen();
    return () => {
      clientRef.current.leave();
    };
  }, []);

  return (
    <div className="container"> 
      <video
        className="video-circle"
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
      />
      <VideosList users={users} />
      <ControlPanel
        clientRef={clientRef}
        localVideoRef={localVideoRef}
        localScreenTrackRef={localScreenTrackRef}
        localCameraTrackRef={localCameraTrackRef}
        localAudioTrackRef={localAudioTrackRef}
      />
    </div>
  );
}

export default App;
