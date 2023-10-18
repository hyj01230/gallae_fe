// import { useEffect, useState } from "react";
import Layout from "../components/common/Layout";
// import { axiosInstance } from "../api/axiosInstance";

export default function MyPageModify() {
  // // get_마이페이지 조회
  // const [myPageInfo, setMyPageInfo] = useState({});

  // const getMyPageInfo = async () => {
  //   try {
  //     const response = await axiosInstance.get("/api/users/profile");
  //     console.log("마이정보 response :", response.data);
  //     setMyPageInfo(response.data);
  //   } catch (error) {
  //     console.log("댓글 error :", error);
  //   }
  // };

  // useEffect(() => {
  //   getMyPageInfo();
  // }, []);

  return (
    <Layout>
      <div className="flex flex-row">
        <div>닉네임</div>
        <input type="text" className="border border-black" />
      </div>
      <div className="mt-4 flex flex-row">
        <div>현재 비밀번호</div>
        <input type="password" className="border border-black" />
      </div>
      <div className="mt-4 flex flex-row">
        <div>변경 비밀번호</div>
        <input type="password" className="border border-black" />
      </div>
      <div className="mt-4 flex flex-row">
        <div>변경 비밀번호 확인</div>
        <input type="password" className="border border-black" />
      </div>
      <div>
        <button className="bg-yellow-400">취소</button>
        <button className="bg-orange-400">저장</button>
      </div>
    </Layout>
  );
}
