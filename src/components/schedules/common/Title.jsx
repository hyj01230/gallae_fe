const TYPE = {
  header: "flex items-center text-[20px] font-bold text-[#333] select-none",
  question: "mb-4 text-[#333] font-semibold select-none",
};

export default function Title({ children, type }) {
  return <div className={`${TYPE[type]}`}>{children}</div>;
}
