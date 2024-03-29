import { useState, useEffect, useRef } from "react";
import Layout from "../components/common/Layout";
import { axiosInstance } from "../api/axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";
import SearchCategory from "../components/postSearch/SearchCategory";
import { LeftArrow, SearchIcon } from "../assets/Icon";
import { formatCreatedAt } from "../util/formatDate";

function highlightKeyword(text, keyword) {
  if (keyword && text) {
    const regex = new RegExp(`(${keyword})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} style={{ color: "#ff9900", fontWeight: "bold" }}>
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

function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}

export default function PostSearchPage() {
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [inputFocused, setInputFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null); // Ref를 생성하여 입력 필드에 접근

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchKeyword = searchParams.get("keyword");

    if (searchKeyword) {
      setKeyword(searchKeyword);
      handleSearch(searchKeyword);
    }
  }, [location.search]);

  // 파라미터로 보내기
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
      if (error.response && error.response.status === 400) {
        setSearchResults([]);
      } else {
        console.error("API 요청 중 오류 발생:", error);
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (inputFocused) {
        navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
        setSearchResults([]);
        inputRef.current.blur(); // Enter 키를 누른 후 입력 필드의 포커스를 해제
      }
    }
  };

  // 키워드 선택하면 검색창으로!
  const handleCategorySelect = (selectedCategory) => {
    setKeyword(selectedCategory);
    navigate(`/search?keyword=${encodeURIComponent(selectedCategory)}`);
    inputRef.current.blur(); // 카테고리 선택 시 입력 필드의 포커스를 해제
  };

  // 입력 필드가 포커스 상태인지 여부에 따라 컨텐츠를 조건부로 렌더링
  const renderContent = inputFocused ? null : (
    <div className="mr-[10px]">
      {searchResults.length === 0 && keyword && (
        <div className="mx-auto  mt-[153px]">
          <img src={"/img/question_mark_woman.png"} className="mx-auto" />

          <div className="flex flex-col justify-center mx-auto mt-10 select-none text-[#D9D9D9]">
            <p className="text-center mb-1">
              {" "}
              <span className="font-semibold">"{keyword}"</span> 을 찾을 수
              없어요.
            </p>
            <p className="text-center	">
              상단의{" "}
              <span className="text-[#F90] font-semibold">추천 키워드</span>로
              빠르게 둘러볼까요?
            </p>
          </div>
        </div>
      )}

      <div className="w-full">
        {searchResults.map((result) => (
          <div
            key={result.postId}
            style={{ height: "96px" }}
            onClick={() => navigate(`/posts/${result.postId}`)}
          >
            <div className="mt-4 flex w-full h-[96px] mr-2">
              {/* Image 컴포넌트 추가 */}

              <div className="w-[120px] h-[96px] flex items-center justify-center">
                {result.postsPicturesList.length > 0 ? (
                  <img
                    className="w-[120px] h-[96px] rounded-md"
                    src={result.postsPicturesList[0].postsPicturesURL}
                  />
                ) : (
                  <p className="text-4 text-black font-semibold">Img</p>
                )}
              </div>
              <div className="px-4   w-full ">
                <h3 className="text-[18px] font-semibold">
                  {highlightKeyword(truncateText(result.title, 18), keyword)}
                </h3>
                <p className="text-[14px] ">
                  {highlightKeyword(truncateText(result.contents, 25), keyword)}
                </p>
                <div className="text-[12px] text-[#999] mr-3 text-right font-normal">
                  {result.nickName}
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="mb-2">
                      {result && result.tagsList ? (
                        result.tagsList.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block text-[#999] border border-solid border-gray-300 rounded-full text-[11px] px-2 py-1 mr-1 cursor-pointer"
                          >
                            {highlightKeyword(`#${tag}`, keyword)}
                          </span>
                        ))
                      ) : (
                        <p>Loading tags...</p>
                      )}
                    </div>
                  </div>
                  <div className="text-3 text-[#D9D9D9] p-2">
                    {formatCreatedAt(result.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // input창에 포커즈되면 보이는 부분
  return (
    <Layout>
      <div className="mx-4 my-5 w-full">
        <div className="flex justify-center ">
          <div className="relative flex items-center">
            <div className="cursor-pointer mr-2" onClick={() => navigate(`/`)}>
              <LeftArrow />
            </div>
            <div style={{ position: "absolute", left: "55px" }}>
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="어떤 일정을 찾으시나요 ?"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              onKeyPress={handleKeyPress}
              ref={inputRef}
              className="w-full h-[40px] px-4 rounded-full focus:border-[#ff9900] bg-[#F2F2F2] ml-2 pl-[50px]"
            />
            <button
              onClick={() => handleSearch(keyword)}
              className="bg-blue-500 text-white text-[14px] px-4 rounded-r-full ml-1"
            ></button>
          </div>
        </div>
        <SearchCategory
          onCategorySelect={handleCategorySelect}
          keyword={keyword}
        />
        {renderContent}
      </div>
    </Layout>
  );
}
