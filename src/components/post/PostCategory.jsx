// PostCategory.js

import { useState } from "react";

export default function PostCategory({ onCategorySelect }) {
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    onCategorySelect(category);
  };

  return (
    <div className="bg-white mx-10 mb-2">
      <div className="flex justify-between">
        <div
          className={`text-gray-500 ${
            selectedCategory === "전체"
              ? "text-black cursor-pointer"
              : "cursor-pointer"
          }`}
          onClick={() => handleCategoryClick("전체")}
        >
          전체
        </div>
        <div
          className={`text-gray-500 ${
            selectedCategory === "나홀로"
              ? "text-black cursor-pointer"
              : "cursor-pointer"
          }`}
          onClick={() => handleCategoryClick("나홀로")}
        >
          나홀로
        </div>
        <div
          className={`text-gray-500 ${
            selectedCategory === "커플"
              ? "text-black cursor-pointer"
              : "cursor-pointer"
          }`}
          onClick={() => handleCategoryClick("커플")}
        >
          커플
        </div>
        <div
          className={`text-gray-500 ${
            selectedCategory === "우정"
              ? "text-black cursor-pointer"
              : "cursor-pointer"
          }`}
          onClick={() => handleCategoryClick("우정")}
        >
          친구
        </div>
        <div
          className={`text-gray-500 ${
            selectedCategory === "가족"
              ? "text-black cursor-pointer"
              : "cursor-pointer"
          }`}
          onClick={() => handleCategoryClick("가족")}
        >
          가족
        </div>
      </div>
    </div>
  );
}
