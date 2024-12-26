import axios, { CreateAxiosDefaults } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const options: CreateAxiosDefaults = {
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

const $api = axios.create(options);
const $apiAuth = axios.create({
  baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
  const access_token = localStorage.getItem("accessToken");
  if (config.headers && access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
    // config.headers["Content-Type"] = "multipart/form-data";
  }
  return config;
});

$api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite retry loops
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }

      // Get the refresh token
      const refreshToken = localStorage.getItem("refreshToken");

      try {
        // Request a new access token
        const { data } = await $apiAuth.post(`/auth/api/token/refresh/`, {
          token: refreshToken,
        });
        console.log(data);

        // Store the new access token
        localStorage.setItem("accessToken", data.access);

        // Update the Authorization header
        $api.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;

        // Retry the original request with the new token
        return $api(originalRequest);
      } catch (error) {
        console.error("Failed to refresh token:", error);
        // Optionally, redirect to login page or show an error
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export { $apiAuth, $api };
