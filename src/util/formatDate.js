export const formatDateString = (inputDate) => {
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

  // 주어진 날짜 문자열을 Date 객체로 변환
  const date = new Date(inputDate);

  // '년', '월', '일', 요일을 추출
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 월은 0부터 시작하므로 +1
  const day = date.getDate();
  const dayOfWeek = daysOfWeek[date.getDay()];

  // 형식에 맞게 조합하여 반환
  const formattedDate = `${year}년 ${month}월 ${day}일 ${dayOfWeek}`;

  return formattedDate;
};
