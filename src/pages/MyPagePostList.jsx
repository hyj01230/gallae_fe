import { useEffect, useState } from "react";
import { LeftArrow } from "../assets/Icon";
import Layout from "../components/common/Layout";
import { axiosInstance } from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function MyPagePostList() {
  // 페이지 이동
  const navigate = useNavigate();
  const onClickLeftArrowHandler = () => {
    navigate("/mypage");
  };

  // useState : get으로 가져온 사용자별 좋아요 게시글 데이터(getLikeList)
  const [postList, setPostList] = useState([]);

  // GET : 사용자별 게시글 가져오기
  const getPostList = async () => {
    try {
      const response = await axiosInstance.get("/api/user/posts");
      console.log("response", response);
      setPostList(response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  // useEffect : 렌더링되면 실행!
  useEffect(() => {
    getPostList();
  }, []);

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
      <div className="mt-3 ml-4 flex justify-start items-center">
        <div onClick={onClickLeftArrowHandler} className="cursor-pointer">
          <LeftArrow />
        </div>

        <div className="ml-[18px] text-xl/8 font-semibold">나의 게시글</div>
      </div>
      <hr className="mt-3 border-[#F2F2F2] border-t-[1px]"></hr>

      <div className="mb-44">
        {postList.length > 0 &&
          postList.map((item) => (
            <div key={item.postId} className="mx-4 cursor-pointer">
              <div className="mt-4 flex w-full">
                <div className="flex flex-col w-full mr-auto">
                  <div className="text-sm/[22px] font-semibold">
                    {item.title}
                  </div>
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

              <div className="mt-2 flex items-center border-b-[1px] border-[#F2F2F2] pb-3">
                <div className="mr-4 text-[#999999] text-sm/6 font-normal">
                  {item.nickName}
                </div>
                <div className="mr-auto text-[#999999] text-sm/6 font-normal">
                  {getTimeAgo(item.createAt)}
                </div>
              </div>
            </div>
          ))}
      </div>
    </Layout>
  );
}
