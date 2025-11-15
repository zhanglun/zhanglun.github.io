import React from 'react';
import styles from './line-header.module.css';

interface LineHeaderProps {
  title?: string;
  subfix?: string;
  onSubfixClick?: () => void;
}

const LineHeader: React.FC<LineHeaderProps> = ({
  title = "",
  subfix = "",
  onSubfixClick = () => {}
}) => {
  return (
    <div className={styles.lineHeader}>
      <div className={styles.lineHeader__label}>
        <span className={styles.textSmallcaps}>/</span>
        <span className={styles.textSmallcaps}>{title}</span>
      </div>
      {subfix && (
        <div
          className={styles.lineHeader__subfix}
          onClick={onSubfixClick}
        >
          <span className={styles.textSmallcaps}>{subfix}</span>
        </div>
      )}
    </div>
  );
};

export default LineHeader;