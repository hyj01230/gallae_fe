import { useLocation } from "react-router-dom";

export default function SchedulesEditInfoPage() {
  const scheduleData = useLocation().state;
  console.log(scheduleData);
  return <>수정하자~</>;
}
