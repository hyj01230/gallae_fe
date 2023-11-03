export default function EditDeleteModal({
  commentId,
  contents,
  handleDelete,
  setCommentType,
  setNewComment,
}) {
  return (
    <div className="absolute right-4 w-[100px] flex flex-col bg-white ml-10 border cursor-pointer">
      <div
        className="pl-3 py-2 border-b-[1px] border-[#D9D9D9]"
        // onClick={() => setEditedContent(contents)}
        onClick={() => {
          setCommentType("edit");
          setNewComment({ contents });
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