import { LeftArrow } from "../assets/Icon";
import Layout from "../components/common/Layout";
import { useLocation, useNavigate } from "react-router-dom";
// import "../calendar.css";
import Calendar from "react-calendar";
import moment from "moment";
import { useState } from "react";

export default function SchedulesDatePage() {
  const navigate = useNavigate();
  const [startDateFormat, setStartDate] = useState("");
  const [endDateFormat, setEndDate] = useState("");
  const [duDate, setDuDate] = useState("");
  const post = useLocation().state;

  const getDateRange = (startDate, endDate) => {
    let dateArray = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      dateArray.push(
        currentDate.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      );

      currentDate.setDate(currentDate.getDate() + 1);
    }

    setDuDate(dateArray);
  };

  const changeDate = (e) => {
    const startDateFormat = moment(e[0]).format("YYYY/MM/DD");
    const endDateFormat = moment(e[1]).format("YYYY/MM/DD");

    setStartDate(startDateFormat);
    setEndDate(endDateFormat);
    getDateRange(startDateFormat, endDateFormat);
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
      <div>시작일자 : {startDateFormat}</div>
      <div>끝일자 : {endDateFormat}</div>
      <button>초기화</button>

      <div className="max-w-3xl	flex fixed bottom-0">
        <button
          className="w-screen h-14 bg-gray-300 text-white"
          onClick={() => navigate("/myschedules/details", { state: duDate })}
        >
          다음 단계로
        </button>
      </div>
    </Layout>
  );
}
