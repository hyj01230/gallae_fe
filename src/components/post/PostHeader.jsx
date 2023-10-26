import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Post_Search } from "../../assets/Icon";

export default function PostHeader() {
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-[#ffffff] p-4 flex justify-between items-center sticky top-0 z-10 overflow-y-auto">
      <div
        className="text-black text-2xl font-bold cursor-pointer"
        onClick={scrollToTop}
      >
        커뮤니티
      </div>
      <div className="flex items-center">
        <div className="ml-4 text-gray-400 cursor-pointer"></div>
        <Link to="/search?keyword=" className="ml-4 text-black cursor-pointer">
          <Post_Search />
        </Link>
      </div>
    </div>
  );
}
