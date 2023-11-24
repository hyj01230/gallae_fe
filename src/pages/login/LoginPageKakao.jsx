import { useEffect } from "react";
import Layout from "../../components/common/Layout";
import { axiosInstance } from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function LoginPageKakao() {
  const navigate = useNavigate();

  // 카카오에서 준 인가코드 뽑기
  const code = new URL(window.location.href).searchParams.get("code");

  // 인가코드를 백에 보내보자
  // 참고 : https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-token
  useEffect(() => {
    const KakaoLogin = async () => {
      try {
        const response = await axiosInstance.get(
          `/kakao/callback?code=${code}`,
          {
            headers: {
              "Content-type": "application/x-www-form-urlencoded;",
            },
          }
        );
        const accessToken = response.headers.authorization;
        localStorage.setItem("accessToken", `Bearer ${accessToken}`);
        navigate("/");
      } catch (error) {
        // alert(error.response.data.msg);
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
