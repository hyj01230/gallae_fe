export default function Image({ url }) {
  return (
    <div className="flex items-center justify-center h-[300px] bg-gray-100">
      {url.length > 0 ? (
        <img src={url[0].postsPicturesURL} className="w-full h-[300px]" />
      ) : (
        <p className="text-4 text-black font-semibold">첨부 대표 이미지</p>
      )}
    </div>
  );
}
