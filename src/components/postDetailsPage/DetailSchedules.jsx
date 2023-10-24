import { useQuery } from "react-query";
import { getTripDate } from "../../api";
import { formatDateString } from "../../util/formatDate";
import List from "../schedulesDetail/List";

export default function DetailSchedules({ postId }) {
  const { isLoading, error, data } = useQuery("scheduleDetail", () =>
    getTripDate(postId)
  );

  if (isLoading) {
    return <div></div>;
  }

  return (
    <div className="mx-4">
      {data.map((value, index) => {
        return (
          <div key={index} className="mb-4">
            <div>
              <span className="text-sm px-[18px] py-[5px] bg-[#F2F2F2] rounded-[20px]">
                {formatDateString(value.chosenDate, false)}
              </span>
            </div>
            {value.schedulesList.map((list, index) => (
              <List key={index} schedule={list} move={false} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
