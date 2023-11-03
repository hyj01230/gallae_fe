import List from "../components/mySchedules/List";
import Layout from "../components/common/Layout";
import ContentEditable from "react-contenteditable";
import SelectScheduleModal from "../components/postCreate/SelectScheduleModal";
import { DownArrow, LeftArrow } from "../assets/Icon";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getDetailPost, updatePost } from "../api";
import { useMutation, useQueryClient } from "react-query";
import { CATEGORIES, TAGS } from "../constants/mySchedule";
import useImage from "../hooks/useImage";
import UploadLimitMessage from "../components/postCreate/UploadLimitMessage";

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
  // const [mode, setMode] = useState("");
  const imageHandler = useImage();
  const queryClient = useQueryClient();

  useEffect(() => {
    const getData = async () => {
      const response = await getDetailPost(selectedPostId);

      // if (data.title) {
      //   setMode("edit");
      //   setPostData({ ...response, contents: data.contents });
      // } else {
      setPostData({ ...response, contents: "" });
      // }
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

  const handlePostCreateClick = async () => {
    if (imageHandler.previewImage) {
      imageHandler.handleSubmitClick(selectedPostId);
    }

    createPostMutation.mutate();
  };

  const createPostMutation = useMutation(
    () =>
      updatePost(selectedPostId, {
        title: postData.title,
        contents: postData.contents,
        subTitle: data.subTitle,
        postCategory: postData.postCategory,
        tagsList: postData.tagsList,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("schedule");
        navigate("/posts");
      },
    }
  );

  // const createPostMutation = useMutation(
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
          <div className="h-14 flex items-center text-xl">
            {/* {mode === "edit" ? "수정하기" : "글쓰기"} */}
            글쓰기
          </div>
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
        {/* <button onClick={() => handleTestClick(selectedPostId)}>test</button> */}

        {/* {mode !== "edit" && imageHandler.previewImage ? ( */}
        {imageHandler.previewImage ? (
          <div className="mx-4 mt-6">
            <img src={imageHandler.previewImage} className="w-36 h-36" />
          </div>
        ) : (
          <UploadLimitMessage />
        )}

        {/* mode가 edit이고 사진이 있다면 previewImage를 보여준다 */}
        {/* {mode === "edit" && postData.postsPicturesList.length > 0 ? (
          <div className="mx-4 mt-6">
            <img
              src={postData.postsPicturesList[0].postsPicturesURL}
              className="w-36 h-36"
            />
          </div>
        ) : (
          <UploadLimitMessage />
        )} */}

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
        onClick={handlePostCreateClick}
      >
        <button className="w-screen h-14 bg-gray-300 text-white">
          게시하기
          {/* {mode === "edit" ? "수정하기" : "게시하기"} */}
        </button>
      </div>

      {isModal && <SelectScheduleModal handleClick={handleScheduleClick} />}
    </Layout>
  );
}
{
  /* <div className="mx-4 py-2 text-gray-200">
        내용을 입력하세요(최대 20,000자)
      </div> */
}

{
  /* <ContentEditable
        className="mx-4 py-2 mt-4 mb-14 outline-none"
        innerRef={ref}
        // html={data.title ? data.contents : postData.contents} // innerHTML of the editable div
        html={postData.contents} // innerHTML of the editable div
        disabled={false} // use true to disable editing
        onChange={(e) =>
          setPostData((prev) => ({ ...prev, contents: e.target.value }))
        }
      /> */
}

{
  /* <textarea
          className="w-full outline-none resize-none mx-4 mt-3"
          value={postData.contents}
          onChange={(e) =>
            setPostData((prev) => ({ ...prev, contents: e.target.value }))
          }
        /> */
}
