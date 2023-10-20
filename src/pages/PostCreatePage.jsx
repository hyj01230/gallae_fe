import { useEffect, useRef, useState } from "react";
import { DownArrow, LeftArrow } from "../assets/Icon";
import Layout from "../components/common/Layout";
import SelectScheduleModal from "../components/postCreate/SelectScheduleModal";
import { useLocation, useNavigate } from "react-router-dom";
import { getDetailPost, updatePost } from "../api";
import ContentEditable from "react-contenteditable";
import List from "../components/mySchedules/List";
import { useMutation } from "react-query";

const categories = ["가족", "친구", "연인", "친척", "반려동물", "단체"];
const purposes = [
  "휴식",
  "프리미엄",
  "체험",
  "식도락",
  "자연경관",
  "명소",
  "스포츠",
  "오락",
  "레저",
];

export default function PostCreatePage() {
  const ref = useRef();
  const data = useLocation().state;
  const navigate = useNavigate();
  const [isModal, setIsModal] = useState(false);
  const [isCategoryDrop, setIsCategoryDrop] = useState(false);
  const [isPurposeDrop, setIsPurposeDrop] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(data.postId);
  const [postData, setPostData] = useState({ contents: "", tagsList: [] });
  const [listData, setListData] = useState(data);

  useEffect(() => {
    const getData = async () => {
      const response = await getDetailPost(selectedPostId);
      setPostData({ ...response, contents: "" });
    };

    getData();
  }, [selectedPostId]);

  // 카테고리 설정
  const handleCategoryClick = async (e) => {
    setPostData((data) => ({ ...data, postCategory: e.target.innerText }));
  };

  // 태그 설정
  const handlePurposeClick = (e) => {
    const { textContent } = e.currentTarget;
    const tagsList = postData.tagsList;
    const index = tagsList.indexOf(textContent);
    if (index === -1) {
      tagsList.push(textContent);
      if (tagsList.length > 3) {
        return;
      }
    } else {
      tagsList.splice(index, 1);
    }
    setPostData((data) => ({ ...data, tagsList }));
  };

  // 일정 설정 (일정 선택 후 useEffect 동작)
  const handleScheduleClick = async (data) => {
    setSelectedPostId(data.postId);
    setListData(data);
    setIsModal(false);
  };

  // 게시글 생성
  const createPostMutation = useMutation(
    "schedule",
    () =>
      updatePost(selectedPostId, {
        title: postData.title,
        contents: postData.contents,
        postCategory: postData.postCategory,
        tagsList: postData.tagsList,
      }),
    { onSuccess: () => navigate("/posts") }
  );

  return (
    <Layout>
      <div className="flex items-center gap-x-1 p-2 border-b border-gray-300">
        <div className="mr-2">
          <LeftArrow />
        </div>
        <div className="h-14 flex items-center text-xl">글쓰기</div>
      </div>

      <div
        className="border-b border-gray-300 pl-10"
        onClick={() => setIsCategoryDrop(!isCategoryDrop)}
      >
        <div className="h-12 flex items-center gap-x-4 text-base text-gray-300 cursor-pointer select-none">
          카테고리
          <DownArrow />
          {postData.postCategory}
        </div>
      </div>
      {isCategoryDrop && (
        <div className="pl-10 cursor-pointer">
          {categories.map((category, index) => (
            <div key={index} className="py-5" onClick={handleCategoryClick}>
              {category}
            </div>
          ))}
        </div>
      )}

      <div
        className="border-b border-gray-300 pl-10"
        onClick={() => setIsPurposeDrop(!isPurposeDrop)}
      >
        <div className="h-12 flex items-center gap-x-4 text-base text-gray-300 cursor-pointer select-none">
          목적
          <DownArrow />
          {postData.tagsList.map((value, index) => (
            <div key={index}>{value}</div>
          ))}
        </div>
      </div>

      {isPurposeDrop && (
        <div className="grid grid-cols-3 divide-x divide-y border-b">
          {purposes.map((purpose, index) => (
            <div
              key={index}
              className="h-10 flex justify-center items-center cursor-pointer text-sm"
              onClick={handlePurposeClick}
            >
              {purpose}
            </div>
          ))}
        </div>
      )}

      <div className="border-b border-gray-300 pl-10">
        <input
          className="w-full h-12 flex items-center gap-x-4 text-base text-black cursor-pointer select-none outline-none"
          placeholder="제목을 입력하세요"
          onChange={(e) =>
            setPostData((data) => ({ ...data, title: e.target.value }))
          }
        />
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

      <div className="p-2 text-gray-200">내용을 입력하세요(최대 20,000자)</div>

      <ContentEditable
        className="p-2 outline-none"
        innerRef={ref}
        html={postData.contents} // innerHTML of the editable div
        disabled={false} // use true to disable editing
        onChange={(e) =>
          setPostData((prev) => ({ ...prev, contents: e.target.value }))
        }
      />

      {listData && <List schedule={listData} />}

      <div
        className="max-w-3xl	flex fixed bottom-0"
        onClick={() => createPostMutation.mutate()}
      >
        <button className="w-screen h-14 bg-gray-300 text-white">
          게시하기
        </button>
      </div>

      {isModal && <SelectScheduleModal handleClick={handleScheduleClick} />}
    </Layout>
  );
}
