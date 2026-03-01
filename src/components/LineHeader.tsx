import React from "react";
import "./LineHeader.css";

interface Props {
  title?: string;
  subfix?: string;
  onSubfixClick?: () => void;
}

export default function LineHeader({
  title = "",
  subfix = "",
  onSubfixClick = () => {},
}: Props) {
  return (
    <div className="lineHeader">
      <div className="lineHeader__label text-smallcaps">
        <span>/</span>
        {title}
      </div>
      {subfix && (
        <div
          className="lineHeader__subfix text-smallcaps"
          onClick={onSubfixClick}
        >
          {subfix}
        </div>
      )}
    </div>
  );
}
