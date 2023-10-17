// import { useEffect, useState } from "react";
import {
  Community,
  FillMypage,
  LeftArrow,
  ThreeDots,
  WhiteDocument,
} from "../assets/Icon";
import Layout from "../components/common/Layout";
// import { axiosInstance } from "../api/axiosInstance";

export default function MyPageLikeList() {
  const likeListData = [
    {
      postId: "1",
      title: "서울 근교 당일치기 대부도 BEST 여행지 추천",
      contents: "제가 이번엔 하루동안 다녀온 대부도 여행지를 공유해볼까해요",
      nickName: "유랑이",
      createdAt: "2023-10-02",
    },
    {
      postId: "2",
      title: "국내 가족여행, 강원도 평창에서 축제와 함께 힐링해요",
      contents:
        "메밀꽃필무렵소설의 배경지 봉평 메밀꽃밭에서 열리는 봉평면 효석문화마을 축제입니다....",
      nickName: "갈래애애애",
      createdAt: "2023-07-21",
    },
    {
      postId: "2",
      title: "여행을 갑니다 비행기타고 기차타고 요트타고 자동차 타고~_~",
      contents:
        "야호~야호~이야호~야호~야호~이야호~야호~야호~이야호~야호~야호~이야호~야호~야호~이야호~",
      nickName: "뚜벅이",
      createdAt: "2023-09-12",
    },
  ];

  // const [likeList, setLikeList] = useState([]);

  // const getLikeList = async () => {
  //   try {
  //     const response = await axiosInstance.get("/api/posts/like");
  //     console.log("response", response);
  //     // setLikeList(response.data);
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // };

  // useEffect(() => {
  //   getLikeList();
  // }, []);

  return (
    <Layout>
      <div className="mt-[61px] ml-4  flex justify-start items-center">
        <LeftArrow />
        <div className="ml-[18px] text-xl/8 font-semibold">좋아요 목록</div>
      </div>
      <hr className="mt-[11px] border-[#F2F2F2] border-t-[1px]"></hr>

      {likeListData &&
        likeListData.map((item) => (
          <div key={item.postId} className="mx-4 scr">
            <div className="mt-4 flex w-full">
              <div className="flex flex-col w-full mr-auto">
                <div className="text-sm/[22px] font-semibold">{item.title}</div>
                <div className="mt-2 text-xs/[18px] font-normal text-[#999999]">
                  {item.contents}
                </div>
              </div>

              <div className="flex justify-end">
                <div className="ml-3 w-[88px] h-[88px] bg-[#F2F2F2] rounded-lg flex items-center justify-center">
                  사진
                </div>
              </div>
            </div>

            <div className="mt-2 flex items-center border-b-[1px] pb-3">
              <div className="mr-4 text-[#999999] text-sm/6 font-normal">
                {item.nickName}
              </div>
              <div className="mr-auto text-[#999999] text-sm/6 font-normal">
                {item.createdAt}
              </div>
              <ThreeDots />
            </div>
          </div>
        ))}
      <div className="absolute bottom-0 w-full h-[84px] bg-[#F2F2F2] flex justify-center">
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
