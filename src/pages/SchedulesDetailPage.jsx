import { useLocation, useNavigate } from "react-router-dom";
import { Money, LeftArrow, Share, PlusWithCircle, XIcon } from "../assets/Icon";
import Layout from "../components/common/Layout";
import List from "../components/schedulesDetail/List";
import { useQuery } from "react-query";
import { getScheduleDetail, getTripDate } from "../api";
import { useEffect, useState } from "react";
import BottomNav from "../components/mySchedules/BottomNav";
import KaKaoMap from "../components/schedulesDetail/KaKaoMap";
import SearchMap from "../components/schedulesDetail/SearchMap";
import TestKakaoMap from "../components/schedulesDetail/TestKakaoMap";
import DateDropbox from "../components/schedulesDetail/DateDropbox";
import DateSelectModal from "../components/schedulesDetail/DateSelectModal";
import useModal from "../hooks/useModal";

export default function SchedulesDetailPage() {
  const navigate = useNavigate();
  const { postId, subTitle, location } = useLocation().state;
  // const [selectedDate, setSelectedDate] = useState({
  //   // **기존 State
  //   date: "",
  //   tripDateId: "",
  // });
  // const [scheduleDetail, setScheduleDetail] = useState([]); // **기존 State
  const modal = useModal();
  const [tripSchedule, setTripSchedule] = useState({
    day: "",
    chosenDate: "",
    schedulesList: [],
    tripDateId: "",
  });

  const { isLoading, error, data } = useQuery("schedulesDetail", async () => {
    const response = await getTripDate(postId);
    setTripSchedule({ ...response[0], day: 1 });
    return response;
  });

  // useEffect(() => {
  //   if (selectedDate.date === "") return;
  //   const getScheduleData = async () => {
  //     const response = await getScheduleDetail(selectedDate.tripDateId);
  //     setScheduleDetail(response.data.schedulesList);
  //   };
  //   getScheduleData();
  // }, [selectedDate]);

  if (isLoading) {
    return <div>로딩중</div>;
  }

  console.log(data);

  // 모달에 나열된 '날짜' 클릭 시 날짜 정보를 토대로 세부일정 업데이트
  const handleUpdateScheduleClick = (date) => {
    setTripSchedule(date);
    modal.handleCloseModal();
  };

  // 가계부로 이동
  const handleAccountClick = () => {
    const accountList = data.map((value) => ({
      chosenDate: value.chosenDate,
      schedules: [...value.schedulesList],
    }));

    navigate("/myschedules/account", {
      state: { accountList, postId, subTitle },
    });
  };

  console.log(tripSchedule);

  return (
    <Layout isBottomNav={true}>
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
            <Share />
          </button>
          <button onClick={handleAccountClick}>
            <Money />
          </button>
          <button>
            <XIcon />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center h-10 mt-4 mx-4 p-4 border border-[#EBEBEB] rounded-lg">
        <div>{subTitle}</div>
      </div>

      {/* <div className="w-full h-36"> *ㄴ/}
      {/* <KaKaoMap /> */}
      {/* <SearchMap keyword={location} /> */}
      {/* <TestKakaoMap /> */}
      {/* </div>   */}

      {/* 여행 날짜 드롭다운 */}
      <DateDropbox
        day={tripSchedule.day}
        date={tripSchedule.chosenDate}
        handleClick={modal.handleOpenModal}
      />

      {/* 날짜별 여행계획 리스트 */}
      {tripSchedule.schedulesList.length >= 1 &&
        tripSchedule.schedulesList.map((schedule, index) => (
          <List
            key={index}
            schedule={schedule}
            handleClick={() =>
              navigate("/myschedules/edit/schedule", {
                state: {
                  ...schedule,
                  subTitle,
                  chosenDate: tripSchedule.chosenDate,
                  postId,
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
              chosenDate: tripSchedule.chosenDate,
              tripDateId: tripSchedule.tripDateId,
            },
          })
        }
      >
        <PlusWithCircle />
        일정 추가하기
      </div>

      {modal.isModal && (
        <DateSelectModal
          data={data}
          selectedDate={tripSchedule.chosenDate}
          handleCloseModal={modal.handleCloseModal}
          handleUpdateScheduleClick={handleUpdateScheduleClick}
        />
      )}

      {/* <BottomNav />  */}
    </Layout>
  );
}

// https://react-kakao-maps-sdk.jaeseokim.dev/docs/sample/library/keywordBasic/
// https://apis.map.kakao.com/web/sample/keywordList/
