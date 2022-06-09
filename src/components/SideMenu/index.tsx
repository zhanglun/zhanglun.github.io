import React, { useState } from 'react';
import { Link } from 'gatsby';
import { Ham4 } from './MenuButtons';
// @ts-ignore
import * as styles from './index.module.css';

console.log(styles);

export function SideMenu(props: any) {
  const { title, menu } = props;
  const [active, setActive] = useState(false);

  const handleToggleMenu = () => {
    setActive(!active);
  };

  const renderMenu = () => menu.map((item) => (
    <Link className={styles.navItem} to={item.url} key={item.id}>
      {item.name}
    </Link>
  ));

  return (
    <div className={styles.menu}>
      <div className={styles.menuButton} onClick={handleToggleMenu}>
        <Ham4 active={active} />
      </div>
      <div className={`${styles.menuMain} ${active ? styles.open : ''}`}>
        <div className={styles.menuTitle}>
          <Link className={styles.titleLink} to="/">{title}</Link>
        </div>
        <nav className={styles.nav}>{renderMenu()}</nav>
      </div>
    </div>
  );
}
