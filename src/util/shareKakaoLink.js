export const shareKakao = (title, postId) => {
  // url이 id값에 따라 변경되기 때문에 route를 인자값으로 받아줌
  if (window.Kakao) {
    const kakao = window.Kakao;
    if (!kakao.isInitialized()) {
      kakao.init(import.meta.env.VITE_REACT_APP_JavaScript_KEY); // 카카오에서 제공받은 javascript key를 넣어줌 -> .env파일에서 호출시킴
    }

    // kakao.Share.sendCustom({
    //   templateId: 100240,
    //   templateArgs: {
    //     title: "[갈래] 나랑 여행 갈래?",
    //     description: title,
    //   },
    // });

    kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "[갈래] 우리 여행 갈래?",
        description: title,
        imageUrl:
          "https://github.com/hyj01230/gallae_fe/blob/main/public/img/gallae.png?raw=true",
        link: {
          // [내 애플리케이션] > [플랫폼] 에서 등록한 사이트 도메인과 일치해야 함
          mobileWebUrl: `https://gallae-fe.vercel.app/posts/${postId}`,
          webUrl: `https://gallae-fe.vercel.app/posts/${postId}`,
        },
      },
      social: {},
      buttons: [], // 빈 배열로 설정하여 버튼을 숨깁니다.
    });
  }
};
