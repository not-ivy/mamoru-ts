import { useContext } from 'solid-js';
import AuthContext from '../../../contexts/authContext';

export default function Overview() {
  const authContext = useContext(AuthContext);

  return (
    <div>
      {authContext == null && <span class='italic block mb-4'>you are currently not signed in.</span>}
      <h1>online players:</h1>
    </div>
  );
}
