import Layout from "../components/common/Layout";
import { GearIcon, PlusCircle, Heart, MyWriting } from "../assets/Icon";
import { useNavigate } from "react-router-dom";

export default function MyPage() {
  const navigate = useNavigate();

  const onClickLogOutHandler = () => {
    navigate("/");
  };

  return (
    <Layout>
      <div className="absolute w-full h-full">
        <div className="mx-4">
          <div className="mt-[60px] flex flex-row justify-end items-center">
            <div
              className="text-[#333333] mr-[7px] cursor-pointer text-sm/normal font-medium"
              onClick={onClickLogOutHandler}
            >
              로그아웃
            </div>
            <GearIcon />
          </div>

          <div
            // onClick={onClickProfileHandler}
            className="bg-[#EBEBEB] mt-7 w-24 h-24 rounded-full mx-auto flex items-center justify-center cursor-pointer"
          >
            <PlusCircle />
          </div>

          <div className="flex justify-center mt-3 text-xl/normal font-semibold">
            릴리
          </div>

          <div className="mt-5 w-full h-[94px] rounded-xl border border-[#F2F2F2]">
            <div className="mt-4 ml-4">
              <div className="text-[14px] text-[#D9D9D9] font-medium leading-5">
                아직 작성된 소개가 없어요.
              </div>
              <div className="text-[14px] text-[#D9D9D9] font-medium leading-5">
                길게 눌러 자기소개를 입력해주세요.
              </div>
            </div>
          </div>

          <div>
            <div className="mt-10 font-semibold">나의 여행계획</div>
            <div className="mt-5 flex flex-row items-center cursor-pointer">
              <Heart />
              <div className="ml-3 font-medium text-base/normal">
                좋아요 목록
              </div>
            </div>
            <div className="mt-4 flex flex-row items-center cursor-pointer">
              <MyWriting />
              <div className="ml-3 font-medium text-base/normal">
                나의 글 쓴 내역
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 w-full h-16 bg-[#D9D9D9] text-white flex items-center justify-center cursor-pointer">
        하단 네브바
      </div>

      {/* <div className="absolute opacity-50 bg-[#666666]  w-full h-full items-center">
        <div className="absolute w-full flex flex-col bottom-[21px]">
          <div className="mx-4 bg-[#F2F2F2] text-center h-[45px] flex items-center justify-center rounded-t-xl text-[#333333] text-[14px] leading-[100%] font-semibold">
            프로필 사진 설정
          </div>
          <div className="mx-4 bg-[#F2F2F2] border-[#666666] border-t-[0.5px] border-b-[0.5px] text-center h-14 flex items-center justify-center text-[#333333] text-[18px] leading-[100%] font-semibold">
            앨범에서 사진 선택
          </div>
          <div className="mx-4 bg-[#F2F2F2] text-center h-14 flex items-center justify-center rounded-b-xl text-[#333333] text-[18px] leading-[100%] font-semibold">
            기본으로 설정
          </div>
          <div className="mt-3 mx-4 bg-[#F2F2F2] rounded-xl h-[58px] flex items-center justify-center text-[#333333] text-[18px] leading-[100%] font-semibold">
            취소
          </div>
        </div>
      </div> */}
    </Layout>
  );
}
