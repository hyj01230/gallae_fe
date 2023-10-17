import Layout from "../components/common/Layout";
import {
  GearIcon,
  PlusCircle,
  Heart,
  MyWriting,
  Community,
  FillMypage,
} from "../assets/Icon";
import { useNavigate } from "react-router-dom";
import { WhiteDocument } from "../assets/Icon";
import { useState } from "react";

export default function MyPage() {
  const navigate = useNavigate();

  const onClickLogOutHandler = () => {
    navigate("/");
  };

  const onclickLikeListHandler = () => {
    navigate("/mypage/like");
  };

  const onclickCommentListHandler = () => {
    navigate("/mypage/comment");
  };

  // 프로필 모달
  // state
  const [profileModal, setProfileModal] = useState(false);
  // 열기
  const onClickProfileOpenHandler = () => {
    setProfileModal(true);
  };
  // 닫기
  const onClickProfileCloseHandler = () => {
    setProfileModal(false);
  };

  // 소개글 모달
  // state
  const [introModal, setIntroModal] = useState(false);
  // 열기
  const onClickIntroOpenHandler = () => {
    setIntroModal(true);
  };
  // 닫기
  const onClickIntroCloseHandler = () => {
    setIntroModal(false);
  };

  return (
    <Layout>
      <div className="mx-4">
        <div className="mt-[60px] flex flex-row justify-end items-center">
          <div
            className="text-[#333333] mr-[7px] cursor-pointer text-sm/normal font-medium"
            onClick={onClickLogOutHandler}
          >
            로그아웃
          </div>
          <div className="m-1">
            <GearIcon />
          </div>
        </div>

        <div
          onClick={onClickProfileOpenHandler}
          className="bg-[#EBEBEB] mt-7 w-24 h-24 rounded-full mx-auto flex items-center justify-center cursor-pointer"
        >
          <PlusCircle />
        </div>

        <div className="flex justify-center mt-3 text-xl/normal font-semibold">
          릴리
        </div>

        <div
          onClick={onClickIntroOpenHandler}
          className="mt-5 w-full h-[94px] rounded-xl border border-[#F2F2F2] cursor-pointer"
        >
          <div className="mt-4 ml-4">
            <div className="text-[14px] text-[#D9D9D9] font-medium leading-5">
              아직 작성된 소개가 없어요.
            </div>
            <div className="text-[14px] text-[#D9D9D9] font-medium leading-5">
              길게 눌러 자기소개를 입력해주세요.
            </div>
          </div>
        </div>

        <div>
          <div className="mt-10 font-semibold">나의 여행계획</div>
          <div
            onClick={onclickLikeListHandler}
            className="mt-5 flex flex-row items-center cursor-pointer"
          >
            <Heart />
            <div className="ml-3 font-medium text-base/normal">좋아요 목록</div>
          </div>
          <div
            onClick={onclickCommentListHandler}
            className="mt-4 flex flex-row items-center cursor-pointer"
          >
            <MyWriting />
            <div className="ml-3 font-medium text-base/normal">
              나의 글 쓴 내역
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 w-full h-[84px] bg-[#F2F2F2] flex justify-center">
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

      {profileModal && (
        <div className="bg-[#666666]/50 w-full h-full absolute top-0 left-0 flex justify-center items-center">
          <div className=" w-full flex flex-col mt-auto mb-[21px]">
            <div className="mx-4 bg-[#F2F2F2] text-center h-[45px] flex items-center justify-center rounded-t-xl text-[#333333] text-[14px] leading-[100%] font-medium">
              프로필 사진 설정
            </div>
            <div className="mx-4 bg-[#F2F2F2] border-[#666666] border-t-[0.5px] border-b-[0.5px] text-center h-14 flex items-center justify-center text-[#333333] text-[18px] leading-[100%] font-medium">
              앨범에서 사진 선택
            </div>
            <div className="mx-4 bg-[#F2F2F2] text-center h-14 flex items-center justify-center rounded-b-xl text-[#333333] text-[18px] leading-[100%] font-medium">
              기본으로 설정
            </div>
            <div
              onClick={onClickProfileCloseHandler}
              className="mt-3 mx-4 bg-[#FFFFFF] rounded-xl h-[58px] flex items-center justify-center text-[##333333] text-[18px] leading-[100%] font-medium cursor-pointer"
            >
              취소
            </div>
          </div>
        </div>
      )}

      {introModal && (
        <div className="bg-[#333333]/80 w-full h-full absolute top-0 left-0 flex flex-col items-center">
          <div className=" mt-[61px] w-full flex flex-row text-white">
            <div
              onClick={onClickIntroCloseHandler}
              className="ml-4 text-base/normal font-normal flex items-center cursor-pointer"
            >
              취소
            </div>
            <div className="mx-auto text-xl/5 font-medium flex items-center">
              소개글 수정
            </div>
            <div className="mr-4 text-base/normal font-normal cursor-pointer">
              확인
            </div>
          </div>
          <div className="w-full px-4 mt-[186px]">
            <input
              type="text"
              placeholder="입력해 주세요."
              maxLength={80}
              className="pb-3 w-full bg-transparent text-center text-white placeholder:text-white border-b-[0.5px] border-[#D9D9D9] outline-none"
            />
          </div>
          <div className="mt-2 text-[#D9D9D9] text-xs/5 font-normal">8/80</div>
        </div>
      )}
    </Layout>
  );
}
