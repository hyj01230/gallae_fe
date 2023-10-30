import { useState } from "react";
import SearchMap from "../schedulesDetail/SearchMap";
import Layout from "../common/Layout";
import { useRecoilState } from "recoil";
import { searchPlaceInfoState } from "../../store/atom";

export default function SearchModal({
  placeName,
  // setSchedule,
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
  const [searchList, setSearchList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [placeInfo, setPlaceInfo] = useRecoilState(searchPlaceInfoState);

  const handleSelectClick = (placeName, x, y) => {
    // 장소를 클릭하면
    // 장소명이 placeName에 저장되고
    // 마커의 info가 나타나고, 목록의 border가 #F90, border-3된다.
    // setSchedule((prev) => ({ ...prev, placeName }));
    setPlaceInfo({ placeName, x, y });
  };

  console.log({ placeInfo });

  const handleSubmitClick = () => {
    // 장소 선택 버튼을 누르면
    // 모달이 닫힌다.
    handleCloseModal();
  };

  return (
    <div className="h-screen max-w-3xl mx-auto ">
      {/* <div
        className="w-full h-screen fixed top-0 left-0 bg-black/50 z-50"
        onClick={handleCloseModal}
      ></div> */}
      <div className="absolute top-0 h-screen bg-white w-full z-50">
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
          <button onClick={() => setIsSearch(true)}>검색</button>
        </div>

        {/* 지도 */}
        {isSearch && (
          <>
            <div className="bg-white">
              <SearchMap
                height={"300px"}
                keyword={keyword}
                setSearchList={setSearchList}
              />
            </div>

            {/* 검색 결과 리스트 */}
            <div className="flex flex-col gap-2 text-[14px] mt-3 bg-white">
              {searchList.map((list, index) => (
                <div
                  key={index}
                  className={`mx-4 p-1 border rounded-md ${
                    placeName === list.place_name
                      ? "border-3 border-[#F90]"
                      : " "
                  }`}
                  onClick={() => handleSelectClick(list.place_name, x, y)}
                >
                  <div className="font-bold">{list.place_name}</div>
                  <div>{list.road_address_name}</div>
                  <div>{list.address_name}</div>
                  <div>{list.phone}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {isSearch && (
        <button
          className="absolute bottom-0 w-full bg-[#F90] py-3 text-[white] z-50"
          onClick={handleSubmitClick}
        >
          장소 선택하기
        </button>
      )}
    </div>
  );
}
