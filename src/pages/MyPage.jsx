import Layout from "../components/common/Layout";
import { GearIcon, Heart, MyCommentList, MyWriting } from "../assets/Icon";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
// import defaultProfile from "../../public/img/defaultProfile.png";
import { axiosInstance } from "../api/axiosInstance";
import { removeCookie } from "../util/cookie";

export default function MyPage() {
  // 페이지 이동
  const navigate = useNavigate(); // navigate 할당
  const onClickLogOutHandler = () => {
    localStorage.removeItem("accessToken");
    removeCookie("refreshToken");
    navigate("/posts"); // 로그아웃
  };
  const onClickModifyHandler = () => {
    navigate("/mypage/modify"); // 톱니바퀴
  };
  const onClickLikeListHandler = () => {
    navigate("/mypage/like"); // 좋아요 목록
  };
  const onClickCommentListHandler = () => {
    navigate("/mypage/comment"); // 나의 댓글 내역
  };
  const onClickPostListHandler = () => {
    navigate("/mypage/post"); // 나의 게시글
  };

  // useState
  const [profileModal, setProfileModal] = useState(false); // 모달 : 프로필 사진
  const [aboutMeModal, setAboutMeModal] = useState(false); // 모달 : 소개글
  const [myPageInfo, setMyPageInfo] = useState({}); // 전체 데이터
  const [uploadImage, setUploadImage] = useState(null); // 프로필 사진 데이터
  const [aboutMe, setAboutMe] = useState(""); // 소개글 데이터
  const [characterCount, setCharacterCount] = useState(0); // 소개글 입력 글자수

  // 모달
  const onClickProfileOpenHandler = () => {
    setProfileModal(true); // 프로필 사진(열기)
  };
  const onClickProfileCloseHandler = () => {
    setProfileModal(false); // 프로필 사진(닫기)
  };
  const onClickAboutMeOpenHandler = () => {
    setAboutMeModal(true); // 소개글(열기)
  };
  const onClickAboutMeCloseHandler = () => {
    setAboutMeModal(false); // 소개글(닫기)
  };

  // 소개글 : onChange
  const onChangeAboutMeHandler = (e) => {
    const newText = e.target.value;
    setAboutMe(newText);
    setCharacterCount(newText.length); // 글자 수 업데이트
  };

  // GET : 마이페이지 전체 데이터 가져오기
  const getMyPageInfo = async () => {
    try {
      const response = await axiosInstance.get("/api/users/profile");
      // console.log("마이페이지 데이터 get 성공 :", response.data);

      setMyPageInfo(response.data); // 마이페이지 데이터 저장
      setAboutMe(response.data.aboutMe); // 소개글 저장
      setUploadImage(response.data.profileImg); // 프로필 사진 저장
    } catch (error) {
      // console.log("마이페이지 데이터 get 실패 :", error.response);
    }
  };

  // useEffect : 렌더링되면 실행!
  useEffect(() => {
    getMyPageInfo();
  }, [profileModal]); // 프로필 사진 모달이 닫히면, getMyPageInfo 실행되고, 변경된 사진이 바로 적용됨!

  // 프로필 사진 : useRef(input-div 연결)
  const inputRef = useRef(null); // 사진선택 input - 앨범에서 선택 연결
  const onClickSelectProfileHandler = () => {
    inputRef.current.click(); // 앨범에서 선택 - 사진선택 input 연결
  };

  // 프로필 사진 : 이미지 선택창 나옴
  const uploadImageHandler = async (e) => {
    const selectImage = e.target.files[0]; // 선택된 파일 가져오기
    // console.log(`선택된 파일 이름: ${selectImage.name}`);
    // console.log(`선택된 파일 크기: ${selectImage.size} bytes`);

    setUploadImage(selectImage); // 선택한 사진은 프로필 사진 state에 저장
    // console.log("useState로 넘어간 선택된 파일", uploadImage); // 🚨사진이 바로 안넘어가고, 원래 있던 사진이 콘솔에 찍힘
    putUpdateProfileHandler(); // 사진 변경 PUT 시작!
  };

  // useEffect : 렌더링되면 실행!
  useEffect(() => {
    putUpdateProfileHandler();
  }, [uploadImage]);

  // PUT : 프로필 사진 - 앨범에서 선택
  const putUpdateProfileHandler = async () => {
    try {
      const formData = new FormData(); // 사진 업로드는 폼데이터로!!!!!!!!!
      formData.append("file", uploadImage);

      const response = await axiosInstance.put(
        "/api/users/profile/update-profileImg",
        formData
      );
      // console.log("앨범에서 선택 put 성공한 사진 : ", response);
      setProfileModal(false); // 모달닫기
      getMyPageInfo();
    } catch (error) {
      // console.log("error", error);
      // console.log("앨범에서 선택 put 실패한 사진 : ", uploadImage);
      setProfileModal(false); // 모달닫기
    }
  };

  // PUT : 프로필 사진 - 기본으로 설정
  const onClickDefaultProfileHandler = async () => {
    try {
      const response = await axiosInstance.put(
        "/api/users/profile/default-profileImg"
      );
      setProfileModal(false); // 모달 닫기
      // console.log("기본 프로필 put 성공 :", response);
    } catch (error) {
      setProfileModal(false); // 모달 닫기
      // console.log("error", error);
    }
  };

  // PUT : 소개글 변경
  const onClickSaveAboutMeHandler = async () => {
    try {
      const response = await axiosInstance.put(
        "/api/users/profile/update-aboutMe",
        {
          aboutMe,
        }
      );
      // console.log("소개글 put 성공 :", response);
      alert(response.data.msg);
      setAboutMeModal(false); // 모달창 닫기
      setMyPageInfo({ ...myPageInfo, aboutMe }); // 마이페이지 소개글에 바로 적용되게!
    } catch (error) {
      // console.log("error :", error);
    }
  };

  return (
    <Layout isBottomNav={true}>
      <div className="mx-4">
        <div className="mt-5 flex flex-row justify-end items-center">
          <div
            className="text-[#333333] mr-[7px] cursor-pointer text-sm/normal font-medium"
            onClick={onClickLogOutHandler}
          >
            로그아웃
          </div>
          <div onClick={onClickModifyHandler} className="m-1">
            <GearIcon />
          </div>
        </div>

        <div
          onClick={onClickProfileOpenHandler}
          className="flex flex-col items-center"
        >
          {/* 사진 선택 input */}
          <input
            type="file"
            accept="image/*"
            onChange={uploadImageHandler} // 파일 선택 시 uploadImageHandler 함수가 실행
            className="hidden"
            ref={inputRef}
          />
          <img
            className="mt-7 w-24 h-24 mx-auto rounded-full flex items-center justify-center cursor-pointer"
            // src={myPageInfo.profileImg ? myPageInfo.profileImg : defaultProfile}
            src={myPageInfo.profileImg}
          />
        </div>

        <div className="flex justify-center mt-3 text-xl/normal font-semibold">
          {myPageInfo.nickName}
        </div>

        <div
          onClick={onClickAboutMeOpenHandler}
          className="mt-5 w-full h-[94px] rounded-xl border border-[#F2F2F2] cursor-pointer"
        >
          <div className="mt-4 ml-4">
            {myPageInfo.aboutMe === null || myPageInfo.aboutMe === "" ? (
              <div>
                <div className="text-[14px] text-[#D9D9D9] font-medium leading-5">
                  아직 작성된 소개가 없어요.
                </div>
                <div className="text-[14px] text-[#D9D9D9] font-medium leading-5">
                  클릭해서 자기소개를 입력해주세요.
                </div>
              </div>
            ) : (
              myPageInfo.aboutMe
            )}
          </div>
        </div>

        <div className="mt-10 font-semibold text-base/normal text-[#333333">
          나의 여행계획
        </div>
        <div
          onClick={onClickLikeListHandler}
          className="mt-5 flex flex-row items-center cursor-pointer"
        >
          <Heart />
          <div className="ml-3 font-medium text-base/normal text-[#666666]">
            좋아요 목록
          </div>
        </div>
        <div
          onClick={onClickPostListHandler}
          className="mt-4 flex flex-row items-center cursor-pointer"
        >
          <MyWriting />
          <div className="ml-3 font-medium text-base/normal text-[#666666]">
            나의 게시글
          </div>
        </div>
        <div
          onClick={onClickCommentListHandler}
          className="mt-4 mb-28 flex flex-row items-center cursor-pointer"
        >
          <div className="mx-[2px]">
            <MyCommentList />
          </div>
          <div className="ml-3 font-medium text-base/normal  text-[#666666]">
            나의 댓글
          </div>
        </div>
      </div>

      {/* 프로필 모달 */}
      {profileModal && (
        <div
          onClick={onClickProfileCloseHandler}
          className="bg-[#666666]/50 w-full h-full absolute top-0 left-0 flex justify-center items-center"
        >
          <div
            onClick={(e) => e.stopPropagation()} // 외부영역만 클릭했을때 모달 닫히게!
            className=" w-full flex flex-col mt-auto mb-24"
          >
            <div className="mx-6 text-white font-normal text-lg/normal text-center">
              사진 업로드는 개당 1MB 내외로 업로드 가능합니다.
            </div>
            <div className="mt-4 mx-4 bg-[#F2F2F2] text-center h-[45px] flex items-center justify-center rounded-t-xl text-[#333333] text-[14px] leading-[100%] font-medium">
              프로필 사진 설정
            </div>
            <div
              onClick={onClickSelectProfileHandler}
              className="mx-4 bg-[#F2F2F2] border-[#666666] border-t-[0.5px] border-b-[0.5px] text-center h-14 flex items-center justify-center text-[#333333] text-[18px] leading-[100%] font-medium cursor-pointer"
            >
              앨범에서 사진 선택
            </div>
            <div
              onClick={onClickDefaultProfileHandler}
              className="mx-4 bg-[#F2F2F2] text-center h-14 flex items-center justify-center rounded-b-xl text-[#333333] text-[18px] leading-[100%] font-medium cursor-pointer"
            >
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

      {/* 소개글 모달 */}
      {aboutMeModal && (
        <div className="bg-[#333333]/80 w-full h-full absolute top-0 left-0 flex flex-col items-center">
          <div className=" mt-[61px] w-full flex flex-row text-white">
            <div
              onClick={onClickAboutMeCloseHandler}
              className="ml-4 text-base/normal font-normal flex items-center cursor-pointer"
            >
              취소
            </div>
            <div className="mx-auto text-xl/5 font-medium flex items-center">
              소개글 수정
            </div>
            <div
              onClick={onClickSaveAboutMeHandler}
              className="mr-4 text-base/normal font-normal cursor-pointer"
            >
              확인
            </div>
          </div>
          <div className="w-full px-4 mt-[186px]">
            <textarea
              value={aboutMe}
              onChange={onChangeAboutMeHandler}
              maxLength={80}
              rows={2}
              className="w-full bg-transparent text-center text-white placeholder:text-white border-b-[0.5px] border-[#D9D9D9] outline-none resize-none"
            />
          </div>
          <div className="mt-2 text-[#D9D9D9] text-xs/5 font-normal">
            {characterCount}/80
          </div>
        </div>
      )}
    </Layout>
  );
}
