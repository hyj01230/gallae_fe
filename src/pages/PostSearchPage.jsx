import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/common/Layout";
import SearchHeader from "../components/postSearch/SearchHeader";
import SearchListBox from "../components/postSearch/SearchListBox";
import SearchCategory from "../components/postSearch/SearchCategory";

export default function PostSearch() {
  const [postSearch, setPostSearch] = useState([
    {
      title: "",
      tagsList: [],
      nickName: "",
      likeNum: "",
      viewNum: "",
      createdAt: "",
      modifiedAt: "",

      // 다른 속성들 초기값 설정
    },
  ]);

  const getPostSearch = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/search?keyword=${keyword}`
      );

      console.log(response);
      setPostSearch(response.data.data);
    } catch (error) {
      console.error("데이터 가져오기 오류:", error);
    }
  };

  useEffect(() => {
    getPostSearch();
  }, []);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword"); // keyword 변수로 수정

  const [tagInput, setTagInput] = useState(""); // setTagInput 수정

  useEffect(() => {
    setTagInput(keyword); // setTagInput 수정
  }, [keyword]);

  const handleTagInputChange = (event) => {
    setTagInput(event.target.value);
  };

  return (
    <Layout>
      <SearchHeader />
      <div className="flex flex-col items-center mt-8">
        <div className="mb-2 flex items-center">
          <p className="mr-3">검색:</p>
          <input
            type="text"
            value={tagInput || ""}
            onChange={handleTagInputChange}
            placeholder="어떤 일정을 찾으시나요?"
            className="border border-black rounded p-2"
          />
        </div>
        <SearchCategory />
        {/* <div className="mt-2">
          <p>검색 결과: {selectedTag}</p>
        </div> */}
        {postSearch.map((item, index) => (
          <SearchListBox
            key={index}
            title={item.title}
            content={item.content}
          />
        ))}
        <div className="rounded-[20px] border border-[#D9D9D9] text-[14px] px-8 py-2 font-normal cursor-pointer mt-8">
          검색결과 더보기
        </div>
      </div>
    </Layout>
  );
}
