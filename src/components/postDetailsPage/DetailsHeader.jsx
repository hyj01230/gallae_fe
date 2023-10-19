import { useNavigate } from "react-router-dom";

export default function DetailsHeader() {
  const navigate = useNavigate();

  return (
    <div>
      <header className="bg-[#ffffff] p-4 flex justify-between items-center">
        <div
          className="ml-4 text-gray-400 cursor-pointer"
          onClick={() => {
            navigate(-1);
          }}
        >
          뒤로가기
        </div>
        <div className="flex items-center">
          {/* 아이콘 넣을땐 ml빼기 */}
          <div className=" text-gray-400">공유</div>
          <div className=" mr-4 text-gray-400">하트</div>
        </div>
      </header>
    </div>
  );
}
