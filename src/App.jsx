import './App.css';
import { createContext, useEffect, useReducer, useRef } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import VideosList from './Components/VideosList/VideosList';
import ControlPanel from './Components/ControlPanel/ControlPanel';
import {
  ADD_USER,
  REMOVE_USER,
  UPDATE_SCREEN,
  UPDATE_SHARING,
} from './actions';
import reducer from './reducer';

export const StreamingContext = createContext();

const defaultState = {
  users: [],
  isScreenSharing: false,
  isScreenFull: false,
};

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
  // const [users, setUsers] = useState([]);
  // const [isScreenSharing, setIsScreenSharing] = useState(false);
  // const [isScreenFull, setIsScreenFull] = useState(false);
  const [state, dispatch] = useReducer(reducer, defaultState);

  const addUser = (user) => {
    dispatch({ type: ADD_USER, payload: { user } });
  };

  const removeUser = (uid) => {
    dispatch({ type: REMOVE_USER, payload: { uid } });
  };

  const updateSharing = (isSharing) => {
    dispatch({
      type: UPDATE_SHARING,
      payload: { isSharing },
    });
  };

  const updateScreen = () => {
    dispatch({
      type: UPDATE_SCREEN,
      payload: { isSharing: !state.isScreenFull },
    });
  };

  useEffect(() => {
    const joinChannel = async () => {
      try {
        const client = AgoraRTC.createClient({ codec: 'vp8', mode: 'rtc' });
        clientRef.current = client;
        await client.join(options.appId, options.channel, options.token);
        const localVideoTrack = await AgoraRTC.createCameraVideoTrack({});
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
          // setUsers((users) => {
          //   const prevUsers = users.filter((u) => u.uid !== user.uid);
          //   const newUsers = [...prevUsers, user];
          //   return newUsers;
          // });
          addUser(user);
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
        // setUsers((users) => {
        //   const newUsers = users.filter((u) => u.uid !== user.uid);
        //   return newUsers;
        // });
        removeUser(user.uid);
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
        className={state.isScreenSharing ? 'video local-video' : 'video'}
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: state.isScreenFull ? '1000px' : '500px',
          height: state.isScreenFull ? '600px' : '300px',
        }}
        onClick={() => updateScreen()}
      />
      <VideosList users={state.users} />
      <StreamingContext.Provider
        value={{
          clientRef,
          localVideoRef,
          localScreenTrackRef,
          localCameraTrackRef,
          localAudioTrackRef,
          state,
          updateSharing,
        }}
      >
        <ControlPanel />
      </StreamingContext.Provider>
    </div>
  );
}

export default App;
