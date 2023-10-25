export const formatDateString = (inputDate, isYear = true, simple = false) => {
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

  if (isYear === false) {
    return `${month}월 ${day}일 ${dayOfWeek}요일`;
  }

  if (simple) {
    return `${String(year).slice(2)}. ${month}. ${day}. ${dayOfWeek}`;
  }

  return formattedDate;
};

export const timeStringToMinutes = (timeString) => {
  // 정규 표현식을 사용하여 시간과 분을 추출
  const match = timeString.match(/(\d+)\s*시간\s*(\d+)\s*분/);

  if (!match) {
    // 시간이 표시되지 않은 경우 분만 있는지 확인
    const minutesOnlyMatch = timeString.match(/(\d+)\s*분/);
    if (minutesOnlyMatch) {
      return parseInt(minutesOnlyMatch[1], 10) || 0;
    }

    // 일치하는 패턴이 없으면 0을 반환하거나 오류 처리
    return 0;
  }

  // 시간과 분을 추출한 후, 분으로 변환하여 반환
  const hours = parseInt(match[1], 10) || 0;
  const minutes = parseInt(match[2], 10) || 0;

  return parseInt(hours * 60 + minutes);
};
