import React from "react";
import clsx from "clsx";

interface Props {
  name: string;
  count: number;
  selected?: boolean;
  hideCount?: boolean;
  onClick: () => void;
}

export default function Tag({
  name,
  count,
  selected = false,
  hideCount = false,
  onClick,
}: Props) {
  function handleClick() {
    console.log("onClick called");
    onClick();
  }

  return (
    <button
      className={clsx(
        "px-2.5 py-1 rounded-lg text-xs font-medium capitalize flex items-center gap-2 border",
        {
          "text-orange-600 bg-orange-50/80 hover:bg-orange-100 border-orange-200":
            !selected,
        },
        {
          "bg-orange-600 text-white border-orange-600 hover:text-orange-100 hover:bg-orange-600":
            selected,
        }
      )}
      onClick={handleClick}
    >
      <span className="text-xs">{name}</span>
      {!hideCount && <span className="text-[10px]">{count}</span>}
    </button>
  );
}
