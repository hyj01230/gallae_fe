import { useRef, useState } from "react";
import axios from "axios";

export default function useImage() {
  const inputRef = useRef(null); // 사진선택 input - 앨범에서 선택 연결
  const [uploadImage, setUploadImage] = useState(null); // 업로드할 이미지를 관리
  const [previewImage, setPreviewImage] = useState(null); // 미리보기할 이미지를 관리

  // 사진선택 input - 앨범에서 선택 연결
  const onClickSelectProfileHandler = () => {
    inputRef.current.click();
  };

  // 파일 선택 시 사진 미리 보기
  const uploadImageHandler = (e) => {
    const selectImage = e.target.files[0]; // 선택된 파일 가져오기

    const reader = new FileReader();
    reader.readAsDataURL(selectImage);
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };

    const formData = new FormData();
    formData.append("file", selectImage);
    setUploadImage(formData);
  };

  // 게시글 이미지 수정
  const handleUpdateImage = async (postPicturesId) => {
    const response = await axios.put(
      `${
        import.meta.env.VITE_REACT_APP_URL
      }/api/postsPictures/${postPicturesId}`,
      uploadImage,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": localStorage.getItem("accessToken"),
        },
        withCredentials: true,
      }
    );

    console.log(response);

    return response;
  };

  // 게시글 이미지 수정
  const handleUpdateSheduleImage = async (picturesId) => {
    const response = await axios.put(
      `${import.meta.env.VITE_REACT_APP_URL}/api/pictures/${picturesId}`,
      uploadImage,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": localStorage.getItem("accessToken"),
        },
        withCredentials: true,
      }
    );
    return response;
  };

  // 세부일정 이미지 생성
  const createScheduleImage = async (schedulesId) => {
    const response = await axios.post(
      `${
        import.meta.env.VITE_REACT_APP_URL
      }/api/schedules/${schedulesId}/pictures`,
      uploadImage,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": localStorage.getItem("accessToken"),
        },
        withCredentials: true,
      }
    );

    return response;
  };

  // 게시글 이미지 생성
  const handleSubmitClick = async (postId) => {
    const res = await axios.post(
      `${import.meta.env.VITE_REACT_APP_URL}/api/posts/${postId}/postsPictures`,
      uploadImage,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": localStorage.getItem("accessToken"),
        },
        withCredentials: true,
      }
    );

    return res;
  };

  return {
    inputRef,
    previewImage,
    uploadImage,
    setUploadImage,
    onClickSelectProfileHandler,
    uploadImageHandler,
    createScheduleImage,
    handleUpdateImage,
    handleUpdateSheduleImage,
    handleSubmitClick,
  };
}
