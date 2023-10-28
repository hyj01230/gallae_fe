import { Move } from "../../assets/Icon";

export default function List({ schedule, handleClick, move = true }) {
  return (
    <div
      className={`flex border border-[#F2F2F2] rounded-lg ${
        move && "mx-4 cursor-pointer  "
      } mt-4 px-4 pt-1 pb-3`}
      onClick={handleClick}
    >
      <div className="flex flex-col w-1/4">
        <div className="flex items-center h-8 text-sm">
          <div className="w-full h-4 border-r border-[#D9D9D9]">
            {schedule.schedulesCategory}
          </div>
        </div>
        <div className="w-16 h-14 mt-2 bg-[#F2F2F2] rounded"></div>
      </div>

      <div className="flex flex-col w-3/4">
        <div className="flex items-center h-8 pl-5 text-sm justify-between">
          {schedule.placeName}
          {schedule.referenceURL.length > 0 && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                window.open(schedule.referenceURL);
              }}
              // href={schedule.referenceURL}
              // target="_blank"
              className="text-[12px] text-[#D9D9D9] underline p-[2px]"
            >
              참고링크
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1 mt-2 pl-3 text-xs text-[#666]">
          <li>{schedule.timeSpent} 소요</li>
          <li>{schedule.costs}원</li>
          <li>{schedule.contents}</li>
        </div>
      </div>

      <div className="h-8">{move && <Move />}</div>
    </div>
  );
}
