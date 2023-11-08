import { useEffect, useState } from "react";
import { LeftArrow } from "../assets/Icon";
// ThreecIrcle
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
      // console.log("error", error);
    }
  };

  const onCilckMyPostHandler = (postId) => {
    navigate(`/posts/${postId}`);
  };

  // useEffect : 렌더링되면 실행!
  useEffect(() => {
    getPostList();
  }, []);

  // 시간 표시
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear().toString().slice(2); // Get the last two digits of the year
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month starts from 0
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}.${month}.${day}`;
  };

  return (
    <Layout isBottomNav={true}>
      <div className="mt-3 ml-4 mb-[10px] flex justify-start items-center">
        <div onClick={onClickLeftArrowHandler} className="cursor-pointer">
          <LeftArrow />
        </div>

        <div className="ml-[18px] text-xl/8 font-semibold">나의 게시글</div>
      </div>
      {/* <hr className="mt-3 border-[#F2F2F2] border-t-[1px]"></hr> */}

      <div className="mb-44">
        {postList.length > 0 &&
          postList
            .filter((item) => item.contents)
            .map((item) => (
              <div
                key={item.postId}
                onClick={() => onCilckMyPostHandler(item.postId)}
                className="mx-4 mb-4 cursor-pointer"
              >
                <div className="flex flex-col w-full border rounded-xl border-[#D9D9D9">
                  <div>
                    {item.postsPicturesList.length > 0 ? (
                      <img
                        className="w-full h-[167px] rounded-t-xl"
                        src={item.postsPicturesList[0].postsPicturesURL}
                      />
                    ) : (
                      <div className="w-full h-[167px] bg-[#F2F2F2] text-4 text-black font-semibold flex justify-center items-center ">
                        대표 이미지
                      </div>
                    )}
                  </div>
                  <div className="ml-[14px] mr-1 mt-3 flex flex-row items-center justify-between">
                    <div className="text-lg/normal font-semibold text-[#333333]">
                      {item.title}
                    </div>
                    <div>{/* <ThreecIrcle /> */}</div>
                  </div>

                  <div className="mt-[9px] px-3">
                    {item.tagsList &&
                      item.tagsList.map((tag, index) => (
                        <div
                          key={index}
                          className="mr-1 inline-block border text-center border-[#D9D9D9] rounded-xl px-[9px] py-1 h-5 text-xs/3 font-normal text-[#888888]"
                        >
                          {tag}
                        </div>
                      ))}
                  </div>

                  <div className="mt-8 mb-4 ml-3 mr-[14px] flex justify-between items-center">
                    <div className="flex flex-row text-xs/3 text-[#666666] font-normal">
                      <div className="mr-2">댓글 {item.commentNum}</div>
                      <div>좋아요 {item.likeNum}</div>
                    </div>
                    <div className="text-xs/normal font-normal text-[#666666]">
                      게시일 {formatDate(item.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </Layout>
  );
}
