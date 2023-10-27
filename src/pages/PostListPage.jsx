import { useNavigate } from "react-router-dom";
import PostHeader from "../components/post/PostHeader";
import Layout from "../components/common/Layout";
import PostCategory from "../components/post/PostCategory";
import PostLine from "../components/post/PostLine";
import PostRanking from "../components/post/PostRanking";
import { axiosInstance } from "../api/axiosInstance";
import { useState, useEffect, useCallback } from "react";
import { LikeHeart, LikeFullHeart, PostListComment } from "../assets/Icon";
import { useInView } from "react-intersection-observer";

export default function PostListPage() {
  const [postList, setPostList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [likedStatus, setLikedStatus] = useState({});
  const navigate = useNavigate();
  const [page, setPage] = useState(0); // 현재 페이지 번호 (페이지네이션)
  const [ref, inView] = useInView();

  const getaccessToken = () => {
    return localStorage.getItem("accessToken"); // 로그인 후 토큰을 저장한 방식에 따라 가져옵니다.
  };

  const fetchLikedPosts = useCallback(async () => {
    const accessToken = getaccessToken();

    if (accessToken) {
      try {
        const response = await axiosInstance.get("/api/postlike/id");
        const likedPosts = response.data;

        // 서버에서 가져온 정보를 likedStatus 상태로 설정합니다.
        const likedStatusMap = {};
        likedPosts.forEach((postId) => {
          likedStatusMap[postId] = true;
        });

        setLikedStatus(likedStatusMap);
      } catch (error) {
        console.error("좋아요 정보 가져오기 오류:", error);
      }
    }
  }, []);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 사용자의 좋아요 상태를 가져옵니다.
    fetchLikedPosts();
  }, [fetchLikedPosts]);

  const params = {
    page: `${page}`, // 백틱으로 변수를 문자열로 변환
    size: "10",
  };

  const getPostList = async () => {
    // console.log("getPostList 함수 호출"); // 함수가 호출되는지 확인
    const response = await axiosInstance.get("/api/posts", { params });

    try {
      // const newPosts = response.data.content;

      // 이제 newPosts를 기존 postList에 추가합니다.
      setPostList([...postList, ...response.data.content]);

      // 응답에서 페이지 번호를 확인
      // console.log("페이지 번호 (응답):", response.data.pageable.pageNumber);

      // 요청 성공 시에 페이지에 1 카운트 해주기
      // 라스트불린값이 트루면 끝 아니면 +1
      setPage((prevPage) => prevPage + 1);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // inView가 true 일때만 실행한다.
    if (inView) {
      // console.log(inView, "무한 스크롤 요청 🎃");
      getPostList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  function formatDateDifference(createdAt) {
    const createdAtDate = new Date(createdAt); // createdAt는 ISO 8601 형식의 문자열이어야 합니다.
    const now = new Date();
    const timeDifference = now - createdAtDate;
    const minutesDifference = Math.floor(timeDifference / (1000 * 60)); // 분 단위
    const hoursDifference = Math.floor(minutesDifference / 60); // 시간 단위
    const daysDifference = Math.floor(hoursDifference / 24); // 일 단위

    if (minutesDifference === 0) {
      return "방금";
    } else if (daysDifference === 1) {
      return "어제";
    } else if (minutesDifference < 60) {
      return `${minutesDifference}분 전`;
    } else if (hoursDifference < 24) {
      return `${hoursDifference}시간 전`;
    } else if (daysDifference < 7) {
      return `${daysDifference}일 전`;
    } else {
      const weeksDifference = Math.floor(daysDifference / 7); // 주 단위
      return `${weeksDifference}주 전`;
    }
  }
  return (
    <Layout isBottomNav={true}>
      <div className="sticky top-0 bg-white z-10 ">
        <PostHeader />
        <PostCategory onCategorySelect={handleCategorySelect} />
      </div>
      <div ref={ref} className="overflow-y-auto">
        <div className="border-b-2 border-gray-100"></div>
        <PostRanking postList={postList} />
        <PostLine />
        <div className="overflow-y-auto">
          {filteredPostList && filteredPostList.length > 0 ? (
            filteredPostList.map((item) => (
              <div
                key={item.postId} // 고유한 식별자를 사용
                className="w-393 h-275 bg-white flex flex-col relative"
              >
                <div className="flex items-center justify-between mb-2 mt-5">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full ml-4 cursor-pointer"></div>
                    <div className="flex flex-col ml-[13px]">
                      <span
                        className="text-[18px] font-semibold cursor-pointer"
                        onClick={() => navigate(`/posts/${item.postId}`)}
                      >
                        {item.title}
                      </span>
                      <span className="text-xs text-gray-500 mt-1 cursor-pointer">
                        {item.postCategory}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 mr-4">
                    {formatDateDifference(item.createdAt)}
                    <p className="w-2 h-2 ml-[11px] mr-[15px] bg-gray-400 rounded-full inline-block"></p>
                  </span>
                </div>
                <span
                  className="text-3 mt-4 mx-5 cursor-pointer"
                  onClick={() => navigate(`/posts/${item.postId}`)}
                >
                  {item.contents && item.contents.length > 200
                    ? item.contents.slice(0, 200) + "..."
                    : item.contents}
                </span>
                <div className="flex items-center text-xs text-gray-500 mb-6 mt-6 ml-4">
                  <div>
                    <p className="ml-1">좋아요 {item.likeNum} · </p>
                  </div>
                  <div>
                    <p className="ml-1">댓글 {item.commentNum} · </p>
                  </div>
                  <div>
                    <p className="ml-1">조회수 {item.viewNum}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 h-[40px] bordertop-solid border-t-2">
                  <div className="flex items-center space-x-2 flex-1 justify-center border-r-2 h-[40px]">
                    <div onClick={() => handleLikeClick(item.postId)}>
                      {likedStatus[item.postId] ? (
                        <LikeFullHeart />
                      ) : (
                        <LikeHeart />
                      )}
                    </div>
                    <p className="cursor-pointer">좋아요</p>
                  </div>

                  <div className="flex items-center space-x-2 flex-1 justify-center">
                    <PostListComment />
                    <p className="cursor-pointer"> 댓글달기</p>
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
    </Layout>
  );
}
