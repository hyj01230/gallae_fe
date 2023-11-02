import { useEffect, useState } from "react";
import { LeftArrow, ThreeDots } from "../assets/Icon";
import Layout from "../components/common/Layout";
import { axiosInstance } from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { shareKakao } from "../util/shareKakaoLink";

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

  // useState : get으로 가져온 사용자별 좋아요 게시글 데이터(getLikeList)
  const [likeList, setLikeList] = useState([]);

  // GET : 사용자별 좋아요 게시글 가져오기
  const getLikeList = async () => {
    try {
      const response = await axiosInstance.get("/api/posts/like", {
        params: {
          page: 0, // 원하는 페이지 번호
          size: 20, // 원하는 페이지 크기
        },
      });
      console.log("response", response);
      setLikeList(response.data.content);
    } catch (error) {
      console.log("error", error);
    }
  };

  const onClickLikeCancleHandler = async (postId) => {
    try {
      const response = await axiosInstance.get(`/api/posts/like/${postId}`);
      console.log("response", response);
      getLikeList();
    } catch (error) {
      console.log("error", error);
    }
  };

  // useEffect : 렌더링되면 실행!
  useEffect(() => {
    getLikeList();
  }, []);

  // 입력 시간 표시
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const createAt = new Date(timestamp);
    const timeDiff = now - createAt;
    const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));

    if (hoursAgo < 1) {
      const minutesAgo = Math.floor(timeDiff / (1000 * 60));
      if (minutesAgo < 1) {
        return "방금 전";
      }
      return `${minutesAgo}분 전`;
    }

    if (hoursAgo < 24) {
      return `${hoursAgo}시간 전`;
    }

    const daysAgo = Math.floor(hoursAgo / 24);
    if (daysAgo === 1) {
      return "어제";
    }

    // 년-월-일 시간:분 형식으로 날짜 및 시간 표시
    const formattedDate = `${createAt.getFullYear()}-${(createAt.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${createAt
      .getDate()
      .toString()
      .padStart(2, "0")} ${createAt
      .getHours()
      .toString()
      .padStart(2, "0")}:${createAt.getMinutes().toString().padStart(2, "0")}`;
    return formattedDate;
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
      <div className="mt-3 ml-4 flex justify-start items-center">
        <div onClick={onClickLeftArrowHandler} className="cursor-pointer">
          <LeftArrow />
        </div>

        <div className="ml-[18px] text-xl/8 font-semibold">좋아요 목록</div>
      </div>
      <hr className="mt-3 border-[#F2F2F2] border-t-[1px]"></hr>

      <div className="mb-44">
        {likeList.length > 0 &&
          likeList.map((item) => (
            <div
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
                <div className="mr-4 text-[#999999] text-[20px] font-normal">
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
          ))}
      </div>
    </Layout>
  );
}
