import { useLocation } from "react-router-dom";

export default function Search() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedTag = searchParams.get("tag");

  return (
    <div>
      <input type="text">
        {" "}
        <p>검색 결과: {selectedTag}</p>
      </input>
    </div>
  );
}
