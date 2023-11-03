import { useQuery } from "react-query";
import { getMySchedules } from "../../api";
import { LeftArrow } from "../../assets/Icon";
import List from "../mySchedules/List";

export default function SelectScheduleModal({ handleClick, setIsModal }) {
  const { data, isLoading, error } = useQuery("mySchedule", getMySchedules);

  return (
    <div className="max-w-screen-md h-screen fixed top-0 left-0 right-0 mx-auto bg-white z-50">
      <div className="flex items-center justify-between gap-x-1 p-2 ">
        <div className="flex items-center">
          <div
            className="mr-2 cursor-pointer"
            onClick={() => setIsModal(false)}
          >
            <LeftArrow />
          </div>
          <div className="h-14 flex items-center text-xl font-semibold">
            나의 일정
          </div>
        </div>
      </div>
      {data &&
        data.map((schedule) => (
          <List
            key={schedule.postId}
            schedule={schedule}
            isPointer={false}
            handlePostClick={() => handleClick(schedule)}
          />
        ))}
    </div>
  );
}
