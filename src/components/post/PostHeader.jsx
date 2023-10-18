import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function PostHeader() {
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-[#ffffff] p-4 flex justify-between items-center">
      <div
        className="text-black text-2xl font-bold cursor-pointer"
        onClick={scrollToTop}
      >
        커뮤니티
      </div>
      <div className="flex items-center">
        <div className="ml-4 text-gray-400 cursor-pointer">알림</div>
        <Link
          to="/search?keyword="
          className="ml-4 text-gray-400 cursor-pointer"
        >
          검색
        </Link>
      </div>
    </div>
  );
}
