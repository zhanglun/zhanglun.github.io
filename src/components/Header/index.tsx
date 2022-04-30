import React from 'react';
import { Link } from 'gatsby';
import './index.css';

export function Header(props) {
  const { title, menu = [] } = props;

  const renderMenu = () => menu.map((item) => (
    <Link className="nav-item" to={item.url} key={item.id}>
      {item.name}
    </Link>
  ));

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-title">
          <Link className="header-title-link" to="/">{title}</Link>
        </div>
        <nav className="header-nav">{renderMenu()}</nav>
      </div>
    </header>
  );
}
