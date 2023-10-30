export default function Replies({ reply, handleEdit, handleDelete }) {
  const [editedContent, setEditedContent] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const handleAddReply = async (comment) => {
    try {
      const response = await axiosInstance.post(
        `/api/comments/${comment.commentId}/replies`,
        { contents: replyContent }
      );

      if (selectedCommentForReply === comment) {
        setIsReplying(false);
        setSelectedCommentForReply(null);
      } else {
        setSelectedCommentForReply(comment);
        setIsReplying(true);
      }

      setReplyContent("");

      // 새로운 답댓글을 replyData에 추가
      setReplyData((prevReplyData) => ({
        ...prevReplyData,
        [comment.commentId]: [
          ...(prevReplyData[comment.commentId] || []),
          response.data,
        ],
      }));
    } catch (error) {
      console.error("답댓글 생성 중 오류 발생:", error);
    }
  };
  return (
    <div
      key={reply.replyId}
      className="bg-white p-4 border relative font-[14px] h-[127px]"
    >
      {editedContent ? (
        // 수정 모드
        <div>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="답글을 수정하세요..."
            className="w-full border rounded p-2"
          />
          <div className="absolute right-4 top-4 flex space-x-2">
            <button
              onClick={handleAddReply}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              저장
            </button>
            <button
              onClick={() => handleDelete(reply)} // 삭제 함수를 호출하는 부분
              className="text-red-500"
            >
              삭제
            </button>
          </div>
        </div>
      ) : (
        // 보기 모드
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
  );
}
