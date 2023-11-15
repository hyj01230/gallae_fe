import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { deletePost } from "../../api";

export default function ListModal({ scheduleData, onCloseModalClick }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 일정 삭제하기
  const deletePostMutation = useMutation(
    () => deletePost(scheduleData.postId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("mySchedule");
        onCloseModalClick();
      },
    }
  );

  // 커뮤니티 공유 (title 유무에 따라 게시글 생성 또는 수정 페이지로 이동)
  const handleShareClick = () => {
    const { title } = scheduleData;
    if (title) {
      navigate("/post/edit", { state: scheduleData });
    } else {
      navigate("/post/create", { state: scheduleData });
    }
  };

  // 이름 및 태그 수정하기
  const handleEditClick = () => {
    const { postId, title, contents, postCategory, tagsList, subTitle } =
      scheduleData;

    navigate("/myschedules/edit/info", {
      state: { postId, title, contents, postCategory, tagsList, subTitle },
    });
  };

  // 날짜 수정하기
  // const handleEditDateClick = () => {
  //   const { tripDateIdList, chosenDateList } = scheduleData;
  //   navigate("/myschedules/edit/date", {
  //     state: { tripDateIdList, chosenDateList },
  //   });
  // };

  return (
    <div className="cursor-pointer">
      <div
        className="w-full h-screen fixed top-0 left-0 bg-black/50 z-50"
        onClick={onCloseModalClick}
      ></div>

      <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-screen-md z-50">
        <div className="bg-[#F2F2F2] rounded-xl divide-y divide-[#666] mx-4 z-50">
          <div className="flex justify-center">
            <button className="my-[19px] text-sm">일정 더보기</button>
          </div>
          <div onClick={() => deletePostMutation.mutate()}>
            <button className="ml-8 my-[19px] text-lg">삭제하기</button>
          </div>
          <div onClick={handleShareClick}>
            <button className="ml-8 my-[19px] text-lg">
              {scheduleData.title ? "게시글 수정하기" : "커뮤니티에 공유하기"}
            </button>
          </div>

          <div onClick={handleEditClick}>
            <button className="ml-8 my-[19px] text-lg">
              이름 및 태그 수정하기
            </button>
          </div>
          {/* <div onClick={handleEditDateClick}>
            <button className="ml-8 my-[19px] text-lg">날짜 수정하기</button>
          </div> */}
        </div>

        <div
          className="bg-[#F2F2F2] mx-4 mt-3 mb-[22px] rounded-xl flex justify-center"
          onClick={onCloseModalClick}
        >
          <button className="my-5">취소</button>
        </div>
      </div>
    </div>
  );
}
