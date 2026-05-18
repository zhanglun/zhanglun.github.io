import React from "react";
import styles from "./LineHeader.module.css";

interface Props {
  title: string;
  subfix?: string;
  onSubfixClick?: () => void;
}

export default function LineHeader({
  title,
  subfix = "",
  onSubfixClick,
}: Props) {
  return (
    <div className={styles.lineHeader}>
      <div className={`${styles.label} text-smallcaps`}>
        <span>/</span>
        {title}
      </div>
      {subfix && (
        <div className={styles.subfix} onClick={onSubfixClick}>
          {subfix}
        </div>
      )}
    </div>
  );
}
