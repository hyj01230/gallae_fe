import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";
import { XIcon } from "../assets/Icon";
import List from "../components/mySchedulesAccount/List";

export default function MySchedulesAccountPage() {
  const navigate = useNavigate();
  const { postId, tripDateId, subTitle, accountList } = useLocation().state;
  const totalCosts = accountList.reduce((acc, day) => {
    const dayCosts = day.schedules.reduce((dayAcc, schedule) => {
      return dayAcc + (schedule.costs || 0); // costs 속성이 없을 경우를 대비하여 0으로 기본값 설정
    }, 0);

    return acc + dayCosts;
  }, 0);

  return (
    <Layout>
      <div
        className="flex items-center gap-x-1 p-2"
        onClick={() =>
          navigate("/myschedules/details", {
            state: { postId, subTitle, tripDateId },
          })
        }
      >
        <div className="mr-2">
          <XIcon />
        </div>
        <div className="py-3 flex items-center text-xl font-bold">가계부</div>
      </div>

      <div className="pl-[14px] py-1 mx-4 mb-[23px] border border-[#F2F2F2] rounded-md	">
        {subTitle}
      </div>

      {accountList.map((value, index) => (
        <List key={index} data={value} day={index + 1} />
      ))}

      <div>
        <div
          style={{
            background:
              "linear-gradient(353deg, rgba(217, 217, 217, 0.40) 5.86%, rgba(255, 255, 255, 0.00) 84.43%)",
            height: "27px",
          }}
        ></div>
        <div className="py-6 font-semibold	text-center">
          총 {totalCosts.toLocaleString()}원 지출
        </div>
      </div>
    </Layout>
  );
}
