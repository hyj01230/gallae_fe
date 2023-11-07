export default function EditDeleteModal({
  commentId,
  contents,
  handleDelete,
  setCommentType,
  setNewComment,
  editedContentRef,
}) {
  return (
    <div className="absolute right-4 w-[100px] flex flex-col bg-white ml-10 border cursor-pointer">
      <div
        className="pl-3 py-2 border-b-[1px] border-[#D9D9D9]"
        onClick={() => {
          setCommentType("edit");
          setNewComment({ contents });
          if (editedContentRef && editedContentRef.current) {
            editedContentRef.current.focus(); // 모달 내의 입력 창에 포커스를 줍니다.
          }
        }}
      >
        댓글 수정
      </div>
      <div className="pl-3 py-2" onClick={() => handleDelete(commentId)}>
        댓글 삭제
      </div>
    </div>
  );
}
