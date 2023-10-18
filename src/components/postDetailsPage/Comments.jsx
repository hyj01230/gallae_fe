import { useState } from "react";

export default function Comments({ comments, onReplySubmit }) {
  const [selectedComment, setSelectedComment] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [replyContent, setReplyContent] = useState("");

  const handleEdit = (comment) => {
    setSelectedComment(comment);
    setEditedContent(comment.contents);
  };

  const handleDelete = (comment) => {
    // 삭제 처리 로직 추가
    // 원본 comments 배열을 업데이트
    const updatedComments = comments.filter(
      (c) => c.commentId !== comment.commentId
    );
    setSelectedComment(null);
  };

  const handleSave = (comment, editedContent) => {
    // 수정 처리 로직 추가
    // 원본 comments 배열을 업데이트
    const updatedComments = comments.map((c) => {
      if (c.commentId === comment.commentId) {
        return { ...c, contents: editedContent, modifiedAt: new Date() };
      }
      return c;
    });
    setSelectedComment(null);
  };

  const handleEditContentChange = (value) => {
    setEditedContent(value);
  };

  const handleAddReply = (comment) => {
    // 대댓글 입력 필드를 표시하도록 선택된 댓글을 설정합니다.
    setSelectedComment(comment);
    // 대댓글 내용을 초기화합니다.
    setReplyContent("");
  };

  const handleReplyContentChange = (value) => {
    setReplyContent(value);
  };

  const handleSaveReply = (commentId, replyContent) => {
    onReplySubmit(commentId, replyContent); // 부모 컴포넌트로부터 전달된 함수를 호출하여 대댓글을 저장
    setSelectedComment(null); // 대댓글 입력 필드를 닫음
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">댓글</h2>
      {Array.isArray(comments) ? (
        comments.map((comment) => (
          <div
            key={comment.commentId}
            className="bg-white p-4 rounded-md mb-4 relative"
          >
            {selectedComment === comment ? (
              <div>
                <textarea
                  value={replyContent}
                  onChange={(e) => handleReplyContentChange(e.target.value)}
                  placeholder="대댓글을 작성하세요..."
                  className="w-full border rounded p-2"
                />
                <button
                  onClick={() =>
                    handleSaveReply(comment.commentId, replyContent)
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  대댓글 작성
                </button>
              </div>
            ) : (
              <p className="text-lg mb-2">{comment.contents}</p>
            )}
            <p className="text-gray-600 text-sm font-semibold">
              <span className="font-semibold">{comment.nickname}</span>
            </p>
            {selectedComment === comment ? (
              <div className="absolute right-4 top-4 flex space-x-2">
                <button
                  onClick={() => handleSave(comment, editedContent)}
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  저장
                </button>
              </div>
            ) : (
              <div className="absolute right-4 top-4 flex space-x-2">
                <button
                  onClick={() => handleEdit(comment)}
                  className="text-blue-500"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(comment)}
                  className="text-red-500"
                >
                  삭제
                </button>
              </div>
            )}
            <button
              onClick={() => handleAddReply(comment)}
              className="text-green-500 mt-2"
            >
              대댓글 작성
            </button>
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-6">
                {comment.replies.map((reply) => (
                  <div
                    key={reply.replyId}
                    className="bg-gray-200 p-2 rounded-md mb-2 relative"
                  >
                    <p className="text-sm mb-1">{reply.contents}</p>
                    <p className="text-gray-500 text-xs">
                      <span className="font-semibold">{reply.nickname}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-600 italic">댓글이 없습니다.</p>
      )}
    </div>
  );
}
