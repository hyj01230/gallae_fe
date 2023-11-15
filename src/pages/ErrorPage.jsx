import { useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="h-screen flex flex-col justify-center">
        <img src="img/NotFound.png" />
        <div className="flex flex-col items-center gap-2 text-[20px]">
          <p>페이지가 존재하지 않습니다.</p>
          <p>
            <span
              className="font-bold cursor-pointer"
              onClick={() => navigate(-1)}
            >
              이전 페이지
            </span>{" "}
            또는{" "}
            <span
              className="font-bold text-[#F90] cursor-pointer"
              onClick={() => navigate("/")}
            >
              갈래 홈
            </span>
            으로 이동해주시기 바랍니다.
          </p>
        </div>
      </div>
    </Layout>
  );
}
