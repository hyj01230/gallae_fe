import { useState, useEffect } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";

export default function SearchMap({
  height = "150px",
  keyword = "",
  isSearch,
  setSearchList,
}) {
  const [info, setInfo] = useState();
  const [markers, setMarkers] = useState([]);
  const [map, setMap] = useState();
  const [list, setList] = useState([]);

  useEffect(() => {
    if (!map) return;
    // 장소 검색 객체 생성
    const ps = new kakao.maps.services.Places();

    if (keyword === undefined) {
      keyword === "서울";
    }

    ps.keywordSearch(keyword, (data, status, _pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
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
    >
      {markers.map((marker) => (
        <MapMarker
          key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
          position={marker.position}
          onClick={() => setInfo(marker)}
        >
          {info && info.content === marker.content && (
            <div style={{ color: "#000", visibility: "hidden" }}>
              {marker.content}
            </div>
          )}
        </MapMarker>
      ))}
    </Map>
  );
}
