import React from 'react';
import dayjs, { Dayjs } from "dayjs";

export interface Props {
  datetime: string;
  size?: "sm" | "lg";
  className?: string;
}

export default function Datetime({ datetime, size = "sm", className }: Props) {
  return (
    <div
      className={`font-bold opacity-80 flex items-center justify-center space-x-2 ${className}`}
    >
      <span className="sr-only">Posted on:</span>
      <span className={`${size === "sm" ? "text-base" : "text-xl"}`}>
        <FormattedDatetime datetime={datetime} />
      </span>
    </div>
  );
}

const FormattedDatetime = ({ datetime }: { datetime: string }) => {
  const date = dayjs(datetime).format("YYYY-MM-D HH:mm");

  return <>{date}</>;
};
