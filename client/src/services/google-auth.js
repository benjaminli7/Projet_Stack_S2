import axios from 'axios';
import {useUserStore} from '../userStore';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Make a request to the backend to get the Google authentication URL
export const getGoogleAuthUrl = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/auth/google/url`);

    return response.data.authUrl;
  } catch (error) {
    // Handle the error
    console.error(error);
    throw error;
  }
};

export const googleAuthCallback = async (code) => {
  try {
    const userStore = useUserStore()
    const response = await axios
      .get(`${BASE_URL}/auth/google/callback?code=${code}`)
      .then((res) => {
        if (res.status === 200) {
          userStore.setUser(res.data.user);
          return res;
        } else if (res.status === 201) {
          userStore.setUser(res.data.user);
          return res;
        } else {
          console.log(res);
          return res;
        }
      });

    return response;
  } catch (error) {
    // Handle the error
    console.error(error);
    throw error;
  }
}

