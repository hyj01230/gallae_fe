// PostListItem.js

import { LikeHeart, LikeFullHeart, PostListComment } from "../../assets/Icon";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { axiosInstance } from "../../api/axiosInstance";
import { formatDateDifference } from "../../util/formatDate";

const PostListItem = ({
  item,
  handleLikeClick,
  navigate,
  postList,
  setPostList,
}) => {
  // const [page, setPage] = useState(0);
  // const [ref, inView] = useInView();

  // const getPostList = async () => {
  //   try {
  //     const response = await axiosInstance.get("/api/posts", {
  //       params: {
  //         page: `${page}`,
  //         size: 5,
  //       },
  //     });
  //     const newPosts = response.data.content;

  //     // 이 부분에서 postList를 업데이트합니다.
  //     setPostList((postList) => [...postList, ...newPosts]);

  //     console.log("페이지 번호 (응답):", response.data.pageable.pageNumber);

  //     setPage((prevPage) => prevPage + 1);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // useEffect(() => {
  //   getPostList();
  // }, [postList]); // postList가 변경될 때만 실행

  // useEffect(() => {
  //   if (inView) {
  //     getPostList();
  //   }
  // }, [inView, postList]); // inView 또는 postList가 변경될 때 실행

  return (
    <div
      ref={ref}
      key={item.postId}
      className="w-393 h-275 bg-white flex flex-col relative"
    >
      <div className="flex items-center justify-between mb-2 mt-5">
        <div className="flex items-center">
          <img
            className="w-12 h-12 bg-gray-300 rounded-full ml-4"
            src={item.profileImage}
            alt={`${item.nickName}'s profile`}
          />
          <div className="flex flex-col ml-[13px]">
            <span
              className="text-[18px] font-semibold cursor-pointer"
              onClick={() => navigate(`/posts/${item.postId}`)}
            >
              {item.title && item.title.length > 17
                ? item.title.slice(0, 17) + "..."
                : item.title}
            </span>
            <span className="text-[12px] text-gray-500 mt-1 ">
              {item.nickName}
            </span>
          </div>
        </div>
        <span className="text-xs text-gray-500 mr-4 mt-7">
          {formatDateDifference(item.createdAt)}
        </span>
      </div>
      <div onClick={() => navigate(`/posts/${item.postId}`)}>
        {item.postsPicturesList.length > 0 ? (
          <img
            className="w-full aspect-video object-cover"
            src={item.postsPicturesList[0].postsPicturesURL}
            alt="Post Thumbnail"
          />
        ) : (
          <p className="text-4 text-black font-semibold text-center"></p>
        )}
      </div>
      <span
        className="text-3 mt-4 mx-5 cursor-pointer"
        onClick={() => navigate(`/posts/${item.postId}`)}
      >
        {item.contents && item.contents.length > 96
          ? item.contents.slice(0, 96) + "..."
          : item.contents}
      </span>
      <div className="flex items-center text-xs text-gray-500 mb-6 mt-6 ml-4">
        <div className="">
          {item && item.tagsList ? (
            item.tagsList.map((tag, index) => (
              <span
                key={index}
                className="inline-block text-[#999] border border-solid border-gray-300 rounded-full text-[11px] px-2 py-1 mr-1 cursor-pointer"
              >
                #{tag}
              </span>
            ))
          ) : (
            <p>Loading tags...</p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-500 h-[40px] bordertop-solid border-t-2">
        <div
          className="flex items-center space-x-2 flex-1 justify-center "
          onClick={() => {
            if (!localStorage.getItem("accessToken")) {
              alert("로그인이 필요한 서비스입니다.");
              navigate("/login");
            } else {
              navigate(`/posts/${item.postId}/`);
            }
          }}
        >
          <div className="cursor-pointer">
            <PostListComment />
          </div>
          <p className="cursor-pointer text-[14px]">댓글 {item.commentNum}</p>
        </div>
        <div
          className="flex items-center space-x-2 flex-1 justify-center  h-[40px] "
          onClick={() => {
            if (!localStorage.getItem("accessToken")) {
              alert("로그인이 필요한 서비스입니다.");
              navigate("/login");
            } else {
              handleLikeClick(item.postId);
            }
          }}
        >
          <div className="cursor-pointer">
            {item && item.likedStatus ? <LikeFullHeart /> : <LikeHeart />}
          </div>
          <p className="cursor-pointer text-[14px]">좋아요 {item.likeNum}</p>
        </div>
      </div>
    </div>
  );
};

export default PostListItem;
