import { useEffect, useRef, useMemo, useState } from "react";
import {
  CustomOverlayMap,
  Map,
  MapMarker,
  Polyline,
} from "react-kakao-maps-sdk";

export default function ScheduleMap({
  keyword,
  height = "150px",
  placeList = [
    { placeName: "제주1", lat: 33.452344169439975, lng: 126.56878163224233 },
    { placeName: "제주2", lat: 33.452739313807456, lng: 126.5709308145358 },
    { placeName: "제주3", lat: 33.45178067090639, lng: 126.5726886938753 },
  ],
}) {
  const mapRef = useRef();
  const [map, setMap] = useState();
  const [keywordMarkers, setKeywordMarkers] = useState([]);

  const position = placeList.map(({ placename, ...rest }) => ({ ...rest }));

  const bounds = useMemo(() => {
    const bounds = new kakao.maps.LatLngBounds();
    placeList.forEach((list) => {
      bounds.extend(new kakao.maps.LatLng(list.lat, list.lng));
    });

    return bounds;
  }, [placeList]);

  useEffect(() => {
    if (keyword) {
      const ps = new kakao.maps.services.Places();

      ps.keywordSearch(keyword, (data, status, _pagination) => {
        if (status === kakao.maps.services.Status.OK) {
          // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
          // LatLngBounds 객체에 좌표를 추가합니다
          const bounds = new kakao.maps.LatLngBounds();
          let markers = [];

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
          setKeywordMarkers(markers);

          // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
          map.setBounds(bounds);
        }
      });
    }

    if (placeList.length > 0 && mapRef.current) {
      mapRef.current.setBounds(bounds);
    }
  }, [map, mapRef, placeList]);

  return (
    <Map // 로드뷰를 표시할 Container
      center={{
        lat: 37.566826,
        lng: 126.9786567,
      }}
      style={{
        width: "100%",
        height: `${height}`,
      }}
      level={3}
      onCreate={setMap}
      ref={mapRef}
    >
      {placeList.length > 0 &&
        placeList.map((point) => (
          <CustomOverlayMap
            key={`${point.lat}-${point.lng}`}
            position={{ lat: point.lat, lng: point.lng }}
          >
            <div className="flex flex-col items-center">
              <span className="bg-white py-1 px-1 rounded-md text-[14px]">
                {point.placeName}
              </span>
              <img src="/img/location.png" className="w-[40px]" />
            </div>
          </CustomOverlayMap>
        ))}

      {placeList.length > 0 && (
        <Polyline
          path={[position]}
          strokeWeight={5} // 선의 두께 입니다
          strokeColor={"#FFAE00"} // 선의 색깔입니다
          strokeOpacity={0.7} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
          strokeStyle={"solid"} // 선의 스타일입니다
        />
      )}
    </Map>
  );
}
