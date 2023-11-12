export default function EmptyStateDisplay() {
  return (
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
  );
}
