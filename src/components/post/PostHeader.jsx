import { Link } from "react-router-dom";
import { PostSearch } from "../../assets/Icon";

export default function PostHeader() {
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-[#ffffff] gap-x-1 mx-4 flex justify-between items-center ">
      <div
        className="text-black text-[20px] py-3 font-bold cursor-pointer"
        onClick={scrollToTop}
      >
        커뮤니티
      </div>
      <div className="flex items-center">
        <div className="ml-4 text-gray-400 cursor-pointer"></div>
        <Link to="/search?keyword=" className="ml-4 text-black cursor-pointer">
          <PostSearch />
        </Link>
      </div>
    </div>
  );
}
