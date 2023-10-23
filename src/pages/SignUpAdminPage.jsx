import { useEffect, useState } from "react";
import { RightArrow, LeftArrow } from "../assets/Icon";
import Layout from "../components/common/Layout";
import CheckBox from "../components/signUp/CheckBox";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/axiosInstance";

export default function SignUpPage() {
  // 페이지 이동
  const navigate = useNavigate();
  const onClickLeftArrowHandler = () => {
    navigate("/login");
  };

  // useState : 닉네임, 이메일, 인증코드, 인증코드 input, 비번, 비번확인, 인증여부확인
  const [nickName, setNickName] = useState("");
  const [email, setEmail] = useState("");
  const [emailCord, setEmailCord] = useState("");
  const [emailCordInput, setEmailCordInput] = useState(false);
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [emailAuthCompleted, setEmailAuthCompleted] = useState(false);

  // onChange : 닉네임, 이메일, 인증코드, 비번, 비번확인
  const onChangeNickNameHandler = (e) => {
    setNickName(e.target.value);
  };
  const onChangeEmailHandler = (e) => {
    setEmail(e.target.value);
  };
  const onChangeEmailCordHandler = (e) => {
    setEmailCord(e.target.value);
  };
  const onChangePasswordHandler = (e) => {
    setPassword(e.target.value);
  };
  const onChangeCheckPasswordHandler = (e) => {
    setCheckPassword(e.target.value);
  };

  // 유효성&안내메시지 : 닉네임
  const [nickNameMessage, setNickNameMessage] = useState("");
  useEffect(() => {
    if (nickName.length === 1) {
      setNickNameMessage("닉네임은 2자 이상 입력해야합니다.");
    } else if (!/^[A-Za-z0-9가-힣]*$/.test(nickName)) {
      setNickNameMessage("영어, 숫자, 한글만 입력 가능합니다");
    } else {
      setNickNameMessage(true);
    }
  }, [nickName]);

  // 유효성&안내메시지 : 이메일
  const [emailMessage, setEmailMessage] = useState("");
  useEffect(() => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (email.length === 0) {
      setEmailMessage("");
    } else if (!emailRegex.test(email)) {
      setEmailMessage("이메일 형태를 지켜주세요");
    } else {
      setEmailMessage(true);
    }
  }, [email]);

  // 유효성&안내메시지 : 비번
  const [passwordMessage, setPasswordMessage] = useState("");
  useEffect(() => {
    if (password.length === 0) {
      setPasswordMessage("");
    } else if (password.length < 8) {
      setPasswordMessage("비밀번호는 8글자 이상이어야 합니다.");
      // } else if (!/^[a-zA-Z0-9!@#$%^&*]*$/.test(password)) {
      //   setPasswordMessage(
      //     "대/소문자, 숫자, 특수문자(!@#$%^&*)만 사용 가능합니다."
      //   );
    } else if (!/^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password)) {
      setPasswordMessage("영어 소문자, 숫자, 특수문자를 모두 포함해야 합니다.");
    } else {
      setPasswordMessage(true);
    }
  }, [password, checkPassword]);

  // 유효성&안내메시지 : 비번 확인
  const [checkPassWordMessage, setCheckPassWordMessage] = useState("");
  useEffect(() => {
    if (checkPassword.length === 0) {
      setCheckPassWordMessage("");
    } else if (password !== checkPassword) {
      setCheckPassWordMessage("비밀번호가 일치하지 않습니다.");
    } else if (password === checkPassword) {
      setCheckPassWordMessage(true);
    }
  }, [password, checkPassword]);

  // POST : 이메일 인증하기
  const onClickEmailAuthHandler = async () => {
    if (emailMessage !== true) {
      alert("이메일을 올바르게 입력해주세요.");
      return;
    }

    try {
      const response = await axiosInstance.post("/api/users/signup/email", {
        email,
      });
      console.log("response", response);

      if (response.data.statusCode === 200) {
        alert(response.data.msg);
        setEmailCordInput(true);
      }
    } catch (error) {
      console.log("error", error);
      alert(error.response.data.msg);
    }
  };

  // POST : 이메일 인증코드 확인
  const onClickEmailCordPostHandler = async () => {
    try {
      const response = await axiosInstance.post(
        "/api/users/signup/email/valid",
        {
          email,
          validNumber: emailCord,
        }
      );
      console.log("response", response);

      if (response.status === 200) {
        alert("인증완료!");
        setEmailAuthCompleted(true);
      }
    } catch (error) {
      console.log("error", error);
      alert(error.response.data.msg);
    }
  };

  // POST : 회원가입 하기
  const onClickSignUpCompleteHandler = async () => {
    // 에러메시지 있는지 확인
    if (
      emailMessage !== true ||
      passwordMessage !== true ||
      checkPassWordMessage !== true
    ) {
      alert("필수 정보를 올바르게 입력하세요.");
      return;
    } else if (emailAuthCompleted !== true) {
      alert("이메일 인증이 필요합니다.");
      return;
    }

    try {
      const response = await axiosInstance.post("/api/users/signup", {
        nickName: nickName || null, //닉네임이 비어있으면 null로 보내기
        email,
        password,
        profileImg: null,
        adminToken: import.meta.env.VITE_ADMIN_TOKEN,
      });
      console.log("response", response);

      if (response.data.statusCode === 201) {
        alert(response.data.msg);
        navigate("/signup/complete", { state: { nickName } }); // 웰컴페이지로 닉네임 보내기!
      }
    } catch (error) {
      console.log("error", error);
      console.log("VITE_ADMIN_TOKEN", import.meta.env.VITE_ADMIN_TOKEN); // 관리자 토큰 전송!
      // console.log("admin", adminToken);
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
          <div className="mx-auto text-xl/normal font-semibold">
            관리자 회원가입
          </div>
        </div>

        <div className="flex flex-col mt-10">
          <div className="flex justify-between">
            <div className="text-sm/normal font-semibold">닉네임</div>
          </div>
          <input
            type="text"
            placeholder="닉네임 입력(2~10자)"
            maxLength={10}
            value={nickName}
            onChange={onChangeNickNameHandler}
            className="mt-2 border border-[#D9D9D9] rounded-lg w-full h-[49px] px-[17px] placeholder:text-sm/normal placeholder:text-[#999999] placeholder:font-medium"
          />
          {nickNameMessage !== true && nickNameMessage && (
            <div className="my-2 text-red-600">{nickNameMessage}</div>
          )}
        </div>

        <div className="mt-5 flex flex-col">
          <div className="flex justify-between">
            <div className="text-sm/normal font-semibold">이메일 주소</div>
            <div
              onClick={onClickEmailAuthHandler}
              className="text-[#999999] underline cursor-pointer text-sm/normal font-medium"
            >
              이메일 인증
            </div>
          </div>
          <input
            type="text"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={onChangeEmailHandler}
            className="border border-[#D9D9D9] rounded-lg w-full h-[49px] mt-2 px-[17px] placeholder:text-sm/normal placeholder:text-[#999999] placeholder:font-medium"
          />
          {emailCordInput && (
            <div className="flex flex-row justify-center items-center">
              <input
                type="text"
                placeholder="이메일로 전송된 인증코드를 입력해주세요"
                value={emailCord}
                onChange={onChangeEmailCordHandler}
                className="border border-[#D9D9D9] rounded-lg w-full h-[49px] mt-2 px-[17px] placeholder:text-sm/normal placeholder:text-[#999999] placeholder:font-medium"
              />
              <div
                onClick={onClickEmailCordPostHandler}
                className="ml-3 mt-2 rounded-lg w-20 h-[49px] flex items-center justify-center bg-[#D9D9D9] text-white cursor-pointer text-sm/normal font-medium "
              >
                확인
              </div>
            </div>
          )}

          {emailMessage !== true && emailMessage && (
            <div className="my-2 text-red-600">{emailMessage}</div>
          )}
        </div>

        <div className="mt-5 flex flex-col">
          <div className="text-sm/normal font-semibold">비밀번호</div>
          <input
            type="password"
            // placeholder="8~15자(대/소문자, 숫자, 특수문자(!@#$%^&*)만 사용 가능)"
            placeholder="비밀번호 입력(문자, 숫자, 특수문자 포함 8~15자)"
            maxLength={15}
            value={password}
            onChange={onChangePasswordHandler}
            className="border border-[#D9D9D9] rounded-lg w-full h-[49px] mt-2 px-[17px] placeholder:text-sm/normal placeholder:text-[#999999] placeholder:font-medium"
          />
          {passwordMessage !== true && passwordMessage && (
            <div className="my-2 text-red-600">{passwordMessage}</div>
          )}
        </div>

        <div className="mt-5 flex flex-col">
          <div className="text-sm/normal font-semibold">비밀번호 확인</div>
          <input
            type="password"
            placeholder="비밀번호 재입력"
            maxLength={20}
            value={checkPassword}
            onChange={onChangeCheckPasswordHandler}
            className="border border-[#D9D9D9] rounded-lg w-full h-[49px] mt-2 px-[17px] placeholder:text-sm/normal placeholder:text-[#999999] placeholder:font-medium"
          />
          {checkPassWordMessage !== true && checkPassWordMessage && (
            <div className="my-2 text-red-600">{checkPassWordMessage}</div>
          )}
        </div>

        <div className="mt-5 flex flex-col">
          <div className="flex flex-row items-center">
            <CheckBox />
            <div className="ml-3 text-sm/normal font-bold ">전체 동의하기</div>
          </div>
          <div className="mt-2 ml-8 text-[#999999] text-sm/normal font-normal">
            선택정보에 대한 동의를 포함합니다.
          </div>
        </div>

        <div className="mt-4 flex mb-20">
          <div className="border border-[#D9D9D9] rounded-lg w-full pt-[21px] pr-3 pb-[23px] pl-5">
            <div className="flex flex-row items-center">
              <CheckBox />
              <div className="ml-3 text-sm/normal font-normal">
                [필수] 만 14세 이상입니다.
              </div>
            </div>

            <div className="flex flex-row items-center mt-[10px]">
              <CheckBox />
              <div className="ml-3 mr-auto text-sm/normal font-normal">
                [필수] 회원가입 및 운영약관 동의
              </div>
              <RightArrow />
            </div>

            <div className="flex flex-row items-center mt-[10px]">
              <CheckBox />
              <div className="ml-3 mr-auto text-sm/normal font-normal">
                [필수] 개인정보 수집 및 이용 동의
              </div>
              <RightArrow />
            </div>

            <div className="flex flex-row items-center mt-[10px]">
              <CheckBox />
              <div className="ml-3 mr-auto text-sm/normal font-normal">
                [필수] 위치정보 이용약관 동의
              </div>
              <RightArrow />
            </div>

            <div className="flex flex-row items-center mt-[10px]">
              <CheckBox />
              <div className="ml-3 mr-auto text-sm/normal font-normal">
                [선택] 마케팅 수신 동의
              </div>
              <RightArrow />
            </div>
          </div>
        </div>
      </div>
      <div
        className="fixed bottom-0 max-w-3xl w-full h-16 bg-[#D9D9D9] text-[#FFFFFF] text-xl/normal font-medium flex items-center justify-center cursor-pointer"
        onClick={onClickSignUpCompleteHandler}
      >
        회원가입 완료
      </div>
    </Layout>
  );
}
