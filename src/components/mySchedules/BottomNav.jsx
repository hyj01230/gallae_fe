import { Document, Person, SpeechBubble } from "../../assets/Icon";

export default function BottomNav() {
  return (
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
  );
}
