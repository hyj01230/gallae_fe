import PostListItem from "./PostListItem";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { axiosInstance } from "../../api/axiosInstance";

const PostList = ({
  filteredPostList,
  handleLikeClick,
  navigate,
  postList,
  setPostList,
}) => {
  const [page, setPage] = useState(0); // 현재 페이지 번호
  const [ref, inView] = useInView();
  const getPostList = async () => {
    try {
      console.log("getPostList 함수 호출");
      const response = await axiosInstance.get("/api/posts", {
        params: {
          page: `${page}`, // 현재 페이지 번호
          size: 5, // 원하는 페이지 크기(게시물 수)
        },
      });
      const newPosts = response.data.content;

      // newPosts를 기존 postList에 추가.
      setPostList((postList) => [...postList, ...newPosts]);

      // 응답에서 페이지 번호를 확인
      console.log("페이지 번호 (응답):", response.data.pageable.pageNumber);

      // 요청 성공 시에 페이지에 1 카운트 해주기
      // 라스트불린값이 트루면 끝 아니면 +1
      setPage((prevPage) => prevPage + 1);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPostList();
  }, []);

  useEffect(() => {
    if (inView) {
      getPostList();
    }
  }, [inView]);

  return (
    <div>
      {filteredPostList && filteredPostList.length > 0 ? (
        filteredPostList.map((item, index) => (
          <PostListItem
            key={index}
            item={item}
            postList={postList}
            handleLikeClick={handleLikeClick}
            navigate={navigate}
            setPostList={setPostList}
            ref={ref}
          />
        ))
      ) : (
        <div className="text-center p-4 bg-gray-100 border border-gray-300 rounded my-8">
          <p className="text-lg text-gray-600">게시물이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default PostList;
