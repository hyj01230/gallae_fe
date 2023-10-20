import Layout from "../components/common/Layout";
import PostLine from "../components/post/PostLine";
import DetailsHeader from "../components/postDetailsPage/DetailsHeader";
import Image from "../components/postDetailsPage/Image";
import { axiosInstance } from "../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Comments from "../components/postDetailsPage/Comments";

export default function PostDetailsPage() {
  const [postDetails, setPostDetails] = useState({
    title: "",
    tagsList: [],
    nickName: "",
    likeNum: "",
    viewNum: "",
    createdAt: "",
    modifiedAt: "",
    commentNum: "",
    // 다른 속성들 초기값 설정
  });

  const [postComments, setPostComments] = useState([{}]);

  const [newComment, setNewComment] = useState({ contents: "" });
  const [comments, setComments] = useState([]); // 댓글 목록을 관리하는 상태 추가

  const { postId } = useParams(); // useParams 훅을 사용하여 postId 라우팅 파라미터 읽기

  const getPostDetails = async () => {
    try {
      const response = await axiosInstance.get(`/api/posts/${postId}`);
      setPostDetails(response.data); // 게시물 데이터 업데이트

      // 댓글 데이터 가져오기 (예: API 엔드포인트는 /api/posts/{postId}/comments/ 로 가정)
      const commentsResponse = await axiosInstance.get(
        `/api/posts/${postId}/comments`
      );
      console.log(commentsResponse);
      setPostComments(commentsResponse.data.content); // 댓글 데이터 업데이트
    } catch (error) {
      console.error("데이터 가져오기 오류:", error);
    }
  };

  useEffect(() => {
    getPostDetails();
  }, []);

  // 댓글 작성 핸들러
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      // 새로운 댓글을 서버에 저장
      const response = await axiosInstance.post(
        `/api/posts/${postId}/comments`,
        newComment
      );

      // 서버로부터 수정된 댓글 목록을 가져와서 클라이언트의 상태를 업데이트
      const commentsResponse = await axiosInstance.get(
        `/api/posts/${postId}/comments`
      );
      setPostComments(commentsResponse.data.content);

      // 새로운 댓글 입력 필드를 초기화
      setNewComment({ contents: "" });
    } catch (error) {
      console.error("댓글 작성 오류:", error);
    }
  };

  // 페이지가 로드될 때 댓글 목록을 가져와서 초기화
  useEffect(() => {
    getPostDetails();

    const fetchComments = async () => {
      const commentsResponse = await axiosInstance.get(
        `/api/posts/${postId}/comments`
      );
    };
    fetchComments();
  }, [postId]);

  const navigate = useNavigate();

  const handleTagClick = (tag) => {
    // 선택된 태그를 URL 파라미터로 전달하고 검색 페이지로 이동
    navigate(`/search?keyword=${tag}`);
  };

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
                  <p className="text-[18px] font-semibold">
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
          <p className="text-3 mt-4 mx-5">{postDetails.contents}</p>
          <p className="text-3 mt-4 mx-5  cursor-pointer"></p>
          <div className="mt-5">
            <PostLine />
            <div className="flex items-center justify-between  text-sm text-gray-500 h-[40px] border-b-2  ">
              <div className="flex items-center space-x-2 flex-1 justify-center ">
                <div className=" cursor-pointer w-4 h-4 bg-gray-400 rounded-full"></div>
                <p className="cursor-pointer">댓글 {postDetails.commentNum}</p>
              </div>
              <div className="border border-gray-500 "></div>
              <div className="flex items-center space-x-2 flex-1 justify-center">
                <div className="w-4 h-4 bg-gray-400 rounded-full cursor-pointer"></div>
                <p className="cursor-pointer">좋아요 {postDetails.likeNum}</p>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <div className="flex items-center">
              <textarea
                value={newComment.contents}
                onChange={(e) => setNewComment({ contents: e.target.value })}
                placeholder="댓글을 작성하세요..."
                className="w-full border rounded p-2"
              />
              <button
                onClick={handleCommentSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
              >
                작성
              </button>
            </div>
          </div>
        </div>
        <Comments
          comments={
            postComments
              ? postComments.map((comment, index) => ({
                  ...comment,
                  key: index,
                }))
              : []
          }
          setComments={setComments}
        />
      </div>
    </Layout>
  );
}
