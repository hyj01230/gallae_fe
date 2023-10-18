import Layout from "../components/common/Layout";
import { useLocation, useNavigate } from "react-router-dom";

export default function SignUpCompletePage() {
  const navigate = useNavigate();

  const onClickHomeBtnHandler = () => {
    navigate("/");
  };

  const onClickLoginHandler = () => {
    navigate("/login");
  };

  const { state } = useLocation(); // useLocation() 함수에서 반환된 객체에서 구조 분해 할당을 사용하여 state 변수를 추출
  const nickName = state.nickName; // state 객체에서 nickName 속성을 변수 nickName에 할당
  console.log({ state });

  return (
    <Layout>
      <div className="flex flex-col justify-center items-center mt-[292px] mb-[379px]">
        <div className="bg-[#EBEBEB] w-[121px] h-[121px] mb-4 flex justify-center items-center text-xs">
          웰컴이미지
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="mb-3 text-lg font-bold">
            {nickName ? nickName : "익명"} 님
          </div>
          <div className="text-lg">회원이 된 것을 축하드려요!</div>
        </div>
        <div className="mt-6 flex justify-center items-center">
          <div
            onClick={onClickLoginHandler}
            className="text-base/normal text-[#888888] cursor-pointer"
          >
            로그인 하러가기
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 h-16 w-full bg-[#D9D9D9] text-white flex items-center justify-center cursor-pointer"
        onClick={onClickHomeBtnHandler}
      >
        홈화면 바로가기
      </div>
    </Layout>
  );
}
