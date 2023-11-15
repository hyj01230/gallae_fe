export default function UploadLimitMessage() {
  return (
    <div className="  flex items-center justify-center relative width-[90%] py-3 rounded-xl mt-4 bg-[#eee] mx-auto text-[#999] ">
      <div
        className="absolute block width-[0px] top-[-20%] left-[75%] border border-solid border-[#eee] z-[1]"
        style={{
          content: "",
          borderWidth: "0 15px 15px",
          borderColor: "#eee transparent",
        }}
      >
        <div className="hidden"></div>
      </div>
      사진 업로드는 개당 10MB 내외로 업로드 가능합니다.
    </div>
  );
}
