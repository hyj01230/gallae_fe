import Layout from "../../components/common/Layout";
import { LeftArrow } from "../../assets/Icon";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMyPageInfoAPI } from "../../api";

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

  // useStat
  const [nickName, setNickName] = useState("");

  // GET : 닉네임 가져오기
  const getMyPageInfo = async () => {
    try {
      const response = await getMyPageInfoAPI();
      setNickName(response.nickName);
    } catch (error) {
      // alert(error.response.data.msg);
    }
  };

  useEffect(() => {
    getMyPageInfo();
  }, []);

  return (
    <Layout isBottomNav={true}>
      <div className="mx-4">
        <div className="flex items-center mt-3">
          <div onClick={onClickLeftArrowHandler} className="cursor-pointer">
            <LeftArrow />
          </div>
          <div className="ml-4 text-xl/8 font-semibold text-[#333333]">
            개인정보 설정
          </div>
        </div>
        <div
          onClick={onClickModifyNickNameHandler}
          className="flex items-center mt-6 pb-3 border-b border-[#F2F2F2] cursor-pointer"
        >
          <div className="text-[18px]/8 mr-auto text-[#333333]">
            닉네임 수정
          </div>
          <div className="text-[18px]/8 font-medium text-[#999999]">
            {nickName}
          </div>
        </div>

        <div
          onClick={onClickModifyPassWordHandler}
          className="mt-4 pb-3 border-b border-[#F2F2F2] cursor-pointer text-[#333333] text-[18px]/8"
        >
          비밀번호 변경
        </div>
        <div
          onClick={onClickModifySignOutHandler}
          className="mt-4 pb-3 border-b border-[#F2F2F2] cursor-pointer text-[#333333] text-[18px]/8"
        >
          탈퇴하기
        </div>
      </div>
    </Layout>
  );
}
