import { useState, useEffect } from "react";
import { DropDown, DropUp } from "../../assets/Icon";

export default function SearchCategory({ onCategorySelect, keyword }) {
  const categories = [
    "휴식",
    "프리미엄",
    "체험",
    "식도락",
    "자연경관",
    "명소",
    "스포츠",
    "오락",
    "레저",
  ];

  // "추천키워드" 섹션의 초기 상태를 키워드가 제공되는지 여부에 따라 설정합니다
  const [showCategories, setShowCategories] = useState(!keyword);

  const toggleCategories = () => {
    setShowCategories(!showCategories);
  };

  const handleCategoryClick = (category) => {
    onCategorySelect(category);
  };

  useEffect(() => {
    // 키워드가 변경될 때 상태를 업데이트합니다
    setShowCategories(!keyword);
  }, [keyword]);

  return (
    <div>
      <div className="flex justify-center items-center mt-4">
        <div className="flex justify-end">
          <div
            onClick={toggleCategories}
            className="mb-3 h-8 cursor-pointer flex items-center"
          >
            <span className="mr-2 text-[18px] font-medium">추천키워드</span>
            {showCategories ? <DropUp /> : <DropDown />}
          </div>
        </div>
      </div>
      {showCategories && (
        <div>
          <div className="flex flex-wrap justify-center items-center mb-5">
            {categories.map((category, index) => (
              <div
                key={index}
                className="border rounded-[20px] px-4 py-2 flex justify-center items-center space-x-1 mr-1 mb-2 cursor-pointer"
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </div>
            ))}
          </div>
          <div className="border-b-8 border-gray-100 mb-5"></div>
        </div>
      )}
    </div>
  );
}
