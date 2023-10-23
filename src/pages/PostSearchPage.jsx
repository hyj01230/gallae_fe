import { useState, useEffect } from "react";
import Layout from "../components/common/Layout";
import { axiosInstance } from "../api/axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";
import SearchHeader from "../components/postSearch/SearchHeader";
import SearchCategory from "../components/postSearch/SearchCategory";

function highlightKeyword(text, keyword) {
  if (keyword && text) {
    const regex = new RegExp(`(${keyword})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} style={{ color: "red" }}>
          {part}
        </span>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  } else {
    return text;
  }
}

function formatCreatedAt(createdAt) {
  const date = new Date(createdAt);
  const year = date.getFullYear().toString().slice(2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}.${month}.${day}`;
}

function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}

export default function PostSearchPage() {
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchKeyword = searchParams.get("keyword");

    if (searchKeyword) {
      setKeyword(searchKeyword);
      handleSearch(searchKeyword);
    }
  }, [location.search]);

  const handleSearch = async (searchKeyword) => {
    try {
      const response = await axiosInstance.get(
        `/api/search?keyword=${encodeURIComponent(searchKeyword)}`
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
      navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
    }
  };

  const handleCategorySelect = (selectedCategory) => {
    setKeyword(selectedCategory);
    navigate(`/search?keyword=${encodeURIComponent(selectedCategory)}`);
  };

  function highlightKeyword(text, keyword) {
    if (keyword && text) {
      const regex = new RegExp(`(${keyword})`, "gi");
      const parts = text.split(regex);

      return parts.map((part, index) =>
        regex.test(part) ? (
          <span key={index} style={{ color: "red" }}>
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      );
    } else {
      return text;
    }
  }

  function formatCreatedAt(createdAt) {
    const date = new Date(createdAt);
    const year = date.getFullYear().toString().slice(2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}.${month}.${day}`;
  }

  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  }

  return (
    <Layout>
      <SearchHeader />
      <div className="mx-4 my-5">
        <div className="flex justify-center">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-[321px] h-[40px] px-4 rounded-l-full border border-gray-400"
            />
            <button
              onClick={() => handleSearch(keyword)}
              className="bg-blue-500 text-white text-[14px] px-4 rounded-r-full ml-1"
            >
              검색
            </button>
          </div>
        </div>
        <SearchCategory
          onCategorySelect={handleCategorySelect}
          keyword={keyword}
        />

        <div className="flex flex-wrap -mx-4 mt-[52px]">
          {searchResults.map((result) => (
            <div
              key={result.postId}
              className="w-full px-4 mb-4 cursor-pointer"
              onClick={() => navigate(`/posts/${result.postId}`)}
            >
              <div className="bg-white rounded-lg border-2">
                <div className="px-4 pt-4">
                  <h3 className="text-[18px] font-semibold mb-[9px]">
                    {highlightKeyword(truncateText(result.title, 18), keyword)}
                  </h3>
                  <p className="text-[14px] mb-[9px]">
                    {highlightKeyword(
                      truncateText(result.contents, 25),
                      keyword
                    )}
                  </p>

                  <div className="">
                    {result && result.tagsList ? (
                      result.tagsList.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block bg-orange-100 text-gray-500 text-[10px] rounded-full px-2 py-1 mr-1 cursor-pointer mb-2"
                          onClick={() => handleTagClick(tag)}
                        >
                          {highlightKeyword(`#${tag}`, keyword)}
                        </span>
                      ))
                    ) : (
                      <p>Loading tags...</p>
                    )}
                  </div>
                </div>
                <div className="pb-4 px-4 flex justify-between">
                  <p className="text-[3px]">{result.nickName}</p>
                  <p className="text-[3px]">
                    {formatCreatedAt(result.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
