import { useEffect, useState } from "react";
import Layout from "../components/common/Layout";
import { LeftArrow } from "../assets/Icon";
import { useNavigate } from "react-router-dom";
import { putPasswordAPI } from "../api";

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
      setPasswordMessage("• 비밀번호는 8글자 이상이어야 합니다.");
    } else if (!/^[a-zA-Z0-9!@#$%^&*]*$/.test(updatePassword)) {
      setPasswordMessage(
        "• 대/소문자, 숫자, 특수문자(!@#$%^&*)만 사용 가능합니다."
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
      setCheckPassWordMessage("• 비밀번호가 일치하지 않습니다.");
    } else if (updatePassword === checkUpdatePassword) {
      setCheckPassWordMessage(true);
    }
  }, [updatePassword, checkUpdatePassword]);

  // PUT : 비밀번호 변경
  const onClickModifyNickNameHandler = async () => {
    // 에러메시지 있는지 확인
    if (updatePasswordMessage !== true || checkUpdatePassWordMessage !== true) {
      alert("필수 정보를 올바르게 입력하세요.");
      return;
    }

    try {
      const response = await putPasswordAPI({
        currentPassword: currentPassword,
        updatePassword: checkUpdatePassword,
      });

      if (response.data.statusCode === 200) {
        alert(response.data.msg);
        setCurrentPassword("");
        setUpdatePassword("");
        setCheckUpdatePassword("");
      }
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  return (
    <Layout isBottomNav={true}>
      <div className="mx-4 mb-24">
        <div className="flex items-center mt-3">
          <div onClick={onClickLeftArrowHandler} className="cursor-pointer">
            <LeftArrow />
          </div>
          <div className="ml-4 text-xl/normal font-semibold text-[#333333]">
            비밀번호 변경
          </div>
          <div
            onClick={onClickModifyNickNameHandler}
            className={`${
              currentPassword && updatePassword && checkUpdatePassword
                ? "text-[#FF9900]"
                : "text-[#D9D9D9]"
            } ml-auto  text-xl/8 font-medium cursor-pointer`}
          >
            변경
          </div>
        </div>

        <input
          type="password"
          placeholder="현재 비밀번호"
          maxLength={15}
          value={currentPassword}
          onChange={onChangeCurrentPasswordHandler}
          className="mt-[30px] pb-3 w-full outline-none flex items-center border-b border-b-[#D9D9D9] placeholder:text-lg/5 placeholder:font-medium"
        />

        <input
          type="password"
          placeholder="새 비밀번호"
          maxLength={15}
          value={updatePassword}
          onChange={onChangeUpdatePasswordHandler}
          className="mt-5 pb-3 w-full outline-none flex items-center border-b border-b-[#D9D9D9] placeholder:text-lg/5 placeholder:font-medium"
        />

        {updatePasswordMessage !== true && updatePasswordMessage && (
          <div className="mt-1 text-[#FF3737] text-xs/5 font-medium">
            {updatePasswordMessage}
          </div>
        )}

        <input
          type="password"
          placeholder="새 비밀번호 확인"
          maxLength={15}
          value={checkUpdatePassword}
          onChange={onChangeCheckUpdatePasswordHandler}
          className="mt-5 pb-3 w-full outline-none flex items-center border-b border-b-[#D9D9D9] placeholder:text-lg/5 placeholder:font-medium"
        />

        {checkUpdatePassWordMessage !== true && checkUpdatePassWordMessage && (
          <div className="mt-1 text-[#FF3737] text-xs/5 font-medium">
            {checkUpdatePassWordMessage}
          </div>
        )}

        <div className="mt-5 text-[#FF9900] text-xs/5 font-medium flex">
          <div className="mr-1">•</div>
          <div>영문, 숫자, 특수문자(!@#$%^&*) 포함 8자~15자를 입력해주세요</div>
        </div>

        <div className="mt-1 text-[#999999] text-xs/5 font-medium flex">
          <div className="mr-1">•</div>
          <div>
            개인정보(연락처,생일)와 관련된 숫자 등 다른 사람이 알아낼 수 있는
            비밀번호를 사용하지 마세요.
          </div>
        </div>
      </div>
    </Layout>
  );
}
