import { useNavigate } from "react-router-dom";
import PostHeader from "../components/post/PostHeader";
import Layout from "../components/common/Layout";
import PostCategory from "../components/post/PostCategory";
import PostLine from "../components/post/PostLine";
import PostRanking from "../components/post/PostRanking";
import { axiosInstance } from "../api/axiosInstance";
import { useState, useEffect } from "react";
import { Like_Heart, Like_Full_Heart, PostList_Comment } from "../assets/Icon";

export default function PostListPage() {
  const [postList, setPostList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [likedStatus, setLikedStatus] = useState({});
  const navigate = useNavigate();
  const params = {
    page: "0",
    size: "10",
  };

  useEffect(() => {
    getPostList();
  }, []);

  const getPostList = async () => {
    try {
      const response = await axiosInstance.get("/api/posts", { params });
      setPostList(response.data.content);
    } catch (error) {
      console.error("데이터 가져오기 오류:", error);
    }
  };

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
    const createdAtDate = new Date(createdAt);
    const now = new Date();

    const timeDifference = now - createdAtDate;
    const minutesDifference = Math.floor(timeDifference / (1000 * 60)); // 차이를 분으로 변환

    if (minutesDifference < 60) {
      // 1시간 미만일 경우
      return `${minutesDifference}분 전`;
    } else if (minutesDifference < 24 * 60) {
      // 1일 미만일 경우
      const hoursDifference = Math.floor(minutesDifference / 60);
      return `${hoursDifference}시간 전`;
    } else {
      // 1일 이상일 경우
      const daysDifference = Math.floor(minutesDifference / (60 * 24));
      return `${daysDifference}일 전`;
    }
  }

  return (
    <Layout>
      <div>
        <PostHeader />
        <PostCategory onCategorySelect={handleCategorySelect} />
        <div className="border-b-2 border-gray-100"></div>
        <PostRanking postList={postList} />
        <PostLine />
        {filteredPostList && filteredPostList.length > 0 ? (
          filteredPostList.map((item, index) => (
            <div
              key={index}
              className="w-393 h-275 bg-white flex flex-col relative"
            >
              <div className="flex items-center justify-between mb-2 mt-5">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full ml-4 cursor-pointer"></div>
                  <div className="flex flex-col ml-[13px]">
                    <p
                      className="text-[18px] font-semibold cursor-pointer"
                      onClick={() => navigate(`/posts/${item.postId}`)}
                    >
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 cursor-pointer">
                      {item.postCategory}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mr-4">
                  {formatDateDifference(item.createdAt)}
                  <p className="w-2 h-2 ml-[11px] mr-[15px] bg-gray-400 rounded-full inline-block"></p>
                </p>
              </div>
              <p
                className="text-3 mt-4 mx-5 cursor-pointer"
                onClick={() => navigate(`/posts/${item.postId}`)}
              >
                {item.contents && item.contents.length > 200
                  ? item.contents.slice(0, 200) + "..."
                  : item.contents}
              </p>
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
                      <Like_Full_Heart />
                    ) : (
                      <Like_Heart />
                    )}
                  </div>
                  <p className="cursor-pointer">좋아요</p>
                </div>

                <div className="flex items-center space-x-2 flex-1 justify-center">
                  <PostList_Comment />
                  <p className="cursor-pointer"> 댓글달기</p>
                </div>
              </div>
              <PostLine />
            </div>
          ))
        ) : (
          <div className="text-center p-4 bg-gray-100 border  border-gray-300 rounded my-8">
            <p className="text-lg text-gray-600">게시물이 없습니다.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
