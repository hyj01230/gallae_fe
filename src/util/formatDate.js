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




export const renderDateRange = (dateArray) => {
  if (dateArray.length === 1) {
    // 날짜 요소가 하나인 경우
    return formatDateString(dateArray[0]);
  } else if (dateArray.length > 1) {
    // 날짜 요소가 여러 개인 경우
    const startDate = formatDateString(dateArray[0]);
    const endDate = formatDateString(dateArray[dateArray.length - 1]);
    return `${startDate} ~ ${endDate}`;
  } else {
    // 날짜 요소가 없는 경우
    return null;
  }
};


//PostListPage formatDate
export const formatDateDifference = (createdAt) => {
  const createdAtDate = new Date(createdAt);
  const now = new Date();
  const timeDifference = now - createdAtDate;
  const minutesDifference = Math.floor(timeDifference / (1000 * 60)); // 분 단위
  const hoursDifference = Math.floor(minutesDifference / 60); // 시간 단위
  const daysDifference = Math.floor(hoursDifference / 24); // 일 단위

  if (minutesDifference === 0) {
    return "방금";
  } else if (daysDifference === 1) {
    return "어제";
  } else if (minutesDifference < 60) {
    return `${minutesDifference}분 전`;
  } else if (hoursDifference < 24) {
    return `${hoursDifference}시간 전`;
  } else if (daysDifference < 7) {
    return `${daysDifference}일 전`;
  } else {
    const weeksDifference = Math.floor(daysDifference / 7); // 주 단위
    return `${weeksDifference}주 전`;
  }
};

// PostSearchPage formatDate
export const formatCreatedAt = (createdAt) => {
  const date = new Date(createdAt);
  const year = date.getFullYear().toString().slice(2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}.${month}.${day}`;
};

// Comments formatDate
export const formatDateComments = (date) => {
  if (!date || isNaN(new Date(date).getTime())) {
    return "";
  }

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  const formattedDate = new Date(date).toLocaleString("ko-KR", options);

  return formattedDate.replace("오전", "").replace("오후", "");
};
