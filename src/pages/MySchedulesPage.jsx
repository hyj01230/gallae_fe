import { useNavigate } from "react-router-dom";
import { Hamburger, Plus } from "../assets/Icon";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getMySchedules } from "../api";
import Layout from "../components/common/Layout";
import List from "../components/mySchedules/List";
import ListModal from "../components/mySchedules/ListModal";
import useModal from "../hooks/useModal";

export default function MySchedulesPage() {
  const navigate = useNavigate();
  const modal = useModal();
  const [isSelect, setIsSelect] = useState(null);
  const { data, isLoading, error } = useQuery("mySchedule", getMySchedules, {
    retry: false,
    onError: (err) => {
      if (err.response.status === 500) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/posts");
        return;
      }
    },
  });

  const handleOpenModal = (data) => {
    setIsSelect(data);
    modal.handleOpenModal();
  };

  if (isLoading) {
    // Loading state
    return <div>로딩중</div>;
  }

  return (
    <Layout isBottomNav={true}>
      <div className="flex items-center justify-between gap-x-1 mx-4">
        <div className="py-3 flex items-center text-[20px] font-bold select-none">
          나의 일정
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => navigate("/myschedules/create/info")}>
            <Plus />
          </button>
          {/* <button>
            <Hamburger />
          </button> */}
        </div>
      </div>

      {data && data.length === 0 ? (
        <div className="mx-auto mt-[100px]">
          <img
            src={"/img/woman_writing_with_a_big_pencil.png"}
            className="mx-auto"
          />

          <div className="flex flex-col justify-center mx-auto mt-10 select-none">
            <p className="text-center">아직 나의 여행 갈래가 비어있어요.</p>
            <p className="text-center	font-semibold">
              <span className="text-[#F90]">상단의 +</span> 를 눌러 일정을
              생성해보세요.
            </p>
          </div>
        </div>
      ) : (
        <></>
      )}

      {data && (
        <div className="mb-[100px]">
          {data.map((schedule) => (
            <List
              key={schedule.postId}
              schedule={schedule}
              handleClick={(e) => {
                e.stopPropagation();
                handleOpenModal(schedule);
              }}
            />
          ))}
        </div>
      )}

      {modal.isModal && (
        <ListModal
          handleClick={modal.handleCloseModal}
          scheduleData={isSelect}
        />
      )}
    </Layout>
  );
}
