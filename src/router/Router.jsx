import { createBrowserRouter } from "react-router-dom";
import Page from "../pages";

export const router = createBrowserRouter([
  { path: "/", element: <Page.MySchedulesPage /> },
  { path: "/posts", element: <Page.PostListPage /> },
  { path: "/search", element: <Page.PostSearchPage /> },
  { path: "/signup", element: <Page.SignUpPage /> },
  { path: "/signup/admin", element: <Page.SignUpAdminPage /> },
  { path: "/signup/complete", element: <Page.SignUpCompletePage /> },
  { path: "/login", element: <Page.LoginPage /> },
  { path: "/kakao/callback", element: <Page.LoginPageKakao /> },
  {
    path: "/posts/:postId",
    element: <Page.PostDetailsPage />,
  },
  { path: "/post/create", element: <Page.PostCreatePage /> },
  { path: "/post/edit", element: <Page.PostEditPage /> },
  { path: "/myschedules/account", element: <Page.MySchedulesAccountPage /> },
  { path: "/myschedules/create/info", element: <Page.SchedulesInfoPage /> },
  { path: "/myschedules/create/date", element: <Page.SchedulesDatePage /> },
  {
    path: "/myschedules/create/schedule",
    element: <Page.SchedulesCreatePage />,
  },
  {
    path: "/myschedules/edit/schedule",
    element: <Page.SchedulesEditPage />,
  },
  { path: "/myschedules/edit/date", element: <Page.SchedulesEditDatePage /> },
  { path: "/myschedules/edit/info", element: <Page.SchedulesEditInfoPage /> },
  { path: "/myschedules/details", element: <Page.SchedulesDetailPage /> },
  { path: "/mypage", element: <Page.MyPage /> },
  { path: "/mypage/modify", element: <Page.MyPageModify /> },
  { path: "/mypage/modify/nickname", element: <Page.MyPageNickName /> },
  { path: "/mypage/modify/password", element: <Page.MyPagePassWord /> },
  { path: "/mypage/modify/signout", element: <Page.MyPageSignOut /> },
  { path: "/mypage/like", element: <Page.MyPageLikeList /> },
  { path: "/mypage/comment", element: <Page.MyPageCommentList /> },
  { path: "/mypage/post", element: <Page.MyPagePostList /> },
  { path: "/user/profile", element: <Page.UserProfile /> },
]);
