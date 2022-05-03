import React, { useState } from 'react';
import { Link } from 'gatsby';
import { Ham4 } from './MenuButtons';
import './index.css';

export function SideMenu(props: any) {
  const { title, menu } = props;
  const [active, setActive] = useState(false);

  const handleToggleMenu = () => {
    setActive(!active);
  };

  const renderMenu = () => menu.map((item) => (
    <Link className="sidemenu-nav-item hover-underline" to={item.url} key={item.id}>
      {item.name}
    </Link>
  ));

  return (
    <div className="sidemenu">
      <div className="sidemenu-button" onClick={handleToggleMenu}>
        <Ham4 active={active} />
      </div>
      <div className={`sidemenu-main ${active ? 'open' : ''}`}>
        <div className="sidemenu-title">
          <Link className="sidemenu-title-link" to="/">{title}</Link>
        </div>
        <nav className="sidemenu-nav">{renderMenu()}</nav>
      </div>
    </div>
  );
}
