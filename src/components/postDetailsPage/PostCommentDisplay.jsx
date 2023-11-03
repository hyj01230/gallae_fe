// CommentsDisplay.js

import { LikeHeart, LikeFullHeart, CommentIcon } from "../../assets/Icon";
import { useNavigate } from "react-router-dom";

export default function PostCommentsDisplay({
  areCommentsVisible,
  setCommentsVisible,
  handleOpenModal,
  postDetails,
  likedStatus,
  handleLikeClick,
}) {
  const navigate = useNavigate();
  return (
    // h-50px뒤부터 레이아웃 컴포넌트 맞춤
    <div className="flex items-center justify-between text-sm text-gray-500 h-[50px] border-b-2 relative overflow-auto max-w-3xl mx-auto ">
      <div
        className="flex items-center space-x-2 flex-1 justify-center p-3"
        onClick={() => setCommentsVisible(!areCommentsVisible)}
      >
        <div className="cursor-pointer">
          {areCommentsVisible ? <CommentIcon /> : <CommentIcon />}
        </div>
        <p className="cursor-pointer" onClick={handleOpenModal}>
          댓글 {postDetails.commentNum}
        </p>
      </div>
      <div className="border border-gray-500"></div>
      <div
        className="flex items-center space-x-2 flex-1 justify-center"
        onClick={() => {
          if (!localStorage.getItem("accessToken")) {
            alert("로그인이 필요한 서비스입니다.");
            navigate("/login");
          } else {
            handleLikeClick;
          }
        }}
      >
        <div className="" onClick={handleLikeClick}>
          {likedStatus[postDetails.postId] ? <LikeFullHeart /> : <LikeHeart />}
        </div>
        <p className="cursor-pointer">좋아요 {postDetails.likeNum}</p>
      </div>
    </div>
  );
}
