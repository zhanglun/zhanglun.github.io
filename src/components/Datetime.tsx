import React from 'react';
import dayjs from "dayjs";

export interface Props {
  datetime: string;
  size?: "sm" | "lg";
  className?: string;
}

export default function Datetime({ datetime, size = "sm", className }: Props) {
  return (
    <div
      className={`font-medium opacity-80 flex items-center justify-center space-x-2 ${className}`}
    >
      <span className="sr-only">Posted on:</span>
      <span className={`${size === "sm" ? "text-sm" : "text-base"}`}>
        <FormattedDatetime datetime={datetime} />
      </span>
    </div>
  );
}

const FormattedDatetime = ({ datetime }: { datetime: string }) => {
  const date = dayjs(datetime).format("YYYY-MM-D HH:mm");

  return <>{date}</>;
};
