import axios from "axios";

// Axios 인스턴스를 생성하고 설정
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_URL, // API 요청의 기본 URL을 설정
  headers: { "Content-Type": "application/json" }, // 모든 요청에 대한 기본 헤더를 설정
});

// Axios 인스턴스에 요청 인터셉터(interceptor)를 추가
axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken"); // 로컬 스토리지에서 "accessToken"을 가져오기

  // 만약 "accessToken"이 존재하면, 요청 헤더에 "Authorization" 헤더를 추가하고
  // CORS (Cross-Origin Resource Sharing) 요청을 허용하기 위해 "withCredentials" 옵션을 true로 설정
  if (accessToken) {
    config.headers["Authorization"] = accessToken;
    config.withCredentials = true;
  }

  // 만약 요청 데이터가 FormData 객체인 경우, "Content-Type" 헤더를 "multipart/form-data"로 설정
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";

    // 만약 요청 데이터가 배열이고, 모든 요소의 "file" 프로퍼티가 FormData 객체인 경우,
    // "Content-Type" 헤더를 "multipart/form-data"로 설정
  } else if (
    Array.isArray(config.data) &&
    config.data.every((value) => value.file instanceof FormData)
  ) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else {
    // 그 외의 경우에는 "Content-Type" 헤더를 "application/json"으로 설정
    config.headers["Content-Type"] = "application/json";
  }

  // 설정된 요청(config)을 반환
  return config;
});
