import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Layout from "../components/common/Layout";
import { axiosInstance } from "../api/axiosInstance";

export default function LoginPage() {
  // 페이지 이동
  const navigate = useNavigate();

  const onClickSkipHandler = () => {
    navigate("/");
  };

  const onClickSingUpHandler = () => {
    navigate("/signup");
  };

  // 이메일, 비밀번호 state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onchangeEmailHandler = (e) => {
    setEmail(e.target.value);
  };
  const onchangePasswordHandler = (e) => {
    setPassword(e.target.value);
  };

  const onClickLoginHandler = async () => {
    try {
      const response = await axiosInstance.post("/api/users/login", {
        email,
        password,
      });
      console.log("response", response);

      if (response.data.statusCode === 200) {
        localStorage.setItem("accessToken", response.headers.authorization);
        navigate("/");
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

  return (
    <Layout>
      <div className="mx-4">
        <div
          className="flex justify-end mt-[60px] text-[#999999] text-base/normal font-normal cursor-pointer"
          onClick={onClickSkipHandler}
        >
          건너뛰기
        </div>

        <div className="mt-[113px] flex justify-center items-center flex-col">
          <div className="text-base/normal font-normal">
            우리 여행 갈래길잡이
          </div>
          <div className="mt-[5px] text-[26px] leading-normal">
            나랑 여행 <strong>갈래 ?</strong>
          </div>
        </div>

        <div className="mt-8 bg-[#EBEBEB] w-[120px] h-[120px] mx-auto flex items-center justify-center">
          로고
        </div>

        <div className="mt-6">
          <input
            type="text"
            value={email}
            onChange={onchangeEmailHandler}
            placeholder="이메일을 입력해주세요."
            className="border border-[#D9D9D9] rounded-lg w-full h-[49px] px-[17px] placeholder:text-sm/normal placeholder:text-[#999999] placeholder:font-medium"
          />
          <input
            type="password"
            value={password}
            onChange={onchangePasswordHandler}
            placeholder="비밀번호를 입력해주세요."
            className="mt-2 border border-[#D9D9D9] rounded-lg w-full h-[49px] px-[17px] placeholder:text-sm/normal placeholder:text-[#999999] placeholder:font-medium"
          />
        </div>

        <div>
          <div
            onClick={onClickLoginHandler}
            className="rounded-lg mt-4 w-full h-[50px] bg-[#EBEBEB] flex justify-center items-center text-[#666] text-base font-semibold cursor-pointer"
          >
            로그인
          </div>
        </div>

        <div>
          <div
            onClick={onClickSingUpHandler}
            className="mt-4 rounded-lg w-full h-[50px] bg-[#F8DF00] flex justify-center items-center text-[#333333] text-base/[30px] font-medium cursor-pointer"
          >
            <img className="w-12 h-12" src="public/img/kakao.png"></img>
            카카오톡으로 시작하기
          </div>
        </div>

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
