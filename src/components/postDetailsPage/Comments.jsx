import { useState, useEffect, useRef } from "react";
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
  const [selectedReplyForEdit, setSelectedReplyForEdit] = useState(null);
  const [editedReplyContent, setEditedReplyContent] = useState("");
  const editedReplyContentRef = useRef(null);

  const editedContentRef = useRef(null);

  const nickName = useRecoilValue(nickNameState);

  useEffect(() => {
    // ... (editedContent가 변경될 때의 로직)
  }, [editedContent]);

  // 이벤트 핸들러 함수들
  const handleEdit = (comment) => {
    setSelectedCommentForEdit(comment);
    setEditedContent(comment.contents);
    editedContentRef.current.focus();
  };

  // 댓글 삭제 로직
  const handleDelete = async (comment) => {
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
  // 댓글 저장 로직
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
          setEditedCommentIds([...editedCommentIds, comment.commentId]);
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
  // 대댓글 추가 로직
  const handleAddReply = async (commentId, content) => {
    try {
      const response = await axiosInstance.post(
        `/api/comments/${commentId}/replies`,
        { contents: content }
      );

      // 대댓글 작성 후 서버에서 대댓글 목록을 다시 가져옴
      const commentsResponse = await axiosInstance.get(
        `/api/posts/${postId}/comments`
      );
      setComments(commentsResponse.data.content);

      setReplyContent("");
      setSelectedCommentForReply(null);
    } catch (error) {
      console.error("대댓글 작성 오류:", error);
    }
  };

  const isCommentEdited = (comment) =>
    editedCommentIds.includes(comment.commentId);
  // 대댓글 수정 로직
  const handleEditReply = (comment, reply) => {
    setSelectedCommentForEdit(comment);
    setSelectedCommentForReply(reply);
    setEditedContent(reply.contents);
  };
  // 대댓글 저장 로직
  const handleSaveReply = async (comment, reply) => {
    try {
      await axiosInstance.put(
        `/api/replies/${reply.repliesId}`,
        { contents: editedReplyContent },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const updatedReplies = comment.repliesList.map((r) => {
        if (r.repliesId === reply.repliesId) {
          setEditedCommentIds([...editedCommentIds, reply.repliesId]);
          return { ...r, contents: editedReplyContent, modifiedAt: new Date() };
        }
        return r;
      });

      const updatedComments = comments.map((c) => {
        if (c.commentId === comment.commentId) {
          return { ...c, repliesList: updatedReplies };
        }
        return c;
      });

      setComments(updatedComments);
      setEditedReplyContent("");
    } catch (error) {
      console.error("대댓글 수정 중 오류 발생:", error);
    }
  };
  // 대댓글 삭제 로직
  const handleDeleteReply = async (comment, reply) => {
    try {
      // 대댓글을 삭제하는 API 호출
      await axiosInstance.delete(`/api/replies/${reply.repliesId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      // 대댓글 삭제 후, 대댓글 목록을 업데이트합니다.
      const updatedReplies = comment.repliesList.filter(
        (r) => r.repliesId !== reply.repliesId
      );

      const updatedComments = comments.map((c) => {
        if (c.commentId === comment.commentId) {
          return { ...c, repliesList: updatedReplies };
        }
        return c;
      });

      setComments(updatedComments);
    } catch (error) {
      console.error("대댓글 삭제 중 오류 발생:", error);
    }
  };

  const handleOriginalPost = async () => {
    handleCloseModal();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button
          onClick={handleCloseModal}
          className="modal-close-button"
        ></button>
        <div
          className="bg-gray-100 overflow-y-auto w-full"
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
                  {selectedCommentForEdit === comment ? (
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
                    <div className="h-auto">
                      <div className="flex justify-between">
                        <p className="text-[16px] font-semibold flex items-cençter space-x-2">
                          <span className="font-semibold">
                            {comment.nickname}
                          </span>
                          {comment.checkUser === "글쓴이" && (
                            <span className="border border-orange-300 bg-white rounded-[12px] px-2 ml-2 text-yellow-400 text-[12px]">
                              글쓴이
                            </span>
                          )}
                        </p>
                      </div>
                      <p className="text-[14px] font-normal w-[360px]">
                        <span>{comment.contents}</span>
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
                        </div>
                      )}
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
                      <button
                        onClick={() =>
                          setSelectedCommentForReply(comment.commentId)
                        }
                      >
                        대댓글 작성
                      </button>
                      {selectedCommentForReply === comment.commentId && (
                        <div>
                          <input
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="대댓글을 입력하세요."
                            className="w-full"
                          />
                          <button
                            onClick={() =>
                              handleAddReply(comment.commentId, replyContent)
                            }
                          >
                            작성
                          </button>
                        </div>
                      )}

                      {comment.repliesList && comment.repliesList.length > 0 ? (
                        comment.repliesList.map((reply) => (
                          <div
                            key={reply.repliesId}
                            className="bg-white p-4 border relative font-[14px] h-[127px] w-full"
                          >
                            {selectedReplyForEdit === reply ? (
                              <div>
                                <textarea
                                  ref={editedReplyContentRef}
                                  value={editedReplyContent}
                                  onChange={(e) =>
                                    setEditedReplyContent(e.target.value)
                                  }
                                  placeholder="대댓글을 수정하세요..."
                                  className="w-full border rounded p-2"
                                />
                                <div className="absolute right-4 top-4 flex space-x-2">
                                  <button
                                    onClick={() =>
                                      handleSaveReply(comment, reply)
                                    }
                                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                                  >
                                    저장
                                  </button>
                                  <button
                                    onClick={() =>
                                      setSelectedReplyForEdit(null)
                                    }
                                    className="text-red-500"
                                  >
                                    취소
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="h-auto">
                                {/* 대댓글 내용 및 수정, 삭제 버튼 */}
                                <div className="flex justify-between">
                                  <p className="text-[16px] font-semibold flex items-center space-x-2">
                                    <span className="font-semibold">
                                      {reply.nickname}
                                    </span>
                                    {reply.checkUser === "글쓴이" && (
                                      <span className="border border-orange-300 bg-white rounded-[12px] px-2 ml-2 text-yellow-400 text-[12px]">
                                        글쓴이
                                      </span>
                                    )}
                                  </p>
                                </div>
                                <p className="text-[14px] font-nomal w-[360px]">
                                  <span>{reply.contents}</span>
                                </p>
                                {reply.nickname === nickName && (
                                  <div>
                                    <button
                                      onClick={() =>
                                        setSelectedReplyForEdit(reply)
                                      }
                                      className="text-[#999] border-[#FF9900] text-sm mr-1"
                                    >
                                      수정
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteReply(comment, reply)
                                      }
                                      className="text-[#999] border-[#FF9900] text-sm"
                                    >
                                      삭제
                                    </button>
                                  </div>
                                )}
                                <p className="text-[12px] font-normal text-[#999]">
                                  <span>
                                    {formatDate(reply.modifiedAt)}
                                    {isCommentEdited(reply) && (
                                      <span className="text-gray-600 text-[12px] font-semibold">
                                        (수정됨)
                                      </span>
                                    )}
                                  </span>
                                </p>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="p-4 text-[14px] font-normal">
                          대댓글이 아직 없습니다.
                        </p>
                      )}
                    </div>
                  )}
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
        <button className="w-1/3 p-3 bg-[#ff9900] text-white border border-r border-transparent">
          좋아요
        </button>
        <button
          className="w-1/3 p-3 bg-[#ff9900] text-white border border-r"
          onClick={handleOriginalPost}
        >
          원문보기
        </button>
        <button className="w-1/3 p-3 bg-[#ff9900] text-white border-transparent">
          공유하기
        </button>
      </div>
    </div>
  );
}
