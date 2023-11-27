import "../calendar.css";
import moment from "moment";
import Calendar from "react-calendar";
import Layout from "../components/common/Layout";
import { LeftArrow } from "../assets/Icon";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateTripDate } from "../api";

export default function SchedulesEditDatePage() {
  const navigate = useNavigate();
  const { tripDateIdList, chosenDateList } = useLocation().state;
  const [tripDateRange, setTripDateRange] = useState(chosenDateList);

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

      dateArray.push({ chosenDate: formattedDate });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (dateArray.length > tripDateIdList.length) {
      alert("날짜 범위가 넘 큼");
      return;
    }
    setTripDateRange(dateArray);
  };

  const changeDate = (e) => {
    const startDate = moment(e[0]).format("YYYY/MM/DD");
    const endDate = moment(e[1]).format("YYYY/MM/DD");
    getDateRange(startDate, endDate);
  };

  const handleSubmitClick = async () => {
    for (let i = 0; i < tripDateIdList.length; i++) {
      await updateTripDate(tripDateIdList[i], tripDateRange[i]);
    }
    navigate("/myschedules");
  };

  return (
    <Layout>
      <Header>
        <div className="flex gap-[15px]">
          <Button onClick={() => navigate("/myschedules")}>
            <LeftArrow />
          </Button>
          <Title type={"header"}>여행 일정</Title>
        </div>
        <Button onClick={() => navigate("/myschedules")}>
          <XIcon />
        </Button>
      </Header>
      {/* <div className="flex items-center gap-x-1 p-2 border-b border-gray-300">
        <div className="mr-2" onClick={() => navigate("/myschedules")}>
          <LeftArrow />
        </div>
        <div className="h-14 flex items-center text-xl">여행 일정</div>
      </div> */}
      <Calendar
        formatDay={(locale, date) => moment(date).format("DD")}
        onChange={changeDate}
        selectRange={true}
      />
      <div>시작일자 : {tripDateRange[0].chosenDate}</div>
      <div>끝일자 : {tripDateRange[tripDateRange.length - 1].chosenDate}</div>
      <div className="max-w-3xl	flex fixed bottom-0">
        <button
          className="w-screen h-14 bg-gray-300 text-white"
          onClick={handleSubmitClick}
        >
          날짜 변경하기
        </button>
      </div>
    </Layout>
  );
}
