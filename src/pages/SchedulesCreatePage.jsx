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
import { useEffect, useState } from "react";
import { createScheduleDetail, getScheduleDetail } from "../api";
import { formatDateString } from "../util/formatDate";
import {
  DETAIL_SCHEDULES_CATEGORIES,
  SPENT_TIME_LIST,
} from "../constants/mySchedule";
import useImage from "../hooks/useImage";
import { useMutation, useQueryClient } from "react-query";
import useModal from "../hooks/useModal";
import SearchModal from "../components/scheduleCreate/SearchModal";

export default function SchedulesCreatePage() {
  const modal = useModal();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [timeSpent, setTimeSpent] = useState({ time: 0, text: "" });
  const [schedule, setSchedule] = useState({
    schedulesCategory: "",
    costs: "",
    placeName: null,
    x: "",
    y: "",
    contents: "",
    timeSpent: "",
    referenceURL: "",
  });
  const { subTitle, chosenDate, tripDateId, postId } = useLocation().state;
  const imageHandler = useImage();

  const handleClick = (value) => {
    if (value === 0) {
      setTimeSpent({ time: 0, text: "" });
      return;
    }

    setTimeSpent((prevTimeSpent) => {
      const number = prevTimeSpent.time + value;
      if (number >= 60) {
        return {
          time: number,
          text: `${Math.floor(number / 60)}시간  ${number % 60}분`,
        };
      } else {
        return { time: number, text: `${number}분` };
      }
    });
  };

  useEffect(() => {
    setSchedule({ ...schedule, timeSpent: timeSpent.text });
  }, [timeSpent]);

  const createScheduleMutation = useMutation(
    () => {
      let costs = Number(schedule.costs.replaceAll(",", ""));
      return createScheduleDetail(tripDateId, {
        schedulesList: [{ ...schedule, costs }],
      });
    },

    {
      onSuccess: async () => {
        queryClient.invalidateQueries("schedulesDetail");
        const response = await getScheduleDetail(tripDateId);
        const schedulesId = response.data.schedulesList.at(-1).schedulesId;
        // 이미지 업로드 하는 것
        if (imageHandler.previewImage) {
          await imageHandler.createScheduleImage(schedulesId);
        }
        navigate("/myschedules/details", {
          state: { postId, tripDateId, subTitle },
        });
      },
    }
  );

  // 모달 열림
  const handleSearchClick = () => {
    modal.handleOpenModal();
  };

  const handleCostChange = (e) => {
    const enteredValue = e.target.value;
    // 숫자 이외의 문자 제거
    const numericValue = enteredValue.replace(/[^0-9]/g, "");

    // 콤마 찍기
    const formattedValue = Number(numericValue).toLocaleString("ko-KR");
    setSchedule((prev) => ({ ...prev, costs: formattedValue }));
  };

  const isValidate = () => {
    // 카테고리와 장소명이 정해지지 않으면 버튼 활성화 안되게 하기
    if (
      DETAIL_SCHEDULES_CATEGORIES.includes(schedule.schedulesCategory) &&
      schedule.placeName &&
      schedule.placeName.trim() !== "" &&
      schedule.timeSpent !== "" &&
      schedule.costs !== "" &&
      schedule.contents !== ""
    ) {
      return true;
    }
    return false;
  };

  return (
    <Layout>
      <div
        className="flex items-center gap-x-1 p-2"
        onClick={() => {
          navigate("/myschedules/details", {
            state: { postId, subTitle, tripDateId },
          });
        }}
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
              className="w-full text-[#999]"
              value={
                schedule.schedulesCategory !== "" && schedule.schedulesCategory
              }
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
        </div>

        <div className="flex justify-between items-center w-3/5">
          <div className="flex items-center gap-2 text-[14px]">
            <Marker />
            <div className="cursor-pointer" onClick={handleSearchClick}>
              {schedule.placeName !== null ? (
                schedule.placeName
              ) : (
                <span className="text-[#999]">장소를 검색하세요 (필수)</span>
              )}
            </div>
          </div>
          <DownArrow />
        </div>
      </div>

      {/* 이미지 업로드 */}
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
        {imageHandler.previewImage ? (
          <div className="mt-3">
            <img src={imageHandler.previewImage} className="w-36 h-36" />
          </div>
        ) : (
          <div className="w-36 h-36 flex justify-center items-center bg-[#F2F2F2] rounded-lg cursor-pointer">
            <Plus />
          </div>
        )}
      </div>

      <div className="text-xs text-[#999] mx-4 mt-3">
        <p>사진 업로드는 개당 1MB내외로 업로드 가능합니다.</p>
        {/* 사진 업로드는 개당 1MB내외로 업로드 가능합니다. */}
      </div>

      {/* 소요시간, 참고링크, 바용, 메모 작성 */}
      <div className="flex flex-col mt-5 mx-7">
        <div className="flex gap-4">
          <div className="flex justify-center">
            <Clock />
          </div>

          <div className="w-full">
            <div className="w-full flex items-center gap-8 border border-[#D9D9D9] rounded-lg px-3 py-2">
              {timeSpent.text === "" ? (
                <span className="text-sm text-[#999]">
                  아래의 버튼을 눌러 소요시간을 선택해주세요 (필수)
                </span>
              ) : (
                <>
                  <span className="text-sm text-[#999]">소요시간</span>
                  <span className="text-sm text-[#999]">{timeSpent.text}</span>
                </>
              )}
            </div>

            <div className="flex justify-between text-[#999]">
              {SPENT_TIME_LIST.map((value, index) => (
                <button
                  key={index}
                  className="text-sm text=[#999] mx-2 mt-3"
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
          className="w-full border border-[#D9D9D9] rounded-lg px-3 py-2 text-sm outline-[#F90]"
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
          className="w-full border border-[#D9D9D9] rounded-lg px-3 py-2 text-sm outline-[#F90] appearance-none"
          placeholder="소요되는 비용을 입력해주세요 (필수)"
          value={schedule.costs !== null ? schedule.costs : ""}
          onChange={handleCostChange}
        />
      </div>

      <div className="flex items-center gap-4 mt-4 mx-7">
        <Memo />
        <textarea
          className="w-full border border-[#D9D9D9] rounded-lg px-3 py-2 text-sm resize-none outline-[#F90]"
          placeholder="메모를 입력해주세요 (필수)"
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
          style={{
            background:
              isValidate() &&
              "linear-gradient(95deg, #F90 -39.5%, #FFB800 5.63%, #FF912C 109.35%, #FF912C 109.35%)",
          }}
          className="w-screen h-14 bg-gray-300 text-white"
          onClick={() => {
            if (isValidate) {
              createScheduleMutation.mutate();
            }
          }}
        >
          일정 작성하기
        </button>
      </div>

      {modal.isModal && (
        <SearchModal
          schedule={schedule}
          setSchedule={setSchedule}
          handleCloseModal={modal.handleCloseModal}
        />
      )}
    </Layout>
  );
}
