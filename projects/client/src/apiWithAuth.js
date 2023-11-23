import axios from 'axios';
import { useSelector } from 'react-redux';

const createApiWithAuth = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const token = useSelector((state) => state.auth.token);

  return axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const apiWithAuth = createApiWithAuth();

export default apiWithAuth;
