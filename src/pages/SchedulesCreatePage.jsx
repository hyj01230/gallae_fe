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
import { useRecoilState } from "recoil";
import { scheduleDataState } from "../store/atom";

export default function SchedulesCreatePage() {
  const modal = useModal();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [timeSpent, setTimeSpent] = useState({ time: 0, text: "" });
  const [schedule, setSchedule] = useRecoilState(scheduleDataState);
  const { subTitle, chosenDate, tripDateId, postId } = useLocation().state;
  const imageHandler = useImage();

  const handleClick = (value) => {
    if (value === 0) {
      setTimeSpent({ time: 0, text: "" });
      setSchedule((prev) => ({ ...prev, timeSpent: timeSpent.text }));
      return;
    }

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

  const createScheduleMutation = useMutation(
    () => createScheduleDetail(tripDateId, { schedulesList: [schedule] }),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries("schedulesDetail");
        initRecoilState();
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

  const handleSearchClick = () => {
    modal.handleOpenModal();
  };

  // 뒤로 가기 또는 게시글 생성 시 전역 상태 초기화
  const initRecoilState = () => {
    setSchedule({
      schedulesCategory: "",
      costs: 0,
      placeName: null,
      x: "",
      y: "",
      contents: "",
      timeSpent: "",
      referenceURL: "",
    });
  };

  const handleSubmitClick = async () => {
    /**
     * 1. 세부일정 생성 api
     * 2. 생성이 잘 되면, GET tripDate해서 가장 마지막에 생성된 애의 schedulesId를 가져온다
     * 3. 그 아이디를 이용해 이미지를 업로드한다.
     *
     */
    await createScheduleDetail(tripDateId, {
      schedulesList: [schedule],
    });
    navigate("/myschedules/details", { state: { postId, tripDateId } });
  };

  return (
    <Layout>
      <div
        className="flex items-center gap-x-1 p-2"
        onClick={() => {
          initRecoilState();
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
              {schedule.placeName !== null
                ? schedule.placeName
                : "장소를 검색하세요"}
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
        <div className="w-36 h-36 flex justify-center items-center bg-[#F2F2F2] rounded-lg cursor-pointer">
          <Plus />
        </div>

        {imageHandler.previewImage ? (
          <div className="mt-3">
            <img src={imageHandler.previewImage} className="w-36 h-36" />
          </div>
        ) : (
          <div className="w-36 h-36 flex justify-center items-center bg-[#F2F2F2] rounded-lg cursor-pointer">
            <Plus />
          </div>
        )}

        {/* <div className="flex">
          {imageHandler.previewImage.length > 0 &&
            imageHandler.previewImage.map((value, index) => (
              <img key={index} src={value} className="w-36 h-36" />
            ))}
        </div> */}
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
              <span className="text-sm text-[#999]">소요시간</span>
              <span className="text-sm text-[#999]">{timeSpent.text}</span>
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
          type="number"
          className="w-full border border-[#D9D9D9] rounded-lg px-3 py-2 text-sm outline-[#F90] appearance-none"
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
          className="w-full border border-[#D9D9D9] rounded-lg px-3 py-2 text-sm resize-none outline-[#F90]"
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
          style={{
            background:
              "linear-gradient(95deg, #F90 -39.5%, #FFB800 5.63%, #FF912C 109.35%, #FF912C 109.35%)",
          }}
          className="w-screen h-14 bg-gray-300 text-white"
          onClick={() => createScheduleMutation.mutate()}
          // onClick={handleSubmitClick}
        >
          일정 수정 완료
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
