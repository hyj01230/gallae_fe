import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";
import { LeftArrow, XIcon } from "../assets/Icon";
import List from "../components/mySchedulesAccount/List";
import { Header, Button } from "../components/schedules/common";

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
      <Header>
        <div className="flex gap-[15px]">
          <Button
            onClick={() =>
              navigate(-1, { state: { postId, subTitle, tripDateId } })
            }
          >
            <LeftArrow />
          </Button>
          <Title type={"header"}>가계부</Title>
        </div>
      </Header>

      <div className="pl-[14px] py-1 mx-4 mb-[23px] border border-[#F2F2F2] rounded-md	">
        {subTitle}
      </div>

      <div className="mb-[100px]">
        {accountList.map((value, index) => (
          <List key={index} data={value} day={index + 1} />
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-screen-md">
        <div
          style={{
            background:
              "linear-gradient(353deg, rgba(217, 217, 217, 0.40) 5.86%, rgba(255, 255, 255, 0.00) 84.43%)",
            height: "27px",
          }}
        ></div>
        <div className="py-6 font-semibold text-center bg-white">
          총 {totalCosts.toLocaleString()}원 지출
        </div>
      </div>
    </Layout>
  );
}
