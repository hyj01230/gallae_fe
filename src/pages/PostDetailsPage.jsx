import Layout from "../components/common/Layout";
import PostLine from "../components/post/PostLine";
import DetailsHeader from "../components/postDetailsPage/DetailsHeader";
import Image from "../components/postDetailsPage/Image";
import { axiosInstance } from "../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function PostDetailsPage() {
  const [postDetails, setPostDetails] = useState({
    title: "",
    tagsList: [],
    nickName: "",
    likeNum: "",
    viewNum: "",
    createdAt: "",
    modifiedAt: "",

    // 다른 속성들 초기값 설정
  });
  const { postId } = useParams(); // useParams 훅을 사용하여 postId 라우팅 파라미터 읽기

  const getPostDetails = async () => {
    try {
      const response = await axiosInstance.get(`/api/posts/${postId}`);

      console.log(response);
      setPostDetails(response.data);
    } catch (error) {
      console.error("데이터 가져오기 오류:", error);
    }
  };

  useEffect(() => {
    getPostDetails();
  }, []);

  const navigate = useNavigate();

  const handleTagClick = (tag) => {
    // 선택된 태그를 URL 파라미터로 전달하고 검색 페이지로 이동
    navigate(`/search?keyword=${tag}`);
  };
  //TODO : 사진 제목 카테고리 태그 내용 (일정) 댓글 좋아요

  return (
    <Layout>
      <div>
        <DetailsHeader />
        <Image />
        <div className="w-393 h-275 bg-white flex flex-col ">
          <div className="flex items-center justify-between mb-2 mt-5">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full ml-4  cursor-pointer"></div>
              <div className="flex flex-col ml-[13px]">
                {postDetails ? (
                  <p className="text-[18px] font-semibold cursor-pointer">
                    {postDetails.title}
                  </p>
                ) : (
                  <p>Loading...</p>
                )}
                <div className="">
                  {postDetails && postDetails.tagsList ? (
                    postDetails.tagsList.map((tag, index) => (
                      <span
                        key={index}
                        className="text-gray-500 text-sm m-[2px] cursor-pointer"
                        onClick={() => handleTagClick(tag)}
                      >
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <p>Loading tags...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <p className="text-3 mt-4 mx-5  cursor-pointer">
            {postDetails.contents}
          </p>
          <p className="text-3 mt-4 mx-5  cursor-pointer"></p>
          <div className="flex items-center text-xs text-gray-500 mb-6 mt-6 ml-4"></div>
          <div className="flex items-center justify-between text-sm text-gray-500 h-[40px] bordertop-solid border-t-2">
            <div className="flex items-center space-x-2 flex-1 justify-center ">
              <div className=" cursor-pointer w-4 h-4 bg-gray-400 rounded-full"></div>
              <p className="cursor-pointer">좋아요 {postDetails.likeNum}</p>
            </div>

            <div className="border border-gray-500 "></div>
            <div className="flex items-center space-x-2 flex-1 justify-center">
              <div className="w-4 h-4 bg-gray-400 rounded-full cursor-pointer"></div>
              <p className="cursor-pointer">댓글달기 {postDetails.likeNum}</p>
            </div>
          </div>
          <PostLine />
        </div>
      </div>
    </Layout>
  );
}
