import { useNavigate } from "react-router-dom";
import PostHeader from "../components/post/PostHeader";
import Layout from "../components/common/Layout";
import PostCategory from "../components/post/PostCategory";
import PostLine from "../components/post/PostLine";
import PostRanking from "../components/post/PostRanking";
import { axiosInstance } from "../api/axiosInstance";
import { useState, useEffect } from "react";

export default function PostListPage() {
  const [postList, setPostList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [likedStatus, setLikedStatus] = useState({});
  const navigate = useNavigate();
  const params = {
    page: "0",
    size: "10",
  };

  const getLikeStatusFromServer = async (postId) => {
    try {
      const response = await axiosInstance.get(`/api/posts/like/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return response.data.liked;
    } catch (error) {
      console.error("좋아요 상태 가져오기 오류:", error);
      return false;
    }
  };

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
      const liked = likedStatus[postId]; // 현재 상태를 가져옵니다.

      // 서버에 좋아요 상태를 업데이트하는 요청을 보냅니다.
      await axiosInstance.get(`/api/posts/like/${postId}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      // 클라이언트에서 좋아요 상태를 업데이트한 후,
      // liked 변수를 토글하여 클라이언트에서 좋아요를 누른 것처럼 가정합니다.
      const newLiked = !liked;

      // 상태를 업데이트하여 클라이언트에서 좋아요 상태를 갱신합니다.
      setLikedStatus((prevLikedStatus) => ({
        ...prevLikedStatus,
        [postId]: newLiked,
      }));

      // 좋아요 수를 업데이트합니다.
      setPostList((prevPostList) => {
        return prevPostList.map((item) => {
          if (item.postId === postId) {
            // 만약 좋아요를 취소한다면 likeNum을 1 감소시킵니다.
            if (liked) {
              return {
                ...item,
                likeNum: item.likeNum - 1,
              };
            }
            // 아니라면 likeNum을 1 증가시킵니다.
            return {
              ...item,
              likeNum: item.likeNum + 1,
            };
          }
          return item;
        });
      });
    } catch (error) {
      console.error("좋아요 클릭 오류:", error);
    }
  };

  useEffect(() => {
    getPostList();
  }, []);

  const filteredPostList = postList
    ? postList.filter((item) =>
        selectedCategory === "전체"
          ? true
          : item.postCategory === selectedCategory
      )
    : [];

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
                  {item.createdAt}
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
                  <div
                    className="cursor-pointer w-4 h-4 bg-gray-400 rounded-full"
                    onClick={() => handleLikeClick(item.postId)}
                  >
                    {likedStatus[item.postId] ? "❤️" : "🤍"}
                  </div>
                  <p className="cursor-pointer">좋아요</p>
                </div>

                <div className="flex items-center space-x-2 flex-1 justify-center">
                  <div className="w-4 h-4 bg-gray-400 rounded-full cursor-pointer"></div>
                  <p className="cursor-pointer">댓글달기</p>
                </div>
              </div>
              <PostLine />
            </div>
          ))
        ) : (
          <p>게시물이 없습니다.</p>
        )}
      </div>
    </Layout>
  );
}
