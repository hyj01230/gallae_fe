import Layout from "../common/Layout";

export default function PostWrite() {
  return (
    <Layout>
      <div className="fixed bottom-[84px] right-[430px] cursor-pointer">
        <div className="w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center shadow-lg">
          <p className="text-white">글쓰기</p>
        </div>
      </div>
    </Layout>
  );
}
