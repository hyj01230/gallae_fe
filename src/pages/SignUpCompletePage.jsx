import Layout from "../components/common/Layout";
import { useNavigate } from "react-router-dom";

export default function SignUpCompletePage() {
  const navigate = useNavigate();

  const onClickHomeBtnHandler = () => {
    navigate("/");
  };

  return (
    <Layout>
      <div className="flex flex-col justify-center items-center mt-[292px] mb-[379px]">
        <div className="bg-[#EBEBEB] w-[121px] h-[121px] mb-4 flex justify-center items-center text-xs">
          웰컴이미지
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="mb-3 text-lg font-bold">닉네임 님</div>
          <div className="text-lg">회원이 된 것을 축하드려요!</div>
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
