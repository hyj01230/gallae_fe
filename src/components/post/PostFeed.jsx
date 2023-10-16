import PostLine from "./PostLine";

PostLine;

export default function PostFeed() {
  //TODO : 사진 제목 카테고리 태그 내용 (일정) 댓글 좋아요
  const feedData = [
    {
      postId: "1",
      postCategory: "나홀로",
      title: "달팽이랑 제주도로!",
      contents:
        "🐌...잠시....만요....🐌...지나가겠...🐌.......읍니다....🐌..정말...🐌죄송.......합니..🐌.....다....🐌...지나......가겠..🐌...읍니다...🐌....면목...🐌..........없읍이다...🐌......뚜뚜.....🐌..............🐌......빵빵......🐌......잠시..🐌......만요.........🐌... ...🐌...잠시....만요....🐌...지나가겠...🐌.......읍니다....🐌..정말...🐌죄송.......합니..🐌.....다....🐌...지나......가겠..🐌...읍니다...🐌.... ...🐌...잠시....만요....🐌...지나가겠...🐌.......읍니다....🐌..정말...🐌죄송.......합니..🐌.....다....🐌...지나......가겠..🐌..🐌...잠시....만요....🐌...지나가겠...🐌.......읍니다....🐌..정말...🐌죄송.......합니..🐌.....다....🐌...지나......가겠..🐌...읍니다...🐌....면목...🐌..........없읍이다...🐌......뚜뚜.....🐌..............🐌......빵빵......🐌🐌...잠시....만요....🐌...지나가겠...🐌.......읍니다....🐌..정말...🐌죄송.......합니..🐌.....다....🐌...지나......가겠..🐌...읍니다...🐌....면목...🐌..........없읍이다...🐌......뚜뚜.....🐌..............🐌......빵빵......🐌......잠시..🐌......만요",
      tagList: ["힐링", "추억", "레저"],
      nickName: "허원",
      likeNum: "4",
      viewNum: "3",
      commentNum: "5",
      createdAt: "8분전",
    },
    {
      postId: "2",
      postCategory: "친구",
      title: "ENFP들의 여행",
      contents:
        "👤👥👥👤👥웅성웅성..👤👥 👤👥👤👥👤👥👤👥👥👤👥 👤👥👤👥👥👤👥👤👥👤👥 👥👤👥👤뭐야..👥👥👤👥",
      tagList: ["스포츠", "레저"],
      nickName: "허투",
      likeNum: "2",
      viewNum: "5",
      commentNum: "1",
      createdAt: "1분전",
    },
    {
      postId: "3",
      postCategory: "커플",
      title: "초호화 여행 가보자",
      contents:
        "끆ㄱ끄얶흒끕..끆껑껑..끆끆흡끅..흡꾺꾺꾹ㄱ끄엉..헝헝헝ㅇ..흡끄륵ㄱ끅끅ㄱ끄엉엉..흡끄윽..끄헝헝..흐우앙흡끅끆ㄱ끄얶흒끕..끆껑껑..끆끆흡끅..흡끄윽..끄헝 끆ㄱ끄얶흒끕..끆껑껑..끆끆흡끅..흡꾺꾺꾹ㄱ끄엉..헝헝헝ㅇ..흡끄륵ㄱ끅끅ㄱ끄엉엉..흡끄윽..끄헝헝..흐우앙흡끅끆ㄱ끄얶흒끕..끆껑껑..끆끆흡끅..흡끄윽..끄헝",
      tagList: ["프리미엄"],
      nickName: "허쓰리",
      likeNum: "8",
      viewNum: "1",
      commentNum: "8",
      createdAt: "2분전",
    },
    {
      postId: "4",
      postCategory: "가족",
      title: "효도.. 여행으로 대신한다!",
      contents:
        "얼ᕕ( ᐛ )ᕗ렁ᕕ( ᐛ )ᕗ뚱ᕕ( ᐛ )ᕗ땅ᕕ( ᐛ )ᕗ 얼ᕕ( ᐛ )ᕗ렁ᕕ( ᐛ )ᕗ뚱ᕕ( ᐛ )ᕗ땅ᕕ( ᐛ )ᕗ 얼ᕕ( ᐛ )ᕗ렁ᕕ( ᐛ )ᕗ뚱ᕕ( ᐛ )ᕗ땅ᕕ( ᐛ )ᕗ 얼ᕕ( ᐛ )ᕗ렁ᕕ( ᐛ )ᕗ뚱ᕕ( ᐛ )ᕗ땅ᕕ( ᐛ )ᕗ 얼ᕕ( ᐛ )ᕗ렁ᕕ( ᐛ )ᕗ뚱ᕕ( ᐛ )ᕗ땅ᕕ( ᐛ )ᕗ 얼ᕕ( ᐛ )ᕗ렁ᕕ( ᐛ )ᕗ뚱ᕕ( ᐛ )ᕗ땅ᕕ( ᐛ )ᕗ",
      tagList: ["힐링", "자연경관", "명소", "프리미엄"],
      nickName: "허포",
      likeNum: "10",
      viewNum: "9",
      commentNum: "1",
      createdAt: "1시간전",
    },
    // 다른 피드 아이템들 추가
  ];
  return (
    <div>
      {feedData.map((item, index) => (
        <div
          key={index}
          className="w-393 h-275 bg-white flex flex-col relative"
        >
          <div className="flex items-center justify-between mb-2 mt-5">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full ml-4  cursor-pointer"></div>
              <div className="flex flex-col ml-[13px]">
                <p className="text-[18px] font-semibold  cursor-pointer">
                  {item.title}
                </p>
                <p className="text-xs text-gray-500 mt-1 cursor-pointer">
                  {item.postCategory}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mr-4">
              {item.createdAt}
              <p className="w-2 h-2 ml-[11px] mr-[15px] bg-gray-400 rounded-full inline-block"></p>
            </p>
          </div>
          <p className="text-3 mt-4 mx-5  cursor-pointer">
            {item.contents.length > 100
              ? item.contents.slice(0, 100) + "..."
              : item.contents}
          </p>
          <div className="flex items-center text-xs text-gray-500 mb-6 mt-6 ml-4">
            <div>
              <p className="ml-1">좋아요 {item.likeNum} · </p>
            </div>
            <div>
              <p className="ml-1">댓글 {item.commentNum} · </p>
            </div>
            <div>
              <p className="ml-1">조회수 {item.viewNum}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500 h-[40px] bordertop-solid border-t-2">
            <div className="flex items-center space-x-2 flex-1 justify-center ">
              <div className=" cursor-pointer w-4 h-4 bg-gray-400 rounded-full"></div>
              <p className="cursor-pointer">좋아요</p>
            </div>

            <div className="border border-gray-500 "></div>
            <div className="flex items-center space-x-2 flex-1 justify-center">
              <div className="w-4 h-4 bg-gray-400 rounded-full cursor-pointer"></div>
              <p className="cursor-pointer">댓글달기</p>
            </div>
          </div>
          <PostLine />
        </div>
      ))}
    </div>
  );
}
