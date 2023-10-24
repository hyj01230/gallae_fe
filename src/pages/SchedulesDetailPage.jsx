import { useLocation, useNavigate } from "react-router-dom";
import { Card, LeftArrow, Plus, Share, PlusWithCircle } from "../assets/Icon";
import Layout from "../components/common/Layout";
import List from "../components/schedulesDetail/List";
import { useQuery } from "react-query";
import { getScheduleDetail, getTripDate } from "../api";
import { useEffect, useState } from "react";
import BottomNav from "../components/mySchedules/BottomNav";
import KaKaoMap from "../components/schedulesDetail/KaKaoMap";
import SearchMap from "../components/schedulesDetail/SearchMap";
import TestKakaoMap from "../components/schedulesDetail/TestKakaoMap";

export default function SchedulesDetailPage() {
  const navigate = useNavigate();
  const { postId, subTitle, location } = useLocation().state;
  const [selectedDate, setSelectedDate] = useState({
    date: "",
    tripDateId: "",
  });
  const [scheduleDetail, setScheduleDetail] = useState([]);

  const { isLoading, error, data } = useQuery("schedulesDetail", () =>
    getTripDate(postId)
  );

  useEffect(() => {
    if (selectedDate.date === "") return;
    const getScheduleData = async () => {
      const response = await getScheduleDetail(selectedDate.tripDateId);
      setScheduleDetail(response.data.schedulesList);
    };
    getScheduleData();
  }, [selectedDate]);

  if (isLoading) {
    return <div>로딩중</div>;
  }

  const handleAccountClick = () => {
    const accountList = data.map((value) => ({
      chosenDate: value.chosenDate,
      schedules: [...value.schedulesList],
    }));

    navigate("/myschedules/account", {
      state: { accountList, postId, subTitle },
    });
  };

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
          <button>
            <Plus />
          </button>
          <button>
            <Share />
          </button>
          <button onClick={handleAccountClick}>
            <Card />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center h-10 mt-4 mx-4 p-4 border border-[#EBEBEB] rounded-lg">
        <div>{subTitle}</div>
      </div>

      {/* <div className="w-full h-36"> *ㄴ/}
      {/* <KaKaoMap /> */}
      <SearchMap keyword={location} />
      {/* <TestKakaoMap /> */}
      {/* </div>   */}

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

      {scheduleDetail.length >= 1 &&
        scheduleDetail.map((schedule, index) => (
          <List
            key={index}
            schedule={schedule}
            handleClick={() =>
              navigate("/myschedules/edit/schedule", {
                state: {
                  ...schedule,
                  subTitle: data.subTitle,
                  chosenDate: selectedDate.date,
                  postId,
                  subTitle,
                },
              })
            }
          />
        ))}

      <div
        className="flex justify-center items-center gap-3 mt-4 text-[#666] cursor-pointer"
        onClick={() =>
          navigate("/myschedules/create/schedule", {
            state: {
              postId,
              subTitle: subTitle,
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

// https://react-kakao-maps-sdk.jaeseokim.dev/docs/sample/library/keywordBasic/
// https://apis.map.kakao.com/web/sample/keywordList/
