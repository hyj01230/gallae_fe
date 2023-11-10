import { useEffect, useState } from "react";
import { LeftArrow, ThreeDots } from "../assets/Icon";
import Layout from "../components/common/Layout";
import { axiosInstance } from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { shareKakao } from "../util/shareKakaoLink";
import { useInView } from "react-intersection-observer";

export default function MyPageLikeList() {
  // 페이지 이동
  const navigate = useNavigate();
  const onClickLeftArrowHandler = () => {
    if (!openModal) {
      navigate("/mypage");
    }
  };
  const onCilckLikePostHandler = (postId) => {
    if (!openModal) {
      navigate(`/posts/${postId}`);
    }
  };

  // 케밥 모달
  const [openModal, setOpenModal] = useState(false);
  const [modalPostId, setModalPostId] = useState("");
  const onClickThreeDotsHandler = (e, postId) => {
    e.stopPropagation();
    if (modalPostId === postId && openModal) {
      // 모달이 이미 열려 있을 때 누르면 모달 닫기
      setOpenModal(false);
    } else {
      setModalPostId(postId);
      setOpenModal(true);
    }
  };

  const closeAllModals = () => {
    setModalPostId(""); // 모달 상태 초기화
    setOpenModal(false); // 모달 닫기
  };

  useEffect(() => {
    // 모달이 열려 있을 때, 외부 영역 클릭 시 모달 닫기
    window.addEventListener("click", closeAllModals);

    return () => {
      // 컴포넌트 언마운트 시에 리스너 제거
      window.removeEventListener("click", closeAllModals);
    };
  }, []);

  // 무한스크롤
  // ref : 관찰할 객체
  // inView : ref가 화면에 보이면 true로 변경됨
  const [ref, inView] = useInView();
  const [page, setPage] = useState(0); // 페이지 수 관리
  const [likeList, setLikeList] = useState([]); // get으로 가져온 사용자별 좋아요 게시글 데이터(getLikeList)
  const [last, setLast] = useState(false); // 마지막 페이지 확인

  // GET : 사용자별 좋아요 게시글 가져오기
  const getLikeList = async () => {
    try {
      const response = await axiosInstance.get("/api/posts/like", {
        params: {
          page: `${page}`, // 현재 페이지 번호
          size: 5, // 원하는 페이지 크기(게시물 수)
        },
      });
      // console.log("response", response);

      setLikeList((likeList) => [...likeList, ...response.data.content]); // 기존 데이터에 새 데이터 추가
      setPage((page) => page + 1); // 페이지 번호 +1 시킴
      setLast(response.data.last); // 마지막 페이지 확인값
    } catch (error) {
      // console.log("error", error);
    }
  };

  // useEffect : 렌더링되면 getLikeList 데이터 가져오기!
  useEffect(() => {
    getLikeList();
  }, []);

  // inView 상태가 true일 때(= 관찰한 게시물 ref가 화면에 보일 때 = 마지막)
  // 좋아요한 게시물 목록을 추가로 가져오기
  useEffect(() => {
    if (inView) {
      getLikeList();
      // console.log("📢 데이터를 더 가져와랏!!", inView);
      // console.log("page 번호", page);
      // console.log("로드된 데이터", likeList);
      // console.log("🔍 막지막 페이지 확인", last);
    }
  }, [inView]);

  const onClickLikeCancleHandler = async (postId) => {
    try {
      const response = await axiosInstance.get(`/api/posts/like/${postId}`);
      // console.log("response", response);
      getLikeList();
    } catch (error) {
      // console.log("error", error);
    }
  };

  // 입력 일자 표시
  const getTimeAgo = (timestamp) => {
    const createdAtDate = new Date(timestamp); // 날짜 객체 생성

    const year = createdAtDate.getFullYear(); // 년, 월, 일 추출
    const month = (createdAtDate.getMonth() + 1).toString().padStart(2, "0");
    const day = createdAtDate.getDate().toString().padStart(2, "0");

    return `${year}.${month}.${day}`; // 변경된 날짜 형식 반환
  };

  // 카카오 공유하기
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  return (
    <Layout isBottomNav={true}>
      <div className="bg-white fixed max-w-3xl w-full pt-3 pl-4 pb-[10px] flex justify-start items-center">
        <div onClick={onClickLeftArrowHandler} className="cursor-pointer">
          <LeftArrow />
        </div>

        <div className="ml-[18px] text-xl/8 font-semibold">좋아요 목록</div>
      </div>

      <div className="mt-[73px] mb-44">
        {likeList.length > 0 ? (
          likeList.map((item) => (
            <div
              ref={ref}
              key={item.postId}
              onClick={() => onCilckLikePostHandler(item.postId)}
              className="mx-4 cursor-pointer"
            >
              <div className="mt-4 flex w-full">
                <div className="flex flex-col w-full mr-auto">
                  <div className="text-sm/[22px] font-semibold">
                    {item.title}
                  </div>
                  <div className="mt-2 text-xs/[18px] font-normal text-[#999999]">
                    {item.contents}
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="ml-3 w-[88px] h-[88px] bg-[#F2F2F2] rounded-lg flex items-center justify-center">
                    {item.postsPicturesList.length > 0 ? (
                      <img
                        className="w-[88px] h-[88px] rounded-lg"
                        src={item.postsPicturesList[0].postsPicturesURL}
                      />
                    ) : (
                      <p className=" text-4 text-black font-semibold text-center">
                        대표 이미지
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-2 flex items-center border-b-[1px] border-[#F2F2F2] pb-3 ">
                <div className="mr-4 text-[#999999] text-sm/6 font-normal">
                  {item.nickName}
                </div>
                <div className="mr-auto text-[#999999] text-sm/6 font-normal">
                  {getTimeAgo(item.createdAt)}
                </div>
                <div
                  onClick={(e) => {
                    onClickThreeDotsHandler(e, item.postId);
                  }}
                >
                  <ThreeDots />
                  {/* 케밥 모달 */}
                  {modalPostId === item.postId && openModal && (
                    <div className="absolute right-4">
                      <div className="w-[136px] h-[80px] bg-white shadow-[0_0_4px_4px_rgba(0,0,0,0.05)]">
                        <div
                          onClick={() => onClickLikeCancleHandler(item.postId)}
                          className="pl-3 w-full h-10 border-b border-[#F2F2F2] flex justify-start items-center cursor-pointer"
                        >
                          좋아요 취소
                        </div>
                        <div
                          onClick={() => shareKakao(item.title, item.postId)}
                          className="pl-3 w-full h-10 flex justify-start items-center cursor-pointer"
                        >
                          공유하기
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="mx-4">
            <div className="mt-4 flex w-full justify-center">
              좋아요 목록이 없습니다.
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
