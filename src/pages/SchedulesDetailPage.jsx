import { useLocation, useNavigate } from "react-router-dom";
import {
  DownArrow,
  Hamburger,
  LeftArrow,
  Plus,
  Share,
  PlusWithCircle,
} from "../assets/Icon";
import Layout from "../components/common/Layout";
import List from "../components/schedulesDetail/List";
import { useQuery } from "react-query";
import { getScheduleDetail, getTripDate } from "../api";
import { useEffect, useState } from "react";
import BottomNav from "../components/mySchedules/BottomNav";

export default function SchedulesDetailPage() {
  const navigate = useNavigate();
  const postId = useLocation().state; // 새로 고침 해도 유지됨
  const [selectedDate, setSelectedDate] = useState({
    date: "",
    tripDateId: "",
  });

  // API : 여행 날짜, 서브제목, 세부일정 Id 불러오기
  const { isLoading, error, data } = useQuery("schedulesDetail", () =>
    getTripDate(postId)
  );

  useEffect(() => {
    if (selectedDate.date === "") return;
    const scheduleDetail = async () => {
      const response = await getScheduleDetail(selectedDate.tripDateId);
      return response;
    };

    const res = scheduleDetail();
    console.log(res);
  }, [selectedDate]);

  if (isLoading) {
    return <div>로딩중</div>;
  }

  return (
    <Layout>
      <div className="flex items-center justify-between gap-x-1 p-2 border-b border-gray-300">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="mr-2">
            <LeftArrow />
          </div>
          <div className="h-14 flex items-center text-xl">나의 일정</div>
        </div>

        <div className="flex items-center gap-1">
          <Plus />
          <Share />
          <Hamburger />
        </div>
      </div>

      <div className="flex justify-between items-center h-10 mt-4 mx-4 p-4 border border-[#EBEBEB] rounded-lg">
        <div>{data[0].subTitle}</div>
        <div>
          <DownArrow />
        </div>
      </div>

      <div className="w-full h-36">{/* <Map /> */}</div>

      <div className="flex justify-between mx-4 mt-4 border border-[#EBEBEB] rounded-xl">
        {data.map((date, index) => (
          <div
            className={`px-4 py-1 rounded-xl cursor-pointer ${
              selectedDate.date === date.chosenDate ? "bg-[#F2F2F2]" : ""
            }`}
            key={index}
            onClick={() => {
              setSelectedDate({
                date: date.chosenDate,
                tripDateId: date.tripDateId,
              });
            }}
          >
            {date.chosenDate}
          </div>
        ))}
      </div>

      {/* 특정 날짜를 눌렀을 때, <List/>에 날짜에 해당하는 데이터가 보여야함 */}
      {/* <List /> */}

      {/* 세부 일정을 생성하기 위한 데이터를 전달해야함 tripDateId, subTitle, chosenDate*/}
      <div
        className="flex justify-center items-center gap-3 mt-4 text-[#666] cursor-pointer"
        onClick={() =>
          navigate("/myschedules/create/schedule", {
            state: {
              subTitle: data[0].subTitle,
              chosenDate: selectedDate.date,
              tripDateId: selectedDate.tripDateId,
            },
          })
        }
      >
        <PlusWithCircle />
        일정 추가하기
      </div>

      <BottomNav />
    </Layout>
  );
}
