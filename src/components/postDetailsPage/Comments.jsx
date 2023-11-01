import { useState, useEffect } from "react";
import { axiosInstance } from "../../api/axiosInstance";
import { useRecoilValue } from "recoil";
import { nickNameState } from "../../store/atom";

function formatDate(date) {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  if (!date || isNaN(new Date(date).getTime())) {
    return "";
  }

  return new Date(date)
    .toLocaleDateString(undefined, options)
    .replace(/(\d+)\D+(\d+)/, "$1 $2");
}

export default function Comments({
  comments,
  setComments,
  newComment,
  handleCommentSubmit,
  setNewComment,
  handleCloseModal,
}) {
  const [selectedComment, setSelectedComment] = useState(null);
  const [selectedCommentForEdit, setSelectedCommentForEdit] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [editedCommentIds, setEditedCommentIds] = useState([]);
  const [replyContent, setReplyContent] = useState(""); // 대댓글 입력 필드
  const [selectedCommentForReply, setSelectedCommentForReply] = useState(null);
  const [isReplyInputVisible, setIsReplyInputVisible] = useState(false);
  const nickName = useRecoilValue(nickNameState);

  // 대댓글 추가 함수
  const handleReplySubmit = async (comment) => {
    try {
      const response = await axiosInstance.post(
        `/api/comments/${comment.commentId}/replies`,
        {
          contents: replyContent,
          email: "string",
          nickname: "string",
          checkUser: "string",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      // 대댓글을 추가한 후 해당 댓글의 대댓글 목록 배열에 대댓글을 추가
      const updatedComments = comments.map((c) => {
        if (c.commentId === comment.commentId) {
          return {
            ...c,
            replies: [
              ...(c.replies || []), // 대댓글 배열이 없을 경우 빈 배열로 초기화
              {
                repliesId: response.data.repliesId,
                contents: replyContent,
                email: "string",
                nickname: "string",
                checkUser: "string",
                createAt: response.data.createAt,
                modifiedAt: response.data.modifiedAt,
              },
            ],
          };
        }
        return c;
      });

      setComments(updatedComments);

      setReplyContent(""); // 대댓글 입력 필드 초기화
      setIsReplyInputVisible(false); // 대댓글 작성 완료 후 입력 창 숨김
    } catch (error) {
      console.error("대댓글 작성 중 오류 발생:", error);
    }
  };

  useEffect(() => {}, [comments]);

  useEffect(() => {
    // ... (editedContent가 변경될 때의 로직)
  }, [editedContent]);

  const isCommentEdited = (comment) =>
    editedCommentIds.includes(comment.commentId);

  const handleEdit = (comment) => {
    if (comment) {
      setSelectedCommentForEdit(comment);
      setEditedContent(comment.contents);
    }
  };

  const handleDelete = async (comment) => {
    setSelectedComment(null);
    const updatedComments = comments.filter(
      (c) => c.commentId !== comment.commentId
    );

    try {
      await axiosInstance.delete(`/api/comments/${comment.commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      setComments(updatedComments);
    } catch (error) {
      console.error("댓글 삭제 중 오류 발생:", error);
    }
  };

  const handleReply = (comment) => {
    setSelectedCommentForReply(comment);
    setIsReplyInputVisible(true); // 대댓글 작성 버튼을 누르면 입력 창 표시
  };

  const handleSave = async (comment) => {
    try {
      await axiosInstance.put(
        `/api/comments/${comment.commentId}`,
        { contents: editedContent },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const updatedComments = comments.map((c) => {
        if (c.commentId === comment.commentId) {
          setEditedCommentIds((prevIds) => [...prevIds, comment.commentId]);
          return { ...c, contents: editedContent, modifiedAt: new Date() };
        }
        return c;
      });

      setComments(updatedComments);
      setEditedContent("");
    } catch (error) {
      console.error("댓글 수정 중 오류 발생:", error);
    }
  };

  const handleLikeClick = async () => {
    // 좋아요 버튼을 클릭했을 때 수행할 동작 구현
    // 예: 좋아요 상태 업데이트 및 서버에 좋아요 요청 보내기
  };

  const handleOriginalPost = async () => {
    // 원문보기 버튼을 클릭했을 때 수행할 동작 구현
    // 예: 원문 페이지로 이동
    handleCloseModal();
  };

  const handleShare = async () => {
    // 공유하기 버튼을 클릭했을 때 수행할 동작 구현
    // 예: 공유 기능 구현
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button
          onClick={handleCloseModal}
          className="modal-close-button"
        ></button>
        <div
          className="bg-gray-100 overflow-y-auto"
          style={{ height: "800px" }}
        >
          <div className="relative transition-all duration-5000 ease-in-out">
            {/* 댓글 입력창 고정 부분 */}
            <div className="sticky top-0 bg-white z-10">
              <textarea
                value={newComment.contents}
                onChange={(e) => setNewComment({ contents: e.target.value })}
                placeholder="댓글을 입력하세요."
                className="w-full p-4 h-[57px]"
              />
              <button
                onClick={handleCommentSubmit}
                className="bg-white font-[14px] absolute top-4 right-5 mx-0 rounded-md"
              >
                작성
              </button>
            </div>
            {/* 댓글 입력창 고정 부분 끝 */}
            <h2 className="text-2xl font-[14px]"></h2>
            {Array.isArray(comments) && comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.commentId}
                  className="bg-white p-4 border relative font-[14px] h-[127px]"
                >
                  <div>
                    {isReplyInputVisible && ( // 대댓글 입력 창 표시 여부에 따라 렌더링
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="대댓글을 작성하세요..."
                        className="w-full border rounded p-2"
                      />
                    )}
                    <div className="absolute right-4 top-4 flex space-x-2">
                      <button
                        onClick={() => handleReplySubmit(comment)}
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                      >
                        작성
                      </button>
                    </div>
                  </div>
                  <div className="h-auto">
                    <div className="flex justify-between">
                      <p className="text-[16px] font-semibold flex items-center space-x-2">
                        <span className="hfont-semibold">
                          {comment.nickname}
                        </span>
                        {comment.checkUser === "글쓴이" && (
                          <span className="border border-orange-300 bg-white rounded-[12px] px-2 ml-2 text-yellow-400 text-[12px]">
                            글쓴이
                          </span>
                        )}
                      </p>
                    </div>
                    <p className="text-[14px] font-nomal w-[360px]">
                      <span>{comment.contents}</span>
                    </p>
                    <p className="text-[12px] font-normal text-[#999]">
                      <span>
                        {formatDate(comment.modifiedAt)}{" "}
                        {isCommentEdited(comment) && (
                          <span className="text-gray-600 text-[12px] font-semibold">
                            (수정됨)
                          </span>
                        )}
                      </span>
                    </p>
                    {comment.nickname === nickName && (
                      <div>
                        <button
                          onClick={() => handleEdit(comment)}
                          className="text-[#999] border-[#FF9900] text-sm mr-1"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(comment)}
                          className="text-[#999] border-[#FF9900] text-sm"
                        >
                          삭제
                        </button>
                        <button
                          onClick={() => handleReply(comment)}
                          className="text-green-500"
                        >
                          대댓글 작성
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-[14px] font-normal">
                댓글이 아직 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bottom-bar flex">
        <button
          className="w-1/3 p-3 bg-[#ff9900] text-white border border-r border-transparent"
          onClick={handleLikeClick}
        >
          좋아요
        </button>
        <button
          className="w-1/3 p-3 bg-[#ff9900] text-white border border-r "
          onClick={handleOriginalPost}
        >
          원문보기
        </button>
        <button
          className="w-1/3 p-3 bg-[#ff9900] text-white border-transparent"
          onClick={handleShare}
        >
          공유하기
        </button>
      </div>
    </div>
  );
}
