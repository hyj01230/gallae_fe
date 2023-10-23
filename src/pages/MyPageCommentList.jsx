import { useEffect, useState } from "react";
import {
  Community,
  FillMypage,
  LeftArrow,
  WhiteDocument,
  CommentIcon,
  // XIcon,
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

  // const commentListData = [
  //   {
  //     commnetId: "1",
  //     title: "서울 근교 당일치기 대부도 BEST 여행지 추천",
  //     contents: "재밌더라고여 ㅎㅎ 추천합니당~_~",
  //     createdAt: "2023-10-02",
  //   },
  //   {
  //     commnetId: "2",
  //     title: "국내 가족여행, 강원도 평창에서 축제와 함께 힐링해요",
  //     contents: "ㅍㅕㅇㅊㅏㅇ 최고~~~~~ 또 갈래여",
  //     createdAt: "2023-07-21",
  //   },
  //   {
  //     commnetId: "2",
  //     title: "여행을 갑니다 비행기타고 기차타고 요트타고 자동차 타고~_~",
  //     contents: "비행기랑 요트도 나오는데, 기차랑 자동차만 탑니다 ㅎㅁㅎ",
  //     createdAt: "2023-09-12",
  //   },
  // ];

  // useState : get으로 가져온 사용자별 댓글 조회 데이터(getMyCommentsList)
  const [myCommentsList, setMyCommentsList] = useState([]);

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

  // // 사용자별 대댓글 조회
  // // useState : get으로 가져온 사용자별 대댓글 조회 데이터(getMyRepliesList)
  // const [myRepliesList, setMyRepliesList] = useState([]);

  // // GET : 사용자별 대댓글 가져오기
  // const getMyRepliesList = async () => {
  //   try {
  //     const response = await axiosInstance.get("/api/commentsme");
  //     console.log("대댓글 response :", response);
  //     setMyRepliesList(response.data);
  //   } catch (error) {
  //     console.log("대댓글 error :", error);
  //   }
  // };

  // // useEffect : 렌더링되면 실행!
  // useEffect(() => {
  //   getMyRepliesList();
  // }, []);

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

      <div className="mb-24">
        {myCommentsList &&
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
                {/* <div className="ml-2 mr-4">
                  <XIcon />
                </div> */}
              </div>
            </div>
          ))}
      </div>

      {/* 대댓글 */}
      {/* 
      <div className="mb-24">
      {myRepliesList &&
        myRepliesList.map((item) => (
          <div key={item.repliesId} className="ml-4 mt-4 flex flex-row">
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
                  {item.createdAt}
                </div>
              </div>
              <div className="ml-2 mr-4">
                <XIcon />
              </div>
            </div>
          </div>
        ))}
        </div> */}

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
