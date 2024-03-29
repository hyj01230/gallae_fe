import { useNavigate } from "react-router-dom";
import { LeftArrow } from "../../assets/Icon";
import Layout from "../../components/common/Layout";
import { useState } from "react";
import { removeCookie } from "../../util/cookie";
import { SignOutAPI } from "../../api";

export default function MyPageSignOut() {
  // 페이지 이동
  const navigate = useNavigate();
  const onClickLeftArrowHandler = () => {
    navigate("/mypage/modify");
  };

  const [email, setEmail] = useState(""); // 이메일
  const [password, setPassword] = useState(""); // 비밀번호
  const onChangeEmailHandler = (e) => {
    setEmail(e.target.value); // 이메일
  };
  const onChangePasswordHandler = (e) => {
    setPassword(e.target.value); // 비밀번호
  };

  // delete : 탈퇴
  const onClickDeleteSignOutHandler = async () => {
    try {
      const response = await SignOutAPI({
        data: { email, password },
      });

      alert("회원탈퇴");
      localStorage.removeItem("accessToken");
      removeCookie("refreshToken");
      navigate("/");
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  return (
    <Layout>
      <div className="mx-4 mb-24">
        <div className="flex items-center mt-3">
          <div onClick={onClickLeftArrowHandler} className="cursor-pointer">
            <LeftArrow />
          </div>
          <div className="ml-4 text-xl/normal font-semibold text-[#333333]">
            탈퇴하기
          </div>
          <div
            onClick={onClickDeleteSignOutHandler}
            className={`${
              email && password ? "text-[#FF9900]" : "text-[#D9D9D9]"
            }
              ml-auto  text-xl/8 font-medium cursor-pointer`}
          >
            확인
          </div>
        </div>

        <input
          type="text"
          placeholder="이메일을 입력해주세요"
          value={email}
          onChange={onChangeEmailHandler}
          className="mt-[30px] pb-3 w-full outline-none flex items-center border-b border-b-[#D9D9D9] placeholder:text-lg/5 placeholder:font-medium"
        />

        <input
          type="password"
          placeholder="비밀번호를 입력해주세요"
          //   maxLength={15}
          value={password}
          onChange={onChangePasswordHandler}
          className="mt-5 pb-3 w-full outline-none flex items-center border-b border-b-[#D9D9D9] placeholder:text-lg/5 placeholder:font-medium"
        />
      </div>
    </Layout>
  );
}
