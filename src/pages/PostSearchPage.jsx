import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/common/Layout";
import SearchHeader from "../components/postSearch/SearchHeader";

export default function PostSearch() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedTag = searchParams.get("keyword");
  console.log(searchParams);

  const [tagInput, setTagInput] = (useState < string) | (null > selectedTag);

  useEffect(() => {
    setTagInput(selectedTag);
  }, [selectedTag]);

  // 선택된 태그를 사용하여 검색 작업을 수행하고 결과를 표시
  // ...

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
            placeholder="태그를 입력하세요"
            className="border border-black rounded p-2"
          />
        </div>
        <div className="mt-2">
          <p>검색 결과 : {selectedTag}</p>
        </div>
      </div>
    </Layout>
  );
}
