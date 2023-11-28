import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

function UserRoute({ children, ...rest }) {
  const profile = useSelector((state) => state.auth.profile);

  if (!profile || !profile.role) {
    return <Navigate to="/" />;
  }

  return profile.role === 'user' ? <Outlet /> : <Navigate to="/" />;
}

export default UserRoute;
