import { useNavigate } from "react-router-dom";
import { Hamburger, Plus } from "../../assets/Icon";
import { useState } from "react";
import { useQuery } from "react-query";
import { getMySchedules } from "../../api";
import Layout from "../../components/common/Layout";
import useModal from "../../hooks/useModal";
import { Header, Button, Title } from "../../components/schedules/common";
import {
  EmptyStateDisplay,
  List,
  ListModal,
} from "../../components/mySchedules";

export default function MySchedulesPage() {
  const modal = useModal();
  const navigate = useNavigate();
  const [selectList, setSelectList] = useState(null);

  // 여행 일정 관련 모달 열기
  const handleOpenModalClick = (e, data) => {
    e.stopPropagation();
    setSelectList(data);
    modal.handleOpenModal();
  };

  // 여행 일정 리스트 클릭 시 일정 조회 페이지로 이동
  const onNavigateClick = (event, schedule) => {
    event.preventDefault();
    navigate("/myschedules/details", {
      state: {
        postId: schedule.postId,
        subTitle: schedule.subTitle,
        tripDateId: schedule.tripDateIdList[0],
      },
    });
  };

  // 여행 일정 데이터 불러오기
  const { data, isLoading } = useQuery("mySchedule", getMySchedules, {
    retry: false,
  });

  if (isLoading) {
    return <div>로딩중</div>;
  }

  return (
    <Layout isBottomNav={true}>
      <Header>
        <Title type={"header"}>나의 일정</Title>
        <Button
          type={"navigate"}
          onClick={() => navigate("/myschedules/create/info")}
        >
          <Plus />
        </Button>
      </Header>

      {data && data.length >= 1 ? (
        <div className="mb-[100px]">
          {data.map((schedule) => (
            <List
              key={schedule.postId}
              schedule={schedule}
              onNavigateClick={(e) => onNavigateClick(e, schedule)}
              onOpenModalClick={(e) => handleOpenModalClick(e, schedule)}
            />
          ))}
        </div>
      ) : (
        <EmptyStateDisplay />
      )}

      {modal.isModal && (
        <ListModal
          scheduleData={selectList}
          onCloseModalClick={modal.handleCloseModal}
        />
      )}
    </Layout>
  );
}
