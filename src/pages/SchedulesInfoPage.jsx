import { useNavigate } from "react-router-dom";
import { LeftArrow } from "../assets/Icon";
import Layout from "../components/common/Layout";
import { useState } from "react";

const categorys = ["가족", "친구", "연인", "친척", "반려동물", "단체"];

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

export default function SchedulesInfoPage() {
  const navigate = useNavigate();

  const [post, setPost] = useState({
    title: null,
    contents: null,
    postCategory: "",
    tagsList: [],
    tripDateList: [
      {
        chosenDate: "",
        subTitle: "",
      },
    ],
  });

  const handleTagsClick = (event) => {
    const { textContent } = event.currentTarget;
    const tagsList = post.tagsList;

    if (textContent) {
      const index = tagsList.indexOf(textContent);

      if (index === -1) {
        tagsList.push(textContent);
        if (tagsList.length > 3) {
          return;
        }
      } else {
        tagsList.splice(index, 1);
      }
    }

    setPost((post) => ({ ...post, tagsList }));
  };

  const handleSubmitClick = async () => {
    navigate("/myschedules/create/date", { state: post });
  };

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
          {categorys.map((category, index) => (
            <div
              key={index}
              className="h-10 flex justify-center items-center border border-[#d1d5db] cursor-pointer text-sm"
              onClick={() =>
                setPost((post) => ({ ...post, postCategory: category }))
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
          {purposes.map((purpose, index) => (
            <div
              key={index}
              className="h-10 flex justify-center items-center border border-[#d1d5db] cursor-pointer text-sm"
              onClick={handleTagsClick}
            >
              {purpose}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-7 px-4">
        <div className="font-semibold mb-4 select-none">여행의 이름은?</div>
        <div>
          <input
            type="text"
            placeholder="여행의 이름을 입력해주세요."
            className="w-full p-4 border border-[#C9C9C9] rounded-lg text-sm"
            onChange={(event) =>
              setPost((post) => ({ ...post, subTitle: event.target.value }))
            }
          />
        </div>
      </div>

      <div className="max-w-3xl	flex fixed bottom-0">
        <button
          className="w-screen h-14 bg-gray-300 text-white"
          onClick={handleSubmitClick}
        >
          다음 단계로
        </button>
      </div>
    </Layout>
  );
}
