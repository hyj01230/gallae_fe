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

  useEffect(() => {
    getPostDetails();

    const fetchComments = async () => {
      const commentsResponse = await axiosInstance.get(
        `/api/posts/${postId}/comments`
      );
      setPostComments(commentsResponse.data.content);
    };

    console.log(postComments);
    fetchComments();
  }, [postId]);

  const navigate = useNavigate();

  const handleTagClick = (tag) => {
    navigate(`/search?keyword=${tag}`);
  };

  // const handleDelete = async (comment) => {
  //   try {
  //     await axiosInstance.delete(
  //       `/api/posts/${postId}/comments/${comment.commentId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //         },
  //       }
  //     );

  //     const commentsResponse = await axiosInstance.get(
  //       `/api/posts/${postId}/comments`
  //     );

  //     setPostComments(commentsResponse.data.content);
  //   } catch (error) {
  //     console.error("댓글 삭제 중 오류 발생:", error);
  //   }
  // };

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
                        className="text-gray-500 text-sm  cursor-pointer"
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
          <DetailSchedules postId={postId} />
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
          <div className="relative">
            <textarea
              value={newComment.contents}
              onChange={(e) => setNewComment({ contents: e.target.value })}
              placeholder="  댓글을 입력하세요."
              className="w-full  p-4 h-[57px] "
            />
            <button
              onClick={handleCommentSubmit}
              className="bg-white font-[14px] absolute w-20  top-4 right-5 mx-0 rounded-md "
            >
              작성
            </button>
          </div>
        </div>
        <Comments
          comments={postComments}
          setComments={setPostComments}

          // handleDelete={handleDelete}
        />
      </div>
    </Layout>
  );
}
