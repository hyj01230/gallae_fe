import { useEffect, useState } from "react";
import {
  Community,
  FillMypage,
  LeftArrow,
  WhiteDocument,
  CommentIcon,
  ReplyIcon,
} from "../assets/Icon";
import Layout from "../components/common/Layout";
import { axiosInstance } from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function MyPageCommentList() {
  // 페이지 이동
  const navigate = useNavigate();
  const onClickLeftArrowHandler = () => {
    navigate("/mypage");
  };

  // useState
  const [myCommentsList, setMyCommentsList] = useState([]); // get : 사용자별 댓글 조회
  const [myRepliesList, setMyRepliesList] = useState([]); // get : 사용자별 대댓글 조회
  const myCommentsRepliesList = [...myCommentsList, ...myRepliesList];
  const sortedLists = myCommentsRepliesList.sort(
    (a, b) => new Date(b.createAt) - new Date(a.createAt)
  );

  // GET : 사용자별 댓글 가져오기
  const getMyCommentsList = async () => {
    try {
      const response = await axiosInstance.get("/api/commentsme");
      console.log("댓글 response :", response);
      setMyCommentsList(response.data.content);
    } catch (error) {
      console.log("댓글 error :", error);
    }
  };

  // useEffect : 렌더링되면 실행!
  useEffect(() => {
    getMyCommentsList();
  }, []);

  // GET : 사용자별 대댓글 가져오기
  const getMyRepliesList = async () => {
    try {
      const response = await axiosInstance.get("/api/repliesme");
      console.log("대댓글 response :", response);
      setMyRepliesList(response.data.content);
    } catch (error) {
      console.log("대댓글 error :", error);
    }
  };

  // useEffect : 렌더링되면 실행!
  useEffect(() => {
    getMyRepliesList();
  }, []);

  // 댓글/대댓글 클릭해서 이동
  // const onClickCommentReplyHandler = () => {
  //   navigate("/mypage");
  // }

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

  //무한 스크롤
  // const observer = new IntersectionObserver(callback { threshold: 0.7 });

  return (
    <Layout>
      <div
        onClick={onClickLeftArrowHandler}
        className="mt-[61px] ml-4 flex justify-start items-center cursor-pointer"
      >
        <LeftArrow />
        <div className="ml-[18px] text-xl/8 font-semibold">나의 댓글 내역</div>
      </div>
      <hr className="mt-[11px] border-[#F2F2F2] border-t-[1px]"></hr>

      {sortedLists.length &&
        sortedLists.map((item) => (
          <div
            key={
              item.commentId
                ? `comment_${item.commentId}`
                : `replies_${item.repliesId}`
            }
            // onClick={onClickCommentReplyHandler}
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
        ))}

      {/* {Lists.length > 0 &&
        Lists.map((item) => (
          <div key={item.Id}> map으로 생성할 내용 작성하기 </div>
        ))}

      {Lists.length &&
        Lists.map((item) => (
          <div key={item.Id}> map으로 생성할 내용 작성하기 </div>
        ))}
      
      {Lists &&
        Lists.map((item) => (
          <div key={item.Id}> map으로 생성할 내용 작성하기 </div>
        ))} */}

      {/* 댓글 */}
      {/* {myCommentsList.length > 0 &&
        myCommentsList.map((item) => (
          <div key={item.commentId} className="ml-4 mt-4 flex flex-row">
            <div className="flex justify-start">
              <div className="w-6 flex flex-col justify-center items-center">
                <CommentIcon />
                <div className="text-xs/[18px] font-normal text-[#999999]">
                  댓글
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
                  {item.createAt}
                </div>
              </div>
            </div>
          </div>
        ))} */}

      {/* 대댓글 */}
      {/* {myRepliesList.length > 0 &&
        myRepliesList.map((item) => (
          <div key={item.repliesId} className="ml-4 mt-4 flex flex-row">
            <div className="flex justify-start">
              <div className="w-6 flex flex-col justify-center items-center">
                <ReplyIcon />
                <div className="text-xs/[18px] font-normal text-[#999999]">
                  답글
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
                  {item.createAt}
                </div>
              </div>
            </div>
          </div>
        ))} */}

      <div className="mb-24"></div>

      <div className="fixed bottom-0 max-w-3xl w-full h-[84px] bg-[#F2F2F2] flex justify-center">
        <div className="h-10 w-full mx-10 mt-[11.6px] flex">
          <div className="w-10 h-10 flex flex-col justify-center items-center">
            <WhiteDocument />
            <div className="mt-[5px] text-center text-[9px] text-[#888888] font-extrabold leading-[9px]">
              일정
            </div>
          </div>
          <div className="mx-auto w-10 h-10 flex flex-col justify-center items-center">
            <Community />
            <div className="mt-[5px] text-center text-[9px] text-[#888888] font-extrabold leading-[9px]">
              커뮤니티
            </div>
          </div>
          <div className="w-[45px] h-10 flex flex-col justify-center items-center">
            <FillMypage />
            <div className="mt-[5px] text-center text-[9px] text-[#888888] font-extrabold leading-[9px]">
              마이페이지
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
