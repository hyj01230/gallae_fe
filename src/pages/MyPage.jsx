import Layout from "../components/common/Layout";
import {
  GearIcon,
  Heart,
  MyCommentList,
  MyWriting,
  MypageProfileEdit,
} from "../assets/Icon";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { removeCookie } from "../util/cookie";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  getMyPageInfoAPI,
  putUpdateProfileAPI,
  putDefaultProfileAPI,
  putAboutMeAPI,
} from "../api";

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

  // React-Query
  const queryClient = useQueryClient();

  // useState
  const [profileModal, setProfileModal] = useState(false); // 모달 : 프로필 사진
  const [aboutMeModal, setAboutMeModal] = useState(false); // 모달 : 소개글
  const [aboutMe, setAboutMe] = useState(""); // 소개글 데이터
  const [characterCount, setCharacterCount] = useState(0); // 소개글 입력 글자수

  // GET : 마이페이지 데이터 가져오기
  const { isLoading, data } = useQuery("myPage", getMyPageInfoAPI);

  // 프로필 사진 관련 --------------------------------------------------
  // useRef(input-div 연결)
  const inputRef = useRef(null); // 사진선택 input - 앨범에서 선택 연결
  const onClickSelectProfileHandler = () => {
    inputRef.current.click(); // 앨범에서 선택 - 사진선택 input 연결
  };

  // PUT : 프로필 사진 변경(앨범)
  const updateProfileMutation = useMutation(
    (formData) => putUpdateProfileAPI(formData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("myPage");
        setProfileModal(false);
      },
    }
  );

  // 프로필 사진 : 이미지 선택창 나옴
  const uploadImageHandler = (e) => {
    const selectImage = e.target.files[0]; // 선택된 파일 가져오기
    const formData = new FormData(); // 사진 업로드는 폼데이터로!!!!!!!!!
    formData.append("file", selectImage);
    updateProfileMutation.mutate(formData);
  };

  // PUT : 프로필 사진 변경(기본)
  const defaultProfileMutation = useMutation(putDefaultProfileAPI, {
    onSuccess: (response) => {
      queryClient.invalidateQueries("myPage");
      setProfileModal(false);
    },
    onError: (error) => {
      setProfileModal(false);
    },
  });

  // PUT : 소개글 변경
  const aboutMeMutation = useMutation(() => putAboutMeAPI(aboutMe), {
    onSuccess: (response) => {
      queryClient.invalidateQueries("myPage");
      setAboutMeModal(false); // 모달창 닫기
    },
  });

  // 소개글 : onChange
  const onChangeAboutMeHandler = (e) => {
    const newText = e.target.value;
    setAboutMe(newText);
    setCharacterCount(newText.length); // 글자 수 업데이트
  };

  if (isLoading) {
    return <div>로딩중</div>;
  }

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
          onClick={() => {
            setProfileModal(true);
          }}
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
            src={data.profileImg}
          />
          <div className="absolute mt-[86px] ml-16">
            <MypageProfileEdit />
          </div>
        </div>

        <div className="flex justify-center mt-3 text-xl/normal font-semibold">
          {data.nickName}
        </div>

        <div
          onClick={() => {
            setAboutMeModal(true);
          }}
          className="mt-5 w-full min-h-[94px] rounded-xl border border-[#F2F2F2] cursor-pointer"
        >
          <div className="my-4 ml-4">
            {data.aboutMe === null || data.aboutMe === "" ? (
              <div>
                <div className="text-[14px]/5 text-[#D9D9D9] font-medium leading-5">
                  아직 작성된 소개가 없어요.
                </div>
                <div className="mt-1 text-[14px]/5 text-[#D9D9D9] font-medium leading-5">
                  클릭해서 자기소개를 입력해주세요.
                </div>
              </div>
            ) : (
              <div className="whitespace-pre-line">{data.aboutMe}</div>
            )}
          </div>
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
          className="mt-5 flex flex-row items-center cursor-pointer"
        >
          <MyWriting />
          <div className="ml-3 font-medium text-base/normal text-[#666666]">
            나의 게시글
          </div>
        </div>
        <div
          onClick={onClickCommentListHandler}
          className="mt-5 mb-28 flex flex-row items-center cursor-pointer"
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
          onClick={() => {
            setProfileModal(false);
          }}
          className="bg-[#666666]/50 w-full h-full absolute top-0 left-0 flex justify-center items-center"
        >
          <div
            onClick={(e) => e.stopPropagation()} // 외부영역만 클릭했을때 모달 닫히게!
            className=" w-full flex flex-col mt-auto mb-24"
          >
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
              onClick={() => defaultProfileMutation.mutate()}
              className="mx-4 bg-[#F2F2F2] text-center h-14 flex items-center justify-center rounded-b-xl text-[#333333] text-[18px] leading-[100%] font-medium cursor-pointer"
            >
              기본으로 설정
            </div>
            <div
              onClick={() => {
                setProfileModal(false);
              }}
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
              onClick={() => {
                setAboutMeModal(false);
              }}
              className="ml-4 text-base/normal font-normal flex items-center cursor-pointer"
            >
              취소
            </div>
            <div className="mx-auto text-xl/5 font-medium flex items-center">
              소개글 수정
            </div>
            <div
              onClick={() => aboutMeMutation.mutate(aboutMe)}
              className="mr-4 text-base/normal font-normal cursor-pointer"
            >
              확인
            </div>
          </div>
          <div className="w-full px-4 mt-[186px]">
            <textarea
              value={aboutMe || ""} // aboutMe가 null이거나 undefined일 때 빈 문자열을 할당해서 빈값일때 나타나는 에러 잡기!
              onChange={onChangeAboutMeHandler}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              maxLength={80}
              rows={1}
              className="w-full bg-transparent text-center text-white placeholder:text-white border-b border-[#D9D9D9] outline-none resize-none"
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

// React Query : useQuery(GET), useMutation(POST, PUT, DELETE)
// React Query를 통해서 마이페이지 정보 불러오기(api/index 에 있는 getMyPageInfo를 임포트!)

// PUT : 프로필 사진 변경(앨범) 리팩토링 과정
// Before
// 1. onClickSelectProfileHandler
// 2. upLoadImageHandler(detUploadImage, detIsUpdate, putUpdateProfileHandler)
// 3. putUpdateprofileHandler(formData 처리, 사진업로드 API, setProfileModal, getMyPageInfo)
// 4. useEffect(isUpdate, getMyPageInfo)

// After
// 1. onClickSelectProfileHandler
// 2. uploadImageHandler(formData 처리, useMutation)
// 3. updateProfileMutation(querykey, setProfileModal)
