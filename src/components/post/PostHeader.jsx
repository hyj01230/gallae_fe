import React from "react";

export default function PostHeader() {
  return (
    <div className="bg-[#ffffff] p-4 flex justify-between items-center">
      <div className="text-black text-2xl font-bold">커뮤니티</div>
      <div className="flex items-center">
        <div className="ml-4 text-gray-400">알림</div> {/* 알림 아이콘 넣기 */}
        <div className="ml-4 text-gray-400">검색</div> {/* 검색 아이콘 넣기 */}
      </div>
    </div>
  );
}
