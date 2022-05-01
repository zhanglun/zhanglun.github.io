import * as React from 'react';
import { Header } from './Header';

function Layout({
  location, children, title, menu, description,
}) {
  const rootPath = `${__PATH_PREFIX__}/`;
  const isRootPath = location.pathname === rootPath;

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <Header
        title={title}
        menu={menu}
      />
      {children}
    </div>
  );
}

export default Layout;
