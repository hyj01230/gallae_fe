import { Cookies } from "react-cookie";

const cookies = new Cookies();

// 저장
export const setCookie = (name, value, options) => {
  return cookies.set(name, value, { ...options });
};

// 가져오기
export const getCookie = (name) => {
  return cookies.get(name);
};

// 삭제
export const removeCookie = (name) => {
  return cookies.remove(name);
};
