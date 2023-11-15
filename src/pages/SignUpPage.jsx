import { useEffect, useState } from "react";
import { RightArrow, LeftArrow } from "../assets/Icon";
import Layout from "../components/common/Layout";
import { useNavigate } from "react-router-dom";
import {
  EmailAuthAPI,
  checkEmailCordAPI,
  checkNickNameAPI,
  signUpAPI,
} from "../api";

export default function SignUpPage() {
  // 페이지 이동
  const navigate = useNavigate();
  const onClickLeftArrowHandler = () => {
    navigate("/login");
  };

  // 로그인 후 접근하면 막기!
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      navigate("/"); // 뒤로가기
    }
  }, []);

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
      setEmailMessage("이메일 형태를 지켜주세요.");
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
    } else if (nickName === "") {
      alert("닉네임을 올바르게 입력해주세요.");
      return;
    }

    try {
      const response = await checkNickNameAPI(nickName);
      setCheckNickName(true); // 사용가능 닉네임은 checkNickName이 true로 => 가능 메시지 나옴!
    } catch (error) {
      setCheckNickName(false); // 사용가능 닉네임은 checkNickName이 false로 => 중복 메시지 나옴!
    }
  };

  // POST : 이메일 인증하기
  const onClickEmailAuthHandler = async () => {
    if (emailMessage !== true) {
      alert("이메일을 올바르게 입력해주세요.");
      return;
    } else {
      setEmailCordInput(true);
    }

    try {
      const response = await EmailAuthAPI(email);
      // alert(response.data.msg); // 인증번호 발송 완료 안내인데, 느려서 주석하고 위에 씀
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  // POST : 이메일 인증번호 확인
  const onClickEmailCordPostHandler = async () => {
    try {
      const response = await checkEmailCordAPI({
        email,
        validNumber: emailCord,
      });

      alert("인증완료!");
      setEmailAuthCompleted(true);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  // 정보동의 체크박스 관련
  const [allAgreed, setAllAgreed] = useState(false); // 전체동의
  const [agreeChecked1, setAgreeChecked1] = useState(false); // 필수동의1
  const [agreeChecked2, setAgreeChecked2] = useState(false); // 필수동의2
  const [agreeChecked3, setAgreeChecked3] = useState(false); // 필수동의3

  const onAgreeCheckedChange = (checkboxNumber, newValue) => {
    // 개별 동의 항목이 변경되었을 때의 이벤트 핸들러
    switch (checkboxNumber) {
      case 1:
        setAgreeChecked1(newValue);
        break;
      case 2:
        setAgreeChecked2(newValue);
        break;
      case 3:
        setAgreeChecked3(newValue);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // 개별 동의 항목이 변경될 때 전체 동의 상태를 업데이트
    if (agreeChecked1 && agreeChecked2 && agreeChecked3) {
      setAllAgreed(true);
    } else {
      setAllAgreed(false);
    }
  }, [agreeChecked1, agreeChecked2, agreeChecked3]);

  const onClickAllAgreeHandler = () => {
    // 전체 동의를 클릭했을 때의 이벤트 핸들러
    const newValue = !allAgreed;
    setAgreeChecked1(newValue);
    setAgreeChecked2(newValue);
    setAgreeChecked3(newValue);
    setAllAgreed(newValue);
  };

  // 정보동의 모달 관련
  const [agree1, setAgree1] = useState(false); // 모달 : 개인정보 수집 및 이용 동의
  const [agree2, setAgree2] = useState(false); // 모달 : 위치정보 수집 및 이용 동의
  const [agree3, setAgree3] = useState(false); // 모달 : 마케팅 수신 동의

  const onClickAgree1 = () => {
    setAgree1(true); // 모달 : 열기_개인정보 수집 및 이용 동의
  };
  const onClickAgree2 = () => {
    setAgree2(true); // 모달 : 열기_위치정보 수집 및 이용 동의
  };
  const onClickAgreeHandler = () => {
    setAgree1(false); // 모달 : 닫기_개인정보 수집 및 이용 동의
    setAgree2(false); // 모달 : 닫기_위치정보 수집 및 이용 동의
    setAgree3(false); // 모달 : 닫기_마케팅 수신 동의
  };

  // 회원가입 Bar 색상변경
  useEffect(() => {
    if (
      (nickName === "" || nickNameMessage === true) && // 닉네임 빈값이거나, 중복확인이 통과
      (nickName === "" || checkNickName === true) && // 닉네임 빈값이거나, 중복확인이 통과
      email !== "" && // 이메일 input에 겂이 있음
      emailMessage === true && // 이메일 유효성 문제없음
      emailAuthCompleted === true && // 이메일 인증 완료
      password !== "" && // 비밃번호 input에 겂이 있음
      passwordMessage === true && // 비밀번호 유효성 문제없음
      checkPassword !== "" && // 비밀번호 확인 input에 겂이 있음
      checkPassWordMessage === true && // 비밀번호 확인 유효성 문제없음
      agreeChecked1 === true &&
      agreeChecked2 === true &&
      agreeChecked3 === true
    ) {
      setSignUpBar(true);
    } else {
      setSignUpBar(false);
    }
  }, [
    nickName,
    nickNameMessage,
    checkNickName,
    email,
    emailMessage,
    emailAuthCompleted,
    password,
    passwordMessage,
    checkPassword,
    checkPassWordMessage,
    agreeChecked1,
    agreeChecked2,
    agreeChecked3,
  ]);

  // POST : 회원가입 하기
  const onClickSignUpCompleteHandler = async () => {
    // 에러메시지 있는지 확인
    if (
      nickNameMessage !== true || // 닉네임 중복확인이 false = 중복된 닉네임!
      emailMessage !== true ||
      passwordMessage !== true ||
      checkPassWordMessage !== true
    ) {
      alert("필수 정보를 올바르게 입력하세요.");
      return;
      // 닉네임값이 바뀌면 중복체크 재시도 필요!
    } else if (
      agreeChecked1 === false ||
      agreeChecked2 === false ||
      agreeChecked3 === false
    ) {
      alert("필수 동의를 체크해주세요.");
      return;
    } else if (nickName !== "" && checkNickName === "재확인") {
      alert("닉네임 중복체크가 필요합니다.");
      return;
    } else if (emailAuthCompleted !== true) {
      alert("이메일 인증이 필요합니다.");
      return;
    }

    try {
      const response = await signUpAPI({
        nickName: nickName || null, //닉네임이 비어있으면 null로 보내기
        email,
        password,
        profileImg: null,
      });

      if (response.data.statusCode === 201) {
        alert(response.data.msg);
        navigate("/signup/complete", { state: { nickName } }); // 웰컴페이지로 닉네임 보내기!
      }
    } catch (error) {
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
          <div className="mx-auto text-xl/normal font-medium text-[#333333]">
            회원가입
          </div>
          {/* 우측도 <LeftArrow />만큼 들어가게! */}
          <div className="w-8"></div>
        </div>

        <div className="mt-10 flex flex-col">
          <div className="flex justify-between">
            <div className="text-sm/normal font-medium text-[#333333]">
              닉네임
            </div>
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
            <div className="mt-2 text-[#FF9900] text-sm/normal font-normal">
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
            <div className="flex flex-row items-center">
              <div className="mr-1 text-sm/normal font-medium text-[#333333]">
                이메일 주소
              </div>
              <div className="text-sm/normal font-normal text-[#FF9900]">
                (필수)
              </div>
            </div>

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
              <div className="flex flex-row items-center">
                <div className="mr-1 text-sm/normal font-medium text-[#333333]">
                  이메일 인증번호
                </div>
                <div className="text-sm/normal font-normal text-[#FF9900]">
                  (필수)
                </div>
              </div>
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
          <div className="flex flex-row items-center">
            <div className="mr-1 text-sm/normal font-medium text-[#333333]">
              비밀번호
            </div>
            <div className="text-sm/normal font-normal text-[#FF9900]">
              (필수)
            </div>
          </div>
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
          <div className="flex flex-row items-center">
            <div className="mr-1 text-sm/normal font-medium text-[#333333]">
              비밀번호 확인
            </div>
            <div className="text-sm/normal font-normal text-[#FF9900]">
              (필수)
            </div>
          </div>
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
            <input
              type="checkbox"
              checked={allAgreed}
              onChange={onClickAllAgreeHandler}
              className="w-5 h-5 accent-[#FF9900] cursor-pointer"
            />
            <div className="ml-3 text-sm/normal font-bold text-[#333333]">
              전체 동의하기
            </div>
          </div>
          <div className="mt-2 ml-8 text-[#888888] text-sm/normal font-normal">
            모든 정보에 동의합니다.
          </div>
        </div>

        <div className="mt-4 flex mb-20">
          <div className="border border-[#D9D9D9] rounded-lg w-full pt-[21px] pr-3 pb-[23px] pl-5">
            <div className="flex flex-row items-center">
              <input
                type="checkbox"
                checked={agreeChecked1}
                onChange={() => onAgreeCheckedChange(1, !agreeChecked1)}
                className="w-5 h-5 accent-[#FF9900] cursor-pointer"
              />
              <div className="ml-3 text-sm/normal font-normal text-[#333333]">
                [필수] 만 14세 이상입니다.
              </div>
            </div>

            <div className="flex flex-row items-center mt-[10px]">
              <input
                type="checkbox"
                checked={agreeChecked2}
                onChange={() => onAgreeCheckedChange(2, !agreeChecked2)}
                className="w-5 h-5 accent-[#FF9900] cursor-pointer"
              />
              <div className="ml-3 mr-auto text-sm/normal font-normal text-[#333333]">
                [필수] 개인정보 수집 및 이용 동의
              </div>
              <div onClick={onClickAgree1}>
                <RightArrow />
              </div>
            </div>

            <div className="flex flex-row items-center mt-[10px]">
              <input
                type="checkbox"
                checked={agreeChecked3}
                onChange={() => onAgreeCheckedChange(3, !agreeChecked3)}
                className="w-5 h-5 accent-[#FF9900] cursor-pointer"
              />
              <div className="ml-3 mr-auto text-sm/normal font-normal text-[#333333]">
                [필수] 위치정보 수집 및 이용 동의
              </div>
              <div onClick={onClickAgree2}>
                <RightArrow />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`${
          signUpBar ? "bg-[#FF9900]" : "bg-[#D9D9D9]"
        } z-10 fixed bottom-0 max-w-3xl w-full h-16 text-[#FFFFFF] text-xl/normal font-medium flex items-center justify-center cursor-pointer`}
        onClick={onClickSignUpCompleteHandler}
      >
        회원가입 완료
      </div>

      {/* 필수동의1 : 개인정보 수집 및 이용 동의 */}
      {agree1 && (
        <div className="bg-white w-full h-full absolute top-0 left-0 z-20">
          <div className="mx-4 mt-3 flex justify-start items-center ">
            <div onClick={onClickAgreeHandler} className="cursor-pointer">
              <LeftArrow />
            </div>
            <div className="ml-[18px] text-xl/8 font-semibold text-[#333333]">
              개인정보 수집 및 이용 동의
            </div>
          </div>

          <div className="bg-white">
            <div className="mx-10">
              <div className="mt-4 text-lg/8 font-normal text-[#333333]">
                개인정보보호법에 따라 `갈래`에 회원가입 신청하시는 분께 수집하는
                개인정보의 항목, 개인정보의 수집 및 이용목적, 개인정보의 보유 및
                이용기간, 동의 거부권 및 동의 거부 시 불이익에 관한 사항을 안내
                드리오니 자세히 읽은 후 동의하여 주시기 바랍니다.
              </div>

              <div className="mt-4 text-lg/8 font-medium text-[#333333]">
                1. 수집하는 개인정보
              </div>
              <div className="mx-4 text-lg/8 font-normal text-[#333333]">
                <p>
                  `갈래`는 회원 가입 및 서비스 이용 시 아래와 같은 최소한의
                  개인정보를 수집합니다.
                </p>
                <p>• 회원가입 시 : 아이디, 비밀번호, 이메일</p>
                <p>
                  • (소셜 계정) 회원가입 시 : 카카오계정(이메일, 전화번호),
                  닉네임, 성별, 생년월일, CI(연계정보), 프로필 이미지
                </p>
                <p>• 프로필 정보 : 닉네임, 프로필 사진</p>
                <p>• 서비스 이용 내역</p>
              </div>

              <div className="mt-4 text-lg/8 font-medium text-[#333333]">
                2. 수집한 개인정보의 이용
              </div>
              <div className="mx-4 text-lg/8 font-normal text-[#333333]">
                <p>
                  `갈래`는 수집한 개인정보를 다음과 같은 목적으로 이용합니다.
                </p>
                <p>• 회원 가입 및 관리</p>
                <p>• 서비스 제공 및 개선</p>
                <p>• 고객 지원 및 연락</p>
              </div>

              <div className="mt-4 text-lg/8 font-medium text-[#333333]">
                3. 개인정보 보관기간
              </div>
              <div className="mx-4 text-lg/8 font-normal text-[#333333]">
                <p>
                  `갈래`는 수집한 개인정보를 다음과 같은 기간 동안 보관합니다.
                </p>
                <p>• 탈퇴 요청 5일 이내로 지체 없이 파기합니다.</p>
                <p>
                  • 서비스 부정 이용 기록은 부정 가입 및 이용 방지를 위하여 회원
                  탈퇴 시점으로부터 1년간 보관 후 파기합니다.
                </p>
                <p>
                  • 관계 법령에 따라 일정 기간 보존해야 하는 경우 해당 기간 보관
                  후 파기합니다.
                </p>
              </div>

              <div className="mt-4 text-lg/8 font-medium text-[#333333]">
                4. 개인정보 수집 및 이용 동의를 거부할 권리
              </div>
              <div className="mx-4 text-lg/8 font-normal text-[#333333]">
                <p className="pb-24">
                  사용자는 개인정보의 수집 및 이용 동의를 거부할 권리가
                  있습니다. 회원가입 시 수집하는 최소한의 개인정보, 즉, 필수
                  항목에 대한 수집 및 이용 동의를 거부하실 경우, 회원가입이
                  어려울 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          <div
            onClick={onClickAgreeHandler}
            className="bg-[#FF9900] z-30 fixed bottom-0 max-w-3xl w-full h-16 text-[#FFFFFF] text-xl/normal font-medium flex items-center justify-center cursor-pointer"
          >
            확인
          </div>
        </div>
      )}

      {/* 필수동의2 : 위치정보 수집 및 이용 동의 */}
      {agree2 && (
        <div className="bg-white w-full h-full absolute top-0 left-0 z-20">
          <div className="mx-4 mt-3 flex justify-start items-center ">
            <div onClick={onClickAgreeHandler} className="cursor-pointer">
              <LeftArrow />
            </div>
            <div className="ml-[18px] text-xl/8 font-semibold text-[#333333]">
              위치정보 이용약관 동의
            </div>
          </div>

          <div className="bg-white absolute h-full">
            <div className="mx-10">
              <div className="mt-4 text-lg/8 font-medium text-[#333333]">
                1. 위치정보 수집 및 이용 목적
              </div>
              <div className="mx-4 text-lg/8 font-normal text-[#333333]">
                <p>
                  `갈래`의 서비스 향상과 사용자 경험을 개선하기 위한 것으로,
                  사용자에게 더 나은 여행 정보와 편의성을 제공하기 위한
                  것입니다.
                </p>
                <p>• 여행 관련 서비스 제공 및 향상에 활용</p>
                <p>• 위치 관련 검색 및 정보 제공</p>
              </div>

              <div className="mt-4 text-lg/8 font-medium text-[#333333]">
                2. 위치정보 수집 및 이용 동의를 거부할 권리
              </div>
              <div className="mx-4 text-lg/8 font-normal text-[#333333]">
                <p className="pb-24">
                  사용자는 위치 정보 수집을 거부할 수 있지만, 일부 기능 사용에
                  영향을 줄 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          <div
            onClick={onClickAgreeHandler}
            className="bg-[#FF9900] z-30 fixed bottom-0 max-w-3xl w-full h-16 text-[#FFFFFF] text-xl/normal font-medium flex items-center justify-center cursor-pointer"
          >
            확인
          </div>
        </div>
      )}

      {/* 필수동의3 : 위치정보 수집 및 이용 동의 */}
      {agree3 && (
        <div className="bg-white w-full h-full absolute top-0 left-0 z-20">
          <div className="mx-4 mt-3 flex justify-start items-center ">
            <div onClick={onClickAgreeHandler} className="cursor-pointer">
              <LeftArrow />
            </div>
            <div className="ml-[18px] text-xl/8 font-semibold text-[#333333]">
              마케팅 수신 동의
            </div>
          </div>

          <div className="bg-white absolute h-full">
            <div className="mx-10">
              <div className="mt-4 text-lg/8 font-normal text-[#333333]">
                `갈래`는 사용자에게 다양한 마케팅 정보를 제공합니다. 마케팅
                정보는 이메일, SMS, 푸시 알림, 또는 기타 통신 수단을 통해 전달될
                수 있습니다.
              </div>
            </div>
          </div>

          <div
            onClick={onClickAgreeHandler}
            className="bg-[#FF9900] z-30 fixed bottom-0 max-w-3xl w-full h-16 text-[#FFFFFF] text-xl/normal font-medium flex items-center justify-center cursor-pointer"
          >
            확인
          </div>
        </div>
      )}
    </Layout>
  );
}
