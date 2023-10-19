import React, { useState } from "react";
import { axiosInstance } from "../../api/axiosInstance";

function formatDate(date) {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(date)
    .toLocaleDateString(undefined, options)
    .replace(/(\d+)\D+(\d+)/, "$1 $2");
}

export default function Comments({ comments, setComments }) {
  const [selectedComment, setSelectedComment] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  const handleEdit = (comment) => {
    setSelectedComment(comment);
    setEditedContent(comment.contents);
  };

  const handleDelete = async (comment) => {
    // 클라이언트 측에서 댓글 상태 업데이트
    setSelectedComment(null); // 선택한 댓글 초기화

    const updatedComments = comments.filter(
      (c) => c.commentId !== comment.commentId
    );
    setComments(updatedComments); // 댓글 목록 업데이트

    try {
      // 서버로 DELETE 요청 보내기
      await axiosInstance.delete(`/api/comments/${comment.commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
    } catch (error) {
      console.error("댓글 삭제 중 오류 발생:", error);
    }
  };

  const handleSave = async (comment) => {
    // 클라이언트 측에서 댓글 상태 업데이트
    setSelectedComment(null); // 선택한 댓글 초기화
    setEditedContent(""); // 수정된 내용 초기화

    const updatedComments = comments.map((c) => {
      if (c.commentId === comment.commentId) {
        return { ...c, contents: editedContent, modifiedAt: new Date() };
      }
      return c;
    });
    setComments(updatedComments); // 댓글 목록 업데이트

    try {
      // 서버로 PUT 요청 보내기
      await axiosInstance.put(
        `/api/comments/${comment.commentId}`,
        { contents: editedContent },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
    } catch (error) {
      console.error("댓글 수정 중 오류 발생:", error);
    }
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
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  placeholder="댓글을 수정하세요..."
                  className="w-full border rounded p-2"
                />
                <div className="absolute right-4 top-4 flex space-x-2">
                  <button
                    onClick={() => handleSave(comment)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => handleDelete(comment)}
                    className="text-red-500"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <p className="text-lg mb-2">{comment.contents}</p>
                <div>
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
              </div>
            )}
            <p className="text-gray-600 text-sm font-semibold">
              <span className="font-semibold">{comment.nickname}</span>
            </p>
            <p className="text-gray-600 text-sm font-semibold">
              <span className="font-semibold">
                {formatDate(comment.createAt)}
              </span>
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-600 italic">댓글이 없습니다.</p>
      )}
    </div>
  );
}
