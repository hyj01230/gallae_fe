import { useNavigate } from "react-router-dom";
import { LeftArrow, Search, XIcon } from "../assets/Icon";
import Layout from "../components/common/Layout";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { scheduleState } from "../store/atom";
import { CATEGORIES, TAGS } from "../constants/mySchedule";
import PlaceList from "../components/schedulesInfo/PlaceList";
import { Header, Button, Title } from "../components/schedules/common";

export default function SchedulesInfoPage() {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useRecoilState(scheduleState);
  const [isModal, setisModal] = useState(false);
  const [post, setPost] = useState({
    location: schedule.location || null,
    title: null,
    contents: null,
    postCategory: schedule.postCategory || "",
    subTitle: schedule.subTitle || "",
    tagsList: schedule.tagsList || [],
    tripDateList: schedule.tripDateList || [
      {
        chosenDate: "",
      },
    ],
  });

  const handleTagsClick = (event) => {
    const { textContent } = event.currentTarget;
    const tagsList = [...post.tagsList];
    const index = tagsList.indexOf(textContent);

    if (index === -1) {
      if (tagsList.length + 1 > 3) {
        return;
      }
      tagsList.push(textContent);
    } else {
      tagsList.splice(index, 1);
    }

    setPost((post) => ({ ...post, tagsList }));
  };

  const handleInputChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length <= 20) {
      setPost((post) => ({ ...post, subTitle: inputText }));
    }
  };

  const formValidation = () => {
    if (
      !CATEGORIES.includes(post.postCategory) ||
      post.tagsList.length < 1 ||
      !(post.subTitle && !(post.subTitle.trim() === ""))
    ) {
      return false;
    }

    return true;
  };

  const handleSubmitClick = () => {
    // 필요한 정보를 클릭 또는 입력하지 않는다면 다음 단계로 넘어가지 못한다.
    if (
      post.postCategory !== "" &&
      post.subTitle.trim() !== "" &&
      post.tagsList.length !== 0
    ) {
      setSchedule(post);
      navigate("/myschedules/create/date");
    }

    return;
  };

  return (
    <Layout>
      <Header>
        <div className="flex gap-[15px]">
          <Button onClick={() => navigate("/myschedules")}>
            <LeftArrow />
          </Button>
          <Title type={"header"}>여행 만들기</Title>
        </div>
        <Button onClick={() => navigate("/myschedules")}>
          <XIcon />
        </Button>
      </Header>

      <div className="mx-4 mb-7 mt-[14px]">
        <Title type={"question"}>어디로 여행을 떠나시나요?</Title>
        <div className="flex border border-[#D9D9D9] rounded-lg divide-x">
          <div className="text-sm px-12 py-3">국내</div>
          <div className="flex flex-1 gap-2 items-center text-sm pl-[22px] cursor-pointer">
            <Search />
            <button
              className="text-[#999] w-full text-left"
              onClick={() => setisModal(!isModal)}
            >
              {post.location ? post.location : "여행지 검색"}
            </button>
          </div>
        </div>
        {isModal && (
          <PlaceList handleClick={() => setisModal(false)} setPost={setPost} />
        )}
      </div>

      <div className="mb-7 mx-4 mt-3">
        <Title type={"question"}>누구와 떠나시나요?</Title>
        <div className="grid grid-cols-3 divide-x divide-y border border-[#d1d5db] rounded-xl">
          {CATEGORIES.map((category, index) => (
            <div
              key={index}
              className={`h-10 flex justify-center items-center cursor-pointer text-sm ${
                post.postCategory === category
                  ? "text-[#F90] font-bold"
                  : "text-[#D9D9D9]"
              }`}
              onClick={() =>
                setPost((post) => ({ ...post, postCategory: category }))
              }
            >
              {category}
            </div>
          ))}
        </div>
      </div>
      <div className="mb-7 mx-4">
        <Title type={"question"}>
          여행의 목적은 어떻게 되시나요?(최대 3개 선택)
        </Title>
        <div className="grid grid-cols-3 divide-x divide-y border border-[#d1d5db] rounded-xl">
          {TAGS.map((tag, index) => (
            <div
              key={index}
              className={`h-10 flex justify-center items-center cursor-pointer text-sm ${
                post.tagsList.includes(tag)
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

      <div className="mx-4">
        <Title type={"question"}>여행의 이름은?</Title>
        <div>
          <input
            type="text"
            placeholder="여행의 이름을 입력해주세요(20자 이내)"
            className="w-full p-4 border border-[#C9C9C9] rounded-lg text-sm text-[#999] outline-[#F90]"
            value={post.subTitle}
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
          className="w-screen h-14 bg-gray-300 text-white"
          onClick={() => {
            if (formValidation() === false) {
              return;
            }
            handleSubmitClick();
          }}
        >
          날짜 입력하기
        </button>
      </div>
    </Layout>
  );
}
