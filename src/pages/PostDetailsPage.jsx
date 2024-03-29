import { useState, useEffect, useCallback, useRef } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/common/Layout";
import DetailsHeader from "../components/postDetailsPage/DetailsHeader";
import Image from "../components/postDetailsPage/Image";
import Comments from "../components/postDetailsPage/Comments";
import DetailSchedules from "../components/postDetailsPage/DetailSchedules";
import PostCommentsDisplay from "../components/postDetailsPage/PostCommentDisplay";
import {
  getPostDetailsAPI,
  fetchLikedPostsAPI,
  handleLikeClickAPI,
} from "../api";
import { useQueries, useQuery } from "react-query";

export default function PostDetailsPage() {
  const { postId } = useParams();
  const [likedStatus, setLikedStatus] = useState({});
  const [areCommentsVisible, setCommentsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isLoading, data } = useQuery("postDetail", () =>
    getPostDetailsAPI(postId)
  );

  const postData = data?.data;

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
        const response = await fetchLikedPostsAPI();
        const likedPosts = response.data;
        const likedStatusMap = {};
        likedPosts.forEach((postId) => {
          likedStatusMap[postId] = true;
        });

        setLikedStatus(likedStatusMap);
      } catch (error) {
        // console.error("좋아요 정보 가져오기 오류:", error);
      }
    }
  }, []);

  useEffect(() => {
    fetchLikedPosts();
  }, [fetchLikedPosts]);

  const handleLikeClick = async () => {
    try {
      const response = await handleLikeClickAPI(postId);
      if (response.data.check) {
        setLikedStatus({ ...likedStatus, [postId]: true });
        postData.likeNum += 1;
      } else {
        setLikedStatus({ ...likedStatus, [postId]: false });
        postData.likeNum -= 1;
      }
    } catch (error) {
      // console.error("좋아요 토글 오류:", error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = async () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <div></div>;
  }

  console.log(data);

  return (
    <Layout>
      <div className="fixed top-0 left-0 w-full bg-white ">
        <DetailsHeader />
      </div>
      <div>
        <Image url={postData.postsPicturesList} />
        <div className="w-393 h-275 bg-white flex flex-col mb-[50px]">
          <div className="flex items-center justify-between mb-2 mt-5">
            <div className="flex items-center">
              {" "}
              <div className="flex items-center">
                <img
                  className="w-12 h-12 bg-gray-300 rounded-full ml-4 cursor-pointer"
                  src={postData.profileImage}
                />

                <div className="flex flex-col ml-[13px]">
                  {postData ? (
                    <span className="text-[20px] font-semibold mr-5">
                      {postData.title}
                    </span>
                  ) : (
                    <p>Loading...</p>
                  )}
                  <div className="">
                    {postData && postData.tagsList ? (
                      postData.tagsList.map((tag, index) => (
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
          <span className="text-3 mt-2 mx-6 mb-3 whitespace-pre-line">
            {postData.contents}
          </span>

          <DetailSchedules postId={postId} />
          <div className="fixed bottom-0 left-0 w-full bg-white ">
            <PostCommentsDisplay
              areCommentsVisible={areCommentsVisible}
              setCommentsVisible={setCommentsVisible}
              handleOpenModal={handleOpenModal}
              postDetails={postData}
              likedStatus={likedStatus}
              handleLikeClick={handleLikeClick}
            />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Comments postId={postId} handleCloseModal={handleCloseModal} />
      )}
    </Layout>
  );
}
