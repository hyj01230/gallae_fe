import Layout from "../../components/common/Layout";
import { useLocation, useNavigate } from "react-router-dom";

export default function SignUpCompletePage() {
  // 페이지 이동
  const navigate = useNavigate();
  const onClickLoginHandler = () => {
    navigate("/login");
  };

  // useLocation : 회원가입 페이지에서 닉네임 받아오기!
  const { state } = useLocation(); // useLocation() 함수에서 반환된 객체에서 구조 분해 할당을 사용하여 state 변수를 추출
  const nickName = state.nickName; // state 객체에서 nickName 속성을 변수 nickName에 할당

  return (
    <Layout>
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="w-[184px] h-[184px] flex justify-center items-center">
          <img src={"/img/welcome.png"} className="w-[184px] h-[184px]" />
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="mt-3 text-xl/normal font-bold text-[#333333]">
            {nickName ? nickName : "여행자"} 님
          </div>
          <div className="mt-3 text-xl/normal font-medium text-[#333333]">
            회원이 된 것을 축하드려요!
          </div>
        </div>
        <div className="mb-[72px]"></div>
      </div>

      <div
        className="fixed bottom-0 max-w-3xl w-full h-[72px] bg-[#FF9900] text-[#FFFFFF] flex items-center justify-center cursor-pointer"
        onClick={onClickLoginHandler}
      >
        로그인 바로가기
      </div>
    </Layout>
  );
}
