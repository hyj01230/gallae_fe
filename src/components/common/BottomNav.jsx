import { useLocation, useNavigate } from "react-router-dom";
import {
  MySchedules,
  MySchedulesColor,
  Community,
  CommunityColor,
  MyPage,
  MyPageColor,
} from "../../assets/Icon";

export default function BottomNav() {
  // 현재 페이지 URL 확인
  const location = useLocation();
  const currentPath = location.pathname;
  // console.log("현재 페이지 URL:", currentPath);

  console.log(
    (currentPath.includes("posts") ||
      currentPath.includes("post") ||
      currentPath.pathname === "/") &&
      currentPath !== "/mypage/post"
  );

  // 페이지 이동
  const navigate = useNavigate(); // navigate 할당
  const onClickMySchedules = () => {
    if (!localStorage.getItem("accessToken")) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
    } else {
      navigate("/myschedules");
    } // 일정
  };
  const onClickPosts = () => {
    navigate("/"); // 커뮤니티
  };
  const onClickMypage = () => {
    if (!localStorage.getItem("accessToken")) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
    } else {
      navigate("/mypage");
    } // 마이페이지
  };
  console.log(currentPath);
  return (
    // 하단 네브바(Layout 안에서 사용!)
    <div className="fixed bottom-0 max-w-3xl w-full h-[84px] bg-[#F2F2F2] flex justify-center">
      <div className="h-10 w-full mx-10 mt-[11.6px] flex">
        <div
          onClick={onClickMySchedules}
          className="w-10 h-10 flex flex-col justify-center items-center cursor-pointer"
        >
          {currentPath.includes("myschedules") ||
          currentPath === "/myschedules" ||
          currentPath === "/search" ? (
            <MySchedulesColor />
          ) : (
            <MySchedules />
          )}
          <div
            className={`${
              currentPath.includes("myschedules") ||
              currentPath === "/myschedules" ||
              currentPath === "/search"
                ? "text-[#FF9900]"
                : "text-[#888888]"
            } mt-[5px] text-center text-[9px] font-extrabold leading-[9px]`}
          >
            일정
          </div>
        </div>

        <div
          onClick={onClickPosts}
          className="mx-auto w-10 h-10 flex flex-col justify-center items-center cursor-pointer"
        >
          {currentPath === "/" &&
          !currentPath.includes("posts") &&
          !currentPath.includes("post") ? (
            <CommunityColor />
          ) : (
            <Community />
          )}
          <div
            className={`${
              currentPath === "/" &&
              !currentPath.includes("posts") &&
              !currentPath.includes("post")
                ? "text-[#FF9900] "
                : "text-[#888888] "
            }mt-[5px] text-center text-[9px] font-extrabold leading-[9px]`}
          >
            커뮤니티
          </div>
        </div>

        <div
          onClick={onClickMypage}
          className="w-[45px] h-10 flex flex-col justify-center items-center cursor-pointer"
        >
          {currentPath.includes("mypage") ? <MyPageColor /> : <MyPage />}
          <div
            className={`${
              currentPath.includes("mypage")
                ? "text-[#FF9900]"
                : "text-[#888888]"
            } mt-[5px] text-center text-[9px] font-extrabold leading-[9px]`}
          >
            마이페이지
          </div>
        </div>
      </div>
    </div>
  );
}
