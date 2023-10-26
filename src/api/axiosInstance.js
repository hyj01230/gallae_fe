import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_URL,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers["Authorization"] = accessToken;
    config.withCredentials = true;
  }

  // 폼 데이터를 보낼 때만 Content-Type을 "multipart/form-data"로 설정
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else if (
    Array.isArray(config.data) &&
    config.data.every((value) => value.file instanceof FormData)
  ) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else {
    // 그 외의 경우에는 "application/json"을 사용
    config.headers["Content-Type"] = "application/json";
  }
  // console.log("axiosInstance headers :", config.headers); // 추가된 로깅
  return config;
});
