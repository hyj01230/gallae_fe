import { useNavigate } from "react-router-dom";
import { LeftArrow } from "../../assets/Icon";

export default function DetailsHeader() {
  const navigate = useNavigate();

  return (
    <div>
      <header className=" p-4  sticky top-0  z-50 flex items-center justify-between text-sm text-gray-500 h-[50px] border-b-2  border-gray-100  overflow-auto max-w-3xl mx-auto bottom-0 w-full">
        <div
          className=" text-gray-400 cursor-pointer flex items-center"
          onClick={() => {
            navigate("/");
          }}
        >
          <LeftArrow />
          <span className="text-black text-[20px] py-3 font-bold cursor-pointer ml-2">
            게시글
          </span>
        </div>
        <div className="flex items-center"></div>
      </header>
    </div>
  );
}
