import { useEffect, useState } from "react";
import Layout from "../components/common/Layout";
import { axiosInstance } from "../api/axiosInstance";
import {
  Community,
  FillMypage,
  LeftArrow,
  WhiteDocument,
} from "../assets/Icon";
import { useNavigate } from "react-router-dom";

export default function MyPageNickName() {
  // 페이지 이동
  const navigate = useNavigate();
  const onClickLeftArrowHandler = () => {
    navigate("/mypage/modify");
  };

  // useState : 닉네임
  const [nickName, setNickName] = useState("");

  // onChange : 닉네임
  const onChangeNickNameHandler = (e) => {
    setNickName(e.target.value);
  };

  // 유효성&안내메시지 : 닉네임
  const [nickNameMessage, setNickNameMessage] = useState("");
  useEffect(() => {
    if (nickName.length === 1) {
      setNickNameMessage("닉네임은 2자 이상 입력해야합니다.");
    } else if (!/^[A-Za-z0-9가-힣]*$/.test(nickName)) {
      setNickNameMessage("영어, 숫자, 한글만 입력 가능합니다");
    } else {
      setNickNameMessage(true);
    }
  }, [nickName]);

  // GET : 마이페이지 조회
  const getMyPageInfo = async () => {
    try {
      const response = await axiosInstance.get("/api/users/profile");
      console.log("마이정보 response :", response.data);
      setNickName(response.data.nickName);
    } catch (error) {
      console.log("error :", error);
    }
  };

  useEffect(() => {
    getMyPageInfo();
  }, []);

  // PUT : 닉네임 변경

  return (
    <Layout>
      <div className="mx-4">
        <div className="flex items-center mt-16">
          <div onClick={onClickLeftArrowHandler} className="cursor-pointer">
            <LeftArrow />
          </div>
          <div className="ml-4 text-xl/normal font-semibold">닉네임 수정</div>
        </div>

        <div className="mt-4 flex flex-row">
          <div>닉네임</div>
          <input
            type="text"
            value={nickName}
            onChange={onChangeNickNameHandler}
            className="border border-black"
          />
          {nickNameMessage !== true && nickNameMessage && (
            <div className="my-2 text-red-600">{nickNameMessage}</div>
          )}
          <div>
            <button className="bg-yellow-400">취소</button>
            <button className="bg-orange-400">저장</button>
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
      </div>
    </Layout>
  );
}
