import { useNavigate } from "react-router-dom";
import PostHeader from "../components/post/PostHeader";
import Layout from "../components/common/Layout";
import PostCategory from "../components/post/PostCategory";
import PostLine from "../components/post/PostLine";

import { axiosInstance } from "../api/axiosInstance";
import { useState, useEffect, useRef } from "react";
import PostRanking from "../components/post/PostRanking";

export default function PostListPage() {
  const [postList, setPostList] = useState([]); // 초기값을 빈 배열로 설정
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const navigate = useNavigate();
  const params = {
    page: "1",
    size: "3",
  };

  const getPostList = async () => {
    try {
      const response = await axiosInstance.get("/api/posts", { params });

      console.log(response);
      setPostList(response.data.content);
    } catch (error) {
      console.error("데이터 가져오기 오류:", error);
    }
  };

  useEffect(() => {
    getPostList();
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

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
              <div className="flex items-center justify-between mb-2 mt-5 ">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full ml-4 cursor-pointer"></div>
                  <div className="flex flex-col ml-[13px]">
                    <p
                      className="text-[18px] font-semibold cursor-pointer"
                      onClick={() => handlePostClick(item.postId.toString())}
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
                onClick={() => handlePostClick(item.postId.toString())}
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
              <div className="flex items-center justify-between text-sm text-gray-500 h-[40px] bordertop-solid border-t-2 ">
                <div className="flex items-center space-x-2 flex-1 justify-center border-r-2 h-[40px]">
                  <div className="cursor-pointer w-4 h-4 bg-gray-400 rounded-full"></div>
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
          // 만약 postList가 빈 배열이나 null이면 여기에 렌더링할 내용을 추가하세요
          <p>게시물이 없습니다.</p>
        )}
      </div>
    </Layout>
  );
}
