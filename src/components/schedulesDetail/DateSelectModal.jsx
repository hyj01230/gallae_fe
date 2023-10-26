import { useState } from "react";
import { formatDateString } from "../../util/formatDate";

export default function DateSelectModal({
  data,
  selectedDate,
  handleCloseModal,
  handleUpdateScheduleClick,
}) {
  const [isSelected, setIsSelected] = useState({
    date: selectedDate,
    dateInfo: {},
  }); // 글자색상 변경 및 날짜 데이터 저장
  const tailWindClassName =
    "py-[18px] flex gap-[10px] border-b border-[#F2F2F2]";

  return (
    <div className="cursor-pointer">
      <div
        className="w-full h-screen fixed top-0 left-0 bg-black/50"
        onClick={handleCloseModal}
      ></div>

      <div className="absolute bottom-0 bg-white w-full rounded-t-3xl">
        <div className="mt-8 mx-7">
          <div className="text-[#999]">날짜선택</div>
          {data.map((value, index) => {
            return (
              <div
                key={index}
                className={
                  isSelected.date === value.chosenDate
                    ? tailWindClassName + " font-bold text-[#F90]"
                    : tailWindClassName
                }
                onClick={() =>
                  setIsSelected({
                    date: value.chosenDate,
                    dateInfo: { ...value, day: index + 1 },
                  })
                }
              >
                <span>{index + 1} DAY</span>
                <span>{formatDateString(value.chosenDate, false)}</span>
              </div>
            );
          })}
        </div>

        <div>
          <button
            className="w-full py-6 text-white text-lg bg-[#F90]"
            onClick={() => handleUpdateScheduleClick(isSelected.dateInfo)}
          >
            일정 이동
          </button>
        </div>
      </div>
    </div>
  );
}