const TYPE = {
  navigate: "block cursor-pointer",
};

export default function Button({ children, ...props }) {
  return (
    <button className={`${props.type ? TYPE[props.type] : ""}`} {...props}>
      {children}
    </button>
  );
}
