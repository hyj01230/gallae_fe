import { ThreeDot_horizen } from "../../assets/Icon";
import { renderDateRange } from "../../util/formatDate";

export default function List({
  schedule,
  onNavigateClick = null,
  onScheduleClick = null,
  onOpenModalClick = null,
}) {
  return (
    <div
      className={`border border-[#D9D9D9] mx-4 mb-3 p-3 rounded-xl ${
        onScheduleClick || onNavigateClick ? "cursor-pointer" : ""
      }`}
      onClick={onScheduleClick || onNavigateClick}
    >
      <div className="flex justify-between items-center mr-[10px] text-[18px]	font-semibold">
        {schedule.subTitle}
        <button
          className={`px-[6px] py-[14px] ${onOpenModalClick ? "" : "hidden"}`}
          onClick={onOpenModalClick}
        >
          <ThreeDot_horizen />
        </button>
      </div>
      <div className="mt-2 text-sm font-normal">
        {renderDateRange(schedule.chosenDateList)}
      </div>
      <div className="flex gap-1 mt-6">
        {schedule.tagsList.map((tag, index) => (
          <span
            key={index}
            className="text-[12px] px-2 py-1 border border-[#D9D9D9] text-[#888] rounded-xl"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
