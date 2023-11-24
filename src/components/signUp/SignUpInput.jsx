export default function SignUpInput({
  type,
  placeholder,
  value,
  onChange,
  maxLength,
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="mt-2 border border-[#D9D9D9] rounded-lg w-full h-[43px] px-[17px] placeholder:text-sm/normal placeholder:text-[#D9D9D9] placeholder:font-light outline-none"
      maxLength={maxLength}
    />
  );
}
