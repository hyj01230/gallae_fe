import { useLocation, useNavigate } from "react-router-dom";
import {
  Money,
  LeftArrow,
  Share,
  PlusWithCircle,
  ZoomIn,
  ZoomOut,
} from "../assets/Icon";
import Layout from "../components/common/Layout";
import List from "../components/schedulesDetail/List";
import { useQuery } from "react-query";
import { getTripDate } from "../api";
import { useState } from "react";
import DateDropbox from "../components/schedulesDetail/DateDropbox";
import DateSelectModal from "../components/schedulesDetail/DateSelectModal";
import useModal from "../hooks/useModal";
import ScheduleMap from "../components/schedulesDetail/ScheduleMap";

export default function SchedulesDetailPage() {
  const navigate = useNavigate();
  const { postId, subTitle, location, tripDateId } = useLocation().state;
  const modal = useModal();
  const [placeList, setPlaceList] = useState([]);
  const [tripSchedule, setTripSchedule] = useState({
    day: "",
    chosenDate: "",
    schedulesList: [],
    tripDateId: "",
  });
  const [isZoomOut, setIsZoomOut] = useState(false);

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
      state: { accountList, postId, subTitle, tripDateId },
    });
  };

  const { isLoading, error, data } = useQuery("schedulesDetail", async () => {
    const response = await getTripDate(postId);
    const foundElement = response.find(
      (value) => value.tripDateId === tripDateId
    );

    const index = response.findIndex(
      (value) => value.tripDateId === tripDateId
    );
    const filteredPlaceInfo = response.flatMap(({ schedulesList }) =>
      schedulesList.map(({ placeName, x, y }) => ({
        placeName,
        lat: y,
        lng: x,
      }))
    );
    setTripSchedule({ ...foundElement, day: index + 1 });
    setPlaceList(filteredPlaceInfo);

    return response;
  });

  if (isLoading) {
    return <div>로딩중</div>;
  }

  return (
    <Layout isBottomNav={true}>
      {/* 하단의 Navbar가 보이지 않아서 margin-bottom 값 추가 */}
      <div className="mb-[110px]">
        <div className="flex items-center justify-between gap-x-1 p-2   ">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="mr-2">
              <LeftArrow />
            </div>
            <div className="py-3 flex items-center text-xl font-bold">
              나의 일정
            </div>
          </div>

          <div className="flex items-center gap-1 mr-3">
            <button onClick={handleAccountClick}>
              <Money />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center h-10 mt-1 mx-4 p-4 border border-[#EBEBEB] rounded-lg">
          <div>{subTitle}</div>
        </div>

        <div className="relative mt-3">
          <ScheduleMap
            keyword={location}
            placeList={placeList}
            height={isZoomOut ? "300px" : "150px"}
          />
          <div
            className="absolute z-10 right-0 bottom-[0] p-2 cursor-pointer"
            onClick={() => setIsZoomOut(!isZoomOut)}
          >
            {isZoomOut ? <ZoomOut /> : <ZoomIn />}
          </div>
        </div>

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
                    tripDateId: tripSchedule.tripDateId,
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
      </div>

      {modal.isModal && (
        <DateSelectModal
          data={data}
          initDate={tripSchedule}
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
