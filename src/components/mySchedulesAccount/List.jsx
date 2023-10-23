import { formatDateString } from "../../util/formatDate";

export default function List({ data, day }) {
  return (
    <div className="mx-4 mb-[56px]">
      <div className="mb-4">
        <span className="text-[14px] rounded-[20px] bg-[#F2F2F2] px-[18px] py-[5px]">
          <span className="font-semibold mr-1">{day}일차</span>{" "}
          <span className="text-[#999]">
            {formatDateString(data.chosenDate, false)}
          </span>
        </span>
      </div>

      {data.schedules.map((schedule) => (
        <div
          key={schedule.schedulesId}
          className="flex items-center border-b border-[#F2F2F2]"
        >
          <div className="flex items-center py-5">
            <div className="mr-[9px]">ICON</div>
            <div className="w-[42px] text-[12px] text-[#999] mr-[10px]">
              {schedule.schedulesCategory}
            </div>
          </div>
          <div className="flex flex-1 justify-between">
            <div className="font-semibold text-[#333]">
              {schedule.placeName}
            </div>
            <div className="font-bold text-[#333]">
              ₩ {schedule.costs.toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
