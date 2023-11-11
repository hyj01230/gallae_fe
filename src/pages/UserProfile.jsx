import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../api/axiosInstance";

export default function UserProfil() {
  const { nickName } = useParams();
  const [userData, setUserData] = useState({
    email: "",
    nickName: "",
    profileImg: "",
    aboutMe: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/users/profile/${encodeURIComponent(nickName)}`
        );

        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [nickName]);

  return (
    <div className="p-4">
      <img
        src={userData.profileImg}
        alt="Profile"
        className="w-48 h-48 rounded-full mx-auto mb-4"
      />
      <h2 className="text-2xl font-bold text-center mb-2">
        {userData.nickName}
      </h2>
      <p className="text-gray-600 text-center">{userData.aboutMe}</p>
    </div>
  );
}
