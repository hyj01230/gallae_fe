import { useNavigate } from "react-router-dom";
import { LeftArrow } from "../../assets/Icon";

export default function DetailsHeader() {
  const navigate = useNavigate();

  return (
    <div>
      <header className="bg-[#ffffff] p-4 flex justify-between items-center sticky top-0 z-10">
        <div
          className=" text-gray-400 cursor-pointer flex items-center"
          onClick={() => {
            navigate(-1);
          }}
        >
          <LeftArrow />
          <span className="text-black text-lg font-semibold ml-2">게시글</span>
        </div>
        <div className="flex items-center"></div>
      </header>
    </div>
  );
}
