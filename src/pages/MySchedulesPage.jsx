import { useNavigate } from "react-router-dom";
import {
  Document,
  Hamburger,
  LeftArrow,
  Person,
  Plus,
  SpeechBubble,
} from "../assets/Icon";
// import defaultSchedule from "img/woman_writing_with_a_big_pencil.png";
import { useState } from "react";
import { isError, useQuery } from "react-query";
import { getMySchedules } from "../api";
import Layout from "../components/common/Layout";
import List from "../components/mySchedules/List";
import ListModal from "../components/mySchedules/ListModal";
import useModal from "../hooks/useModal";

export default function MySchedulesPage() {
  const navigate = useNavigate();
  const modal = useModal();
  const [isSelect, setIsSelect] = useState(null);
  const { data, isLoading, error } = useQuery("mySchedule", getMySchedules);

  const handleOpenModal = (data) => {
    setIsSelect(data);
    modal.handleOpenModal();
  };

  if (isLoading) {
    return <div>로딩중</div>;
  }

  if (error) {
    navigate("/posts");
  }
  console.log(data);

  return (
    <Layout>
      <div className="flex items-center justify-between gap-x-1 mb-1 p-2">
        <div className="flex items-center">
          <div className="mr-2">
            <LeftArrow />
          </div>
          <div className="h-14 flex items-center text-xl">나의 일정</div>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => navigate("/myschedules/create/info")}>
            <Plus />
          </button>
          <button>
            <Hamburger />
          </button>
        </div>
      </div>

      {data.length === 0 && (
        <>
          <div className="w-32 h-32 flex justify-center items-center mx-auto bg-[#EBEBEB]">
            픽토그램
          </div>

          <div className="flex flex-col justify-center mx-auto mt-10">
            <p className="text-center">아직 나의 여행 갈래가 비어있어요.</p>
            <p className="text-center	font-semibold">
              상단의 + 를 눌러 일정을 생성해보아요.
            </p>
          </div>
        </>
      )}

      {data &&
        data.map((schedule) => (
          <List
            key={schedule.postId}
            schedule={schedule}
            handleClick={(e) => {
              e.stopPropagation();
              handleOpenModal(schedule);
            }}
          />
        ))}
      {/* <div className="max-w-3xl flex justify-around bg-[#F2F2F2] p-4 fixed bottom-0">
        <div className="flex flex-col justify-center items-center">
          <Document />
          <span className="font-bold	text-[#888]">일정</span>
        </div>

        <div className="flex flex-col justify-center items-center">
          <SpeechBubble />
          <span className="font-bold	text-[#888]">커뮤니티</span>
        </div>

        <div className="flex flex-col justify-center items-center">
          <Person />
          <span className="font-bold	text-[#888]">마이페이지</span>
        </div>
      </div> */}

      {modal.isModal && (
        <ListModal
          handleClick={modal.handleCloseModal}
          scheduleData={isSelect}
        />
      )}
    </Layout>
  );
}
