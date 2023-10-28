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

  // useState
  const [nickName, setNickName] = useState(""); // 닉네임
  const [checkNickName, setCheckNickName] = useState(""); // 닉네임 중복확인(true = 사용가능 / false = 중복 / 재확인 = 중복체크 미완료)
  const [email, setEmail] = useState(""); // 이메일
  const [emailCord, setEmailCord] = useState(""); // 인증번호
  const [emailCordInput, setEmailCordInput] = useState(false); // 인증번호 input 열기
  const [emailAuthCompleted, setEmailAuthCompleted] = useState(false); // 이메일 인증여부 확인
  const [password, setPassword] = useState(""); // 비밀번호
  const [checkPassword, setCheckPassword] = useState(""); // 비밀번호 확인
  const [signUpBar, setSignUpBar] = useState(false); // 회원가입바

  // onChange
  const onChangeNickNameHandler = (e) => {
    setNickName(e.target.value);
    setCheckNickName("재확인"); // 닉네임 input창 값이 바뀌면, checkNickName이 "재확인"으로! => 중복체크 재시도 필요!
    // 닉네임
  };
  const onChangeEmailHandler = (e) => {
    setEmail(e.target.value);
    setEmailAuthCompleted(false); // 이메일주소 변경되면, 인증 다시 받기
    // 이메일
  };
  const onChangeEmailCordHandler = (e) => {
    setEmailCord(e.target.value);
    setEmailAuthCompleted(false); // 인증번호 변경되면, 인증 다시 받기
    // 인증번호
  };
  const onChangePasswordHandler = (e) => {
    setPassword(e.target.value);
    // 비밀번호
  };
  const onChangeCheckPasswordHandler = (e) => {
    setCheckPassword(e.target.value);
    // 비밀번호 확인
  };

  // 유효성 & 메시지 : 닉네임
  const [nickNameMessage, setNickNameMessage] = useState("");
  useEffect(() => {
    if (nickName.length === 1) {
      setNickNameMessage("닉네임은 2자 이상 입력해야합니다.");
    } else if (!/^[A-Za-z0-9가-힣]*$/.test(nickName)) {
      setNickNameMessage("한글(단어), 영어, 숫자만 입력 가능합니다");
    } else {
      setNickNameMessage(true);
    }
  }, [nickName]);

  // 유효성 & 메시지 : 이메일
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

  // 유효성 & 메시지 : 비밀번호
  const [passwordMessage, setPasswordMessage] = useState("");
  useEffect(() => {
    if (password.length === 0) {
      setPasswordMessage("");
    } else if (password.length < 8) {
      setPasswordMessage("비밀번호는 8글자 이상이어야 합니다.");
    } else if (!/^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password)) {
      setPasswordMessage("영어 소문자, 숫자, 특수문자를 모두 포함해야 합니다.");
    } else {
      setPasswordMessage(true);
    }
  }, [password, checkPassword]);

  // 유효성 & 메시지 : 비밀번호 확인
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

  // POST : 닉네임 중복확인
  const onClickCheckNickNameHandler = async () => {
    if (nickNameMessage !== true) {
      alert("닉네임을 올바르게 입력해주세요.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/api/users/signup/check-nickname",
        {
          nickName,
        }
      );
      console.log("response", response);
      setCheckNickName(true); // 사용가능 닉네임은 checkNickName이 true로 => 가능 메시지 나옴!
    } catch (error) {
      console.log("error", error);
      setCheckNickName(false); // 사용가능 닉네임은 checkNickName이 false로 => 중복 메시지 나옴!
    }
  };

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

  // POST : 이메일 인증번호 확인
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

  // 회원가입 Bar 색상변경
  useEffect(() => {
    if (
      nickName !== "" && // 닉네임 input에 값이 있음
      checkNickName === true && // 닉네임 중복확인이 true = 사용가능 닉네임
      email !== "" && // 이메일 input에 겂이 있음
      emailMessage === true && // 이메일 유효성 문제없음
      emailAuthCompleted === true && // 이메일 인증 완료
      password !== "" && // 비밃번호 input에 겂이 있음
      passwordMessage === true && // 비밀번호 유효성 문제없음
      checkPassword !== "" && // 비밀번호 확인 input에 겂이 있음
      checkPassWordMessage === true // 비밀번호 확인 유효성 문제없음
    ) {
      setSignUpBar(true);
    } else {
      setSignUpBar(false);
    }
  }, [
    nickName,
    checkNickName,
    email,
    emailMessage,
    emailAuthCompleted,
    password,
    passwordMessage,
    checkPassword,
    checkPassWordMessage,
  ]);

  // POST : 회원가입 하기
  const onClickSignUpCompleteHandler = async () => {
    // 에러메시지 있는지 확인
    if (
      checkNickName === false || // 닉네임 중복확인이 false = 중복된 닉네임!
      emailMessage !== true ||
      passwordMessage !== true ||
      checkPassWordMessage !== true
    ) {
      alert("필수 정보를 올바르게 입력하세요.");
      return;
      // 닉네임값이 바뀌면 중복체크 재시도 필요!
    } else if (checkNickName === "재확인") {
      alert("닉네임 중복체크가 필요합니다.");
      return;
    } else if (emailAuthCompleted !== true) {
      alert("이메일 인증이 필요합니다.");
      return;
    }

    try {
      // console.log({ nickName }, { email }, { password });
      const response = await axiosInstance.post("/api/users/signup", {
        nickName: nickName || null, //닉네임이 비어있으면 null로 보내기
        email,
        password,
        profileImg: null,
      });
      console.log("response", response);

      if (response.data.statusCode === 201) {
        alert(response.data.msg);
        navigate("/signup/complete", { state: { nickName } }); // 웰컴페이지로 닉네임 보내기!
      }
    } catch (error) {
      console.log("error", error);
      alert(error.response.data.msg);
    }
  };

  return (
    <Layout>
      <div className="mx-4">
        <div className="flex items-center mt-4">
          <div onClick={onClickLeftArrowHandler} className="cursor-pointer">
            <LeftArrow />
          </div>
          <div className="mx-auto text-xl/normal font-medium">회원가입</div>
          {/* 우측도 <LeftArrow />만큼 들어가게! */}
          <div className="w-8"></div>
        </div>

        <div className="mt-10 flex flex-col">
          <div className="flex justify-between">
            <div className="text-sm/normal font-medium">닉네임</div>
            <div
              onClick={onClickCheckNickNameHandler}
              className="text-[#999999] underline cursor-pointer text-sm/normal font-medium"
            >
              중복체크
            </div>
          </div>
          <input
            type="text"
            placeholder="닉네임을 입력해주세요. (2~10자)"
            maxLength={10}
            value={nickName}
            onChange={onChangeNickNameHandler}
            className="mt-2 border border-[#D9D9D9] rounded-lg w-full h-[43px] px-[17px] placeholder:text-sm/normal placeholder:text-[#D9D9D9] placeholder:font-light outline-none"
          />

          {/* 닉네임 유효성 메시지 */}
          {nickNameMessage !== true && nickNameMessage && (
            <div className="mt-2 text-[#FF3737] text-sm/normal font-normal">
              {nickNameMessage}
            </div>
          )}

          {/* 닉네임 중복 확인 - 가능 */}
          {/* 닉네임 유효성 메시지가 없을 때(=== true) 그리고, checkNickName에 true일 때만 표시됨! */}
          {nickNameMessage === true && checkNickName === true && (
            <div className="mt-2 text-[#888888] text-sm/normal font-normal">
              사용 가능한 닉네임입니다.
            </div>
          )}

          {/* 닉네임 중복 확인 - 불가능 */}
          {/* 닉네임 유효성 메시지가 없을 때(=== true) 그리고, checkNickName에 false일 때만 표시됨! */}
          {nickNameMessage === true && checkNickName === false && (
            <div className="mt-2 text-[#FF3737] text-sm/normal font-normal">
              중복된 닉네임입니다.
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col">
          <div className="flex justify-between">
            <div className="text-sm/normal font-medium">이메일 주소</div>
            <div
              onClick={onClickEmailAuthHandler}
              className="text-[#999999] underline cursor-pointer text-sm/normal font-medium"
            >
              인증하기
            </div>
          </div>
          <input
            type="text"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={onChangeEmailHandler}
            className="mt-2 border border-[#D9D9D9] rounded-lg w-full h-[43px] px-[17px] placeholder:text-sm/normal placeholder:text-[#D9D9D9] placeholder:font-light outline-none"
          />

          {/* 이메일 유효성 메시지 */}
          {emailMessage !== true && emailMessage && (
            <div className="mt-2 text-[#FF3737] text-sm/normal font-normal">
              {emailMessage}
            </div>
          )}

          {/* 이메일 인증번호 Input창 */}
          {emailCordInput && (
            <div className="mt-6 flex flex-col">
              <div className="text-sm/normal font-medium">이메일 인증번호</div>
              <div className="flex flex-row justify-center items-center">
                <input
                  type="text"
                  // 숫자만 입력 가능하게!
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                  }}
                  placeholder="123456"
                  maxLength={6}
                  value={emailCord}
                  onChange={onChangeEmailCordHandler}
                  className="mt-2 appearance-none border border-[#D9D9D9] rounded-lg w-full h-[43px] px-[17px] placeholder:text-sm/normal placeholder:text-[#D9D9D9] placeholder:font-light outline-none"
                />
                <div>
                  <div
                    onClick={onClickEmailCordPostHandler}
                    className={`${
                      emailCord.length < 6 ? "bg-[#D9D9D9]" : "bg-[#FF9900]"
                    } mt-2 ml-1 rounded-lg w-20 h-[43px] flex items-center justify-center text-[#FFFFFF] cursor-pointer text-base/normal font-medium `}
                  >
                    확인
                  </div>
                </div>
              </div>
              <div className="mt-2 text-[#888888] text-sm/normal font-normal">
                메일에서 복사한 인증번호를 입력해주세요.
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col">
          <div className="text-sm/normal font-medium">비밀번호</div>
          <input
            type="password"
            placeholder="문자, 숫자, 특수문자(!@#$%^&*) 포함 8~15자"
            maxLength={15}
            value={password}
            onChange={onChangePasswordHandler}
            className="mt-2 border border-[#D9D9D9] rounded-lg w-full h-[43px] px-[17px] placeholder:text-sm/normal placeholder:text-[#D9D9D9] placeholder:font-light outline-none"
          />

          {/* 비밀번호 유효성 메시지 */}
          {passwordMessage !== true && passwordMessage && (
            <div className="mt-2 text-[#FF3737] text-sm/normal font-normal">
              {passwordMessage}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col">
          <div className="text-sm/normal font-medium">비밀번호 확인</div>
          <input
            type="password"
            placeholder="비밀번호 재입력"
            maxLength={15}
            value={checkPassword}
            onChange={onChangeCheckPasswordHandler}
            className="mt-2 border border-[#D9D9D9] rounded-lg w-full h-[43px] px-[17px] placeholder:text-sm/normal placeholder:text-[#D9D9D9] placeholder:font-light outline-none"
          />

          {/* 비밀번호 확인 유효성 메시지 */}
          {checkPassWordMessage !== true && checkPassWordMessage && (
            <div className="mt-2 text-[#FF3737] text-sm/normal font-normal">
              {checkPassWordMessage}
            </div>
          )}
        </div>

        <div className="mt-[27px] flex flex-col">
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
        className={`${
          signUpBar ? "bg-[#FF9900]" : "bg-[#D9D9D9]"
        } z-20 fixed bottom-0 max-w-3xl w-full h-16 text-[#FFFFFF] text-xl/normal font-medium flex items-center justify-center cursor-pointer`}
        onClick={onClickSignUpCompleteHandler}
      >
        회원가입 완료
      </div>
    </Layout>
  );
}
