import PostListItem from "./PostListItem";

const PostList = ({
  filteredPostList,
  handleLikeClick,
  navigate,
  postList,
  setPostList,
}) => {
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
