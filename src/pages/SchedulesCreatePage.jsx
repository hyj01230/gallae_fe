import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  Circle,
  Clock,
  DownArrow,
  LeftArrow,
  Marker,
  Memo,
  Plus,
  Url,
} from "../assets/Icon";
import Layout from "../components/common/Layout";
import { useState } from "react";

export default function SchedulesCreatePage() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [schedule, setSchedule] = useState({
    schedulesCategory: "",
    costs: 0,
    placeName: null,
    contents: "",
    timeSpent: "",
    referenceURL: "",
  });

  const date = useLocation().state;

  const getData = (data) => {
    setSchedule((schedule) => ({ ...schedule, placeName: data.address }));
    setIsOpen(false);
  };

  return (
    <Layout>
      <div className="flex items-center gap-x-1 p-2">
        <div className="mr-2">
          <LeftArrow />
        </div>
        <div className="h-14 flex items-center text-xl">나의 일정</div>
      </div>

      <div className="flex border border-[#EBEBEB] rounded-lg mx-4">
        <div className="flex items-center w-full h-10 p-4">
          가족과 전주 여행
        </div>
        <div className="flex items-center w-full h-10 p-4">{date}</div>
      </div>

      <div className="flex gap-3 mx-7 mt-6 border-b p-1">
        <div className="flex justify-between items-center w-2/5">
          <div className="flex items-center gap-2 text-[14px]">
            <Circle />
            명소
          </div>
          <DownArrow />
        </div>

        <div className="flex justify-between items-center w-3/5">
          <div className="flex items-center gap-2 text-[14px]">
            <Marker />
            {schedule.placeName ? schedule.placeName : "장소를 검색하세요"}
          </div>
          <DownArrow />
        </div>
      </div>
      {isOpen && (
        <>
          <DaumPostcode onComplete={getData} />
        </>
      )}

      <div className="mt-3 mx-4">
        <div className="w-36 h-36 flex justify-center items-center bg-[#F2F2F2]">
          <Plus />
        </div>
      </div>

      <div className="flex flex-col mt-7 mx-7">
        <div className="flex gap-4">
          <Clock />
          <div className="w-full flex items-center gap-8 border border-[#D9D9D9] rounded-lg px-3 py-2">
            <span>소요시간</span>
            <span>00:00</span>
          </div>
        </div>
        <div className="flex justify-between">
          <button>5분</button>
          <button>10분</button>
          <button>30분</button>
          <button>1시간</button>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4 mx-7">
        <Url />
        <input
          className="w-full border border-[#D9D9D9] rounded-lg px-3 py-2 text-sm"
          placeholder="참고 할 만한 URL을 입력해주세요."
          onChange={(e) =>
            setSchedule((schedule) => ({
              ...schedule,
              referenceURL: e.target.value,
            }))
          }
        />
      </div>

      <div className="flex items-center gap-4 mt-4 mx-7">
        <Card />
        <input
          className="w-full border border-[#D9D9D9] rounded-lg px-3 py-2 text-sm"
          placeholder="소요되는 비용을 입력해주세요."
          onChange={(e) =>
            setSchedule((schedule) => ({
              ...schedule,
              costs: Number(e.target.value),
            }))
          }
        />
      </div>

      <div className="flex items-center gap-4 mt-4 mx-7">
        <Memo />
        <textarea
          className="w-full border border-[#D9D9D9] rounded-lg px-3 py-2 text-sm resize-none"
          placeholder="메모를 해주세요."
          onChange={(e) =>
            setSchedule((schedule) => ({
              ...schedule,
              contents: e.target.value,
            }))
          }
        />
      </div>

      <div className="max-w-3xl	flex fixed bottom-0">
        <button
          className="w-screen h-14 bg-gray-300 text-white"
          onClick={() => navigate("/myschedules/details")}
        >
          일정 수정 완료
        </button>
      </div>
    </Layout>
  );
}
