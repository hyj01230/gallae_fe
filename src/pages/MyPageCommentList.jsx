import { useEffect, useState } from "react";
import { LeftArrow, CommentIcon, ReplyIcon } from "../assets/Icon";
import Layout from "../components/common/Layout";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { getCommetsListAPI, getRepliesListAPI } from "../api";

export default function MyPageCommentList() {
  // 페이지 이동
  const navigate = useNavigate();
  const onClickLeftArrowHandler = () => {
    navigate("/mypage");
  };

  // 무한스크롤
  // ref : 관찰할 객체
  // inView : ref가 화면에 보이면 true로 변경됨
  const [ref, inView] = useInView();
  const [myCommentspage, setMyCommentsPage] = useState(0); // 댓글 페이지 수 관리
  const [myRepliespage, setMyRepliesPage] = useState(0); // 대댓글 페이지 수 관리
  const [myCommentsList, setMyCommentsList] = useState([]); // get : 사용자별 댓글 조회
  const [myRepliesList, setMyRepliesList] = useState([]); // get : 사용자별 대댓글 조회
  const [myCommentslast, setMyCommentsLast] = useState(false); // 댓글 마지막 페이지 확인
  const [myReplieslast, setMyRepliesLast] = useState(false); // 대댓글 마지막 페이지 확인
  const myCommentsRepliesList = [...myCommentsList, ...myRepliesList];
  const sortedLists = myCommentsRepliesList.sort(
    (a, b) => new Date(b.createAt) - new Date(a.createAt)
  );

  // GET : 사용자별 댓글 가져오기
  const getMyCommentsList = async () => {
    try {
      const response = await getCommetsListAPI(myCommentspage, {
        params: {
          page: `${myCommentspage}`, // 현재 페이지 번호
          size: 5, // 원하는 페이지 크기(게시물 수)
        },
      });
      // console.log("댓글 response :", response);
      setMyCommentsList((myCommentsList) => [
        ...myCommentsList,
        ...response.data.content,
      ]);
      setMyCommentsPage((myCommentspage) => myCommentspage + 1); // 페이지 번호 +1 시킴
      setMyCommentsLast(response.data.last);
    } catch (error) {
      // console.log("댓글 error :", error);
    }
  };

  // useEffect : 렌더링되면 실행!
  useEffect(() => {
    getMyCommentsList();
  }, []);

  // GET : 사용자별 대댓글 가져오기
  const getMyRepliesList = async () => {
    try {
      const response = await getRepliesListAPI(myRepliespage, {
        params: {
          page: `${myRepliespage}`, // 현재 페이지 번호
          size: 5, // 원하는 페이지 크기(게시물 수)
        },
      });
      // console.log("대댓글 response :", response);
      setMyRepliesList((myRepliesList) => [
        ...myRepliesList,
        ...response.data.content,
      ]);
      setMyRepliesPage((myRepliespage) => myRepliespage + 1); // 페이지 번호 +1 시킴
      setMyRepliesLast(response.data.last);
    } catch (error) {
      // console.log("대댓글 error :", error);
    }
  };

  // useEffect : 렌더링되면 실행!
  useEffect(() => {
    getMyRepliesList();
  }, []);

  // inView 상태가 true일 때(= 관찰한 게시물 ref가 화면에 보일 때 = 마지막)
  // 좋아요한 게시물 목록을 추가로 가져오기
  useEffect(() => {
    if (inView) {
      getMyCommentsList();
      getMyRepliesList();
      // console.log("📢 데이터를 더 가져와랏!!", inView);
      // console.log("로드된 데이터", myCommentsRepliesList);
      // console.log("💬 댓글 page 번호", myCommentspage);
      // console.log("💬 댓글 막지막 페이지 확인", myCommentslast);
      // console.log("➡️ 대댓글 page 번호", myRepliespage);
      // console.log("➡️ 대댓글 막지막 페이지 확인", myReplieslast);
      // console.log("-------------------------");
    }
  }, [inView]);

  // 댓글/대댓글 클릭해서 이동
  // const onClickCommentReplyHandler = (commentId) => {
  //   navigate(`/comment-detail/${commentId}`);
  // };

  // 입력 시간 표시
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const createAt = new Date(timestamp);
    const timeDiff = now - createAt;
    const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));

    if (hoursAgo < 1) {
      const minutesAgo = Math.floor(timeDiff / (1000 * 60));
      if (minutesAgo < 1) {
        return "방금 전";
      }
      return `${minutesAgo}분 전`;
    }

    if (hoursAgo < 24) {
      return `${hoursAgo}시간 전`;
    }

    const daysAgo = Math.floor(hoursAgo / 24);
    if (daysAgo === 1) {
      return "어제";
    }

    // 년-월-일 시간:분 형식으로 날짜 및 시간 표시
    const formattedDate = `${createAt.getFullYear()}-${(createAt.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${createAt
      .getDate()
      .toString()
      .padStart(2, "0")} ${createAt
      .getHours()
      .toString()
      .padStart(2, "0")}:${createAt.getMinutes().toString().padStart(2, "0")}`;
    return formattedDate;
  };

  return (
    <Layout isBottomNav={true}>
      <div className="bg-white fixed max-w-3xl w-full pt-3 pl-4 pb-[10px] flex justify-start items-center">
        <div onClick={onClickLeftArrowHandler} className="cursor-pointer">
          <LeftArrow />
        </div>

        <div className="ml-[18px] text-xl/8 font-semibold">나의 댓글 내역</div>
      </div>

      <div className="mt-[73px] mb-24">
        {sortedLists.length > 0 ? (
          sortedLists.map((item) => (
            <div
              ref={ref}
              key={
                item.commentId
                  ? `comment_${item.commentId}`
                  : `replies_${item.repliesId}`
              }
              // onClick={() => onClickCommentReplyHandler(item.commentId)}
              className="ml-4 mt-4 flex flex-row"
            >
              <div className="flex justify-start">
                <div className="w-6 flex flex-col justify-center items-center">
                  {item.commentId ? <CommentIcon /> : <ReplyIcon />}
                  <div className="text-xs/[18px] font-normal text-[#999999]">
                    {item.commentId ? "댓글" : "답글"}
                  </div>
                </div>
              </div>

              <div className="ml-[23px] w-full border-[#F2F2F2] pl-[7px] flex flex-row border-b-[1px]">
                <div className="w-full">
                  <div className="text-sm/[22px] font-semibold text-[#333333]">
                    {item.title}
                  </div>
                  <div className="mt-1 text-sm/[18px] font-normal text-[#999999]">
                    {item.contents}
                  </div>
                  <div className="mb-4 mt-1 text-xs/[18px] font-normal text-[#999999]">
                    {getTimeAgo(item.createAt)}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="mt-60 mb-44">
            <div className=" flex w-full justify-center text-xl/normal text-[#333333] font-normal">
              나의 댓글 내역이 없습니다.
            </div>
            <div
              onClick={() => navigate(`/posts`)}
              className="mt-5 flex w-full justify-center text-lg/normal text-[#FF9900] font-normal"
            >
              댓글 작성하러 가기
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
