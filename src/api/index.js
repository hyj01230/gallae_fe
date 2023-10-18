import { axiosInstance } from "./axiosInstance";

// 게시글 및 여행일정 생성
export const createPost = async (post) => {
  const response = await axiosInstance.post("api/posts", post);
  return response;
};

// 사용자별 일정 조회
export const getMySchedules = async () => {
  const response = await axiosInstance.get("api/user/posts");
  return response.data;
};

// 세부일정 조회
export const getScheduleDetail = async (tripDatedId) => {
  const response = await axiosInstance.get(`/api/tripDate/${tripDatedId}`);
  return response;
};

// 여행날짜, subTitle, 세부일정 아이디 불러오기
export const getTripDate = async (postId) => {
  const response = await axiosInstance.get(`/api/posts/${postId}/tripDate`);
  return response.data;
};

// 세부일정 생성
export const createScheduleDetail = async (tripDateId, data) => {
  const response = await axiosInstance.post(
    `/api/schedules/${tripDateId}`,
    data
  );
  return response;
};
