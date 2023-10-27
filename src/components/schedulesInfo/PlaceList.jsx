import { useState } from "react";
import { ALL_LOCATIONS } from "../../constants/mySchedule";

export default function PlaceList({ handleClick, setPost }) {
  const [subLocations, setSubLocations] = useState([]);

  const handleLocationClick = (data) => {
    // if (subLocationsArray) {
    //   setSubLocations(subLocationsArray);
    // } else {
    //   setSubLocations([]);
    // }
    setPost((prev) => ({ ...prev, location: data }));
    handleClick();
  };

  return (
    <div className="grid grid-cols-3 divide-x divide-y mt-3 border border-[#D9D9D9] rounded-xl">
      {ALL_LOCATIONS.map((location, index) => (
        <div
          key={index}
          className="py-3 text-center text-sm cursor-pointer"
          // onClick={() => handleLocationClick(location.subLocations)}
          onClick={() => handleLocationClick(location.mainLocation)}
        >
          {location.mainLocation}
        </div>
      ))}
    </div>
  );
}
