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

  // useEffect(() => {
  //   const getScheduleData = async () => {
  //     const { title, contents, postCategory, tagsList } = await getDetailPost(
  //       postId
  //     );
  //     setEditPost((prev) => ({
  //       ...prev,
  //       title,
  //       contents,
  //       postCategory,
  //       tagsList,
  //       subTitle,
  //     }));
  //   };

  //   getScheduleData();
  // }, []);

  const handleTagsClick = (event) => {
    const { textContent } = event.currentTarget;
    const tagsList = editPost.tagsList;

    const index = tagsList.indexOf(textContent);

    if (index === -1) {
      tagsList.push(textContent);
      if (tagsList.length > 3) {
        return;
      }
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

  // const handleSubmitClick = async () => {
  //   editTagsMutation.mutate();
  //   navigate("/");
  // };

  return (
    <Layout>
      <div
        className="flex items-center gap-x-1 p-2 border-b border-gray-300"
        onClick={() => navigate("/")}
      >
        <div className="mr-2">
          <LeftArrow />
        </div>
        <div className="h-14 flex items-center text-xl font-bold">
          여행 만들기
        </div>
      </div>

      <div className="my-7 px-4">
        <div className="font-semibold mb-4 select-none">누구와 떠나시나요?</div>
        <div className="grid grid-cols-3">
          {CATEGORIES.map((category, index) => (
            <div
              key={index}
              className="h-10 flex justify-center items-center border border-[#d1d5db] cursor-pointer text-sm"
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
        <div className="grid grid-cols-3">
          {TAGS.map((tag, index) => (
            <div
              key={index}
              className="h-10 flex justify-center items-center border border-[#d1d5db] cursor-pointer text-sm"
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
            defaultValue={subTitle}
            placeholder="여행의 이름을 입력해주세요."
            className="w-full p-4 border border-[#C9C9C9] rounded-lg text-sm"
            onChange={(event) =>
              setEditPost((post) => ({
                ...post,
                subTitle: event.target.value,
              }))
            }
          />
        </div>
      </div>

      <div className="max-w-3xl	flex fixed bottom-0">
        <button
          className="w-screen h-14 bg-gray-300 text-white"
          onClick={() => editTagsMutation.mutate()}
        >
          수정하기
        </button>
      </div>
    </Layout>
  );
}
