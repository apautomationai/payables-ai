import axios from "axios";
import { getCookie } from 'cookies-next';
// 1. Create the Axios instance with a base configuration.
// The baseURL will be automatically prepended to all request URLs.
const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
// 2. Use a request interceptor to dynamically add headers to every request.
// This function will run BEFORE each request is sent.
client.interceptors.request.use(
  (config) => {
    // We can only access cookies on the client-side.
    if (typeof window !== "undefined") {
      const token = getCookie('session');
      const userId = getCookie('userId');
      // If a token exists, add it to the Authorization header.
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // If a userId exists, add it to the custom 'x-user-id' header.
      if (userId) {
        config.headers["x-user-id"] = userId;
      }
    }
    // Important: return the config object for the request to proceed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// 3. (Optional but recommended) Use a response interceptor to handle responses globally.
// This allows you to process data or handle errors from one central location.
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      if (typeof window !== "undefined") {
        window.location.href = "/sign-in";
      }
    }
    return Promise.reject(error);
  }
);
export { client };
export default client;
/*
  // HOW TO USE IT IN YOUR COMPONENTS/PAGES:
  import client from './path/to/your/client';
  // Example GET request
  const fetchUsers = async () => {
    try {
      const users = await client.get('/users'); // route is '/users'
      console.log(users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };
  // Example POST request
  const createUser = async (userData) => {
    try {
      const newUser = await client.post('/users', userData); // route is '/users', body is userData
      console.log('User created:', newUser);
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };
*/