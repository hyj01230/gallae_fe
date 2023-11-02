export const shareKakao = (title, postId) => {
  // url이 id값에 따라 변경되기 때문에 route를 인자값으로 받아줌
  if (window.Kakao) {
    const kakao = window.Kakao;
    if (!kakao.isInitialized()) {
      kakao.init(import.meta.env.VITE_REACT_APP_JavaScript_KEY); // 카카오에서 제공받은 javascript key를 넣어줌 -> .env파일에서 호출시킴
    }

    kakao.Share.sendCustom({
      templateId: 100240,
      templateArgs: {
        title: "[갈래] 나랑 여행 갈래?",
        description: title,
      },
      link: {
        mobileWebUrl: `https://gallae-fe.vercel.app/posts/${postId}`,
        webUrl: `https://gallae-fe.vercel.app/posts/${postId}`,
      },
    });
  }
};
