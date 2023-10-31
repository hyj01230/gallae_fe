import { useEffect, useRef, useMemo } from "react";
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk";

export default function ScheduleMap({
  height = "150px",
  placeList = [
    { placeName: "제주1", lat: 33.452344169439975, lng: 126.56878163224233 },
    { placeName: "제주2", lat: 33.452739313807456, lng: 126.5709308145358 },
    { placeName: "제주3", lat: 33.45178067090639, lng: 126.5726886938753 },
  ],
}) {
  const mapRef = useRef();
  const position = placeList.map(({ placename, ...rest }) => ({ ...rest }));

  const bounds = useMemo(() => {
    const bounds = new kakao.maps.LatLngBounds();

    placeList.forEach((list) => {
      bounds.extend(new kakao.maps.LatLng(list.lat, list.lng));
    });
    return bounds;
  }, [placeList]);

  useEffect(() => {
    const map = mapRef.current;
    if (map) map.setBounds(bounds);
  }, [mapRef.current]);

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
      ref={mapRef}
    >
      {placeList.map((point) => (
        <MapMarker key={`${point.lat}-${point.lng}`} position={point}>
          <span>{point.placeName}</span>
        </MapMarker>
      ))}

      <Polyline
        path={[position]}
        strokeWeight={5} // 선의 두께 입니다
        strokeColor={"#FFAE00"} // 선의 색깔입니다
        strokeOpacity={0.7} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle={"solid"} // 선의 스타일입니다
      />
    </Map>
  );
}
