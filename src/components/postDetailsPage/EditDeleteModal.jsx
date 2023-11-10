export default function EditDeleteModal({
  isComment = false,
  isReplyComment = false,
  commentId,
  contents,
  handleDelete,
  setCommentType,
  setNewComment,
  editedContentRef,
}) {
  return (
    <div className="absolute right-4 w-[100px] flex flex-col bg-white ml-10 border cursor-pointer  ">
      {/* <div className="absolute top-0 right-0 mt-2 w-32 bg-white border border-gray-300 rounded-lg shadow-lg"></div> */}
      <div
        className="pl-4 py-2 border-b-[1px] border-[#D9D9D9] justify-center"
        onClick={() => {
          if (isComment) {
            setCommentType("edit");
            setNewComment({ contents });
          }

          if (isReplyComment) {
            setCommentType("replyEdit");
            setNewComment({ contents });
          }
          // 모달 내의 입력 창에 포커스
          if (editedContentRef && editedContentRef.current) {
            editedContentRef.current.focus();
          }
        }}
      >
        댓글 수정
      </div>
      <div
        className="pl-4 py-2 border-b-[1px] border-[#D9D9D9]"
        onClick={handleDelete}
      >
        댓글 삭제
      </div>
    </div>
  );
}
