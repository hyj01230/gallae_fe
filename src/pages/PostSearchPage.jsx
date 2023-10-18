import { useState, useEffect } from "react";
import Layout from "../components/common/Layout";
import { axiosInstance } from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function PostSearchPage() {
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/search?keyword=${encodeURIComponent(keyword)}`
      );
      if (Array.isArray(response.data)) {
        setSearchResults(response.data);
      } else {
        console.error("서버에서 반환된 데이터가 배열이 아닙니다.");
      }
      console.log(response);
    } catch (error) {
      console.error("API 요청 중 오류 발생:", error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch(); // Enter 키를 눌렀을 때 검색 함수 호출
    }
  };

  return (
    <Layout>
      <div className="mx-4 my-5">
        <div className="flex justify-center">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={handleKeyPress} // 엔터 키 이벤트 핸들러 추가
              className="w-[321px] h-[40px] px-4 rounded-l-full border border-gray-400"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white text-[14px] px-4  rounded-r-full ml-1"
            >
              검색
            </button>
          </div>
        </div>

        <div className="flex flex-wrap -mx-4 mt-[52px]">
          {searchResults.map((result) => (
            <div
              key={result.postId}
              className="w-full px-4 mb-4"
              onClick={() => navigate(`/posts/${result.postId}`)}
            >
              <div className="bg-white rounded-lg border-2 ">
                <div className="px-4 pt-4">
                  <h3 className="text-[18px] font-semibold mb-[9px]">
                    {result.title}
                  </h3>
                  <p className="text-[14px] mb-[9px]">{result.contents}</p>
                </div>
                <div className="pb-4 px-4 flex justify-between">
                  <p className="text-[3px]">{result.nickName}</p>
                  <p className="text-[3px]">{result.createdAt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
