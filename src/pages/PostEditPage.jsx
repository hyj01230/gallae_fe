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

  const handleSubmitClick = async () => {
    // 사진이 업데이트되었다면, 사진 업데이트 수행하고
    // 사진이 업데이트 안되었다면 게시글만 업데이트하기

    if (imageHandler.previewImage) {
      const { postsPicturesId } = data.postsPicturesList[0];
      await imageHandler.handleUpdateImage(postsPicturesId);
    }

    await updatePost(selectedPostId, {
      title: postData.title,
      contents: postData.contents,
      subTitle: data.subTitle,
      postCategory: postData.postCategory,
      tagsList: postData.tagsList,
    }),
      navigate("/posts");
  };

  // const updatePostMutation = useMutation(
  //   "schedule",
  //   () => imageHandler.handleSubmitClick(selectedPostId),

  //   {
  //     onSuccess: async () => {
  //       await updatePost(selectedPostId, {
  //         title: postData.title,
  //         contents: postData.contents,
  //         subTitle: data.subTitle,
  //         postCategory: postData.postCategory,
  //         tagsList: postData.tagsList,
  //       }),
  //         navigate("/posts");
  //     },
  //   }
  // );

  return (
    <Layout>
      <div className="mb-[70px]">
        <div className="flex items-center gap-x-1 p-2 border-b border-gray-300">
          <div className="mr-2" onClick={() => navigate("/")}>
            <LeftArrow />
          </div>
          <div className="h-14 flex items-center text-xl">수정하기</div>
        </div>

        <div
          className="border-b border-gray-300 pl-10"
          onClick={() => setIsCategoryDrop(!isCategoryDrop)}
        >
          <div className="h-12 flex items-center gap-x-4 text-base text-gray-300 cursor-pointer select-none">
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
          <div className="h-12 flex items-center gap-x-4 text-base text-gray-300 cursor-pointer select-none">
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
                className="h-10 flex justify-center items-center cursor-pointer text-sm"
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

        {/* 
          이미지가 업로드 되어 있는 상태라면 => 이미지를 나타내고, 메세지는 보이지 않게 한다.
          이미지가 없는 상태라면 => 메세지를 보이게 한다.

          근데 여기서 이미지 수정 시 수정된 이미지를 보여줘야한다.
        */}

        {/* {imageHandler.previewImage ? (
          <div className="mx-4 mt-6">
            <img src={imageHandler.previewImage} className="w-36 h-36" />
          </div>
        ) : (
          <UploadLimitMessage />
        )}

        {postData.postsPicturesList[0].postsPicturesURL ? (
          <div className="mx-4 mt-6">
            <img
              src={postData.postsPicturesList[0].postsPicturesURL}
              className="w-36 h-36"
            />
          </div>
        ) : (
          <UploadLimitMessage />
        )} */}

        {imageHandler.previewImage ||
        postData.postsPicturesList[0].postsPicturesURL ? (
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

        <div
          contentEditable
          className="mx-4 my-5 outline-none"
          value={postData.contents}
          onInput={(e) =>
            setPostData((prev) => ({ ...prev, contents: e.target.innerText }))
          }
        ></div>

        {listData && <List schedule={listData} isPointer={false} />}
      </div>

      <div
        className="max-w-3xl flex fixed bottom-0 z-10"
        onClick={handleSubmitClick}
      >
        <button className="w-screen h-14 bg-gray-300 text-white">
          수정하기
        </button>
      </div>

      {isModal && <SelectScheduleModal handleClick={handleScheduleClick} />}
    </Layout>
  );
}
