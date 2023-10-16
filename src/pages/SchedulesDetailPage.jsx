import { useLocation, useNavigate } from "react-router-dom";
import {
  DownArrow,
  Hamburger,
  LeftArrow,
  Plus,
  Share,
  PlusWithCircle,
  Document,
  SpeechBubble,
  Person,
} from "../assets/Icon";
import Layout from "../components/common/Layout";
import { useState } from "react";

const date = ["01월 11일 목", "01월 12일 금", "01월 13일 토"];

export default function SchedulesDetailPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex items-center justify-between gap-x-1 p-2 border-b border-gray-300">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="mr-2">
            <LeftArrow />
          </div>
          <div className="h-14 flex items-center text-xl">나의 일정</div>
        </div>

        <div className="flex items-center gap-1">
          <Plus />
          <Share />
          <Hamburger />
        </div>
      </div>

      <div className="flex justify-between items-center h-10 mt-4 mx-4 p-4 border border-[#EBEBEB] rounded-lg">
        <div>가족과 전주 여행</div>
        <div>
          <DownArrow />
        </div>
      </div>

      <div className="w-full h-36">{/* <Map /> */}</div>

      <div className="flex justify-between mx-4 mt-4 border border-[#EBEBEB] rounded-3xl">
        {date.map((value, index) => (
          <div
            className="p-1 cursor-pointer"
            key={index}
            onClick={() =>
              navigate("/myschedules/create/schedule", { state: value })
            }
          >
            {value}
          </div>
        ))}
      </div>

      <div
        className="flex justify-center items-center gap-3 mt-4 text-[#666] cursor-pointer"
        onClick={() => navigate("/myschedules/create/schedule", { state: "" })}
      >
        <PlusWithCircle />
        일정 추가하기
      </div>

      <div className="max-w-3xl flex justify-around bg-[#F2F2F2] p-4 fixed bottom-0">
        <div className="flex flex-col justify-center items-center">
          <Document />
          <span className="font-bold	text-[#888]">일정</span>
        </div>

        <div className="flex flex-col justify-center items-center">
          <SpeechBubble />
          <span className="font-bold	text-[#888]">커뮤니티</span>
        </div>

        <div className="flex flex-col justify-center items-center">
          <Person />
          <span className="font-bold	text-[#888]">마이페이지</span>
        </div>
      </div>
    </Layout>
  );
}
