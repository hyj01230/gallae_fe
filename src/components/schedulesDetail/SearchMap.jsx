import React, { useState, useEffect } from "react";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";

export default function SearchMap({
  height = "150px",
  keyword = "",
  isSearch,
  setSearchList,
  schedule,
  setSchedule,
}) {
  const [markers, setMarkers] = useState([]);
  const [map, setMap] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleMarkerClick = (marker) => {
    // 마커클릭 시 인포윈도우 Open, 장소 선택
    setIsOpen(true);
    setSchedule({
      ...schedule,
      placeName: marker.content,
      x: marker.position.lng,
      y: marker.position.lat,
    });
  };

  useEffect(() => {
    if (!map) return;
    // 장소 검색 객체 생성
    const ps = new kakao.maps.services.Places();

    if (keyword === undefined) {
      keyword === "서울";
    }

    ps.keywordSearch(keyword, (data, status, _pagination) => {
      if (status === "ZERO_RESULT") {
        setErrorMsg("검색 결과를 찾을 수 없습니다");
        setSearchList([]);
        return;
      }

      if (status === kakao.maps.services.Status.OK) {
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        setErrorMsg(null);

        const bounds = new kakao.maps.LatLngBounds();
        let markers = [];

        if (setSearchList) {
          setSearchList(data);
        }

        for (var i = 0; i < data.length; i++) {
          // @ts-ignore
          markers.push({
            position: {
              lat: data[i].y,
              lng: data[i].x,
            },
            content: data[i].place_name,
          });
          // @ts-ignore
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }
        setMarkers(markers);

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        map.setBounds(bounds);
      }
    });
  }, [isSearch, map]);

  return (
    <Map // 로드뷰를 표시할 Container
      center={
        schedule && schedule.x && schedule.y
          ? { lat: schedule.y, lng: schedule.x }
          : {
              lat: 37.566826,
              lng: 126.9786567,
            }
      }
      style={{
        width: "100%",
        height: `${height}`,
      }}
      level={3}
      onCreate={setMap}
    >
      {errorMsg ? (
        <div className="mt-5 mx-4 text-[18px] text-center ">{errorMsg}</div>
      ) : (
        markers.map((marker, index) => (
          <React.Fragment key={index}>
            <MapMarker
              key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
              position={marker.position}
              onClick={() => handleMarkerClick(marker)}
            />
            {isOpen && (schedule && schedule.placeName) === marker.content && (
              <CustomOverlayMap
                key={`${marker.content}-${marker.position.lat},${marker.position.lng}`}
                position={marker.position}
              >
                {schedule &&
                  schedule.y === marker.position.lat &&
                  schedule.x === marker.position.lng && (
                    <div className="text-[black] bg-[white] text-center p-1 mt-6 rounded-md opacity-90">
                      {schedule.placeName}
                    </div>
                  )}
              </CustomOverlayMap>
            )}
          </React.Fragment>
        ))
      )}
    </Map>
  );
}
