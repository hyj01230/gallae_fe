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

// 세부일정 삭제
export const deleteScheduleDetail = async (schedulesId) => {
  const response = await axiosInstance.delete(`/api/schedules/${schedulesId}`);
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
// 게시글 이미지 업로드
export const uploadPostImage = async (postId, file) => {
  const response = await axiosInstance.post(
    `/api/posts/${postId}/postsPictures`,
    file,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response;
};

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

// <---------- 회원가입 관련 API ---------->
// POST : 닉네임 중복확인
export const checkNickNameAPI = async (nickName) => {
  const response = await axiosInstance.post(
    "/api/users/signup/check-nickname",
    {
      nickName,
    }
  );
  return response;
};

// POST : 이메일 인증하기
export const EmailAuthAPI = async (email) => {
  const response = await axiosInstance.post("/api/users/signup/email", {
    email,
  });
  return response;
};

// POST : 이메일 인증번호 확인
export const checkEmailCordAPI = async ({ email, validNumber }) => {
  const response = await axiosInstance.post("/api/users/signup/email/valid", {
    email,
    validNumber,
  });
  return response;
};

// POST : 회원가입 하기
export const signUpAPI = async ({ nickName, email, password, profileImg }) => {
  const response = await axiosInstance.post("/api/users/signup", {
    nickName,
    email,
    password,
    profileImg,
  });
  return response;
};

// <---------- 로그인 관련 API ---------->
// POST : 로그인 정보 보내기
export const loginUserAPI = async (data) => {
  const response = await axiosInstance.post("/api/users/login", data);
  return response;
};

// <---------- 마이페이지 관련 API ---------->
// GET : 마이페이지 데이터 가져오기
export const getMyPageInfoAPI = async () => {
  const response = await axiosInstance.get("/api/users/profile");
  return response.data;
};

// PUT : 프로필 사진 변경(앨범)
export const putUpdateProfileAPI = async (formData) => {
  const response = await axiosInstance.put(
    "/api/users/profile/update-profileImg",
    formData
  );
  return response;
};

// PUT : 프로필 사진 변경(기본)
export const putDefaultProfileAPI = async () => {
  const response = await axiosInstance.put(
    "/api/users/profile/default-profileImg"
  );
  return response;
};

// PUT : 소개글 변경
export const putAboutMeAPI = async (aboutMe) => {
  const response = await axiosInstance.put(
    "/api/users/profile/update-aboutMe",
    {
      aboutMe,
    }
  );
  return response;
};

// PUT : 닉네임 변경
export const putNickNameAPI = async ({ updateNickName }) => {
  const response = await axiosInstance.put(
    "/api/users/profile/update-nickname",
    {
      updateNickName,
    }
  );
  return response;
};

// PUT : 비밀번호 변경
export const putPasswordAPI = async ({ currentPassword, updatePassword }) => {
  const response = await axiosInstance.put(
    "/api/users/profile/update-password",
    {
      currentPassword,
      updatePassword,
    }
  );
  return response;
};

// delete : 탈퇴
export const SignOutAPI = async ({ data }) => {
  const response = await axiosInstance.delete("/api/users/signout", {
    data,
  });
  return response;
};

// GET : 사용자별 좋아요 게시글 가져오기
export const getLikeListAPI = async (page) => {
  const response = await axiosInstance.get("/api/posts/like", {
    params: {
      page: `${page}`, // 현재 페이지 번호
      size: 5, // 원하는 페이지 크기(게시물 수)
    },
  });
  return response;
};

// GET : 좋아요 취소
export const getLikeAPI = async (postId) => {
  const response = await axiosInstance.get(`/api/posts/like/${postId}`);
  return response;
};

// GET : 사용자별 게시글 가져오기
export const getPostListAPI = async () => {
  const response = await axiosInstance.get("/api/user/posts");
  return response;
};

// GET : 사용자별 댓글 가져오기
export const getCommetsListAPI = async (myCommentspage) => {
  const response = await axiosInstance.get("/api/commentsme", {
    params: {
      page: `${myCommentspage}`, // 현재 페이지 번호
      size: 5, // 원하는 페이지 크기(게시물 수)
    },
  });
  return response;
};

// GET : 사용자별 대댓글 가져오기
export const getRepliesListAPI = async (myRepliespage) => {
  const response = await axiosInstance.get("/api/repliesme", {
    params: {
      page: `${myRepliespage}`, // 현재 페이지 번호
      size: 5, // 원하는 페이지 크기(게시물 수)
    },
  });
  return response;
};
