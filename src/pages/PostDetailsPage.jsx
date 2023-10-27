import { LikeHeart, LikeFullHeart, CommentIcon } from "../assets/Icon";
import Layout from "../components/common/Layout";
import DetailsHeader from "../components/postDetailsPage/DetailsHeader";
import Image from "../components/postDetailsPage/Image";
import { axiosInstance } from "../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
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
  const [likedStatus, setLikedStatus] = useState({});
  const [areCommentsVisible, setCommentsVisible] = useState(false);

  useEffect(() => {
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

    getPostDetails(); // 함수를 여기서 호출
  }, [postId]);

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

  const navigate = useNavigate();

  const handleTagClick = (tag) => {
    navigate(`/search?keyword=${tag}`);
  };

  const handleLikeClick = async (postId) => {
    try {
      const response = await axiosInstance.get(`/api/posts/like/${postId}`);

      if (response.data.check) {
        // 게시물에 좋아요 추가
        setLikedStatus({ ...likedStatus, [postId]: true });

        // likeNum 증가
        setPostDetails((prevList) =>
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
        setPostDetails((prevList) =>
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
                  <span className="text-[18px] font-semibold">
                    {postDetails.title}
                  </span>
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

          <span className="text-3 mt-4 mx-5 mb-3">{postDetails.contents}</span>

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
                {likedStatus[postDetails.postId] ? (
                  <LikeFullHeart />
                ) : (
                  <LikeHeart />
                )}
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
