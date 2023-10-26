import BottomNav from "./BottomNav";

export default function Layout(prop, { isBottomNav = true }) {
  return (
    <div className="relative overflow-auto h-screen max-w-3xl mx-auto border-2 border-black">
      {prop.children}
      {isBottomNav && <BottomNav />}
    </div>
  );
}
