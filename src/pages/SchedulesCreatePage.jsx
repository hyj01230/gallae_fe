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
import { createScheduleDetail } from "../api";
import { formatDateString } from "../util/formatDate";
import {
  DETAIL_SCHEDULES_CATEGORIES,
  SPENT_TIME_LIST,
} from "../constants/mySchedule";
import useImage from "../hooks/useImage";

export default function SchedulesCreatePage() {
  const navigate = useNavigate();
  const [timeSpent, setTimeSpent] = useState({ time: 0, text: "" });
  const [schedule, setSchedule] = useState({
    schedulesCategory: "",
    costs: 0,
    placeName: null,
    contents: "",
    timeSpent: "",
    referenceURL: "",
  });
  const { subTitle, chosenDate, tripDateId, postId } = useLocation().state;
  const imageHandler = useImage();
  console.log("image : ", imageHandler.uploadImage);

  const handleSubmitClick = async () => {
    await createScheduleDetail(tripDateId, {
      schedulesList: [schedule],
    });
    navigate("/myschedules/details", { state: { postId, tripDateId } });
  };

  const handleClick = (value) => {
    const number = timeSpent.time + value;

    if (number >= 60) {
      setTimeSpent({
        time: number,
        text: `${Math.floor(number / 60)}시간  ${number % 60}분`,
      });
    } else {
      setTimeSpent({
        time: number,
        text: `${number}분`,
      });
    }

    setSchedule((prev) => ({ ...prev, timeSpent: timeSpent.text }));
  };

  return (
    <Layout>
      <div
        className="flex items-center gap-x-1 p-2"
        onClick={() =>
          navigate("/myschedules/details", { state: { postId, subTitle } })
        }
      >
        <div className="mr-2">
          <LeftArrow />
        </div>
        <div className="h-14 flex items-center text-xl">나의 일정</div>
      </div>

      <div className="flex border border-[#EBEBEB] rounded-lg mx-4">
        <div className="flex items-center w-full h-10 p-4">{subTitle}</div>
        <div className="flex items-center w-full h-10 p-4">
          {formatDateString(chosenDate)}
        </div>
      </div>

      <div className="flex gap-3 mx-7 mt-6 border-b p-1">
        <div className="flex justify-between items-center w-2/5">
          <div className="flex items-center gap-2 text-[14px]">
            <Circle />
            <select
              className="w-full"
              onChange={(e) =>
                setSchedule((prev) => ({
                  ...prev,
                  schedulesCategory: e.target.value,
                }))
              }
            >
              {DETAIL_SCHEDULES_CATEGORIES.map((value, index) => (
                <option key={index}>{value}</option>
              ))}
            </select>
          </div>
          <DownArrow />
        </div>

        <div className="flex justify-between items-center w-3/5">
          <div className="flex items-center gap-2 text-[14px]">
            <Marker />
            <input
              placeholder="장소를 입력하세요"
              onChange={(e) =>
                setSchedule((prev) => ({ ...prev, placeName: e.target.value }))
              }
            />
          </div>
          <DownArrow />
        </div>
      </div>

      <div
        className="mt-3 mx-4"
        onClick={imageHandler.onClickSelectProfileHandler}
      >
        <input
          type="file"
          className="hidden"
          onChange={imageHandler.uploadImageHandler}
          accept="image/*"
          ref={imageHandler.inputRef}
        />
        <div className="w-36 h-36 flex justify-center items-center bg-[#F2F2F2] rounded-lg cursor-pointer">
          <Plus />
        </div>
      </div>

      <div className="flex flex-col mt-7 mx-7">
        <div className="flex gap-4">
          <Clock />
          <div className="w-full flex items-center gap-8 border border-[#D9D9D9] rounded-lg px-3 py-2">
            <span>소요시간</span>
            <span>{timeSpent.text}</span>
          </div>
        </div>
        <div className="flex justify-between">
          {SPENT_TIME_LIST.map((value, index) => (
            <button key={index} onClick={() => handleClick(value.minute)}>
              {value.text}
            </button>
          ))}
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
          onClick={handleSubmitClick}
        >
          일정 수정 완료
        </button>
      </div>
    </Layout>
  );
}
