import React from "react";

const SearchListBox = ({ title, content }) => {
  return (
    <div className="flex p-2 mx-4">
      <div>
        <div className="w-16 h-16 bg-gray-300 mr-3 rounded-lg ">사진</div>
      </div>
      <div>
        <div className="text-4 font-bold" style={{ fontSize: "16px" }}>
          {title}
        </div>
        <div className="text-3" style={{ fontSize: "12px" }}>
          {content}
        </div>
      </div>
    </div>
  );
};

export default SearchListBox;
