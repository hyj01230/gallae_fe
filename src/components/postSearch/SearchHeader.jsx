import { useNavigate } from "react-router-dom";

export default function SearchHeader() {
  const navigate = useNavigate();

  return (
    <header className="bg-[#ffffff] p-4 flex justify-between items-center">
      <div
        className="text-black text-2xl font-bold cursor-pointer"
        onClick={() => navigate(`/`)}
      >
        뒤로가기
      </div>
      <div className="flex items-center">
        <div className="ml-4 text-gray-400">알림</div>
        <div className="ml-4 text-gray-400">메뉴</div>
      </div>
    </header>
  );
}
