export const shareKakao = (title, postId) => {
  // url이 id값에 따라 변경되기 때문에 route를 인자값으로 받아줌
  if (window.Kakao) {
    const kakao = window.Kakao;
    if (!kakao.isInitialized()) {
      kakao.init(import.meta.env.VITE_REACT_APP_JavaScript_KEY); // 카카오에서 제공받은 javascript key를 넣어줌 -> .env파일에서 호출시킴
    }

    kakao.Link.sendDefault({
      objectType: "feed", // 카카오 링크 공유 여러 type들 중 feed라는 타입 -> 자세한 건 카카오에서 확인
      content: {
        title: "[갈래] 나랑 여행 갈래?",
        description: title, // 인자값으로 받은 title
        imageUrl: "public/img/gallae.png",
        link: {
          mobileWebUrl:
            import.meta.env.VITE_REACT_APP_URL + `/api/posts/like/${postId}`, // 인자값으로 받은 route(uri 형태)
          webUrl:
            import.meta.env.VITE_REACT_APP_URL + `/api/posts/like/${postId}`,
        },
      },
      buttons: [
        {
          title: "title",
          link: {
            mobileWebUrl:
              import.meta.env.VITE_REACT_APP_URL + `/api/posts/like/${postId}`,
            webUrl:
              import.meta.env.VITE_REACT_APP_URL + `/api/posts/like/${postId}`,
          },
        },
      ],
    });
  }
};
