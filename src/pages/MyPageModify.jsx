import Layout from "../components/common/Layout";
import {
  Community,
  FillMypage,
  LeftArrow,
  WhiteDocument,
} from "../assets/Icon";
import { useNavigate } from "react-router-dom";

export default function MyPageModify() {
  // 페이지 이동
  const navigate = useNavigate();
  const onClickLeftArrowHandler = () => {
    navigate("/mypage");
  };
  const onClickModifyNickNameHandler = () => {
    navigate("/mypage/modify/nickname");
  };
  const onClickModifyPassWordHandler = () => {
    navigate("/mypage/modify/password");
  };

  return (
    <Layout>
      <div className="mx-4">
        <div className="flex items-center mt-16">
          <div onClick={onClickLeftArrowHandler} className="cursor-pointer">
            <LeftArrow />
          </div>
          <div className="ml-4 text-xl/normal font-semibold">개인정보 설정</div>
        </div>

        <div
          onClick={onClickModifyNickNameHandler}
          className="mt-6 pb-3 border-b border-[#F2F2F2] cursor-pointer"
        >
          닉네임 수정
        </div>
        <div
          onClick={onClickModifyPassWordHandler}
          className="mt-4 pb-3 border-b border-[#F2F2F2] cursor-pointer"
        >
          비밀번호 변경
        </div>
      </div>

      <div className="fixed bottom-0 max-w-3xl w-full h-[84px] bg-[#F2F2F2] flex justify-center">
        <div className="h-10 w-full mx-10 mt-[11.6px] flex">
          <div className="w-10 h-10 flex flex-col justify-center items-center">
            <WhiteDocument />
            <div className="mt-[5px] text-center text-[9px] text-[#888888] font-extrabold leading-[9px]">
              일정
            </div>
          </div>
          <div className="mx-auto w-10 h-10 flex flex-col justify-center items-center">
            <Community />
            <div className="mt-[5px] text-center text-[9px] text-[#888888] font-extrabold leading-[9px]">
              커뮤니티
            </div>
          </div>
          <div className="w-[45px] h-10 flex flex-col justify-center items-center">
            <FillMypage />
            <div className="mt-[5px] text-center text-[9px] text-[#888888] font-extrabold leading-[9px]">
              마이페이지
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
