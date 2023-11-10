import { useState, useEffect, useCallback, useRef } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/common/Layout";
import DetailsHeader from "../components/postDetailsPage/DetailsHeader";
import Image from "../components/postDetailsPage/Image";
import Comments from "../components/postDetailsPage/Comments";
import DetailSchedules from "../components/postDetailsPage/DetailSchedules";
import PostCommentsDisplay from "../components/postDetailsPage/PostCommentDisplay";

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
    postsPicturesList: [],
    // 다른 속성들 초기값 설정
  });
  const [comments, setComments] = useState([]);
  const [postComments, setPostComments] = useState([]);
  const [newComment, setNewComment] = useState({ contents: "" });
  const { postId } = useParams();
  const [likedStatus, setLikedStatus] = useState({});
  const [areCommentsVisible, setCommentsVisible] = useState(false);
  const [commentNum, setCommentNum] = useState(0); // 댓글 개수 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림/닫힘 상태 변수
  const [isUpdate, setIsUpdate] = useState(false);
  const updateCommentNum = (num) => {
    setCommentNum(num);
  };

  const modalRef = useRef(null); // 모달 창 Ref

  const addComment = (newComment) => {
    // 새 댓글을 추가하는 로직
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    setCommentNum(updatedComments.length); // 댓글 개수 갱신
  };

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
        // console.error("데이터 가져오기 오류:", error);
      }
    };

    getPostDetails();
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
      // console.log(response);
    } catch (error) {
      console.error("댓글 작성 오류:", error);
    }
  };

  const navigate = useNavigate();

  const handleTagClick = (tag) => {
    navigate(`/search?keyword=${tag}`);
  };

  const getaccessToken = () => {
    return localStorage.getItem("accessToken");
  };

  const fetchLikedPosts = useCallback(async () => {
    const accessToken = getaccessToken();

    if (accessToken) {
      try {
        const response = await axiosInstance.get("/api/postlike/id");
        const likedPosts = response.data;
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
    fetchLikedPosts();
  }, [fetchLikedPosts]);

  const handleLikeClick = async () => {
    try {
      const response = await axiosInstance.get(`/api/posts/like/${postId}`);
      if (response.data.check) {
        setLikedStatus({ ...likedStatus, [postId]: true });
        setPostDetails((prevDetails) => ({
          ...prevDetails,
          likeNum: prevDetails.likeNum + 1,
        }));
      } else {
        setLikedStatus({ ...likedStatus, [postId]: false });
        setPostDetails((prevDetails) => ({
          ...prevDetails,
          likeNum: prevDetails.likeNum - 1,
        }));
      }
    } catch (error) {
      console.error("좋아요 토글 오류:", error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = async () => {
    setIsModalOpen(false);

    // 모달 닫을 때 댓글 목록을 다시 불러와 렌더링
    const commentsResponse = await axiosInstance.get(
      `/api/posts/${postId}/comments`
    );
    setComments(commentsResponse.data.content);
    setNewComment({ contents: "" });

    // 이 부분에서 updateCommentNum 함수를 호출하여 commentNum 업데이트
    updateCommentNum(commentsResponse.data.content.length);
  };

  // 모달 바깥 영역 클릭 시 닫히도록 하는 핸들러
  const handleModalClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    // 페이지가 로드될 때 이벤트 리스너 등록
    window.addEventListener("click", handleModalClickOutside);
    return () => {
      // 페이지가 언로드될 때 이벤트 리스너 제거
      window.removeEventListener("click", handleModalClickOutside);
    };
  }, [isUpdate]);

  // console.log(postDetails.postsPicturesList);

  return (
    <Layout>
      <div className="fixed top-0 left-0 w-full bg-white ">
        <DetailsHeader />
      </div>
      <div>
        <Image url={postDetails.postsPicturesList} />
        <div className="w-393 h-275 bg-white flex flex-col mb-[50px]">
          <div className="flex items-center justify-between mb-2 mt-5">
            <div className="flex items-center">
              {" "}
              <div className="flex items-center">
                <img
                  className="w-12 h-12 bg-gray-300 rounded-full ml-4 cursor-pointer"
                  src={postDetails.profileImage}
                />

                <div className="flex flex-col ml-[13px]">
                  {postDetails ? (
                    <span className="text-[20px] font-semibold mr-5">
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
          </div>
          <span className="text-3 mt-2 mx-6 mb-3">{postDetails.contents}</span>

          <DetailSchedules postId={postId} />
          <div className="fixed bottom-0 left-0 w-full bg-white ">
            <PostCommentsDisplay
              areCommentsVisible={areCommentsVisible}
              setCommentsVisible={setCommentsVisible}
              handleOpenModal={handleOpenModal}
              postDetails={postDetails}
              likedStatus={likedStatus}
              handleLikeClick={handleLikeClick}
              commentNum={commentNum} // commentNum을 프롭으로 전달
            />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Comments
          postId={postId}
          isUpdate={isUpdate}
          setIsUpdate={setIsUpdate}
          comments={postComments}
          setComments={setPostComments}
          newComment={newComment}
          setNewComment={setNewComment}
          handleCommentSubmit={handleCommentSubmit}
          handleCloseModal={handleCloseModal}
          updateCommentNum={setCommentNum} // commentNum을 업데이트할 함수 전달
        />
      )}
    </Layout>
  );
}
