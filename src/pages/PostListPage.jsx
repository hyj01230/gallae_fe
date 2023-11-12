import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { LikeHeart, LikeFullHeart, PostListComment } from "../assets/Icon";
import PostHeader from "../components/post/PostHeader";
import Layout from "../components/common/Layout";
import PostCategory from "../components/post/PostCategory";
import PostLine from "../components/post/PostLine";
import PostRanking from "../components/post/PostRanking";
import { axiosInstance } from "../api/axiosInstance";
import Comments from "../components/postDetailsPage/Comments";
import { formatDateDifference } from "../util/formatDate";

export default function PostListPage() {
  const [postList, setPostList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [likedStatus, setLikedStatus] = useState({});
  const navigate = useNavigate();
  const [page, setPage] = useState(0); // 현재 페이지 번호
  const [ref, inView] = useInView();
  const getaccessToken = () => {
    return localStorage.getItem("accessToken");
  };
  const [rankingList, setRankingList] = useState([]);
  const [expanded, setExpanded] = useState(false);

  const fetchRankingPosts = async () => {
    try {
      const response = await axiosInstance.get("/api/posts/rank");
      const rankingPosts = response.data;

      // 순위 목록을 최대 7개로 제한
      const limitedRankingPosts = rankingPosts.slice(0, 7);
      setRankingList(limitedRankingPosts);
    } catch (error) {
      console.error("순위 목록 가져오기 오류:", error);
    }
  };

  useEffect(() => {
    // 랭킹 가져오기
    fetchRankingPosts();
  }, []);

  const fetchLikedPosts = useCallback(async () => {
    const accessToken = getaccessToken();

    if (accessToken) {
      try {
        const response = await axiosInstance.get("/api/postlike/id");
        const likedPosts = response.data;

        // 서버에서 가져온 정보를 likedStatus 상태로 설정.
        const likedStatusMap = {};
        likedPosts.forEach((postId) => {
          likedStatusMap[postId] = true;
        });

        setLikedStatus(likedStatusMap);
      } catch (error) {
        // console.error("좋아요 정보 가져오기 오류:", error);
      }
    }
  }, []);

  useEffect(() => {
    // 좋아요 상태 가져오기
    fetchLikedPosts();
  }, []);

  const getPostList = async () => {
    try {
      console.log("getPostList 함수 호출");
      const response = await axiosInstance.get("/api/posts", {
        params: {
          page: `${page}`, // 현재 페이지 번호
          size: 5, // 원하는 페이지 크기(게시물 수)
        },
      });
      const newPosts = response.data.content;

      // newPosts를 기존 postList에 추가.
      setPostList((postList) => [...postList, ...newPosts]);

      // 응답에서 페이지 번호를 확인
      console.log("페이지 번호 (응답):", response.data.pageable.pageNumber);

      // 요청 성공 시에 페이지에 1 카운트 해주기
      // 라스트불린값이 트루면 끝 아니면 +1
      setPage((prevPage) => prevPage + 1);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPostList();
  }, []);

  useEffect(() => {
    if (inView) {
      getPostList();
    }
  }, [inView]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleLikeClick = async (postId) => {
    try {
      const response = await axiosInstance.get(`/api/posts/like/${postId}`);

      if (response.data.check) {
        // 게시물에 좋아요 추가
        setLikedStatus({ ...likedStatus, [postId]: true });

        // likeNum 증가
        setPostList((prevList) =>
          prevList.map((post) =>
            post.postId === postId
              ? { ...post, likeNum: post.likeNum + 1 }
              : post
          )
        );
      } else {
        // 게시물의 좋아요 취소
        setLikedStatus({ ...likedStatus, [postId]: false });

        // likeNum 감소
        setPostList((prevList) =>
          prevList.map((post) =>
            post.postId === postId
              ? { ...post, likeNum: post.likeNum - 1 }
              : post
          )
        );
      }

      // 좋아요 상태가 변경되면 랭킹 다시 업데이트
      fetchRankingPosts();
    } catch (error) {
      console.error("좋아요 토글 오류:", error);
    }
  };

  const filteredPostList = postList
    ? postList.filter((item) =>
        selectedCategory === "전체"
          ? true
          : item.postCategory === selectedCategory
      )
    : [];

  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [commentsModalData, setCommentsModalData] = useState({
    postId: null,
    commentsData: null,
  });

  const handleCommentClick = async (postId) => {
    try {
      // 해당 postId에 대한 댓글 정보 가져오기
      const response = await axiosInstance.get(`/api/posts/${postId}/comments`);

      // Comments 모달을 열어서 댓글 정보 전달
      openCommentsModal(response.data, postId);
    } catch (error) {
      console.error("댓글 정보 가져오기 오류:", error);
    }
  };

  const openCommentsModal = (commentsData, postId) => {
    // Comments 모달을 열기 위한 로직
    // 모달을 열기 위한 상태를 설정하고, 필요한 데이터를 전달
    // 예시로 postId와 commentsData를 모달에 전달합니다.
    // 이 데이터에 따라 Comments 컴포넌트에서 해당 댓글 정보를 표시할 수 있습니다.
    // 또한, 이런 상황에서 모달의 렌더링 여부와 데이터 전달을 관리하는 방식은
    // 프로젝트의 구조나 디자인에 따라 다를 수 있습니다.

    // 예시로 모달을 열기 위한 상태를 추가
    setIsCommentsModalOpen(true);

    // 예시로 모달에 필요한 데이터 전달
    setCommentsModalData({
      postId: postId,
      commentsData: commentsData,
    });
  };

  return (
    <Layout isBottomNav={true}>
      <div className="sticky top-0 bg-white z-10 ">
        <PostHeader />
        <PostCategory onCategorySelect={handleCategorySelect} />
      </div>
      <div className="overflow-y-auto mb-20">
        <div className="border-b-2 border-gray-100"></div>
        <PostRanking
          rankingList={rankingList}
          expanded={expanded}
          setExpanded={setExpanded}
        />
        <PostLine />
        <div className="overflow-y-auto">
          {filteredPostList && filteredPostList.length > 0 ? (
            filteredPostList.map((item) => (
              <div
                ref={ref}
                key={item.postId}
                className="w-393 h-275 bg-white flex flex-col relative"
              >
                <div className="flex items-center justify-between mb-2 mt-5">
                  <div className="flex items-center ">
                    <img
                      className="w-12 h-12 bg-gray-300 rounded-full ml-4 "
                      src={item.profileImage}
                      onClick={() =>
                        navigate(`/users/profile/${item.nickName}`)
                      } // 닉네임 파라미터 전달
                    />
                    <div className="flex flex-col ml-[13px]">
                      <span
                        className="text-[18px] font-semibold cursor-pointer"
                        onClick={() => navigate(`/posts/${item.postId}`)}
                      >
                        {item.title && item.title.length > 17
                          ? item.title.slice(0, 17) + "..."
                          : item.title}
                      </span>
                      <span className="text-[12px]  text-gray-500 mt-1 ">
                        {item.nickName}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 mr-4 mt-7">
                    {formatDateDifference(item.createdAt)}
                  </span>
                </div>
                <div onClick={() => navigate(`/posts/${item.postId}`)}>
                  {item.postsPicturesList.length > 0 ? (
                    <img
                      className="w-full aspect-video object-cover   "
                      src={item.postsPicturesList[0].postsPicturesURL}
                    />
                  ) : (
                    <p className=" text-4 text-black font-semibold text-center"></p>
                  )}
                </div>
                <span
                  className="text-3 mt-4 mx-5 cursor-pointer"
                  onClick={() => navigate(`/posts/${item.postId}`)}
                >
                  {item.contents && item.contents.length > 96
                    ? item.contents.slice(0, 96) + "..."
                    : item.contents}
                </span>
                <div className="flex items-center text-xs text-gray-500 mb-6 mt-6 ml-4">
                  <div className="">
                    {item && item.tagsList ? (
                      item.tagsList.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block text-[#999] border border-solid border-gray-300 rounded-full text-[11px] px-2 py-1 mr-1 cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))
                    ) : (
                      <p>Loading tags...</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 h-[40px] bordertop-solid border-t-2">
                  <div
                    className="flex items-center space-x-2 flex-1 justify-center "
                    onClick={() => handleCommentClick(item.postId)} // 댓글 클릭 시 이벤트 핸들러 추가
                  >
                    <div className="cursor-pointer">
                      <PostListComment />
                    </div>
                    <p className="cursor-pointer  text-[14px]">
                      {" "}
                      댓글 {item.commentNum}
                    </p>
                  </div>
                  <div
                    className="flex items-center space-x-2 flex-1 justify-center  h-[40px] "
                    onClick={() => {
                      if (!localStorage.getItem("accessToken")) {
                        alert("로그인이 필요한 서비스입니다.");
                        navigate("/login");
                      } else {
                        handleLikeClick(item.postId);
                      }
                    }}
                  >
                    <div className="cursor-pointer">
                      {likedStatus[item.postId] ? (
                        <LikeFullHeart />
                      ) : (
                        <LikeHeart />
                      )}
                    </div>
                    <p className="cursor-pointer text-[14px]">
                      좋아요 {item.likeNum}
                    </p>
                  </div>
                </div>
                <PostLine />
              </div>
            ))
          ) : (
            <div className="text-center p-4 bg-gray-100 border border-gray-300 rounded my-8">
              <p className="text-lg text-gray-600">게시물이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
      {isCommentsModalOpen && (
        <Comments
          postId={commentsModalData.postId}
          commentsData={commentsModalData.commentsData}
          handleCloseModal={() => setIsCommentsModalOpen(false)}
        />
      )}
    </Layout>
  );
}
