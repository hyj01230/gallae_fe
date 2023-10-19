import { useState } from "react";
import { DownArrow, LeftArrow } from "../assets/Icon";
import Layout from "../components/common/Layout";
import SelectScheduleModal from "../components/postCreate/SelectScheduleModal";
import { useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { getDetailPost } from "../api";

export default function PostCreatePage() {
  const [isModal, setIsModal] = useState(false);
  const postId = useLocation().state;
  console.log("PostCreatePage : ", postId);

  const { isLoading, error, data } = useQuery("schedule", () =>
    getDetailPost(postId)
  );

  if (isLoading) {
    return <div>로딩중</div>;
  }

  console.log(data);

  return (
    <Layout>
      <div className="flex items-center gap-x-1 p-2 border-b border-gray-300">
        <div className="mr-2">
          <LeftArrow />
        </div>
        <div className="h-14 flex items-center text-xl">글쓰기</div>
      </div>

      <div className="border-b border-gray-300 pl-10">
        <div className="h-12 flex items-center gap-x-4 text-base text-gray-300 cursor-pointer select-none">
          {/* <select>
            <option>카테고리 선택</option>
            <option>가족</option>
            <option>친구</option>
            <option>연인</option>
            <option>친척</option>
            <option>반려동물</option>
            <option>단체</option>
          </select> */}
          카테고리
          <DownArrow />
        </div>
      </div>

      <div className="border-b border-gray-300 pl-10">
        <div className="h-12 flex items-center gap-x-4 text-base text-gray-300 cursor-pointer select-none">
          목적
          <DownArrow />
        </div>
      </div>

      <div className="border-b border-gray-300 pl-10">
        <div className="h-12 flex items-center gap-x-4 text-base text-gray-300 cursor-pointer select-none">
          제목을 입력하세요.
        </div>
      </div>

      <div className="h-10 border-b border-gray-300 flex cursor-pointer select-none">
        <div
          className="flex-1 flex items-center justify-center text-sm text-gray-600 border-r border-gray-300"
          onClick={() => setIsModal(true)}
        >
          여행 일정 불러오기
        </div>
        <div className="flex-1 flex items-center justify-center text-sm text-gray-600">
          사진 첨부
        </div>
      </div>

      <div className="p-2 text-gray-200">
        내용을 입력하세요. (최대 20,000자)
      </div>

      <div className="max-w-3xl	flex fixed bottom-0">
        <button className="w-screen h-14 bg-gray-300 text-white">
          게시하기
        </button>
      </div>

      {isModal && <SelectScheduleModal />}
    </Layout>
  );
}
