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
