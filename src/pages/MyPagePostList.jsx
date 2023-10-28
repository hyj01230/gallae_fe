import { useEffect, useState } from "react";
import { LeftArrow, ThreeDots } from "../assets/Icon";
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
                  {item.createdAt}
                </div>
                <div>
                  <ThreeDots />
                  {/* 케밥 모달 */}
                  {/* {modalPostId === item.postId && openModal && (
                    <div className="absolute right-4">
                      <div className="w-[136px] h-[80px] bg-white shadow-[0_0_4px_4px_rgba(0,0,0,0.05)]">
                        <div
                          // onClick={ddd}
                          className="pl-3 w-full h-10 border-b border-[#F2F2F2] flex justify-start items-center cursor-pointer"
                        >
                          좋아요 취소
                        </div>
                        <div
                          // onClick={ddd}
                          className="pl-3 w-full h-10 flex justify-start items-center cursor-pointer"
                        >
                          공유하기
                        </div>
                      </div>
                    </div>
                  )} */}
                </div>
              </div>
            </div>
          ))}
      </div>
    </Layout>
  );
}
