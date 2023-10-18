// PostRanking.js
import React, { useState } from "react";
import { Link } from "react-router-dom";

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
          className="mr-4 px-2 py-1 bg-white border-2 text-[#a8a1a1] rounded-lg hover-bg-yellow-400 transition duration-300"
        >
          {expanded ? "업" : "따"}
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
              <div className="mb-4 mr-4 text-4 font-bold">{index + 1}</div>
              <div className="mb-4 mr-4 text-[14px] ">{post.postCategory}</div>
              <div className="mb-4 mr-4 text-4 ">{post.title}</div>
              <div
                className="mb-4 mr-4 text-3 ml-auto"
                style={{ color: "#666666" }}
              >
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
                <div className="mb-4 mr-4 text-4 font-bold">{index + 4}</div>
                <div className="mb-4 mr-4 text-[14px] ">
                  {post.postCategory}
                </div>
                <div className="mb-4 mr-4 text-4 ">{post.title}</div>
                <div
                  className="mb-4 mr-4 text-3 ml-auto"
                  style={{ color: "#666666" }}
                >
                  {post.likeNum}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
