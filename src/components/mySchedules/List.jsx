import { formatDateString } from "../../util/formatDate";

export default function List({ schedule, handleClick }) {
  // 해당 컴포넌트를 클릭했을 때
  // Modal 생성

  const renderDateRange = () => {
    if (schedule.chosenDateList.length === 1) {
      // 날짜 요소가 하나인 경우
      return (
        <div className="mt-2 text-sm font-normal">
          {formatDateString(schedule.chosenDateList[0])}
        </div>
      );
    } else if (schedule.chosenDateList.length > 1) {
      // 날짜 요소가 여러 개인 경우
      const startDate = formatDateString(schedule.chosenDateList[0]);
      const endDate = formatDateString(
        schedule.chosenDateList[schedule.chosenDateList.length - 1]
      );
      return (
        <div className="mt-2 text-sm font-normal">{`${startDate} ~ ${endDate}`}</div>
      );
    } else {
      // 날짜 요소가 없는 경우
      return null;
    }
  };
  return (
    <div
      className="border border-[#D9D9D9] mx-4 mb-3 p-3 rounded-xl cursor-pointer"
      onClick={handleClick}
    >
      <div className="text-xl	font-semibold">{schedule.subTitleList[0]}</div>
      {renderDateRange()}
      <div className="flex gap-1 mt-6">
        {schedule.tagsList.map((tag, index) => (
          <span
            key={index}
            className="text-xs px-2 py-1 border border-[#D9D9D9] text-[#888] rounded-xl"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
