import { useEffect } from "react";
import Layout from "../components/common/Layout";
import { axiosInstance } from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function LoginPageKakao() {
  const navigate = useNavigate();

  // 카카오에서 준 인가코드 뽑기
  const code = new URL(window.location.href).searchParams.get("code");
  console.log(code);

  // 인가코드를 백에 보내보자
  // 참고 : https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-token
  useEffect(() => {
    const KakaoLogin = async () => {
      try {
        const response = await axiosInstance.get(
          `/kakao/callback?code=${code}`,
          {
            headers: {
              "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
            },
          },
          {
            grant_type: "authorization_code",
            client_id: import.meta.env.VITE_REACT_APP_REST_API_KEY,
            redirect_uri: import.meta.env.VITE_REACT_APP_KAKAO_REDIRECT_URI,
            code,
          }
        );
        console.log("response", response);
        const accessToken = response.headers.authorization;
        localStorage.setItem("accessToken", accessToken);
        navigate("/");
      } catch (error) {
        console.log("error", error);
      }
    };

    KakaoLogin();
  }, []);

  return (
    <Layout>
      <div>카카오 로그인 중입니다.</div>
    </Layout>
  );
}
