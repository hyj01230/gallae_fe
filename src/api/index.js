import { axiosInstance } from "./axiosInstance";

// <---------- 게시글 관련 API ---------->
// 게시글 상세 조회
export const getDetailPost = async (postId) => {
  const response = await axiosInstance.get(`/api/posts/${postId}`);
  return response.data;
};

// 게시글 수정
export const updatePost = async (postId, data) => {
  const response = await axiosInstance.put(`api/posts/${postId}`, data);
  return response;
};

// 게시글 삭제
export const deletePost = async (postId) => {
  const response = await axiosInstance.delete(`/api/posts/${postId}`);
  return response;
};

// 게시글 및 여행일정 생성
export const createPost = async (post) => {
  const response = await axiosInstance.post("/api/posts", post);
  return response;
};

// 사용자별 일정 조회
export const getMySchedules = async () => {
  const response = await axiosInstance.get("/api/user/posts");
  return response.data;
};

// <---------- 세부여행 일정 관련 API ---------->
// 세부일정 생성
export const createScheduleDetail = async (tripDateId, data) => {
  const response = await axiosInstance.post(
    `/api/tripDate/${tripDateId}/schedules`,
    data
  );
  return response;
};

export const updateScheduleDetail = async (schedulesId, data) => {
  const response = await axiosInstance.put(
    `/api/schedules/${schedulesId}`,
    data
  );
  return response;
};

// <---------- 여행 날짜 관련 API ---------->
// 게시글별 여행 날짜 조회
export const getTripDate = async (postId) => {
  const response = await axiosInstance.get(`/api/posts/${postId}/tripDate`);
  return response.data;
};

// 세부(단일)일정 여행 날짜 조회
export const getScheduleDetail = async (tripDatedId) => {
  const response = await axiosInstance.get(`/api/tripDate/${tripDatedId}`);
  return response;
};

// 여행날짜 수정
export const updateTripDate = async (tripDateId, data) => {
  const response = await axiosInstance.put(`/api/tripDate/${tripDateId}`, data);
  return response;
};

// <---------- 이미지 관련 API ---------->
// 세부여행 이미지 업로드
export const uploadScheduleImage = async (schedulesId, file) => {
  const response = await axiosInstance.post(
    `/api/schedules/${schedulesId}/pictures`,
    file,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response;
};
