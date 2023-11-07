import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../api/axiosInstance";
import { useRecoilValue } from "recoil";
import { nickNameState } from "../../store/atom";
import { CommentThreeDots, LeftArrow, Reply } from "../../assets/Icon";
import EditDeleteModal from "./EditDeleteModal";

// 날짜 시간 형식
function formatDate(date, isModified) {
  if (!date || isNaN(new Date(date).getTime())) {
    return "";
  }

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  const formattedDate = new Date(date).toLocaleString("ko-KR", options);

  return formattedDate.replace("오전", "").replace("오후", "");
}

export default function Comments({
  isUpdate,
  setIsUpdate,
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
  const [isEditDelete, setIsEditDelete] = useState(false); // 댓글 수정/삭제 모달 상태 관리
  const [commentType, setCommentType] = useState("normal"); // 댓글 상태관리 (댓글 입력, 댓글 수정, 대댓글 입력,대댓글 수정)
  const navigate = useNavigate();
  const editedContentRef = useRef(null);

  const nickName = useRecoilValue(nickNameState);

  // useEffect(() => {
  //   // ... (editedContent가 변경될 때의 로직)
  // }, [editedContent]);

  // 이벤트 핸들러 함수들
  const handleEdit = (comment) => {
    setSelectedCommentForEdit(comment);
    setEditedContent(comment.contents);
    editedContentRef.current.focus(); // input 엘리먼트에 포커스를 주기
  };

  // 댓글 작성 버튼 클릭 핸들러
  const handleCommentButtonClick = async () => {
    if (!localStorage.getItem("accessToken")) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }
  };

  // 댓글 삭제 로직
  const handleDelete = async (commentId) => {
    const updatedComments = comments.filter((c) => c.commentId !== commentId);

    try {
      await axiosInstance.delete(`/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setIsEditDelete(false);
      setComments(updatedComments);
    } catch (error) {
      console.error("댓글 삭제 중 오류 발생:", error);
    }
  };
  // 댓글 저장 로직
  const handleSave = async (contents) => {
    try {
      await axiosInstance.put(`/api/comments/${selectedComment}`, contents, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const updatedComments = comments.map((c) => {
        if (c.commentId === selectedComment) {
          return { ...c, contents: contents.contents };
        }
        return c;
      });

      setIsUpdate(!isUpdate);
      setComments(updatedComments);
      setNewComment({ contents: "" });
      setCommentType("normal");
    } catch (error) {
      console.error("댓글 수정 중 오류 발생:", error);
    }
  };

  // 대댓글 추가 로직
  const handleAddReply = async (contents) => {
    try {
      const response = await axiosInstance.post(
        `/api/comments/${selectedComment}/replies`,
        contents
      );
      setCommentType("normal");

      // // 대댓글 작성 후 서버에서 대댓글 목록을 다시 가져옴
      // const commentsResponse = await axiosInstance.get(
      //   `/api/posts/${postId}/comments`
      // );
      // setComments(commentsResponse.data.content);

      // setReplyContent("");
      // setSelectedCommentForReply(null);
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

  const handleOpenEditDeleteModal = (index) => {
    setSelectedComment(index);
    setIsEditDelete(!isEditDelete);
  };

  // console.log(comments);
  // console.log(selectedComment);

  return (
    <div className="bg-white fixed top-0 left-0 right-0  h-screen  z-50 flex flex-col  overflow-auto max-w-3xl mx-auto">
      {/* [CSS] 헤더 */}
      <div className="flex items-center gap-4">
        <div className="ml-4" onClick={handleCloseModal}>
          <LeftArrow />
        </div>
        <div className="text-[20px] text-[#333] font-semibold py-3">댓글</div>
      </div>

      {/* [CSS] 댓글 및 대댓글 리스트 */}
      <div
        className="grid divide-y overflow-auto overflow-y-auto mb-[80px] mr-4 w-[400px]"
        style={{ overflowX: "hidden" }}
      >
        {Array.isArray(comments) && comments.length > 0 ? (
          comments.map((value, index) => (
            <div key={index} style={{ maxWidth: "100%" }}>
              {/* 댓글 */}
              <div
                key={index}
                className="px-4 py-[15px] h-auto border-b border-[#F2F2F2]"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-base/normal font-semibold text-[#333333]">
                      {value.nickname}
                    </span>
                    {value.checkUser === "글쓴이" && (
                      <span className="border border-orange-300 bg-white rounded-[12px] px-2 ml-2 text-yellow-400 text-[12px]">
                        글쓴이
                      </span>
                    )}
                  </div>
                  <div
                    onClick={() => handleOpenEditDeleteModal(value.commentId)}
                  >
                    <CommentThreeDots />
                    {/* 케밥 메뉴를 눌렀을 때 작성자면 댓글 수정/삭제 모달을 띄운다 */}
                    {selectedComment === value.commentId &&
                    value.nickname === nickName &&
                    isEditDelete ? (
                      <EditDeleteModal
                        commentId={value.commentId}
                        contents={value.contents}
                        setCommentType={setCommentType}
                        setNewComment={setNewComment}
                        handleDelete={handleDelete}
                        editedContentRef={editedContentRef}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <div className="h-auto w-full text-sm/normal font-normal text-[#333333]">
                  {value.contents}
                </div>
                <div className="flex flex-row justify-between">
                  <div className="text-xs/normal font-light text-[#999999] flex items-end">
                    {formatDate(
                      value.modifiedAt ? value.modifiedAt : value.createAt,
                      value.modifiedAt !== null
                    )}
                  </div>
                  <div className="flex flex-row">
                    {/* <div className="mr-1 flex flex-row items-center h-6 w-[59px] text-center border rounded-[18px]">
                      <Reply />
                      <div className="text-xs/normal text-[#D9D9D9] font-normal">
                        답글
                      </div>
                    </div>
                    <div className="h-6 w-[50px] text-center border rounded-[18px] flex flex-row items-center justify-center">
                      <div className="text-xs/normal text-[#D9D9D9] font-normal mr-[2px]">
                        ♡
                      </div>
                      <div className="text-xs/normal text-[#D9D9D9] font-normal">
                        1
                      </div>
                    </div> */}
                    {/* <button
                      onClick={() => {
                        setSelectedComment(value.commentId);
                        setCommentType("reply");
                      }}
                    >
                      답글
                    </button> */}
                  </div>
                </div>
              </div>
              {/* 대댓글 */}
              {/* {value.repliesList.length > 1 &&
                value.repliesList.map((reply, index) => (
                  <div key={index}>
                    <div className="bg-[#FAFAFA] px-4 py-[15px] h-[126px] border-b border-[#F2F2F2]"> */}
              {/* 대댓글 내용 */}
              {/* <div className="flex flex-row items-center">
                        <Reply />
                        <div className="ml-3 flex flex-row items-center w-full">
                          <div className="mr-2 text-base/normal font-semibold text-[#333333]">
                            {reply.nickname}
                          </div>
                          <div className="pr- border border-[#FF9900] rounded-xl w-[43px] h-4 text-[10px]/normal text-[#FF9900] font-normal text-center">
                            글쓴이
                          </div>
                          <div
                            onClick={() =>
                              handleOpenEditDeleteModal(reply.repliesId)
                            }
                          >
                            <CommentThreeDots /> */}
              {/* 케밥 메뉴를 눌렀을 때 작성자면 댓글 수정/삭제 모달을 띄운다 */}
              {/* {selectedComment === reply.repliesId &&
                            reply.nickname === nickName &&
                            isEditDelete ? (
                              <EditDeleteModal
                                commentId={reply.repliesId}
                                contents={reply.contents}
                                setCommentType={setCommentType}
                                setNewComment={setNewComment}
                                handleDelete={handleDelete}
                              />
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="ml-9 h-9 w-full text-sm/normal font-normal text-[#333333]">
                        {reply.contents}
                      </div>

                      <div className="ml-9 flex flex-row justify-between">
                        <div className="text-xs/normal font-light text-[#999999] flex items-end">
                          {formatDate(reply.createAt)}
                        </div>
                      </div>
                    </div>
                  </div> */}
              {/* ))} */}
            </div>
          ))
        ) : (
          <>작성된 댓글이 없습니다</>
        )}
      </div>

      {/* [CSS] 댓글 입력창 고정 부분 */}
      <div
        className="fixed left-0 right-0 bottom-0 max-w-screen-md mx-auto"
        onClick={handleCommentButtonClick}
      >
        <textarea
          value={newComment.contents}
          ref={editedContentRef}
          onChange={(e) => {
            if (e.target.value.length <= 300) {
              // 입력 길이가 300자 이하일 때만 값을 업데이트합니다.
              setNewComment({ contents: e.target.value });
            }
          }}
          maxLength={300} // 최대 입력 길이를 300으로 설정
          placeholder="댓글을 입력하세요."
          className="w-full h-[57px] p-4 resize-none outline-none overflow-hidden"
        />
        <button
          onClick={async (e) => {
            if (newComment.contents.trim() === "") {
              alert("댓글 내용을 입력하세요.");
              return;
            }

            if (commentType === "normal") {
              await handleCommentSubmit(e);
            }

            if (commentType === "edit") {
              await handleSave(newComment);
            }

            if (commentType === "reply") {
              await handleAddReply(newComment);
            }
          }}
          className="bg-white font-[14px] absolute top-4 right-5 mx-0 rounded-md text-[#666]"
        >
          {commentType === "normal" && "등록"}
          {commentType === "edit" && "수정"}
        </button>
      </div>
    </div>
  );
}
