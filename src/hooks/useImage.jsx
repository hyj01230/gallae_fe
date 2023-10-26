import { useRef, useState } from "react";
import { uploadScheduleImage } from "../api";

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
    console.log(`선택된 파일 크기: ${selectImage.size} bytes`);

    const reader = new FileReader();
    reader.readAsDataURL(selectImage);
    reader.onloadend = () => {
      setPreviewImage((prev) => [...prev, reader.result]);
    };

    setUploadImage((prev) => [...prev, selectImage]);
  };

  const handleSubmitClick = async (schedulesId, file) => {
    const formData = new FormData(); // 사진 업로드는 폼데이터로!!!!!!!!!
    formData.append("file", uploadImage);
    const response = await uploadScheduleImage(schedulesId, file);
    return response;
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
