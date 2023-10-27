import {
  Card,
  Circle,
  Clock,
  DownArrow,
  LeftArrow,
  Marker,
  Memo,
  Plus,
  Trash,
  Url,
} from "../assets/Icon";
import Layout from "../components/common/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  deleteScheduleDetail,
  updateScheduleDetail,
  uploadScheduleImage,
} from "../api";
import { timeStringToMinutes } from "../util/formatDate";
import { useMutation, useQueryClient } from "react-query";
import { formatDateString } from "../util/formatDate";
import {
  DETAIL_SCHEDULES_CATEGORIES,
  SPENT_TIME_LIST,
} from "../constants/mySchedule";
import useImage from "../hooks/useImage";

export default function SchedulesEditPage() {
  const queryClient = useQueryClient();
  const {
    postId, // 이거
    contents,
    costs,
    placeName,
    referenceURL,
    schedulesCategory,
    schedulesId,
    timeSpent,
    subTitle,
    chosenDate,
  } = useLocation().state;
  const navigate = useNavigate();
  const [timeSpentState, setTimeSpent] = useState({
    time: timeStringToMinutes(timeSpent),
    text: timeSpent,
  });

  const [schedule, setSchedule] = useState({
    contents,
    costs,
    placeName,
    referenceURL,
    schedulesCategory,
    timeSpent,
  });

  const imageHandler = useImage();
  // console.log("image : ", imageHandler.uploadImage);

  const updateScheduleMutation = useMutation(
    async () => {
      await updateScheduleDetail(schedulesId, schedule);
      // await uploadScheduleImage(schedulesId);
    },
    {
      onSuccess: async () => {
        // await imageHandler.handleSubmitClick(
        //   schedulesId,
        //   imageHandler.uploadImage
        // );
        queryClient.invalidateQueries("schedulesDetail");
        navigate("/myschedules/details", { state: { postId, subTitle } });
      },
    }
  );

  const deleteScheduleMutation = useMutation(
    () => deleteScheduleDetail(schedulesId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("schedulesDetail");
        navigate("/myschedules/details", { state: { postId, subTitle } });
      },
    }
  );

  const handleClick = (value) => {
    if (value === 0) {
      setTimeSpent({ time: 0, text: "" });
      return;
    }

    const number = timeSpentState.time + value;

    if (number >= 60) {
      setTimeSpent({
        time: number,
        text: `${Math.floor(number / 60)}시간 ${number % 60}분`,
      });
    } else {
      setTimeSpent({
        time: number,
        text: `${number}분`,
      });
    }
  };

  // useState는 비동기로 동작하기때문에
  // setSchedule을 handleClick보다 useEffect에서 실행
  useEffect(() => {
    setSchedule((prev) => ({ ...prev, timeSpent: timeSpentState.text }));
  }, [timeSpentState]);

  return (
    <Layout>
      <div
        className="flex items-center justify-between mx-4 py-3"
        onClick={() =>
          navigate("/myschedules/details", { state: { postId, subTitle } })
        }
      >
        <div className="flex items-center gap-4">
          <LeftArrow />
          <div className="flex items-center text-[20px] font-bold">
            {subTitle}
          </div>
        </div>

        <button
          className="cursor-pointer mr-2"
          onClick={() => deleteScheduleMutation.mutate()}
        >
          <Trash />
        </button>
      </div>

      <div className="flex border border-[#EBEBEB] rounded-lg mx-4">
        <div className="flex items-center w-full h-10 p-4">{subTitle}</div>
        <div className="flex items-center w-full h-10 p-4">
          {formatDateString(chosenDate, false)}
        </div>
      </div>

      <div className="flex gap-3 mx-7 mt-6 border-b p-1">
        <div className="flex justify-between items-center w-2/5">
          <div className="flex items-center gap-2 text-[14px]">
            <Circle />
            <select
              defaultValue={schedule.schedulesCategory}
              className="w-full"
              onChange={(e) =>
                setSchedule((prev) => ({
                  ...prev,
                  schedulesCategory: e.target.value,
                }))
              }
            >
              {DETAIL_SCHEDULES_CATEGORIES.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </div>
          <DownArrow />
        </div>

        <div className="flex justify-between items-center w-3/5">
          <div className="flex items-center gap-2 text-[14px]">
            <Marker />
            <input
              defaultValue={schedule.placeName}
              placeholder="장소를 입력하세요"
              onChange={(e) =>
                setSchedule((prev) => ({ ...prev, placeName: e.target.value }))
              }
            />
          </div>
          <DownArrow />
        </div>
      </div>

      {/* 이미지 업로드 */}
      <div
        className="mt-3 mx-4"
        // onClick={imageHandler.onClickSelectProfileHandler}
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

        <div className="flex">
          {imageHandler.previewImage.length > 0 &&
            imageHandler.previewImage.map((value, index) => (
              <img key={index} src={value} className="w-36 h-36" />
            ))}
        </div>
      </div>

      <div className="text-xs text-[#999] mx-4 mt-3">
        <p className="text-[#d05454]">
          (사진 업로드 기능은 MVP 이후 개발 예정입니다)
        </p>
        {/* 사진 업로드는 개당 1MB내외로 업로드 가능합니다. */}
      </div>

      {/* <div className="flex flex-col mt-7 mx-7">
        <div className="flex gap-4">
          <Clock />
          <div className="w-full flex items-center gap-8 border border-[#D9D9D9] rounded-lg px-3 py-2">
            <span>소요시간</span>
            <span>{timeSpentState.text}</span>
          </div>
        </div>
        <div className="flex justify-between">
          {SPENT_TIME_LIST.map((value, index) => (
            <button key={index} onClick={() => handleClick(value.minute)}>
              {value.text}
            </button>
          ))}
        </div>
      </div> */}

      <div className="flex flex-col mt-7 mx-7">
        <div className="flex gap-4">
          <div className="flex justify-center">
            <Clock />
          </div>

          <div className="w-full">
            <div className="w-full flex items-center gap-8 border border-[#D9D9D9] rounded-lg px-3 py-2">
              <span className="text-sm text-[#999]">소요시간</span>
              <span className="text-sm">{timeSpentState.text}</span>
            </div>

            <div className="flex justify-between">
              {SPENT_TIME_LIST.map((value, index) => (
                <button
                  key={index}
                  className="text-sm text-[#999] mx-2 mt-3"
                  onClick={() => handleClick(value.minute)}
                >
                  {value.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4 mx-7">
        <Url />
        <input
          className="w-full border border-[#D9D9D9] rounded-lg px-3 py-2 text-sm"
          defaultValue={schedule.referenceURL}
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
          defaultValue={schedule.costs}
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
          defaultValue={schedule.contents}
          placeholder="메모를 해주세요."
          onChange={(e) =>
            setSchedule((schedule) => ({
              ...schedule,
              contents: e.target.value,
            }))
          }
        />
      </div>

      <div className="fixed bottom-0 max-w-3xl flex">
        <button
          className="w-screen h-14 bg-gray-300 text-white"
          onClick={() => updateScheduleMutation.mutate()}
        >
          일정 수정 완료
        </button>
      </div>
    </Layout>
  );
}
