import { useRef, useState } from "react";
import { uploadPostImage, uploadScheduleImage } from "../api";
import axios from "axios";

export default function useImage() {
  const inputRef = useRef(null); // 사진선택 input - 앨범에서 선택 연결
  const [uploadImage, setUploadImage] = useState([]); // 업로드할 이미지를 관리
  const [previewImage, setPreviewImage] = useState([]); // 미리보기할 이미지를 관리

  const onClickSelectProfileHandler = () => {
    // 사진선택 input - 앨범에서 선택 연결
    inputRef.current.click();
  };

  // 파일 선택 시 실행
  const uploadImageHandler = (e) => {
    const selectImage = e.target.files[0]; // 선택된 파일 가져오기
    // console.log(`선택된 파일 이름: ${selectImage.name}`);
    // console.log(`선택된 파일 크기: ${selectImage.size} bytes`);

    const reader = new FileReader();
    reader.readAsDataURL(selectImage);
    reader.onloadend = () => {
      setPreviewImage((prev) => [...prev, reader.result]);
    };

    const formData = new FormData();
    formData.append("file", selectImage);
    // setUploadImage((prev) => [...prev, { formData }]);
    setUploadImage(formData);
  };

  const handleSubmitClick = async (postId) => {
    // const formData = new FormData(); // 사진 업로드는 폼데이터로!!!!!!!!!
    // formData.append(uploadImage);
    // const response = await uploadPostImage(postId, { file: uploadImage });
    // return response;

    console.log(uploadImage);

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
    handleSubmitClick,
  };
}
