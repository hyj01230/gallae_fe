import { useParams } from "react-router-dom";
import UserProfileHeader from "../components/userProfile/UserProfileHeader";
import UserProfileBox from "../components/userProfile/UserProfileBox";

export default function UserProfile() {
  const { nickName } = useParams();

  return (
    <div>
      <div className="sticky top-0 bg-white z-10 ">
        <UserProfileHeader nickName={nickName} />
      </div>
      <UserProfileBox />
    </div>
  );
}
