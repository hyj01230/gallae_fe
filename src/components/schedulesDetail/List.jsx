export default function List(props) {
  return (
    <div className="flex border border-[#F2F2F2] rounded-lg mx-4 mt-4 p-4">
      <div className="flex flex-col w-1/4">
        <div className="pb-2 text-sm font-medium">
          {props.schedulesCategory}
        </div>
        <div className="w-16 h-14 bg-[#F2F2F2] rounded"></div>
      </div>
      <div className="flex flex-col w-3/4">
        <div className="pb-2 text-sm font-medium">{props.placeName}</div>
        <div className="text-xs">
          <li>소요시간: {props.timeSpent}</li>
          <li>비용: {props.costs}원</li>
          <li>{props.contents}</li>
        </div>
      </div>
    </div>
  );
}
