import { atom } from "recoil";

export const scheduleState = atom({
  key: "scheduleState",
  default: {},
});

// 전역으로 사용할 state를 선언
export const nickNameState = atom({
  key: "nickNameState",
  default: "",
});

// 여행 일정 생성/수정 시 사용되는 state
export const searchPlaceInfoState = atom({
  key: "searchPlaceInfoState",
  default: { placeName: "", x: "", y: "" },
});
