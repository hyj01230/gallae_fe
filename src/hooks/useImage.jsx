import { useRef, useState } from "react";
import { uploadScheduleImage } from "../api";

export default function useImage() {
  // 프로필 사진 : inputRef, useState
  const inputRef = useRef(null); // 사진선택 input - 앨범에서 선택 연결
  const [uploadImage, setUploadImage] = useState(null); // 업로드할 이미지를 관리

  const onClickSelectProfileHandler = () => {
    // 사진선택 input - 앨범에서 선택 연결
    inputRef.current.click();
  };

  // 프로필 사진 선택창
  const uploadImageHandler = (e) => {
    console.log("실행됨?");
    const selectImage = e.target.files[0]; // 선택된 파일 가져오기
    console.log(`선택된 파일 이름: ${selectImage.name}`);
    console.log(`선택된 파일 크기: ${selectImage.size} bytes`);
    setUploadImage(selectImage);
  };

  const handleSubmitClick = async (schedulesId, file) => {
    const formData = new FormData(); // 사진 업로드는 폼데이터로!!!!!!!!!
    formData.append("file", uploadImage);
    const response = await uploadScheduleImage(schedulesId, file);
    // putUpdateProfileHandler(); // 사진 변경 PUT 시작!
    return response;
  };

  return {
    inputRef,
    uploadImage,
    setUploadImage,
    onClickSelectProfileHandler,
    uploadImageHandler,
    handleSubmitClick,
  };
}
