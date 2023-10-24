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
  const [checkNickName, setCheckNickName] = useState(false); // 닉네임 중복확인
  const [email, setEmail] = useState(""); // 이메일
  const [emailCord, setEmailCord] = useState(""); // 인증코드
  const [emailCordInput, setEmailCordInput] = useState(false); // 인증코드 input
  const [password, setPassword] = useState(""); // 비밀번호
  const [checkPassword, setCheckPassword] = useState(""); // 비밀번호 확인
  const [emailAuthCompleted, setEmailAuthCompleted] = useState(false); // 이메일 인증여부 확인

  // onChange
  const onChangeNickNameHandler = (e) => {
    setNickName(e.target.value);
    setCheckNickName(false);
    // 닉네임
  };
  const onChangeEmailHandler = (e) => {
    setEmail(e.target.value);
    // 이메일
  };
  const onChangeEmailCordHandler = (e) => {
    setEmailCord(e.target.value);
    // 인증코드
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
      setCheckNickName(true);
    } catch (error) {
      console.log("error", error);
      alert(error.response.data.msg); // 중복된 닉네임입니다.
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
        <div className="flex items-center mt-16">
          <div onClick={onClickLeftArrowHandler} className="cursor-pointer">
            <LeftArrow />
          </div>
          <div className="ml-[113px] text-xl/normal font-medium">회원가입</div>
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
            className="mt-2 border border-[#D9D9D9] rounded-lg w-full h-[43px] px-[17px] placeholder:text-sm/normal placeholder:text-[#D9D9D9] placeholder:font-light"
          />

          {/* 닉네임 유효성 메시지 */}
          {nickNameMessage !== true && nickNameMessage && (
            <div className="mt-2 text-[#FF9900] text-sm/normal font-normal">
              {nickNameMessage}
            </div>
          )}

          {/* 닉네임 중복 확인 */}
          {/* 닉네임 유효성 메시지가 없을 때(=== true) 그리고, checkNickName에 값이 있을 때 나옴! */}
          {nickNameMessage === true && checkNickName && (
            <div className="mt-2 text-[#FF9900] text-sm/normal font-normal">
              {checkNickName}
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
            className="mt-2 border border-[#D9D9D9] rounded-lg w-full h-[43px] px-[17px] placeholder:text-sm/normal placeholder:text-[#D9D9D9] placeholder:font-light"
          />

          {/* 이메일 유효성 메시지 */}
          {emailMessage !== true && emailMessage && (
            <div className="mt-2 text-[#FF9900] text-sm/normal font-normal">
              {emailMessage}
            </div>
          )}

          {/* 이메일 인증코드 Input창 */}
          {emailCordInput && (
            <div className="mt-6 flex flex-col">
              <div className="text-sm/normal font-medium">이메일 인증번호</div>
              <div className="flex flex-row justify-center items-center">
                <input
                  type="text"
                  placeholder="123456"
                  value={emailCord}
                  onChange={onChangeEmailCordHandler}
                  className="mt-2 border border-[#D9D9D9] rounded-lg w-full h-[43px] px-[17px] placeholder:text-sm/normal placeholder:text-[#D9D9D9] placeholder:font-light"
                />
                <div>
                  <div
                    onClick={onClickEmailCordPostHandler}
                    className="mt-2 ml-1 rounded-lg w-20 h-[43px] flex items-center justify-center bg-[#FF9900] text-[#FFFFFF] cursor-pointer text-base/normal font-medium "
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
            className="mt-2 border border-[#D9D9D9] rounded-lg w-full h-[43px] px-[17px] placeholder:text-sm/normal placeholder:text-[#D9D9D9] placeholder:font-light"
          />

          {/* 비밀번호 유효성 메시지 */}
          {passwordMessage !== true && passwordMessage && (
            <div className="mt-2 text-[#FF9900] text-sm/normal font-normal">
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
            className="mt-2 border border-[#D9D9D9] rounded-lg w-full h-[43px] px-[17px] placeholder:text-sm/normal placeholder:text-[#D9D9D9] placeholder:font-light"
          />

          {/* 비밀번호 확인  유효성 메시지 */}
          {checkPassWordMessage !== true && checkPassWordMessage && (
            <div className="mt-2 text-[#FF9900] text-sm/normal font-normal">
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
        className="bg-[#D9D9D9] z-20 fixed bottom-0 max-w-3xl w-full h-16 text-[#FFFFFF] text-xl/normal font-medium flex items-center justify-center cursor-pointer"
        onClick={onClickSignUpCompleteHandler}
      >
        회원가입 완료
      </div>
    </Layout>
  );
}
