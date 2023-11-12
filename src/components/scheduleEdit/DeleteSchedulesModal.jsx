import { useMutation, useQueryClient } from "react-query";
import { deleteScheduleDetail } from "../../api";
import { useNavigate } from "react-router-dom";

export default function DeleteSchedulesModal({
  schedulesId,
  postId,
  tripDateId,
  subTitle,
  handleCloseModal,
  // deleteMutate,
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deleteScheduleMutation = useMutation(
    () => deleteScheduleDetail(schedulesId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("schedulesDetail");
        navigate("/myschedules/details", {
          state: { postId, subTitle, tripDateId },
        });
      },
    }
  );

  return (
    <div className="bg-black/50 fixed top-0 left-0 right-0 max-w-screen-md h-screen mx-auto z-50">
      <div className="absolute top-[40%] left-0 right-0 bg-white w-fit mx-auto rounded-xl grid grid-cols-1 divide-y">
        <div className="px-[30px] py-[15px]">
          <div className="text-[18px] text-[#333] font-semibold text-center">
            여행 일정 삭제하기
          </div>
          <div className="mt-[9px] text-[14px] text-center">
            <p>지금까지의 작업이 삭제됩니다</p>
            <p>해당 일정을 완전히 삭제하시겠습니까?</p>
          </div>
        </div>
        <div className="grid grid-cols-2 border-t-1 border-[#D9D9D9] divide-x">
          <button
            className="col-span-1 py-3 text-[#FF3737]"
            onClick={() => deleteScheduleMutation.mutate()}
          >
            삭제
          </button>
          <button
            className="col-span-1 py-3 text-[#3478F6]"
            onClick={handleCloseModal}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
