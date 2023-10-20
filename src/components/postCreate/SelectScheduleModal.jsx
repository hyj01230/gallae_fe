import { useQuery } from "react-query";
import { getMySchedules } from "../../api";
import { LeftArrow } from "../../assets/Icon";
import List from "../mySchedules/List";

export default function SelectScheduleModal({ handleClick }) {
  const { data, isLoading, error } = useQuery("mySchedule", getMySchedules);
  console.log("modal : ", data);

  return (
    <div>
      <div className="flex items-center justify-between gap-x-1 p-2 border-b border-gray-300">
        <div className="flex items-center">
          <div className="mr-2">
            <LeftArrow />
          </div>
          <div className="h-14 flex items-center text-xl">나의 일정</div>
        </div>
      </div>
      {data &&
        data.map((schedule) => (
          <List
            key={schedule.postId}
            schedule={schedule}
            // handleClick={() => handleClick(schedule.postId)}
            handleClick={() => handleClick(schedule)}
          />
        ))}
    </div>
  );
}
