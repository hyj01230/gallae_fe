import { useState } from "react";
import SearchMap from "../schedulesDetail/SearchMap";
import { useRecoilState } from "recoil";
import { searchPlaceInfoState } from "../../store/atom";

export default function SearchModal({
  // placeName,
  schedule,
  setSchedule,
  handleCloseModal,
}) {
  /**
   * @type {string} address_name 구주소
   * @type {number} phone 전화번호
   * @type {string} place_name 장소명
   * @type {string} road_address_name 신주소
   * @type {string} x 위도
   * @type {string} y 경도
   */
  const [keyword, setKeyword] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [placeInfo, setPlaceInfo] = useRecoilState(searchPlaceInfoState);

  const handleSelectClick = (placeName, x, y) => {
    // 장소를 클릭하면
    // 장소명이 placeName에 저장되고
    // 마커의 info가 나타나고, 목록의 border가 #F90, border-3된다.
    // setSchedule((prev) => ({ ...prev, placeName }));
    // setPlaceInfo({ placeName, x, y });
    setSchedule((prev) => ({ ...prev, placeName, x, y }));
  };

  const handleSubmitClick = () => {
    // 장소 선택 버튼을 누르면
    // 모달이 닫힌다.
    handleCloseModal();
  };

  return (
    <div className={`bg-white fixed top-0 w-full h-screen flex flex-col`}>
      <div
        className="py-3 px-2 font-bold text-[20px]"
        onClick={handleCloseModal}
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
        <div className="bg-white mt-3">
          <SearchMap
            height={"200px"}
            keyword={keyword}
            isSearch={isSearch}
            setSearchList={setSearchList}
          />
        </div>

        {/* 검색 결과 리스트 */}
        <div className="flex flex-col gap-2 text-[14px] mt-3 bg-white flex-1 mb-[60px] overflow-auto">
          {searchList.map((list, index) => (
            <div
              key={index}
              className={`mx-4 p-1 border rounded-md ${
                schedule.placeName === list.place_name &&
                schedule.x === list.x &&
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

        <button
          className="absolute bottom-0 w-full py-3 bg-[#F90] text-[white]"
          onClick={handleSubmitClick}
        >
          장소 선택하기
        </button>
      </>
    </div>
  );
}
