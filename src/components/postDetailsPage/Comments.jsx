import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../api/axiosInstance";
import { useParams } from "react-router-dom";

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
  const [selectedCommentForEdit, setSelectedCommentForEdit] = useState(null);
  const [selectedCommentForReply, setSelectedCommentForReply] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [editedCommentIds, setEditedCommentIds] = useState([]);
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    // editedContent가 변경될 때 컴포넌트를 다시 렌더링
    // 이후에 수정 내용이 화면에 즉시 보이게 됩니다.
  }, [editedContent]);

  // 댓글이 수정되었는지 여부를 판단하는 함수
  const isCommentEdited = (comment) =>
    editedCommentIds.includes(comment.commentId);

  const handleEdit = (comment) => {
    if (comment) {
      setSelectedCommentForEdit(comment);
      setEditedContent(comment.contents);
    }
  };

  const handleDelete = async (comment) => {
    // 클라이언트 측에서 댓글 상태 업데이트
    setSelectedComment(null); // 선택한 댓글 초기화

    const updatedComments = comments.filter(
      (c) => c.commentId !== comment.commentId
    );

    try {
      // 서버로 DELETE 요청 보내기
      await axiosInstance.delete(`/api/comments/${comment.commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      // 서버 요청이 성공한 후에 댓글 목록 업데이트
      setComments(updatedComments);
    } catch (error) {
      console.error("댓글 삭제 중 오류 발생:", error);
    }
  };

  const handleSave = async (comment) => {
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

      // 서버 요청이 성공한 후에 댓글 목록 업데이트
      const updatedComments = comments.map((c) => {
        if (c.commentId === comment.commentId) {
          // 수정된 댓글 ID 목록에 추가
          setEditedCommentIds((prevIds) => [...prevIds, comment.commentId]);
          return { ...c, contents: editedContent, modifiedAt: new Date() };
        }
        return c;
      });

      // 댓글 목록 업데이트 이후에 editedContent를 초기화
      setComments(updatedComments);
      setEditedContent(""); // 수정된 내용 초기화
    } catch (error) {
      console.error("댓글 수정 중 오류 발생:", error);
    }
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
    <div className="bg-gray-100">
      <h2 className="text-2xl font-[14px]"></h2>
      {Array.isArray(comments) ? (
        comments.map((comment) => (
          <div
            key={comment.commentId}
            className="bg-white p-4 border relative font-[14px] h-[127px]"
          >
            {selectedCommentForEdit === comment ? (
              <div>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  placeholder="댓글을 수정하세요..."
                  className="w-full border rounded p-2 "
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
              <div className="h-auto">
                <div className="flex justify-between">
                  <p className="text-[16px] font-semibold">
                    <span className="hfont-semibold">{comment.nickname}</span>
                  </p>
                  <p className="text-[16px] font-semibold">
                    {/* <span className="inline-block w-4 h-4 rounded-full bg-gray-200 ml-2">
                      <button
                        onClick={handleOpenModal}
                        className="w-full h-full bg-gray-200 rounded-full"
                      ></button>
                    </span> */}
                  </p>
                </div>
                <p className="text-[14px] font-nomal w-[360px]">
                  <span>{comment.contents}</span>
                </p>
                <p className="text-[12px] font-normal text-[#999]">
                  <span>
                    {formatDate(comment.createAt)}{" "}
                    {isCommentEdited(comment) && (
                      <span className="text-gray-600 text-[12px] font-semibold">
                        (수정됨)
                      </span>
                    )}
                  </span>
                </p>
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
                    onClick={() => handleAddReply(comment)}
                    className="text-green-500"
                  >
                    {/* {isReplying && selectedCommentForReply === comment
                      ? "취소"
                      : "답글"} */}
                  </button>
                </div>
              </div>
            )}
            {isReplying && selectedCommentForReply === comment && (
              <div>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="답글을 작성하세요..."
                  className="w-full border rounded p-2"
                />
                <button
                  onClick={() => handleAddReply(comment)}
                  className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                >
                  답글 작성
                </button>
              </div>
            )}
            {/* <CommentModal
              isOpen={isModalOpen}
              handleCloseModal={handleCloseModal}
              handleEditClick={() => handleEdit(comment)}
              handleDeleteClick={() => handleDelete(comment.commentId)} // comment.commentId를 전달
              comment={comment}
            /> */}
          </div>
        ))
      ) : (
        <p className="text-gray-600 italic">댓글이 없습니다.</p>
      )}
    </div>
  );
}
