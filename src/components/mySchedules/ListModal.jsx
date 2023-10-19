import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { deletePost } from "../../api";

export default function ListModal({ scheduleData, handleClick }) {
  const navigate = useNavigate("");
  const queryClient = useQueryClient();

  const handleScheduleClick = () => {
    // 일정 더보기 클릭
    // 더보기를 클릭하면 postId 전송
    navigate("/myschedules/details", { state: scheduleData.postId });
  };

  // 일정 삭제
  const deletePostMutation = useMutation(
    () => deletePost(scheduleData.postId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("mySchedule");
        handleClick();
      },
    }
  );

  const handleShareClick = () => {
    // 커뮤니티 공유
    // 글쓰기 페이지 이동
    navigate("/post/create", { state: scheduleData.postId });
  };

  const handleShareKakaoClick = () => {
    // 카카오톡 공유
  };

  const handleEditClick = () => {
    // 이름 및 태그 수정하기
  };

  const handleEditDateClick = () => {
    // 날짜 수정하기
  };

  return (
    <div className="cursor-pointer">
      <div className="fixed w-full h-full top-0 left-0 bg-[#666] opacity-30"></div>
      <div className="relative bg-[#F2F2F2] mx-4 rounded-xl divide-y divide-[#666]">
        <div onClick={handleScheduleClick}>
          <button className="ml-8 my-[19px] text-lg">일정 더보기</button>
        </div>
        <div onClick={() => deletePostMutation.mutate()}>
          <button className="ml-8 my-[19px] text-lg">삭제하기</button>
        </div>
        <div onClick={handleShareClick}>
          <button className="ml-8 my-[19px] text-lg">
            커뮤니티에 공유하기
          </button>
        </div>
        <div>
          <button className="ml-8 my-[19px] text-lg">
            카카오톡으로 공유하기
          </button>
        </div>
        <div>
          <button className="ml-8 my-[19px] text-lg">
            이름 및 태그 수정하기
          </button>
        </div>
        <div>
          <button className="ml-8 my-[19px] text-lg">날짜 수정하기</button>
        </div>
      </div>

      <div
        className="relative bg-[#F2F2F2] mx-4 mt-3 mb-[22px] rounded-xl flex justify-center"
        onClick={handleClick}
      >
        <button className="my-5">취소</button>
      </div>
    </div>
  );
}
