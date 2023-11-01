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

export default function Replies({
  comments,
  setComments,
  selectedCommentForEdit,
  setEditedContent,
  editedContent,
}) {
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const nickName = useRecoilValue(nickNameState);

  const handleAddReply = async (comment) => {
    // 클릭할 때 isReplying 상태를 토글합니다.
    setIsReplying((prevIsReplying) => !prevIsReplying);
    setReplyContent(""); // 답글 내용을 초기화합니다.
  };

  const handleAddReply = async (comment) => {
    try {
      const response = await axiosInstance.post(
        `/api/comments/${comment.commentId}/replies`,
        { contents: replyContent }
      );
      console.log(comment.commentId);

      if (selectedCommentForReply === comment) {
        setIsReplying(false);

        setSelectedCommentForReply(null); // 클릭할 때 isReplying 상태를 토글합니다.
      } else {
        setSelectedCommentForReply(comment);
        setIsReplying(true);
      }
      setReplyContent(""); // 답글 내용을 초기화합니다.
    } catch (error) {
      console.error("답글 생성 중 오류 발생:", error);
    }
  };
  const fetchReplies = async (commentId) => {
    try {
      const response = await axiosInstance.get(
        `/api/comments/${comments.commentId}/replies`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const replies = response.data.content; // 서버에서 반환한 답글 데이터
      console.log("replies:", replies);
      // 받아온 답글 데이터를 사용하거나 상태에 업데이트할 수 있습니다.
    } catch (error) {
      console.error("답글 조회 중 오류 발생:", error);
    }
  };

  return (
    <>
      {comments.map((reply) => (
        <div
          key={reply.commentId}
          className="bg-white p-4 border relative font-[14px] h-[127px]"
        >
          {selectedCommentForEdit === reply ? (
            <div>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                placeholder="댓글을 수정하세요..."
                className="w-full border rounded p-2"
              />
              <div className="absolute right-4 top-4 flex space-x-2">
                <button
                  onClick={() => handleSave(reply)}
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  저장
                </button>
                <button
                  onClick={() => handleDelete(reply)}
                  className="text-red-500"
                >
                  삭제
                </button>
              </div>
            </div>
          ) : (
            <div className="h-auto">
              <div className="flex justify-between">
                <p className="text-[16px] font-semibold flex items-center space-x-2">
                  <span className="font-semibold">{reply.nickname}</span>
                  {/* 글쓴이 표시 여부를 처리하는 부분 */}
                </p>
              </div>
              <p className="text-[14px] font-nomal w-[360px]">
                <span>{reply.contents}</span>
              </p>
              <p className="text-[12px] font-normal text-[#999]">
                <span>
                  {formatDate(reply.modifiedAt)}{" "}
                  {/* 수정된 답댓글 여부를 처리하는 부분 */}
                </span>
              </p>
              {reply.nickname === nickName && (
                <div>
                  <button
                    onClick={() => handleEdit(reply)}
                    className="text-[#999] border-[#FF9900] text-sm mr-1"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(reply)}
                    className="text-[#999] border-[#FF9900] text-sm"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </>
  );
}
