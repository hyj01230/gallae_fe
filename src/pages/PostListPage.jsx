import { useNavigate } from "react-router-dom";
import PostHeader from "../components/post/PostHeader";
import Layout from "../components/common/Layout";
import PostRanking from "../components/post/PostRanking";
import PostCategory from "../components/post/PostCategory";
import PostLine from "../components/post/PostLine";
import PostWrite from "../components/post/PostWrite";
import axios from "axios";
import { useState, useEffect } from "react";

//TODO : 헤더 카테고리 순위 피드 순 ***
//TODO : 게시글 다 안나오게 하기 (...더보기)
//TODO : 닉네임은 어디에
//TODO : 마진 탑 4px주기
//TODO : 시간 위치 맞추기
//TODO : 커서
//TODO : 좋아요 댓글달기 전체 박스볼더 주기
//TODO : 시간 어떻게 표시할지? 언제까지 몇분전 몇시간전으로 할건지, 날짜가 뜨게 하는건 언제부턴지 생각하고 찾아보기
//TODO : 무한스크롤링 (레이지로딩) --> 제일 마지막

export default function PostListPage() {
  const [postList, setPostList] = useState([]);

  const getPostList = async () => {
    try {
      const resp = await axios.get("/api/posts");
      setPostList(resp.data.data);
    } catch (error) {
      console.error("데이터 가져오기 오류:", error);
    }
  };

  useEffect(() => {
    getPostList(); // 1) 게시글 목록 조회 함수 호출
  }, []);
  const navigate = useNavigate();

  const handlePostClick = (postId) => {
    const url = `/post/${postId}`;
    navigate(url);
  };

  return (
    <Layout>
      <div>
        <PostHeader />
        <PostCategory />
        <div className="border-b-2 border-gray-100"></div>
        <PostRanking />
        <PostLine />

        {postList.map((item, index) => (
          <div
            key={index}
            onClick={() => handlePostClick(item.postId.toString())}
            className="w-393 h-275 bg-white flex flex-col relative"
          >
            <div className="flex items-center justify-between mb-2 mt-5">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full ml-4  cursor-pointer"></div>
                <div className="flex flex-col ml-[13px]">
                  <p
                    className="text-[18px] font-semibold cursor-pointer"
                    onClick={() => navigate(`/post/:${item.postId}`)}
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
            <p className="text-3 mt-4 mx-5  cursor-pointer">
              {item.contents.length > 100
                ? item.contents.slice(0, 100) + "..."
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
            <div className="flex items-center justify-between text-sm text-gray-500 h-[40px] bordertop-solid border-y-2">
              <div className="flex items-center space-x-2 flex-1 justify-center ">
                <div className=" cursor-pointer w-4 h-4 bg-gray-400 rounded-full"></div>
                <p className="cursor-pointer">좋아요</p>
              </div>

              <div className="border border-gray-500 "></div>
              <div className="flex items-center space-x-2 flex-1 justify-center">
                <div className="w-4 h-4 bg-gray-400 rounded-full cursor-pointer"></div>
                <p className="cursor-pointer">댓글달기</p>
              </div>
            </div>
            <PostLine />
          </div>
        ))}
        <PostWrite />
      </div>
    </Layout>
  );
}
