import * as AccountIcon from "../assets/Account";

export const DETAIL_SCHEDULES_CATEGORIES = [
  "카테고리 (필수)",
  "식당",
  "숙소",
  "카페",
  "명소",
  "교통",
  "마트",
  "쇼핑",
];

// export const ACCOUNT_ICON = [
//   "",
//   "Restaurant",
//   "Accommdation",
//   "Cafe",
//   "Landmark",
//   "Transportation",
//   "Mart",
//   "Shopping",
// ];
export const ACCOUNT_ICON = [
  "",
  <AccountIcon.Restaurant />,
  <AccountIcon.Accommodation />,
  <AccountIcon.Cafe />,
  <AccountIcon.Landmark />,
  <AccountIcon.Transportation />,
  <AccountIcon.Mart />,
  <AccountIcon.Shopping />,
];

export const SPENT_TIME_LIST = [
  { minute: 5, text: "5분" },
  { minute: 10, text: "10분" },
  { minute: 30, text: "30분" },
  { minute: 60, text: "1시간" },
  { minute: 0, text: "초기화" },
];

export const CATEGORIES = ["가족", "친구", "연인", "혼자", "반려동물", "지인"];

export const TAGS = [
  "휴식",
  "프리미엄",
  "체험",
  "식도락",
  "자연경관",
  "명소",
  "스포츠",
  "오락",
  "레저",
];

export const ALL_LOCATIONS = [
  { mainLocation: "서울시" },
  {
    mainLocation: "경기도",
    subLocations: [
      "가평군",
      "고양시",
      "과천시",
      "광명시",
      "광주시",
      "구리시",
      "군포시",
      "김포시",
      "남양주시",
      "동두천시",
      "부천시",
      "성남시",
      "수원시",
      "시흥시",
      "안산시",
      "안성시",
      "안양시",
      "양주시",
      "양평군",
      "여주시",
      "연천국",
      "오산시",
      "용인시",
      "의왕시",
      "의정부시",
      "이천시",
      "파주시",
      "평택시",
      "포천시",
      "하남시",
      "화성시",
    ],
  },
  { mainLocation: "인천시" },
  { mainLocation: "부산시" },
  { mainLocation: "대전시" },
  { mainLocation: "대구시" },
  { mainLocation: "울산시" },
  { mainLocation: "세종시" },
  { mainLocation: "광주시" },
  {
    mainLocation: "강원도",
    subLocations: [
      "강릉시",
      "고성군",
      "동해시",
      "삼척시",
      "속초시",
      "양구군",
      "양양군",
      "영월군",
      "원주시",
      "인제군",
      "정선군",
      "철원군",
      "춘천시",
      "태백시",
      "평창군",
      "홍천군",
      "화천군",
      "횡성군",
    ],
  },
  {
    mainLocation: "충청북도",
    subLocations: [
      "괴산군",
      "단양군",
      "보은군",
      "영동군",
      "옥천군",
      "음성군",
      "제천시",
      "증평군",
      "진천군",
      "청주시",
      "충주시",
      "",
    ],
  },
  ,
  {
    mainLocation: "충청남도",
    subLocations: [
      "계룡시",
      "공주시",
      "금산군",
      "논산시",
      "당진시",
      "보령시",
      "부여군",
      "서산시",
      "서천군",
      "아산시",
      "예산군",
      "천안시",
      "청양군",
      "태안군",
      "홍성군",
    ],
  },
  {
    mainLocation: "경상북도",
    subLocations: [
      "경산시",
      "경주시",
      "고령군",
      "구미시",
      "김천시",
      "문경시",
      "봉화군",
      "상주시",
      "성주군",
      "안동시",
      "영덕군",
      "영양군",
      "영주시",
      "영천시",
      "예천군",
      "울릉군",
      "울진군",
      "의성군",
      "청도군",
      "청송군",
      "칠곡군",
      "포항시",
      "",
      "",
    ],
  },
  {
    mainLocation: "경상남도",
    subLocations: [
      "거제시",
      "거창군",
      "고성군",
      "김해시",
      "남해군",
      "밀양시",
      "사천시",
      "산청군",
      "양산시",
      "의령군",
      "진주시",
      "창녕군",
      "창원시",
      "통영시",
      "하동군",
      "합안군",
      "함양군",
      "합천군",
    ],
  },
  {
    mainLocation: "전라북도",
    subLocations: [
      "고창군",
      "군산시",
      "김제시",
      "남원시",
      "무주군",
      "부안군",
      "순창군",
      "완주군",
      "익산시",
      "임실군",
      "장수군",
      "전주시",
      "정읍시",
      "진안군",
      "",
    ],
  },
  {
    mainLocation: "전라남도",
    subLocations: [
      "강진군",
      "고흥군",
      "곡성군",
      "광양시",
      "구례군",
      "나주시",
      "담양군",
      "목포시",
      "무안군",
      "보성군",
      "순천시",
      "신안군",
      "여수시",
      "영광군",
      "영암군",
      "완도군",
      "장성군",
      "장흥군",
      "진도군",
      "함평군",
      "해남군",
      "화순군",
      "",
      "",
    ],
  },
  { mainLocation: "제주도", subLocations: ["서귀포시", "제주시", ""] },
  { mainLocation: "" },
];