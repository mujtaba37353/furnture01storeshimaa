import { useEffect } from "react";
import { useState } from "react";

export const DateDifference = (payload) => {
  const [previousDate, setPreviousDate] = useState(new Date(payload));
  const [timeDifference, setTimeDifference] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });
  useEffect(() => {
    const calculateTimeDifference = () => {
      const currentDate = new Date();
      const differenceInMilliseconds = currentDate - previousDate;

      const days = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (differenceInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (differenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
      );

      setTimeDifference({ days, hours, minutes });
    };
    const intervalId = setInterval(calculateTimeDifference, 1000);
    return () => clearInterval(intervalId);
  }, [previousDate]);

  return timeDifference;
};
