import { useEffect, useState } from "react";
import { LeftArrow, Plus, ThreecIrcle } from "../../assets/Icon";
import Layout from "../../components/common/Layout";
import { useNavigate } from "react-router-dom";
import { getPostListAPI, updatePost } from "../../api";
import { shareKakao } from "../../util/shareKakaoLink";
// import { deleteScheduleDetail } from "../api";

export default function MyPagePostList() {
  // 페이지 이동
  const navigate = useNavigate();

  // 게시글 삭제 후 페이지 업데이트
  const [isUpdate, setIsUpdate] = useState(false);

  const onClickLeftArrowHandler = () => {
    navigate("/mypage");
  };
  const onCilckMyPostHandler = (postId) => {
    if (!openModal) {
      navigate(`/posts/${postId}`);
    }
  };

  const [openModal, setOpenModal] = useState(false);
  const [modalPostId, setModalPostId] = useState("");
  const onClickThreeCIrcleHandler = (e, postId) => {
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
  const [postList, setPostList] = useState([]);

  // GET : 사용자별 게시글 가져오기
  const getPostList = async () => {
    try {
      const response = await getPostListAPI();
      setPostList(response.data);
    } catch (error) {
      // alert(error.response.data.msg);
    }
  };

  // 게시글 삭제하기 (여행일정은 남겨두고 게시글만 삭제하기)
  const onClickDeleteeHandler = async (item) => {
    try {
      const { postId, postCategory, tagsList, subTitle } = item;

      // 여행일정은 남겨두고 게시글만 삭제하기 위해서
      // title과 contents에 null 값을 할당한다.
      const updatePostData = {
        title: null,
        contents: null,
        postCategory,
        tagsList,
        subTitle,
      };

      await updatePost(postId, updatePostData);

      // 게시글이 삭제되면 모달을 닫는다.
      setOpenModal(false);

      // 페이지를 업데이트하기 위해 useState 상태를 변경한다.
      setIsUpdate(!isUpdate);
    } catch (error) {
      // alert(error.response.data.msg);
    }
  };

  // const onClickEditHandler = () => {
  //   navigate("/post/edit");
  // };

  // useEffect : 렌더링되면 실행!
  useEffect(() => {
    getPostList();
  }, [isUpdate]);

  // 시간 표시
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear().toString().slice(2); // Get the last two digits of the year
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month starts from 0
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}.${month}.${day}`;
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

        <div className="ml-[18px] mr-auto text-xl/8 font-semibold text-[#333333]">
          나의 게시글
        </div>
        <div onClick={() => navigate(`/myschedules`)} className="mr-4">
          <Plus />
        </div>
      </div>

      {postList.length > 0 && postList.find((item) => item.contents) ? (
        postList
          .filter((item) => item.contents)
          .map((item) => (
            <div key={item.postId} className="mt-[73px] mb-44">
              <div
                onClick={() => onCilckMyPostHandler(item.postId)}
                className="mx-4 mb-4 cursor-pointer"
              >
                <div className="flex flex-col w-full border rounded-xl border-[#D9D9D9">
                  <div>
                    {item.postsPicturesList.length > 0 ? (
                      <img
                        className="w-full h-[167px] rounded-t-xl"
                        src={item.postsPicturesList[0].postsPicturesURL}
                      />
                    ) : (
                      <div className="w-full h-[167px] bg-[#F2F2F2] text-4 text-black font-semibold flex justify-center items-center ">
                        대표 이미지
                      </div>
                    )}
                  </div>
                  <div className="ml-[14px] mr-1 mt-3 flex flex-row items-center justify-between">
                    <div className="text-lg/normal font-semibold text-[#333333]">
                      {item.title}
                    </div>
                    <div
                      onClick={(e) => {
                        onClickThreeCIrcleHandler(e, item.postId);
                      }}
                    >
                      <ThreecIrcle />
                      {/* 케밥 모달 */}
                      {modalPostId === item.postId && openModal && (
                        <div className="absolute right-6">
                          <div className="w-[136px] h-[121px] bg-white shadow-[0_0_4px_4px_rgba(0,0,0,0.05)]">
                            <div
                              onClick={() => onClickDeleteeHandler(item)}
                              className="pl-3 w-full h-10 border-b border-[#F2F2F2] flex justify-start items-center cursor-pointer"
                            >
                              삭제하기
                            </div>
                            <div
                              onClick={() =>
                                navigate("/post/edit", { state: item })
                              }
                              className="pl-3 w-full h-10 border-b border-[#F2F2F2] flex justify-start items-center cursor-pointer"
                            >
                              수정하기
                            </div>
                            <div
                              onClick={() =>
                                shareKakao(item.title, item.postId)
                              }
                              className="pl-3 w-full h-10 flex justify-start items-center cursor-pointer"
                            >
                              공유하기
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-[9px] px-3">
                    {item.tagsList &&
                      item.tagsList.map((tag, index) => (
                        <div
                          key={index}
                          className="mr-1 inline-block border text-center border-[#D9D9D9] rounded-xl px-[9px] py-1 h-5 text-xs/3 font-normal text-[#888888]"
                        >
                          {tag}
                        </div>
                      ))}
                  </div>

                  <div className="mt-8 mb-4 ml-3 mr-[14px] flex justify-between items-center">
                    <div className="flex flex-row text-xs/3 text-[#666666] font-normal">
                      <div className="mr-2 text-[#666666]">
                        댓글 {item.commentNum}
                      </div>
                      <div className="text-[#666666]">
                        좋아요 {item.likeNum}
                      </div>
                    </div>
                    <div className="text-xs/normal font-normal text-[#666666]">
                      게시일 {formatDate(item.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
      ) : (
        <div className="pb-[84px] flex flex-col justify-center items-center min-h-screen">
          <div className="w-[184px] h-[184px] flex justify-center items-center">
            <img
              src={"/img/myPagePostsEmpty.png"}
              className="w-[184px] h-[184px]"
            />
          </div>
          <div className="mt-[30px] flex flex-col items-center">
            <div className="text-base/7 font-semibold text-[#D9D9D9]">
              아직 작성 게시글이 없어요.
            </div>
            <div className="text-base/7 font-semibold text-[#D9D9D9]">
              우측의 <span className="text-[#FF9900]">버튼+</span>을 눌러
              게시글을 업로드 해볼까요?
            </div>
          </div>
          <div className="flex flex-col justify-center items-center"></div>
        </div>
      )}
    </Layout>
  );
}
