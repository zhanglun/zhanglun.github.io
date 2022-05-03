import * as React from 'react';
import { SideMenu } from './SideMenu';

function Layout({
  location, children, title, menu, description,
}) {
  const rootPath = `${__PATH_PREFIX__}/`;
  const isRootPath = location.pathname === rootPath;

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <SideMenu
        title={title}
        menu={menu}
      />
      { children }
    </div>
  );
}

export default Layout;
