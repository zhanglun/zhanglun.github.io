import React, { useState, useImperativeHandle, forwardRef } from "react";
import styles from "./DirectoryToggle.module.css";

interface DirectoryToggleProps {
  className?: string;
  name: string;
  list: [string, number][];
  onFilter: (selected: [string, number, boolean][]) => void;
}

export interface DirectoryToggleRef {
  clear: () => void;
}

const DirectoryToggle = forwardRef<DirectoryToggleRef, DirectoryToggleProps>(
  ({ className = "", name, list, onFilter }, ref) => {
    const [renderData, setRenderData] = useState<[string, number, boolean][]>(
      list.map(item => [...item, false] as [string, number, boolean])
    );

    const handleSelect = (item: [string, number, boolean], idx: number) => {
      const newData = [...renderData];
      newData[idx][2] = !newData[idx][2];
      setRenderData(newData);
      onFilter(newData.filter(_ => _[2]));
    };

    const clear = () => {
      setRenderData(
        renderData.map(
          item => [item[0], item[1], false] as [string, number, boolean]
        )
      );
    };

    useImperativeHandle(ref, () => ({ clear }));

    return (
      <div className={`${styles.directory} ${className}`}>
        <div className={styles.toggle}>
          <svg
            className={styles.directoryIcon}
            width="12"
            height="10"
            viewBox="0 0 12 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Folder Icon</title>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1 0H7V1H1V0ZM1 6V1H0V9H1V10H11V9H12V3H11V2H8V1H7V2H8V3H11V4H3V5H2V6H1ZM1 7V9H11V5H3V6H2V7H1Z"
              fill="currentColor"
            />
          </svg>
          {name}
        </div>
        <div className={styles.content}>
          <div className={styles.contentInner}>
            <ul className={styles.filterList}>
              {renderData.map((item, index) => (
                <li key={index} className={styles.filterListItem}>
                  <button
                    className={styles.filterListOption}
                    onClick={() => handleSelect(item, index)}
                  >
                    <svg
                      width="10"
                      height="9"
                      viewBox="0 0 10 9"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`${styles.checkboxIcon} ${
                        item[2] ? styles.checkboxIconActive : ""
                      }`}
                    >
                      <title>Checkbox icon</title>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d={
                          item[2]
                            ? "M1 1L-3.49691e-07 1L-4.37113e-08 8L1 8L1 9L9 9L9 8L10 8L10 1L9 1L9 -3.93402e-07L1 -4.37114e-08L1 1ZM1 1L9 1L9 8L1 8L1 1ZM7 2L8 2L8 3L7 3L7 2ZM6 4L6 3L7 3L7 4L6 4ZM5 5L5 4L6 4L6 5L5 5ZM4 6L4 5L5 5L5 6L4 6ZM3 6L4 6L4 7L3 7L3 6ZM3 6L2 6L2 5L3 5L3 6Z"
                            : "M1 1L-3.49691e-07 1L-4.37113e-08 8L1 8L1 9L9 9L9 8L10 8L10 1L9 1L9 -3.93402e-07L1 -4.37114e-08L1 1ZM1 1L9 1L9 8L1 8L1 1Z"
                        }
                        fill="currentColor"
                      />
                    </svg>
                    <span
                      className={item[2] ? styles.filterListOptionActive : ""}
                    >
                      {item[0]}
                      <span className={styles.filterListOptionCount}>
                        ({item[1]})
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
);

DirectoryToggle.displayName = "DirectoryToggle";

export default DirectoryToggle;
