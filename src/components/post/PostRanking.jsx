import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  DropDown,
  DropUp,
  Like_Heart,
  Like_Small_Heart,
} from "../../assets/Icon";

export default function PostRanking({ postList }) {
  const [expanded, setExpanded] = useState(false);

  const sortedPostList = [...postList].sort((a, b) => b.likeNum - a.likeNum);
  const topRankedPosts = sortedPostList.slice(0, 3);

  return (
    <div className="bg-white mt-4">
      <div className="h-10 mb-3 flex justify-between items-center rounded border-3">
        <div className="ml-4 text-lg font-semibold leading-4">이번주 순위</div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="mr-6 px-2 py-2 bg-white text-[#a8a1a1] rounded-lg hover-bg-yellow-400 transition duration-300"
        >
          {expanded ? <DropDown /> : <DropUp />}
        </button>
      </div>
      <div className="mx-4 mb-7 rounded-[10px] p-2 border-2 border-gray-100">
        <div className="mt-4 ml-5">
          {topRankedPosts.map((post, index) => (
            <Link
              to={`/posts/${post.postId}`}
              key={post.postId}
              className="mb-4 mr-4 flex items-center h-[44px]"
            >
              <div
                className="mb-4 mr-3 text-4 font-bold"
                style={{ width: "30px", color: "#FF9900" }}
              >
                {index + 1}
              </div>
              <div
                className="mb-4 mr-3 text-[14px]  font-medium w-[50px]"
                style={{ width: "130px", color: "#999" }}
              >
                {post.postCategory}
              </div>
              <div
                className="mb-4 mr-4 text-4 font-medium"
                style={{ width: "400px" }}
              >
                {post.title.length > 11
                  ? `${post.title.slice(0, 11)}...`
                  : post.title}
              </div>
              <div
                className="mb-4 mr-2 text-3 ml-2"
                style={{ color: "#666666" }}
              >
                <Like_Small_Heart />
              </div>
              <div className="mb-4 mr-4 text-3 " style={{ color: "#666666" }}>
                {post.likeNum}
              </div>
            </Link>
          ))}
          <div
            className={`h-222 overflow-y-auto ${expanded ? "block" : "hidden"}`}
          >
            {sortedPostList.slice(3).map((post, index) => (
              <Link
                to={`/posts/${post.postId}`}
                key={post.postId}
                className="mb-4 mr-4 flex items-center h-[44px]"
              >
                <div
                  className="mb-4 mr-4 text-4 font-bold"
                  style={{ width: "30px" }}
                >
                  {index + 4}
                </div>
                <div
                  className="mb-4 mr-4 text-[14px]"
                  style={{ width: "100px" }}
                >
                  {post.postCategory}
                </div>
                <div className="mb-4 mr-4 text-4" style={{ width: "150px" }}>
                  {post.title.length > 10
                    ? `${post.title.slice(0, 10)}...`
                    : post.title}
                </div>
                <div
                  className="mb-4 mr-2 text-3 ml-2"
                  style={{ color: "#666666" }}
                >
                  <Like_Heart />
                </div>
                <div className="mb-4 mr-4 text-3">{post.likeNum}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
