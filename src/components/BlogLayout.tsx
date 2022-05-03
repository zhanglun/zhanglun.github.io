import * as React from 'react';
import { SideMenu } from './SideMenu';

function Layout({
  location, children, title, menu, description,
}) {
  // @ts-ignore
  const rootPath = `${__PATH_PREFIX__}/`;
  const isRootPath = location.pathname === rootPath;

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <SideMenu
        title={title}
        menu={menu}
      />
      <div className="article-main">
        {children}
      </div>
    </div>
  );
}

export default Layout;
