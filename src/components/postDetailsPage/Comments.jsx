import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../api/axiosInstance";
import { useRecoilValue } from "recoil";
import { nickNameState } from "../../store/atom";
import { CommentThreeDots, LeftArrow, Reply } from "../../assets/Icon";
import { useInView } from "react-intersection-observer";
import EditDeleteModal from "./EditDeleteModal";
import { formatDateComments } from "../../util/formatDate";
// 날짜 시간 형식

export default function Comments({ handleCloseModal, postId }) {
  const [selectedId, setSelectedId] = useState(null);
  const [newComment, setNewComment] = useState({ contents: "" });
  const [isEditDelete, setIsEditDelete] = useState(false); // 댓글 수정/삭제 모달 상태 관리
  const [commentType, setCommentType] = useState("normal"); // 댓글 상태관리 (댓글 입력, 댓글 수정, 대댓글 입력,대댓글 수정)
  const navigate = useNavigate();
  const editedContentRef = useRef(null);
  const [last, setLast] = useState(false); // 마지막 페이지 확인

  const nickName = useRecoilValue(nickNameState);

  // 무한스크롤
  const [ref, inView] = useInView();
  const [page, setPage] = useState(0); // 현재 페이지 번호
  const [commentList, setCommentList] = useState([]);
  const [hasContent, setHasContent] = useState(false);

  const getCommentList = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/posts/${postId}/comments`,
        {
          params: {
            page: `${page}`, // 백틱으로 변수를 문자열로 변환
            size: 10,
          },
        }
      );
      const newComment = response.data.content;
      // 이제 newComment를 기존 commentList에 추가합니다.
      setCommentList((commentList) => [...commentList, ...newComment]);

      // 요청 성공 시에 페이지에 1 카운트 해주기
      // 라스트불린값이 트루면 끝 아니면 +1
      setPage((page) => page + 1);
      setLast(response.data.last); // 마지막 페이지 확인값
    } catch (err) {
      // console.log("에러 발생:", err);
    }
  };

  useEffect(() => {
    getCommentList();
  }, []);

  // inView 상태가 true일 때(= 관찰한 게시물 ref가 화면에 보일 때 = 마지막)
  // 좋아요한 게시물 목록을 추가로 가져오기
  useEffect(() => {
    if (inView) {
      getCommentList();
      // console.log("📢 데이터를 더 가져와랏!!", inView);
      // console.log("page 번호", page);
      // console.log("로드된 데이터", commentList);
      // console.log("🔍 막지막 페이지 확인", last);
    }
  }, [inView]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        `/api/posts/${postId}/comments`,
        newComment
      );

      const commentsResponse = await axiosInstance.get(
        `/api/posts/${postId}/comments`
      );
      setCommentList(commentsResponse.data.content);
      setNewComment({ contents: "" });
      // console.log(response);
    } catch (error) {
      console.error("댓글 작성 오류:", error);
    }
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
  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/api/comments/${selectedId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      // 대댓글 작성 후 서버에서 대댓글 목록을 다시 가져옴
      const commentsResponse = await axiosInstance.get(
        `/api/posts/${postId}/comments`
      );
      setCommentList(commentsResponse.data.content);
      setNewComment({ contents: "" });
    } catch (error) {
      // console.error("댓글 삭제 중 오류 발생:", error);
    }
  };
  // 댓글 저장 로직
  const handleSave = async (contents) => {
    try {
      await axiosInstance.put(`/api/comments/${selectedId}`, contents, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      // 대댓글 작성 후 서버에서 대댓글 목록을 다시 가져옴
      const commentsResponse = await axiosInstance.get(
        `/api/posts/${postId}/comments`
      );
      setCommentList(commentsResponse.data.content);
      setNewComment({ contents: "" });
      setCommentType("normal");
    } catch (error) {
      // console.error("댓글 수정 중 오류 발생:", error);
    }
  };
  // 대댓글 추가 로직
  const handleAddReply = async (contents) => {
    try {
      const response = await axiosInstance.post(
        `/api/comments/${selectedId}/replies`,
        contents
      );
      // 대댓글 작성 후 서버에서 대댓글 목록을 다시 가져옴
      const commentsResponse = await axiosInstance.get(
        `/api/posts/${postId}/comments`
      );
      setCommentList(commentsResponse.data.content);
      setNewComment({ contents: "" });
      setCommentType("normal");
      // console.log("response:", response);
      setCommentList(commentsResponse.data.content);
    } catch (error) {
      // console.error("대댓글 작성 오류:", error);
    }
  };
  // 대댓글 저장 로직
  const handleSaveReply = async (comment) => {
    try {
      await axiosInstance.put(`/api/replies/${selectedId}`, comment, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      // 대댓글 작성 후 서버에서 대댓글 목록을 다시 가져옴
      const commentsResponse = await axiosInstance.get(
        `/api/posts/${postId}/comments`
      );
      setCommentList(commentsResponse.data.content);
      setNewComment({ contents: "" });
      setCommentType("normal");
    } catch (error) {
      // console.error("대댓글 수정 중 오류 발생:", error);
    }
  };
  // 대댓글 삭제 로직
  const handleDeleteReply = async () => {
    try {
      // 대댓글을 삭제하는 API 호출
      await axiosInstance.delete(`/api/replies/${selectedId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      // 대댓글 작성 후 서버에서 대댓글 목록을 다시 가져옴
      const commentsResponse = await axiosInstance.get(
        `/api/posts/${postId}/comments`
      );
      setCommentList(commentsResponse.data.content);
      setNewComment({ contents: "" });
      setCommentType("normal");
    } catch (error) {
      // console.error("대댓글 삭제 중 오류 발생:", error);
    }
  };

  const handleOpenEditDeleteModal = (index) => {
    setSelectedId(index);
    setIsEditDelete(!isEditDelete);
  };

  return (
    <div className="bg-white fixed top-0 left-0 right-0  h-screen  flex flex-col  overflow-auto max-w-3xl mx-auto">
      {/* [CSS] 헤더 */}
      <div className="flex items-center gap-4">
        <div className="ml-4" onClick={handleCloseModal}>
          <LeftArrow />
        </div>
        <div className="text-[20px] text-[#333] font-semibold py-2">댓글</div>
      </div>
      {/* [CSS] 댓글 및 대댓글 리스트 */}
      <div
        className="grid divide-y overflow-auto overflow-y-auto mb-[80px] mr-4 w-full"
        style={{ overflowX: "hidden" }}
      >
        {commentList.length > 0 && Array.isArray(commentList) ? (
          commentList.map((value, index) => (
            <div key={index} style={{ maxWidth: "100%" }}>
              {/* 댓글 */}
              <div
                ref={ref}
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
                    className="relative"
                    onClick={() => handleOpenEditDeleteModal(value.commentId)}
                  >
                    <CommentThreeDots />
                    {/* 케밥 메뉴를 눌렀을 때 작성자면 댓글 수정/삭제 모달을 띄운다 */}
                    {selectedId === value.commentId &&
                    value.nickname === nickName &&
                    isEditDelete ? (
                      <EditDeleteModal
                        isComment={true}
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
                  {/* 컨텐츠 내용을 줄바꿈해서 나타나게 하기 */}
                  {value.contents &&
                    value.contents.split("\n").map((line, lineIndex) => (
                      <span key={lineIndex}>
                        {line}
                        {lineIndex < value.contents.split("\n").length - 1 && (
                          <br />
                        )}
                      </span>
                    ))}
                </div>
                <div className="flex flex-row justify-between">
                  <div className="text-xs/normal font-light text-[#999999] flex items-end">
                    {formatDateComments(
                      value.modifiedAt ? value.modifiedAt : value.createAt,
                      value.modifiedAt !== null
                    )}
                    {/* {value.modifiedAt && (
                      <span className="text-xs/normal text-[#999999] ml-1">
                        (수정됨)
                      </span>
                    )} */}
                  </div>

                  <div className="flex flex-row">
                    <div className="mr-1 mt-4 flex flex-row items-center h-6 w-[59px] text-center border rounded-[18px] cursor-pointer">
                      <Reply />
                      <div
                        className="text-xs/normal text-[#D9D9D9] font-normal"
                        onClick={() => {
                          setSelectedId(value.commentId);
                          setCommentType("reply");
                          if (editedContentRef && editedContentRef.current) {
                            editedContentRef.current.focus();
                          }
                        }}
                      >
                        답글
                      </div>
                    </div>

                    {/* <button>답글</button> */}
                  </div>
                </div>
              </div>
              {/* 답글 */}
              {value.repliesList &&
                value.repliesList.length >= 1 &&
                value.repliesList.map((reply, index) => (
                  <div key={index}>
                    <div className="bg-[#FAFAFA] px-4 py-[15px] h-[126px] border-b border-[#F2F2F2] ">
                      {/* 대댓글 내용 */}
                      <div className="flex flex-row items-center w-full">
                        <Reply />
                        <div className="ml-3 flex flex-row items-center justify-between w-full">
                          <div className="mr-2 text-base/normal  text-[#333333]">
                            <span className="text-base/normal font-semibold text-[#333333]">
                              {reply.nickname}
                            </span>
                            {reply.checkUser === "글쓴이" && (
                              <span
                                className="border border-orange-300 bg-white 
                              rounded-[12px] px-2 py-[2px] ml-2 text-yellow-400 text-[12px]"
                              >
                                글쓴이
                              </span>
                            )}
                          </div>
                          <div
                            className="relative"
                            onClick={() =>
                              handleOpenEditDeleteModal(reply.repliesId)
                            }
                          >
                            <CommentThreeDots />
                            {/* 케밥 메뉴를 눌렀을 때 작성자면 댓글 수정/삭제 모달을 띄운다 */}
                            {selectedId === reply.repliesId &&
                            reply.nickname === nickName &&
                            isEditDelete ? (
                              <EditDeleteModal
                                isReplyComment={true}
                                commentId={reply.repliesId}
                                contents={reply.contents}
                                setCommentType={setCommentType}
                                setNewComment={setNewComment}
                                handleDelete={handleDeleteReply}
                                editedContentRef={editedContentRef}
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
                          {formatDateComments(
                            reply.modifiedAt
                              ? reply.modifiedAt
                              : reply.createAt,
                            reply.modifiedAt !== null
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))
        ) : (
          // 댓글이 없을 때 메시지 표시
          <div className="mx-auto  mt-[190px]">
            <img src={"/img/question_mark_woman.png"} className="mx-auto" />

            <div className="flex flex-col justify-center mx-auto mt-10 select-none text-[#D9D9D9]">
              <p className="text-center mb-1">아직 댓글이 없네요.</p>
              <p className="text-center	">
                아래의
                <span
                  className="text-[#F90] font-semibold cursor-pointer"
                  onClick={() => {
                    if (editedContentRef && editedContentRef.current) {
                      editedContentRef.current.focus();
                    }
                  }}
                >
                  댓글창
                </span>
                을 통해 첫 댓글을 달아주세요!
              </p>
            </div>
          </div>
        )}
      </div>
      {/* [CSS] 댓글 입력창 고정 부분 */}
      <div
        className="fixed left-0 right-0 bottom-0 max-w-screen-md mx-auto h-[87px] flex items-center "
        style={{ backgroundColor: "#FAFAFA" }}
        onClick={handleCommentButtonClick}
      >
        <textarea
          value={newComment.contents}
          ref={editedContentRef}
          onChange={(e) => {
            // const inputValue = e.target.value.trim();
            // setHasContent(inputValue.length > 0);
            if (newComment.contents.length <= 300) {
              setNewComment({ contents: e.target.value });
            }
          }}
          maxLength={300}
          placeholder="댓글을 입력하세요."
          className="h-[45px] p-4 ml-4 overflow-hidden rounded-2xl bg-white leading-[20px]"
          style={{
            backgroundColor: "#F2F2F2",
            width: "90%",
            wordWrap: "break-word",
            overflowWrap: "break-word",
            whiteSpace: "pre-wrap",
          }}
        />

        <button
          onClick={async (e) => {
            // if (!hasContent) {
            if (newComment.contents.trim().length === 0) {
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
            if (commentType === "replyEdit") {
              await handleSaveReply(newComment);
            }
          }}
          className={`${
            // hasContent
            newComment.contents?.trim()
              ? "bg-[#f90] text-white transition-all duration-1000"
              : "bg-[#D9D9D9] text-[white] transition-all duration-1000"
          } font-[14px] ml-1 w-[60px] h-[45px] rounded-full mr-4`}
        >
          {commentType === "normal" && "등록"}
          {commentType === "edit" && "수정"}
          {commentType === "reply" && "등록"}
          {commentType === "replyEdit" && "수정"}
        </button>
      </div>
    </div>
  );
}
