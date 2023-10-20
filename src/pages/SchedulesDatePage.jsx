import { LeftArrow } from "../assets/Icon";
import Layout from "../components/common/Layout";
import { useNavigate } from "react-router-dom";
// import "../calendar.css";
import Calendar from "react-calendar";
import moment from "moment";
import { useState } from "react";
import { scheduleState } from "../store/atom";
import { useRecoilState } from "recoil";
import { createPost } from "../api";

export default function SchedulesDatePage() {
  const navigate = useNavigate();
  const [tripDateRange, setTripDateRange] = useState("");
  const [schedule, setSchedule] = useRecoilState(scheduleState);

  console.log(schedule);

  const getDateRange = (startDate, endDate) => {
    let dateArray = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      const formattedDate = currentDate
        .toLocaleDateString("en-CA", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\//g, "-");

      dateArray.push(formattedDate);

      currentDate.setDate(currentDate.getDate() + 1);
    }

    setTripDateRange(dateArray);
  };

  const changeDate = (e) => {
    const startDate = moment(e[0]).format("YYYY/MM/DD");
    const endDate = moment(e[1]).format("YYYY/MM/DD");
    getDateRange(startDate, endDate);
  };

  const handleSubmitClick = async () => {
    const tripDateList = tripDateRange.map((date) => ({
      chosenDate: date,
      subTitle: schedule.tripDateList[0].subTitle,
    }));

    setSchedule({ ...schedule, tripDateList });
    const response = await createPost(schedule);
    console.log(response);
    navigate("/myschedules/details", { state: response.data.postId });
  };

  return (
    <Layout>
      <div className="flex items-center gap-x-1 p-2 border-b border-gray-300">
        <div className="mr-2">
          <LeftArrow />
        </div>
        <div className="h-14 flex items-center text-xl">여행 일정</div>
      </div>

      <Calendar
        formatDay={(locale, date) => moment(date).format("DD")}
        onChange={changeDate}
        selectRange={true}
      />
      <div>시작일자 : {tripDateRange[0]}</div>
      <div>끝일자 : {tripDateRange[tripDateRange.length - 1]}</div>

      <div className="max-w-3xl	flex fixed bottom-0">
        <button
          className="w-screen h-14 bg-gray-300 text-white"
          onClick={handleSubmitClick}
        >
          다음 단계로
        </button>
      </div>
    </Layout>
  );
}
