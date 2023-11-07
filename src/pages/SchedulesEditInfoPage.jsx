import Layout from "../components/common/Layout";
import { useState } from "react";
import { LeftArrow } from "../assets/Icon";
import { updatePost } from "../api";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { CATEGORIES, TAGS } from "../constants/mySchedule";

export default function SchedulesEditInfoPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { postId, title, contents, postCategory, tagsList, subTitle } =
    useLocation().state;
  const [editPost, setEditPost] = useState({
    title,
    contents,
    postCategory,
    tagsList,
    subTitle,
  });

  const handleTagsClick = (event) => {
    const { textContent } = event.currentTarget;
    const tagsList = editPost.tagsList;
    const index = tagsList.indexOf(textContent);

    if (index === -1) {
      if (tagsList.length + 1 > 3) {
        return;
      }
      tagsList.push(textContent);
    } else {
      tagsList.splice(index, 1);
    }

    setEditPost((prev) => ({ ...prev, tagsList }));
  };

  const editTagsMutation = useMutation(() => updatePost(postId, editPost), {
    onSuccess: () => {
      queryClient.invalidateQueries("mySchedule");
      navigate("/");
    },
  });

  const formValidation = () => {
    if (
      !CATEGORIES.includes(editPost.postCategory) ||
      editPost.tagsList.length < 1 ||
      !(editPost.subTitle && !(editPost.subTitle.trim() === ""))
    ) {
      return false;
    }

    return true;
  };

  const handleInputChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length <= 20) {
      setEditPost((post) => ({ ...post, subTitle: inputText }));
    }
    return;
  };

  return (
    <Layout>
      <div
        className="flex items-center gap-x-1 mx-4"
        onClick={() => navigate("/")}
      >
        <div className="mr-2">
          <LeftArrow />
        </div>
        <div className="py-3 flex items-center text-xl font-bold">
          여행 만들기
        </div>
      </div>

      <div className="mb-7 mx-4 mt-3">
        <div className="font-semibold mb-4 select-none">누구와 떠나시나요?</div>
        <div className="grid grid-cols-3 divide-x divide-y border border-[#d1d5db] rounded-xl">
          {CATEGORIES.map((category, index) => (
            <div
              key={index}
              className={`h-10 flex justify-center items-center cursor-pointer text-sm ${
                editPost.postCategory === category
                  ? "text-[#F90] font-bold"
                  : "text-[#D9D9D9]"
              }`}
              onClick={() =>
                setEditPost((prev) => ({ ...prev, postCategory: category }))
              }
            >
              {category}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-7 px-4">
        <div className="font-semibold mb-4 select-none">
          여행의 목적은 어떻게 되시나요?(최대 3개 선택)
        </div>
        <div className="grid grid-cols-3 divide-x divide-y border border-[#d1d5db] rounded-xl">
          {TAGS.map((tag, index) => (
            <div
              key={index}
              className={`h-10 flex justify-center items-center cursor-pointer text-sm ${
                editPost.tagsList.includes(tag)
                  ? "text-[#F90] font-bold"
                  : "text-[#D9D9D9]"
              }`}
              onClick={handleTagsClick}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-7 px-4">
        <div className="font-semibold mb-4 select-none">여행의 이름은?</div>
        <div>
          <input
            type="text"
            value={editPost.subTitle}
            placeholder="여행의 이름을 입력해주세요(20자 이내)"
            className="w-full p-4 border border-[#C9C9C9] rounded-lg text-sm"
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="max-w-3xl	flex fixed bottom-0">
        <button
          style={{
            background: `${
              formValidation()
                ? "linear-gradient(95deg, #F90 -39.5%, #FFB800 5.63%, #FF912C 109.35%, #FF912C 109.35%"
                : "rgb(209 213 219)"
            }`,
          }}
          className="w-screen h-14 text-white"
          onClick={() => editTagsMutation.mutate()}
        >
          수정하기
        </button>
      </div>
    </Layout>
  );
}
