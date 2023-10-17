import { useState } from "react";

export default function PostCategory() {
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

  const [showCategories, setShowCategories] = useState(false);

  const toggleCategories = () => {
    setShowCategories(!showCategories);
  };

  return (
    <div>
      <div className="flex justify-center items-center">
        <div className="flex justify-end">
          {showCategories ? (
            <div onClick={toggleCategories} className=" mb-3 h-8 ">
              카테고리 △
            </div>
          ) : (
            <div onClick={toggleCategories} className=" mb-3 h-8 ">
              카테고리 ▽
            </div>
          )}
        </div>
      </div>
      {showCategories && (
        <div>
          <div className="flex flex-wrap justify-center items-center mb-5">
            {categories.map((category, index) => (
              <div
                key={index}
                className="border rounded-[20px] px-4 py-2 flex justify-center items-center space-x-1 mr-4 mb-2"
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
