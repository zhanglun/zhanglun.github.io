import * as React from 'react';

function Layout({
  location, children, title, menu, description,
}) {
  // @ts-ignore
  const rootPath = `${__PATH_PREFIX__}/`;
  const isRootPath = location.pathname === rootPath;

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <div className="article-main">
        {children}
      </div>
    </div>
  );
}

export default Layout;
