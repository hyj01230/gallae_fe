import { useState } from "react";
import Layout from "../components/common/Layout";
import SearchMap from "../components/schedulesDetail/SearchMap";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { scheduleDataState } from "../store/atom";

export default function SchedulesPlaceSearch() {
  /**
   * @type {string} address_name 구주소
   * @type {number} phone 전화번호
   * @type {string} place_name 장소명
   * @type {string} road_address_name 신주소
   * @type {string} x 위도
   * @type {string} y 경도
   */
  const [keyword, setKeyword] = useState(""); // 검색 키워드
  const [searchList, setSearchList] = useState([]); // 검색 목록
  const [isSearch, setIsSearch] = useState(false); // 검색 버튼 클릭 시 상태 변경
  const [schedule, setSchedule] = useRecoilState(scheduleDataState);
  const navigate = useNavigate();
  const { postId, subTitle, tripDateId } = useLocation().state;

  const handleSelectClick = (placeName, x, y) => {
    setSchedule((prev) => ({ ...prev, placeName, x, y }));
  };

  const handleSubmitClick = () => {
    navigate(-1, { state: { postId, subTitle, tripDateId } });
  };

  return (
    <Layout>
      <div
        className="py-3 px-2 font-bold text-[20px]"
        onClick={handleSubmitClick}
      >
        장소 검색하기
      </div>

      {/* 장소 검색창 */}
      <div className="mx-4">
        <input
          className="p-1"
          placeholder="장소를 입력하세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button onClick={() => setIsSearch(!isSearch)}>검색</button>
      </div>

      {/* 지도 */}
      <>
        <div className="bg-white">
          <SearchMap
            height={"300px"}
            keyword={keyword}
            isSearch={isSearch}
            setSearchList={setSearchList}
          />
        </div>

        {/* 검색 결과 리스트 */}
        <div className="flex flex-col gap-2 text-[14px] mt-3 bg-white">
          {searchList.map((list, index) => (
            <div
              key={index}
              className={`mx-4 p-1 border rounded-md ${
                schedule.placeName === list.place_name &&
                schedule.x == list.x &&
                schedule.y === list.y
                  ? "border-3 border-[#F90]"
                  : " "
              }`}
              onClick={() => handleSelectClick(list.place_name, list.x, list.y)}
            >
              <div className="font-bold">{list.place_name}</div>
              <div>{list.road_address_name}</div>
              <div>{list.address_name}</div>
              <div>{list.phone}</div>
            </div>
          ))}
        </div>
      </>

      <div className="max-w-3xl	flex fixed bottom-0 w-full">
        <button
          className="bg-[#F90] py-3 text-[white] w-full"
          onClick={handleSubmitClick}
        >
          장소 선택하기
        </button>
      </div>
    </Layout>
  );
}
