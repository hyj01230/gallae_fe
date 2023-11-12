import { useState, useEffect } from "react";
import { axiosInstance } from "../../api/axiosInstance";
import Layout from "../common/Layout";

export default function UserProfileBox({ nickName }) {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/api/users/profile", {
          params: {
            nickName: nickName,
          },
        });

        setUserData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("사용자 데이터 가져오기 오류:", error);
      }
    };

    fetchUserData();
  }, [nickName]);

  return (
    <Layout>
      <div className="flex items-center mx-9 mt-9 w-full">
        <img
          src={userData.profileImg}
          alt="프로필"
          className="w-[96px] h-[96px] rounded-full mb-4 "
        />
        <div className="flex flex-col items-col  ml-9">
          <h2 className="text-2xl font-bold">{userData.nickName}</h2>
          <p className="text-[#D9D9D9] mb-9 mt-[18px]">{userData.aboutMe}</p>
        </div>
      </div>
    </Layout>
  );
}
