import { useEffect } from "react";
import { axiosInstance } from "../../api/axiosInstance";
import { nickNameState } from "../../store/atom";
import { useRecoilState } from "recoil";
import BottomNav from "./BottomNav";

export default function Layout(prop) {
  // 리코일 state에 닉네임을 변경시키기 위해 useRecoilState를 사용할 수 있다.
  const [nickName, setNickname] = useRecoilState(nickNameState);

  // useEffect를 이용해 Layout 컴포넌트가 렌더링 될 때 사용자의 닉네임을 리코일 state에 저장한다.
  useEffect(() => {
    // 로컬스토리지에 토큰이 있다면 아래의 코드가 실행된다.
    if (localStorage.getItem("accessToken")) {
      const getNickName = async () => {
        try {
          // 만약 리코일 state에 닉네임이 저장되어 있다면 서버 api를 호출하지 말고 return 한다.
          if (nickName !== "") return;
          // 서버에서 사용자의 정보를 받아와서 response에 저장한다.
          const response = await axiosInstance.get("/api/users/profile");
          // 사용자의 닉네임을 리코일 state에 저장한다.
          setNickname(response.data.nickName);
        } catch (error) {
          console.error(error);
        }
      };
      getNickName();
    }
  }, []);

  return (
    <div className="relative overflow-scroll overflow-y-auto min-h-screen max-w-3xl mx-auto ">
      {prop.children}
      {prop.isBottomNav && <BottomNav />}
    </div>
  );
}
