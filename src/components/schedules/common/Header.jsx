export default function Header({ children }) {
  return (
    <header className="flex items-center justify-between mx-4 my-3">
      {children}
    </header>
  );
}
