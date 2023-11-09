import axios from "axios";
import { getCookie, removeCookie, setCookie } from "../util/cookie";

// Axios 인스턴스를 생성하고 설정
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_URL, // API 요청의 기본 URL을 설정
  headers: { "Content-Type": "application/json" }, // 모든 요청에 대한 기본 헤더를 설정
});

// Axios 인스턴스에 요청 인터셉터(interceptor)를 추가
axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken"); // 로컬 스토리지에서 "accessToken"을 가져오기

  // 만약 "accessToken"이 존재하면,
  if (accessToken) {
    config.headers["Authorization"] = accessToken; //요청 헤더에 "Authorization" 헤더를 추가하고
    config.withCredentials = true; // CORS (Cross-Origin Resource Sharing) 요청을 허용하기 위해 "withCredentials" 옵션을 true로 설정
  }

  // 만약 요청 데이터가 FormData 객체인 경우,
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data"; // "Content-Type" 헤더를 "multipart/form-data"로 설정

    // 만약 요청 데이터가 배열이고,
  } else if (
    Array.isArray(config.data) &&
    config.data.every((value) => value.file instanceof FormData) // 모든 요소의 "file" 프로퍼티가 FormData 객체인 경우,
  ) {
    config.headers["Content-Type"] = "multipart/form-data"; // "Content-Type" 헤더를 "multipart/form-data"로 설정
  } else {
    config.headers["Content-Type"] = "application/json"; // 그 외의 경우에는 "Content-Type" 헤더를 "application/json"으로 설정
  }

  return config; // 설정된 요청(config)을 반환
});

// // accessToken 재발급
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // 액세스 토큰 만료됐을 때,
    if (error.response.data.status === 500) {
      const refreshToken = getCookie("refreshToken"); // 리프레시 토큰 가져오고,
      localStorage.removeItem("accessToken"); // 엑세스 토큰은 지우기(axiosInstance 기본설정 때문에 post 보낼때 같이 보내지는데, 403 에러남!)

      console.log("액세스 토큰 만료", error);
      console.log("refreshToken 있니?", refreshToken);

      // 1. 리프레시 토큰이 있으면,
      if (refreshToken) {
        try {
          // 재발급 API로 리프레시 토큰 보내서
          const response = await axiosInstance.post(
            "/api/token/refreshAccessToken",
            null, // 요청 body 보내지 않음
            {
              headers: {
                Authorization_refresh: refreshToken,
              },
            }
          );
          console.log("리프레시 있을 때 response", response);

          // 새로운 토큰(액세스/리프레시) 받고, 저장하기
          const newAccessToken = response.data.accessToken;
          const newRefreshToken = response.data.refreshToken;
          localStorage.setItem("accessToken", newAccessToken);
          setCookie("refreshToken", newRefreshToken, {
            path: "/", // 모든 페이지에서 쿠키 접근 가능
            secure: true, // https로 통신할때만 쿠키 저장됨
            // httpOnly: true, // HttpOnly 속성을 적용(js 접근 불가) > 클라이언트에서 저장안됨
          });

          error.config.headers["Authorization"] = newAccessToken; // 업데이트된 액세스 토큰을 헤더에 설정하고 현재 요청을 다시 실행
          return axiosInstance(error.config); // 현재 요청을 새로운 액세스 토큰을 가지고 재시도

          // 2. 리프레시 토큰 에러면,
        } catch (refreshError) {
          console.log("리프레시 에러 refreshError", refreshError);

          // 토큰(액세스/리프레시) 지우고, 재로그인 시키기
          localStorage.removeItem("accessToken");
          removeCookie("refreshToken");
          window.location.href = "/login";
          alert("재로그인이 필요합니다.");
        }
      } else {
        // 토큰(액세스/리프레시) 지우고, 재로그인 시키기
        localStorage.removeItem("accessToken");
        removeCookie("refreshToken");
        window.location.href = "/login";
        alert("재로그인이 필요합니다.");
      }
    }

    // 다른 오류의 경우, 오류를 다시 반환
    return Promise.reject(error);
  }
);
