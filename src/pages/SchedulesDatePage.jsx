import "../calendar.css";
import moment from "moment";
import Calendar from "react-calendar";
import Layout from "../components/common/Layout";
import { LeftArrow } from "../assets/Icon";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { scheduleState } from "../store/atom";
import { useRecoilState } from "recoil";
import { createPost } from "../api";
import { QueryClient, useMutation } from "react-query";

export default function SchedulesDatePage() {
  const queryClient = new QueryClient();
  const navigate = useNavigate();
  const [tripDateRange, setTripDateRange] = useState(null);
  const [schedule, setSchedule] = useRecoilState(scheduleState);

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

    setSchedule({ ...schedule, tripDateList: dateArray });
    setTripDateRange(dateArray);
  };

  const changeDate = (e) => {
    const startDate = moment(e[0]).format("YYYY/MM/DD");
    const endDate = moment(e[1]).format("YYYY/MM/DD");
    getDateRange(startDate, endDate);
  };

  const createScheduleMutation = useMutation(() => createPost(schedule), {
    onSuccess: (response) => {
      console.log(response);
      queryClient.invalidateQueries("mySchedule");
      navigate("/myschedules/details", {
        state: {
          postId: response.data.postId,
          subTitle: schedule.subTitle,
          location: schedule.location,
          tripDateId: response.data.tripDateId[0],
        },
      });
    },
  });

  return (
    <Layout>
      <div className="flex items-center gap-x-1 p-2 ">
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

      {tripDateRange ? (
        <></>
      ) : (
        <div className="mt-8 ml-[17px]">
          <span
            className={`px-4 py-2 rounded-[40px] border ${
              tripDateRange
                ? " border-[#FF9900] text-[#FF9900]"
                : "border-[#D9D9D9] text-[#D9D9D9]"
            }`}
          >
            아직 날짜가 정해지지 않았어요
          </span>
        </div>
      )}

      <div className="max-w-3xl	flex fixed bottom-0">
        <button
          style={{
            background:
              "linear-gradient(95deg, #F90 -39.5%, #FFB800 5.63%, #FF912C 109.35%, #FF912C 109.35%)",
          }}
          className="w-screen h-14 bg-gray-300 text-white"
          onClick={() => createScheduleMutation.mutate()}
        >
          일정 만들기
        </button>
      </div>
    </Layout>
  );
}
