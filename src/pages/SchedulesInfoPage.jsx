import { useNavigate } from "react-router-dom";
import { LeftArrow, Search } from "../assets/Icon";
import Layout from "../components/common/Layout";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { scheduleState } from "../store/atom";
import { CATEGORIES, TAGS } from "../constants/mySchedule";
import PlaceList from "../components/schedulesInfo/PlaceList";

export default function SchedulesInfoPage() {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useRecoilState(scheduleState);
  const [isModal, setisModal] = useState(false);
  const [post, setPost] = useState({
    location: null,
    title: null,
    contents: null,
    postCategory: "",
    subTitle: "",
    tagsList: [],
    tripDateList: [
      {
        chosenDate: "",
      },
    ],
  });

  const handleTagsClick = (event) => {
    const { textContent } = event.currentTarget;
    const tagsList = post.tagsList;

    const index = tagsList.indexOf(textContent);

    if (index === -1) {
      tagsList.push(textContent);
      if (tagsList.length > 3) {
        return;
      }
    } else {
      tagsList.splice(index, 1);
    }

    setPost((post) => ({ ...post, tagsList }));
  };

  const handleSubmitClick = async () => {
    setSchedule(post);
    navigate("/myschedules/create/date");
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
        <div className="font-semibold mb-4 select-none">
          어디로 여행을 떠나시나요?
        </div>
        <div className="flex border border-[#d1d5db] rounded-lg divide-x">
          <div className="text-sm px-12 py-3">국내</div>
          <div className="flex flex-1 gap-2 items-center text-sm pl-[22px] cursor-pointer">
            <Search />
            <button onClick={() => setisModal(true)}>
              {post.location ? post.location : "여행지 검색"}
            </button>
          </div>
        </div>
      </div>

      {isModal && (
        <PlaceList handleClick={() => setisModal(false)} setPost={setPost} />
      )}

      <div className="mb-7 px-4">
        <div className="font-semibold mb-4 select-none">누구와 떠나시나요?</div>
        <div className="grid grid-cols-3">
          {CATEGORIES.map((category, index) => (
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
            placeholder="여행의 이름을 입력해주세요."
            className="w-full p-4 border border-[#C9C9C9] rounded-lg text-sm"
            onChange={(event) =>
              setPost((post) => ({
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
          onClick={handleSubmitClick}
        >
          다음 단계로
        </button>
      </div>
    </Layout>
  );
}
