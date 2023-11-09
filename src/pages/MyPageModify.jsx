import Layout from "../components/common/Layout";
import { LeftArrow } from "../assets/Icon";
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
  const onClickModifySignOutHandler = () => {
    navigate("/mypage/modify/signout");
  };

  return (
    <Layout isBottomNav={true}>
      <div className="mx-4">
        <div className="flex items-center mt-3">
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
        <div
          onClick={onClickModifySignOutHandler}
          className="mt-4 pb-3 border-b border-[#F2F2F2] cursor-pointer"
        >
          탈퇴하기
        </div>
      </div>
    </Layout>
  );
}
