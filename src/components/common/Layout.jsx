import BottomNav from "./BottomNav";

export default function Layout(prop) {
  return (
    <div className="relative overflow-auto h-screen max-w-3xl mx-auto border-2 border-black">
      {prop.children}
      {prop.isBottomNav && <BottomNav />}
    </div>
  );
}
