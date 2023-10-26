import { Like_Heart, Like_Full_Heart, CommentIcon } from "../assets/Icon";
import Layout from "../components/common/Layout";
import PostLine from "../components/post/PostLine";
import DetailsHeader from "../components/postDetailsPage/DetailsHeader";
import Image from "../components/postDetailsPage/Image";
import { axiosInstance } from "../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Comments from "../components/postDetailsPage/Comments";
import DetailSchedules from "../components/postDetailsPage/DetailSchedules";

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
  const { postId } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [areCommentsVisible, setCommentsVisible] = useState(false);

  const getPostDetails = async () => {
    try {
      const response = await axiosInstance.get(`/api/posts/${postId}`);
      setPostDetails(response.data);

      const commentsResponse = await axiosInstance.get(
        `/api/posts/${postId}/comments`
      );
      setPostComments(commentsResponse.data.content);
    } catch (error) {
      console.error("데이터 가져오기 오류:", error);
    }
  };

  useEffect(() => {
    getPostDetails();
  }, []);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        `/api/posts/${postId}/comments`,
        newComment
      );

      const commentsResponse = await axiosInstance.get(
        `/api/posts/${postId}/comments`
      );
      setPostComments(commentsResponse.data.content);

      setNewComment({ contents: "" });
    } catch (error) {
      console.error("댓글 작성 오류:", error);
    }
  };

  const handleLikeClick = async () => {
    try {
      const response = await axiosInstance.post(`/api/posts/like/${postId}`);

      if (response.data.check) {
        // 게시물이 좋아요된 상태
        setIsLiked(true);

        // postDetails 상태에서 좋아요 수를 업데이트합니다.
        setPostDetails((prevDetails) => ({
          ...prevDetails,
          likeNum: prevDetails.likeNum + 1,
        }));
      } else {
        // 게시물이 좋아요가 취소된 상태
        setIsLiked(false);

        // postDetails 상태에서 좋아요 수를 업데이트합니다.
        setPostDetails((prevDetails) => ({
          ...prevDetails,
          likeNum: prevDetails.likeNum - 1,
        }));
      }
    } catch (error) {
      console.error("좋아요 토글 오류:", error);
    }
  };

  const navigate = useNavigate();

  const handleTagClick = (tag) => {
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
              <div className="w-12 h-12 bg-gray-300 rounded-full ml-4 cursor-pointer"></div>
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
                        className="text-gray-500 text-sm cursor-pointer mr-1"
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

          <p className="text-3 mt-4 mx-5 mb-3">{postDetails.contents}</p>
          <div className="flex items-center justify-between text-sm text-gray-500 h-[50px] border-b-2">
            <div
              className="flex items-center space-x-2 flex-1 justify-center p-3"
              onClick={() => setCommentsVisible(!areCommentsVisible)}
            >
              <div className="cursor-pointer ">
                {areCommentsVisible ? <CommentIcon /> : <CommentIcon />}
              </div>
              <p className="cursor-pointer">댓글 {postDetails.commentNum}</p>
            </div>
            <div className="border border-gray-500"></div>
            <div
              className="flex items-center space-x-2 flex-1 justify-center"
              onClick={handleLikeClick}
            >
              <div className="">
                {isLiked ? <Like_Full_Heart /> : <Like_Heart />}
              </div>
              <p className="cursor-pointer">좋아요 {postDetails.likeNum}</p>
            </div>
          </div>
          {areCommentsVisible && (
            <div className="relative transition-all duration-5000 ease-in-out">
              <textarea
                value={newComment.contents}
                onChange={(e) => setNewComment({ contents: e.target.value })}
                placeholder="댓글을 입력하세요."
                className="w-full p-4 h-[57px]"
              />
              <button
                onClick={handleCommentSubmit}
                className="bg-white font-[14px] absolute w-20 top-4 right-5 mx-0 rounded-md"
              >
                작성
              </button>
            </div>
          )}
          {areCommentsVisible && (
            <div className="transition-all duration-5000 ease-in-out">
              <Comments comments={postComments} setComments={setPostComments} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
