import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../components/common/Layout";
import { axiosInstance } from "../api/axiosInstance";
import { Logo } from "../assets/Icon";

export default function LoginPage() {
  // 페이지 이동
  const navigate = useNavigate();
  const onClickSkipHandler = () => {
    navigate("/posts");
  };
  const onClickSingUpHandler = () => {
    navigate("/signup");
  };

  // useState : 이메일, 비밀번호
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // onChange : 이메일, 비밀번호
  const onChangeEmailHandler = (e) => {
    setEmail(e.target.value);
  };
  const onChangePasswordHandler = (e) => {
    setPassword(e.target.value);
  };

  // 로그인 후 접근하면 막기!
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      navigate("/");
    }
  }, []);

  // 사용자가 Enter 키를 눌렀을 때 로그인 실행하는 함수
  // const handleEnterKey = (event) => {
  //   if (event.key === "Enter") {
  //     // Enter 키가 눌렸을 때, "로그인하기" 버튼을 클릭하도록 시뮬레이트
  //     onClickLoginHandler();
  //   }
  // };

  // POST : 로그인 정보 보내기
  const onClickLoginHandler = async () => {
    try {
      const response = await axiosInstance.post("/api/users/login", {
        email,
        password,
      });
      console.log("response", response);

      if (response.data.statusCode === 200) {
        localStorage.setItem("accessToken", response.headers.authorization); // accessToken 저장!
        localStorage.setItem(
          "refreshToken",
          response.headers.authorization_refresh
        ); // refreshToken 저장!

        navigate("/");

        // accessToken 만료시 로그아웃 - 임시로 사용! 수정예정!
        setTimeout(() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          alert("로그인 시간 만료! 재로그인이 필요합니다.");
          navigate("/login");
        }, 3600000); // 1시간
      }
      alert(response.data.msg);
    } catch (error) {
      console.log("error", error);
      if (email === "" || password === "") {
        alert("아이디와 비밀번호 모두 입력하세요.");
      } else {
        alert(error.response.data.msg);
      }
    }
  };

  // // 카카오 로그인
  // const onClickKakaoLoginHandler = () => {
  //   const REST_API_KEY = import.meta.env.VITE_REACT_APP_REST_API_KEY; // client_id : REST API KEY 설정('갈래' 인지 확인하는 고유 키)
  //   const REDIRECT_URI = import.meta.env.VITE_REACT_APP_KAKAO_REDIRECT_URI; // 리다이렉트 URI 설정(응답받을 주소) > 동의하기 누르면 나오는 페이지
  //   const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`; // 카카오 OAuth 인증 URL
  //   window.location.href = KAKAO_AUTH_URL; // 카카오 로그인 클릭하면 KAKAO_AUTH_URL 여기로 이동!
  // };

  return (
    <Layout isBottomNav={false}>
      <div className="mx-4 mb-10">
        <div
          className="flex justify-end mt-4 text-[#999999] text-base/normal font-normal cursor-pointer"
          onClick={onClickSkipHandler}
        >
          건너뛰기
        </div>

        <div className="mt-[91px] w-[120px] h-[120px] mx-auto flex items-center justify-center">
          <Logo />
        </div>

        <div className="mt-3 flex justify-center items-center flex-col">
          <div className="text-base/normal font-normal">
            우리 여행 갈래길잡이
          </div>
          <div className="mt-[5px] text-[26px] leading-normal">
            나랑 여행 <strong>갈래 ?</strong>
          </div>
        </div>

        <div className="mt-[65px]">
          <input
            type="text"
            value={email}
            onChange={onChangeEmailHandler}
            placeholder="이메일을 입력해주세요."
            className="border border-[#D9D9D9] rounded-lg w-full h-[49px] px-[17px] placeholder:text-sm/normal placeholder:text-[#999999] placeholder:font-medium outline-none"
          />
          <input
            type="password"
            value={password}
            onChange={onChangePasswordHandler}
            placeholder="비밀번호를 입력해주세요."
            className="mt-2 border border-[#D9D9D9] rounded-lg w-full h-[49px] px-[17px] placeholder:text-sm/normal placeholder:text-[#999999] placeholder:font-medium outline-none"
          />
        </div>

        <div
          onClick={onClickLoginHandler}
          className="mt-4 rounded-lg w-full h-[50px] border-[#FF9900] border bg-[#FF9900] flex justify-center items-center text-white text-base/4 font-semibold cursor-pointer"
        >
          로그인하기
        </div>

        {/* <div>
          <div
            onClick={onClickKakaoLoginHandler}
            className="mt-3 rounded-lg w-full h-[50px] bg-[#F8DF00] flex justify-center items-center text-[#333333] text-base/[30px] font-medium cursor-pointer"
          >
            <img className="w-12 h-12" src="img/kakao.png" />
            카카오톡으로 시작하기
          </div>
        </div> */}

        <div className="mt-6 flex justify-center items-center">
          <div
            onClick={onClickSingUpHandler}
            className="text-base/normal text-[#888888] cursor-pointer"
          >
            회원가입
          </div>
        </div>
      </div>
    </Layout>
  );
}
