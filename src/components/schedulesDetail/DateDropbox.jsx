import { DownArrow } from "../../assets/Icon";
import { formatDateString } from "../../util/formatDate";

export default function DateDropbox({
  day = "1",
  date = "1. 11",
  handleClick,
}) {
  return (
    <div
      className="w-fit flex gap-1	items-center mt-4 ml-4 px-3 py-1 border border-[#F2F2F2] rounded-[20px] cursor-pointer "
      onClick={handleClick}
    >
      <span className="text-sm text-[#F90]">{day}일차</span>
      <span className="text-sm text-[#999]">
        {formatDateString(date, false)}
      </span>
      <DownArrow />
    </div>
  );
}
