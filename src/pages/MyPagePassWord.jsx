import { useEffect, useState } from "react";
import Layout from "../components/common/Layout";
import { axiosInstance } from "../api/axiosInstance";
import {
  Community,
  FillMypage,
  LeftArrow,
  WhiteDocument,
} from "../assets/Icon";
import { useNavigate } from "react-router-dom";

export default function MyPagePassWord() {
  // 페이지 이동
  const navigate = useNavigate();
  const onClickLeftArrowHandler = () => {
    navigate("/mypage/modify");
  };

  // useState : 현재비번, 변경비번, 변경비번확인
  const [currentPassword, setCurrentPassword] = useState("");
  const [updatePassword, setUpdatePassword] = useState("");
  const [checkUpdatePassword, setCheckUpdatePassword] = useState("");

  // OnChange : 현재비번, 변경비번, 변경비번확인
  const onChangeCurrentPasswordHandler = (e) => {
    setCurrentPassword(e.target.value);
  };
  const onChangeUpdatePasswordHandler = (e) => {
    setUpdatePassword(e.target.value);
  };
  const onChangeCheckUpdatePasswordHandler = (e) => {
    setCheckUpdatePassword(e.target.value);
  };

  // 유효성&안내메시지 : 변경비번
  const [updatePasswordMessage, setPasswordMessage] = useState("");
  useEffect(() => {
    if (updatePassword.length === 0) {
      setPasswordMessage("");
    } else if (updatePassword.length < 8) {
      setPasswordMessage("비밀번호는 8글자 이상이어야 합니다.");
    } else if (!/^[a-zA-Z0-9!@#$%^&*]*$/.test(updatePassword)) {
      setPasswordMessage(
        "대/소문자, 숫자, 특수문자(!@#$%^&*)만 사용 가능합니다."
      );
      // } else if (!/^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(updatePassword)) {
      //   setPasswordMessage("영어 소문자, 숫자, 특수문자를 모두 포함해야 합니다.");
    } else if (currentPassword === updatePassword) {
      setPasswordMessage("현재 비밀번호와 같습니다.");
    } else {
      setPasswordMessage(true);
    }
  }, [currentPassword, updatePassword]);

  // 유효성&안내메시지 : 변경비번확인
  const [checkUpdatePassWordMessage, setCheckPassWordMessage] = useState("");
  useEffect(() => {
    if (checkUpdatePassword.length === 0) {
      setCheckPassWordMessage("");
    } else if (updatePassword !== checkUpdatePassword) {
      setCheckPassWordMessage("비밀번호가 일치하지 않습니다.");
    } else if (updatePassword === checkUpdatePassword) {
      setCheckPassWordMessage(true);
    }
  }, [updatePassword, checkUpdatePassword]);

  // PUT : 비번 변경
  const onClickModifyHandler = async () => {
    // 에러메시지 있는지 확인
    if (updatePasswordMessage !== true || checkUpdatePassWordMessage !== true) {
      alert("필수 정보를 올바르게 입력하세요.");
      return;
    }

    try {
      const response = await axiosInstance.put(
        "/api/users/profile/update-password",
        {
          currentPassword: currentPassword,
          updatePassword: checkUpdatePassword,
        }
      );
      console.log("수정 response :", response.data);

      if (response.data.statusCode === 200) {
        alert(response.data.msg);
        setCurrentPassword("");
        setUpdatePassword("");
        setCheckUpdatePassword("");
      }
    } catch (error) {
      console.log("error :", error);
      alert(error.response.data.msg);
    }
  };

  return (
    <Layout>
      <div className="mx-4">
        <div className="flex items-center mt-16">
          <div onClick={onClickLeftArrowHandler} className="cursor-pointer">
            <LeftArrow />
          </div>
          <div className="ml-4 text-xl/normal font-semibold">비밀번호 변경</div>
        </div>

        <div className="mt-4 flex flex-col">
          <div>비밀번호 변경</div>
          <div>8~15자(대/소문자, 숫자, 특수문자(!@#$%^&*)만 사용 가능)</div>
        </div>
        <div className="mt-4 flex flex-row">
          <div>현재 비밀번호</div>
          <input
            type="password"
            maxLength={15}
            value={currentPassword}
            onChange={onChangeCurrentPasswordHandler}
            className="border border-black"
          />
        </div>
        <div className="mt-4 flex flex-row">
          <div>변경 비밀번호</div>
          <input
            type="password"
            maxLength={15}
            value={updatePassword}
            onChange={onChangeUpdatePasswordHandler}
            className="border border-black"
          />
          {updatePasswordMessage !== true && updatePasswordMessage && (
            <div className="my-2 text-red-600">{updatePasswordMessage}</div>
          )}
        </div>
        <div className="mt-4 flex flex-row">
          <div>변경 비밀번호 확인</div>
          <input
            type="password"
            maxLength={15}
            value={checkUpdatePassword}
            onChange={onChangeCheckUpdatePasswordHandler}
            className="border border-black"
          />
          {checkUpdatePassWordMessage !== true &&
            checkUpdatePassWordMessage && (
              <div className="my-2 text-red-600">
                {checkUpdatePassWordMessage}
              </div>
            )}
        </div>
        <div>
          <button onClick={onClickModifyHandler} className="bg-orange-400">
            저장
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 max-w-3xl w-full h-[84px] bg-[#F2F2F2] flex justify-center">
        <div className="h-10 w-full mx-10 mt-[11.6px] flex">
          <div className="w-10 h-10 flex flex-col justify-center items-center">
            <WhiteDocument />
            <div className="mt-[5px] text-center text-[9px] text-[#888888] font-extrabold leading-[9px]">
              일정
            </div>
          </div>
          <div className="mx-auto w-10 h-10 flex flex-col justify-center items-center">
            <Community />
            <div className="mt-[5px] text-center text-[9px] text-[#888888] font-extrabold leading-[9px]">
              커뮤니티
            </div>
          </div>
          <div className="w-[45px] h-10 flex flex-col justify-center items-center">
            <FillMypage />
            <div className="mt-[5px] text-center text-[9px] text-[#888888] font-extrabold leading-[9px]">
              마이페이지
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
