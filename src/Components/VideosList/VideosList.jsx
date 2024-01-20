import Video from '../Video/Video';

/* eslint-disable react/prop-types */
function VideosList({ users }) {
  console.log('*****************************');
  console.log('*****************************');
  console.log('*****************************');
  console.log(users);
  return (
    <>
      {users.map((user) => (
        <Video key={user.uid} user={user} />
      ))}
    </>
  );
}
export default VideosList;
