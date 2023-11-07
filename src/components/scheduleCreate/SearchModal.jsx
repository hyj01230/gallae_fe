import { useState } from "react";
import SearchMap from "../schedulesDetail/SearchMap";
import { LeftArrow, Search } from "../../assets/Icon";

export default function SearchModal({
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

  const handleSearchDown = (e) => {
    if (e.key === "Enter") setIsSearch(!isSearch);
    return;
  };

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
    <div
      className={`bg-white fixed top-0 left-0 right-0 mx-auto max-w-screen-md h-screen flex flex-col`}
    >
      <div className="flex gap-4 py-3 px-2 font-bold text-[20px]">
        <div className="cursor-pointer" onClick={handleCloseModal}>
          <LeftArrow />
        </div>
        <div>장소 검색하기</div>
      </div>

      {/* 장소 검색창 */}
      <div className="flex gap-2 justify-center items-center mx-4  bg-[#F2F2F2] text-sm text-[#999] py-2 rounded-2xl">
        <div className="ml-3">
          <Search />
        </div>
        <input
          className="w-full bg-[#F2F2F2] outline-none "
          placeholder="장소를 입력하세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleSearchDown}
        />
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
          className={`absolute bottom-0 w-full py-3 text-[white] ${
            schedule.placeName ? "bg-[#F90]" : "bg-gray-300"
          }`}
          onClick={handleSubmitClick}
        >
          장소 선택하기
        </button>
      </>
    </div>
  );
}
