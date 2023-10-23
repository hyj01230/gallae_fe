function formatTime(timeString) {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  return new Date(timeString).toLocaleDateString(undefined, options);
}

export default function CommentReplies({ replies }) {
  if (!replies) {
    return null; // replies가 없는 경우 렌더링하지 않음
  }
  return (
    <div className="mt-4 border-t border-gray-300">
      {replies.map((reply) => (
        <div key={reply.repliesId} className="mt-4">
          <p className="text-gray-600 font-semibold">{reply.nickname}</p>
          <p className="text-gray-600 text-sm font-semibold">
            {formatTime(reply.createAt)}
            {reply.createAt !== reply.modifiedAt && (
              <span className="text-gray-600 text-sm font-semibold">
                (수정됨)
              </span>
            )}
          </p>
          <p className="text-lg mt-2">{reply.contents}</p>
        </div>
      ))}
    </div>
  );
}
