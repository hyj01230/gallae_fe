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
