export default function List({ schedule }) {
  return (
    <div className="flex border border-[#F2F2F2] rounded-lg mx-4 mt-4 p-4">
      <div className="flex flex-col w-1/4">
        <div className="pb-2 text-sm font-medium">
          {schedule.schedulesCategory}
        </div>
        <div className="w-16 h-14 bg-[#F2F2F2] rounded"></div>
      </div>
      <div className="flex flex-col w-3/4">
        <div className="pb-2 text-sm font-medium">{schedule.placeName}</div>
        <div className="text-xs">
          <li>소요시간: {schedule.timeSpent}</li>
          <li>비용: {schedule.costs}원</li>
          <li>{schedule.contents}</li>
        </div>
      </div>
    </div>
  );
}
