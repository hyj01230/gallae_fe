import List from "../components/mySchedules/List";
import Layout from "../components/common/Layout";
// import ContentEditable from "react-contenteditable";
import SelectScheduleModal from "../components/postCreate/SelectScheduleModal";
import { DownArrow, LeftArrow } from "../assets/Icon";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getDetailPost, updatePost } from "../api";
import { useMutation } from "react-query";
import { CATEGORIES, TAGS } from "../constants/mySchedule";
import useImage from "../hooks/useImage";
import UploadLimitMessage from "../components/postCreate/UploadLimitMessage";

export default function PostEditPage() {
  // const ref = useRef();
  const data = useLocation().state;
  const navigate = useNavigate();
  const [isModal, setIsModal] = useState(false);
  const [isCategoryDrop, setIsCategoryDrop] = useState(false);
  const [isPurposeDrop, setIsPurposeDrop] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(data.postId);
  // const [postData, setPostData] = useState({ contents: "", tagsList: [] });
  const [postData, setPostData] = useState(data);
  const [listData, setListData] = useState(data);
  const imageHandler = useImage();

  useEffect(() => {
    if (data.postId === selectedPostId) return;
    const getData = async () => {
      const response = await getDetailPost(data.postId);
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
      if (tagsList.length + 1 > 3) return;
      tagsList.push(textContent);
    } else {
      tagsList.splice(index, 1);
    }

    setPostData({ ...postData, tagsList });
  };

  // 일정 설정 (일정 선택 후 useEffect 동작)
  const handleScheduleClick = async (data) => {
    setSelectedPostId(data.postId);
    setListData(data);
    setIsModal(false);
  };

  const handleSubmitClick = async () => {
    // 기존에 있는 사진을 수정하기
    if (imageHandler.previewImage && data.postsPicturesList[0]) {
      const { postsPicturesId } = data.postsPicturesList[0];
      await imageHandler.handleUpdateImage(postsPicturesId);
    } else {
      await imageHandler.handleSubmitClick(selectedPostId);
    }

    // 기존에 사진이 없는데, 사진을 생성하기
    // if (imageHandler.previewImage) {
    //   await imageHandler.handleSubmitClick(selectedPostId);
    // }

    await updatePost(selectedPostId, {
      title: postData.title,
      contents: postData.contents,
      subTitle: data.subTitle,
      postCategory: postData.postCategory,
      tagsList: postData.tagsList,
    }),
      navigate("/");
  };

  const formValidation = () => {
    if (
      !CATEGORIES.includes(postData.postCategory) ||
      postData.tagsList.length < 1 ||
      (postData.title && postData.title.trim() === "") ||
      (postData.contents && postData.contents.trim()) === ""
    ) {
      return false;
    }

    return true;
  };

  return (
    <Layout>
      <div className="mb-[70px]">
        <div className="flex items-center gap-x-1 p-2 border-b border-gray-300">
          <div className="mr-2" onClick={() => navigate("/myschedules")}>
            <LeftArrow />
          </div>
          <div className="h-14 flex items-center text-xl">수정하기</div>
        </div>

        <div
          className="border-b border-gray-300 pl-10"
          onClick={() => setIsCategoryDrop(!isCategoryDrop)}
        >
          <div className="h-12 flex items-center gap-x-4 text-base text-[#999] cursor-pointer select-none">
            카테고리
            <DownArrow />
            <span className="text-[black]">{postData.postCategory}</span>
          </div>
        </div>
        {isCategoryDrop && (
          <div className="pl-10 cursor-pointer">
            {CATEGORIES.map((category, index) => (
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
          <div className="h-12 flex items-center gap-x-4 text-base text-[#999] cursor-pointer select-none">
            목적
            <DownArrow />
            {postData.tagsList.map((value, index) => (
              <div key={index} className="text-[black]">
                {value}
              </div>
            ))}
          </div>
        </div>

        {isPurposeDrop && (
          <div className="grid grid-cols-3 divide-x divide-y border-b">
            {TAGS.map((tag, index) => (
              <div
                key={index}
                className={`h-10 flex justify-center items-center cursor-pointer text-sm ${
                  postData.tagsList.includes(tag)
                    ? "text-[#F90] font-semibold"
                    : "text-[#999]"
                }`}
                onClick={handlePurposeClick}
              >
                {tag}
              </div>
            ))}
          </div>
        )}

        <div className="border-b border-gray-300 pl-10">
          <input
            className="w-full h-12 flex items-center gap-x-4 text-base text-black cursor-pointer select-none outline-none"
            defaultValue={data.title && data.title}
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
          <div
            className="flex-1 flex items-center justify-center text-sm text-gray-600"
            onClick={imageHandler.onClickSelectProfileHandler}
          >
            <input
              type="file"
              className="hidden"
              onChange={imageHandler.uploadImageHandler}
              accept="image/*"
              ref={imageHandler.inputRef}
            />
            사진 첨부
          </div>
        </div>

        {imageHandler.previewImage ||
        postData.postsPicturesList[0]?.postsPicturesURL ? (
          <div className="mx-4 mt-6">
            <img
              src={
                imageHandler.previewImage ||
                postData.postsPicturesList[0].postsPicturesURL
              }
              className="w-36 h-36"
            />
          </div>
        ) : (
          <UploadLimitMessage />
        )}

        <div className="mx-4 my-5">
          <textarea
            placeholder="내용을 입력해주세요"
            className="w-full h-[40px] outline-none"
            rows={10}
            value={postData.contents}
            onChange={(e) =>
              setPostData((prev) => ({ ...prev, contents: e.target.value }))
            }
            onInput={(e) => {
              e.target.style.height = 0;
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />
        </div>

        {listData && <List schedule={listData} />}
      </div>

      <div
        className="max-w-3xl flex fixed bottom-0 z-10"
        onClick={handleSubmitClick}
      >
        <button
          className={`w-screen h-14  text-white ${
            formValidation() ? "bg-[#F90]" : "bg-gray-300"
          }`}
        >
          수정하기
        </button>
      </div>

      {isModal && (
        <SelectScheduleModal
          handleClick={handleScheduleClick}
          setIsModal={setIsModal}
        />
      )}
    </Layout>
  );
}
