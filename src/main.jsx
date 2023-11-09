import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/Router";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "react-query";
import { CookiesProvider } from "react-cookie";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <RecoilRoot>
      <CookiesProvider>
        <ToastContainer
          position="top-center" // 알림 위치
          autoClose={2000} // 닫히는 시간(2초)
          hideProgressBar={false} //시간막대(false=표시)
          newestOnTop={false} // 새 알림 위치(false=기존 알림 아래에 표시)
          closeOnClick // 클릭해서 닫기(true=클릭시 닫힘)
          rtl={false} // 텍스트 방향(Right-To-Left, false=왼→오)
          pauseOnFocusLoss // 창포커스(true=다른창으로 이동하면 알림 멈춤)
          draggable // 드래그 이동(true=드래그하면 알림 이동가능)
          pauseOnHover // 마우스호버(true=마우스 올리면 알림 멈춤)
          theme="light" // 테마
          style={{
            width: "300px",
            textAlign: "center",
          }}
        />
        <RouterProvider router={router} />
      </CookiesProvider>
    </RecoilRoot>
  </QueryClientProvider>
);
