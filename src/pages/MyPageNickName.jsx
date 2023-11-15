import { useEffect, useState } from "react";
import Layout from "../components/common/Layout";

import { LeftArrow } from "../assets/Icon";
import { useNavigate } from "react-router-dom";
import { getMyPageInfoAPI, putNickNameAPI } from "../api";

export default function MyPageNickName() {
  // 페이지 이동
  const navigate = useNavigate();
  const onClickLeftArrowHandler = () => {
    navigate("/mypage/modify");
  };

  // useState : get정보, 닉네임
  const [myPageInfo, setMyPageInfo] = useState({});
  const [nickName, setNickName] = useState("");

  // onChange : 닉네임
  const onChangeNickNameHandler = (e) => {
    setNickName(e.target.value);
  };

  // 유효성&안내메시지 : 닉네임
  const [nickNameMessage, setNickNameMessage] = useState("");
  useEffect(() => {
    if (nickName.length === 1) {
      setNickNameMessage("• 닉네임은 2자 이상 입력해야합니다.");
    } else if (!/^[A-Za-z0-9가-힣]*$/.test(nickName)) {
      setNickNameMessage("• 영어, 숫자, 한글만 입력 가능합니다");
    } else {
      setNickNameMessage(true);
    }
  }, [nickName]);

  // GET : 닉네임 가져오기
  const getMyPageInfo = async () => {
    try {
      const response = await getMyPageInfoAPI();
      setMyPageInfo(response); // 마이페이지 데이터 저장
    } catch (error) {
      // alert(error.response.data.msg);
    }
  };

  useEffect(() => {
    getMyPageInfo();
  }, []);

  // PUT : 닉네임 변경
  const onClickModifyNickNameHandler = async () => {
    // 에러메시지 있는지 확인
    if (nickNameMessage !== true) {
      alert("닉네임을 올바르게 입력해주세요.");
      return;
    } else if (nickName === "") {
      alert("변경할 닉네임을 입력해주세요.");
      return;
    }

    try {
      const response = await putNickNameAPI({
        updateNickName: nickName,
      });
      alert(response.data.msg);
      setMyPageInfo({ ...myPageInfo, nickName });
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  return (
    <Layout isBottomNav={true}>
      <div className="mx-4 mb-24">
        <div className="flex items-center mt-3">
          <div onClick={onClickLeftArrowHandler} className="cursor-pointer">
            <LeftArrow />
          </div>
          <div className="ml-4 text-xl/normal font-semibold">닉네임 수정</div>
          <div
            onClick={onClickModifyNickNameHandler}
            className={`${
              nickName.length > 1 ? "text-[#FF9900]" : "text-[#D9D9D9]"
            } ml-auto text-xl/8 font-medium cursor-pointer`}
          >
            변경
          </div>
        </div>

        <div className="mt-[19px] flex flex-row">
          <div className="bg-[#F2F2F2] w-full h-11 rounded-lg flex flex-row justify-start items-center">
            <div className="ml-4 text-[#999999] text-base/5 font-medium">
              현재 닉네임
            </div>
            <div className="ml-[33px] text-[#333333] text-base/5 font-medium">
              {myPageInfo.nickName}
            </div>
          </div>
        </div>
        <input
          type="text"
          placeholder="변경할 닉네임을 입력해주세요. (2~10자)"
          onChange={onChangeNickNameHandler}
          maxLength={10}
          className="mt-[30px] pb-3 w-full outline-none flex items-center border-b border-b-[#D9D9D9] placeholder:text-lg/5 placeholder:font-medium"
        />
        {nickNameMessage !== true && nickNameMessage && (
          <div className="mt-5 text-[#FF9900] text-xs/5 font-medium">
            {nickNameMessage}
          </div>
        )}
      </div>
    </Layout>
  );
}
