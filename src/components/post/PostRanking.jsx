import React from "react";

export default function PostRanking() {
  const [expanded, setExpanded] = React.useState(false);

  //TODO : 순위, 카테고리, 타이틀, 좋아요

  const rankings = ["1", "2", "3", "4", "5", "6", "7"];

  return (
    <div className=" bg-white mto mt-4">
      <div className="h-10 mb-3 flex justify-between items-center rounded border-3">
        <div className="ml-4  text-lg font-semibold leading-4 ">
          이번주 순위
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="mr-4 px-2 py-1 bg-purple-300 text-white rounded hover:bg-yellow-400 transition duration-300"
        >
          {expanded ? "업뽀튼" : "따운뽀튼"}
        </button>
      </div>

      <div className=" mx-4 mb-7 rounded-xl p-2 border-2 border-gray-100">
        <div className="mt-4 mx-5">
          <div className="mb-7 ">{rankings[0]}</div>
          <div className="mb-7">{rankings[1]}</div>
          <div className="mb-7  overflow-y-auto">{rankings[2]}</div>

          <div
            className={`h-222 overflow-y-auto ${expanded ? "block" : "hidden"}`}
          >
            <div className="mb-7">{rankings[3]}</div>
            <div className="mb-7">{rankings[4]}</div>
            <div className="mb-7">{rankings[5]}</div>
            <div className="mb-7">{rankings[6]}</div>
            <div className="">{rankings[7]}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
