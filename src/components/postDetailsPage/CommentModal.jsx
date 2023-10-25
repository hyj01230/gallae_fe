import React from "react";

export default function CommentModal({
  isOpen,
  handleCloseModal,
  handleEditClick,
  handleDeleteClick,
  comment, // Receive the comment as a prop
}) {
  const modalClasses = isOpen
    ? "fixed inset-0 flex items-center justify-center"
    : "hidden";

  return (
    <div className={modalClasses}>
      {/* 모달 뒷배경 */}
      <div className="modal-overlay absolute inset-0 bg-gray-600 opacity-0"></div>

      {/* 모달 창 */}
      <div className="modal relative bg-gray-200 w-full max-w-md mx-auto rounded-lg shadow-lg z-10">
        <div className="p-4">
          <button
            className="block w-full text-blue-500 hover-text-blue-700 p-2"
            onClick={handleEditClick} // handleEditClick 함수 호출
          >
            댓글 수정
          </button>

          <button
            className="block w-full text-red-500 hover:text-red-700 p-2"
            onClick={handleDeleteClick} // 이 부분 수정
          >
            댓글 삭제
          </button>

          <button
            className="block w-full text-gray-700 hover-text-gray-900 p-2"
            onClick={handleCloseModal} // handleCloseModal 함수 호출
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
