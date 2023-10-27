// PostCategory.js

import { useState } from "react";

export default function PostCategory({ onCategorySelect }) {
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    onCategorySelect(category);
  };

  // 스타일을 업데이트하여 선택된 카테고리에 밑줄을 추가합니다.
  const getCategoryStyle = (category) => {
    return {
      cursor: "pointer",
      color: selectedCategory === category ? "#F90" : "gray",
      borderBottom:
        selectedCategory === category ? "2px solid #FF9900" : "none",
    };
  };

  return (
    <div className="bg-white mx-10 mb-2 sticky top-0 z-10 overflow-x-auto">
      <div className="flex justify-between">
        <div className="whitespace-nowrap overflow-x-auto">
          <div
            style={getCategoryStyle("전체")}
            onClick={() => handleCategoryClick("전체")}
            className="inline-block px-4 py-2 mr-4 cursor-pointer text-gray-600 border-b-2 border-transparent hover:border-orange-400 focus:border-orange-400"
          >
            전체
          </div>
          <div
            style={getCategoryStyle("가족")}
            onClick={() => handleCategoryClick("가족")}
            className="inline-block px-4 py-2 mr-4 cursor-pointer text-gray-600 border-b-2 border-transparent hover:border-orange-400 focus:border-orange-400"
          >
            가족
          </div>
          <div
            style={getCategoryStyle("친구")}
            onClick={() => handleCategoryClick("친구")}
            className="inline-block px-4 py-2 mr-4 cursor-pointer text-gray-600 border-b-2 border-transparent hover:border-orange-400 focus:border-orange-400"
          >
            친구
          </div>
          <div
            style={getCategoryStyle("연인")}
            onClick={() => handleCategoryClick("연인")}
            className="inline-block px-4 py-2 mr-4 cursor-pointer text-gray-600 border-b-2 border-transparent hover:border-orange-400 focus:border-orange-400"
          >
            연인
          </div>
          <div
            style={getCategoryStyle("혼자")}
            onClick={() => handleCategoryClick("혼자")}
            className="inline-block px-4 py-2 mr-4 cursor-pointer text-gray-600 border-b-2 border-transparent hover:border-orange-400 focus:border-orange-400"
          >
            혼자
          </div>
          <div
            style={getCategoryStyle("반려동물")}
            onClick={() => handleCategoryClick("반려동물")}
            className="inline-block px-4 py-2 mr-4 cursor-pointer text-gray-600 border-b-2 border-transparent hover:border-orange-400 focus:border-orange-400"
          >
            반려동물
          </div>
          <div
            style={getCategoryStyle("지인")}
            onClick={() => handleCategoryClick("지인")}
            className="inline-block px-4 py-2 mr-4 cursor-pointer text-gray-600 border-b-2 border-transparent hover:border-orange-400 focus:border-orange-400"
          >
            지인
          </div>
        </div>
      </div>
    </div>
  );
}
